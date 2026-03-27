import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Employee } from '../lib/supabase';

export interface Agent {
  id: string;
  user_id: string;
  agent_code: string;
  full_name: string;
  email: string;
  status: string;
  commission_rate: number;
}

export interface Partner {
  id: string;
  user_id: string;
  partner_code: string;
  company_name: string;
  full_name: string;
  email: string;
  status: string;
  partnership_type: string;
  commission_rate: number;
}

export interface MerchantUser {
  id: string;
  user_id: string;
  merchant_id: string;
  is_primary_contact: boolean;
  role: string;
  is_active: boolean;
}

type UserType = 'employee' | 'agent' | 'partner' | 'merchant' | null;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  employee: Employee | null;
  agent: Agent | null;
  partner: Partner | null;
  merchantUser: MerchantUser | null;
  userType: UserType;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [merchantUser, setMerchantUser] = useState<MerchantUser | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string) => {
    const { data: employeeData } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (employeeData) {
      setEmployee(employeeData);
      setUserType('employee');
      return;
    }

    const { data: agentData } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (agentData) {
      setAgent(agentData);
      setUserType('agent');
      return;
    }

    const { data: partnerData } = await supabase
      .from('partners')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (partnerData) {
      setPartner(partnerData);
      setUserType('partner');
      return;
    }

    const { data: merchantUserData } = await supabase
      .from('merchant_users')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (merchantUserData) {
      setMerchantUser(merchantUserData);
      setUserType('merchant');
      return;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadUserProfile(session.user.id);
        }

        setLoading(false);
      })();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setEmployee(null);
          setAgent(null);
          setPartner(null);
          setMerchantUser(null);
          setUserType(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error('Invalid login credentials');
    }

    if (!data.user) {
      throw new Error('Login failed');
    }

    const { data: employeeData } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (!employeeData || !employeeData.is_active) {
      await supabase.auth.signOut();
      throw new Error('Account not authorized. Please contact an administrator.');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setEmployee(null);
    setAgent(null);
    setPartner(null);
    setMerchantUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, employee, agent, partner, merchantUser, userType, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
