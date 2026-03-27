import { useState, useEffect } from 'react';
import { supabase, Transaction, Merchant } from '../lib/supabase';
import {
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  DollarSign,
  Filter,
} from 'lucide-react';

interface TransactionWithMerchant extends Transaction {
  merchant?: Merchant;
}

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<TransactionWithMerchant[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'payin' | 'payout'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | Transaction['status']>('all');
  const [selectedMerchant, setSelectedMerchant] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    merchant_id: '',
    transaction_type: 'payin' as 'payin' | 'payout',
    amount: '',
    currency: 'USD',
    customer_email: '',
    customer_name: '',
    payment_method: '',
    callback_url: '',
    return_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsRes, merchantsRes] = await Promise.all([
        supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('merchants').select('*').eq('status', 'active'),
      ]);

      if (transactionsRes.error) throw transactionsRes.error;
      if (merchantsRes.error) throw merchantsRes.error;

      const transactionsWithMerchants = await Promise.all(
        (transactionsRes.data || []).map(async (transaction) => {
          const { data: merchant } = await supabase
            .from('merchants')
            .select('*')
            .eq('id', transaction.merchant_id)
            .maybeSingle();

          return { ...transaction, merchant };
        })
      );

      setTransactions(transactionsWithMerchants);
      setMerchants(merchantsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/skyphoenix-api/${
        transactionForm.transaction_type
      }`;
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: transactionForm.merchant_id,
          amount: parseFloat(transactionForm.amount),
          currency: transactionForm.currency,
          customerEmail: transactionForm.customer_email,
          customerName: transactionForm.customer_name,
          paymentMethod: transactionForm.payment_method,
          callbackUrl: transactionForm.callback_url,
          returnUrl: transactionForm.return_url,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      setShowCreateModal(false);
      setTransactionForm({
        merchant_id: '',
        transaction_type: 'payin',
        amount: '',
        currency: 'USD',
        customer_email: '',
        customer_name: '',
        payment_method: '',
        callback_url: '',
        return_url: '',
      });
      loadData();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction');
    }
  };

  const cancelTransaction = async (transaction: Transaction) => {
    if (!confirm('Are you sure you want to cancel this transaction?')) return;

    try {
      const endpoint =
        transaction.transaction_type === 'payin' ? 'cancel-payin' : 'cancel-payout';
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/skyphoenix-api/${endpoint}`;
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: transaction.skyphoenix_order_id,
          merchantId: transaction.merchant_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel transaction');
      }

      loadData();
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      alert('Failed to cancel transaction');
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.skyphoenix_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant?.merchant_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesMerchant =
      selectedMerchant === 'all' || transaction.merchant_id === selectedMerchant;

    return matchesSearch && matchesType && matchesStatus && matchesMerchant;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled':
        return <Ban className="w-4 h-4 text-slate-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Transaction Management</h2>
          <p className="text-slate-600 mt-1">Monitor and manage PayIn/PayOut transactions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/30"
        >
          <DollarSign className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedMerchant}
              onChange={(e) => setSelectedMerchant(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Merchants</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.merchant_name}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="payin">PayIn</option>
              <option value="payout">PayOut</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {transaction.transaction_type === 'payin' ? (
                        <ArrowDownCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpCircle className="w-5 h-5 text-blue-600" />
                      )}
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {transaction.transaction_type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {transaction.merchant?.merchant_name || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{transaction.customer_name || '-'}</div>
                    <div className="text-xs text-slate-500">{transaction.customer_email || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {transaction.amount.toFixed(2)} {transaction.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {getStatusIcon(transaction.status)}
                      <span className="capitalize">{transaction.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600 font-mono">
                      {transaction.skyphoenix_order_id || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(transaction.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(transaction.status === 'pending' || transaction.status === 'processing') && (
                      <button
                        onClick={() => cancelTransaction(transaction)}
                        className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Transaction</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Merchant</label>
                <select
                  value={transactionForm.merchant_id}
                  onChange={(e) =>
                    setTransactionForm({ ...transactionForm, merchant_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Merchant</option>
                  {merchants.map((merchant) => (
                    <option key={merchant.id} value={merchant.id}>
                      {merchant.merchant_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Type</label>
                <select
                  value={transactionForm.transaction_type}
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      transaction_type: e.target.value as 'payin' | 'payout',
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="payin">PayIn</option>
                  <option value="payout">PayOut</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={transactionForm.currency}
                    onChange={(e) => setTransactionForm({ ...transactionForm, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={transactionForm.customer_name}
                  onChange={(e) =>
                    setTransactionForm({ ...transactionForm, customer_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={transactionForm.customer_email}
                  onChange={(e) =>
                    setTransactionForm({ ...transactionForm, customer_email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <input
                  type="text"
                  value={transactionForm.payment_method}
                  onChange={(e) =>
                    setTransactionForm({ ...transactionForm, payment_method: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Credit Card, Bank Transfer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Callback URL</label>
                <input
                  type="url"
                  value={transactionForm.callback_url}
                  onChange={(e) =>
                    setTransactionForm({ ...transactionForm, callback_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Return URL</label>
                <input
                  type="url"
                  value={transactionForm.return_url}
                  onChange={(e) =>
                    setTransactionForm({ ...transactionForm, return_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={createTransaction}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Create Transaction
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setTransactionForm({
                    merchant_id: '',
                    transaction_type: 'payin',
                    amount: '',
                    currency: 'USD',
                    customer_email: '',
                    customer_name: '',
                    payment_method: '',
                    callback_url: '',
                    return_url: '',
                  });
                }}
                className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
