import { supabase } from './supabase';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface DocumentUploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export async function uploadDocument(
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<DocumentUploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('underwriting-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return {
      success: true,
      filePath: data.path,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function getDocumentUrl(filePath: string): Promise<string | null> {
  try {
    const { data } = await supabase.storage
      .from('underwriting-documents')
      .createSignedUrl(filePath, 3600);

    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
}

export async function deleteDocument(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('underwriting-documents')
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const baseType = type.split('/')[0];
      return file.type.startsWith(baseType + '/');
    }
    return file.type === type;
  });
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_FILE_SIZE_MB = 10;
