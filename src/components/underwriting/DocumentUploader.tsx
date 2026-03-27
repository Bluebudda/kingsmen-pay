import { useState } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';
import {
  uploadDocument,
  validateFileType,
  validateFileSize,
  formatFileSize,
  ALLOWED_DOCUMENT_TYPES,
  MAX_FILE_SIZE_MB,
} from '../../lib/documentUpload';

interface DocumentUploaderProps {
  onUploadComplete: (filePath: string, fileName: string, fileSize: number, mimeType: string) => void;
  folder: string;
  label?: string;
  required?: boolean;
}

export default function DocumentUploader({
  onUploadComplete,
  folder,
  label = 'Upload Document',
  required = false,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError('');
    setSuccess(false);

    if (!validateFileType(file, ALLOWED_DOCUMENT_TYPES)) {
      setError('Invalid file type. Please upload PDF, JPG, PNG, or DOCX files.');
      return;
    }

    if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
      setError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setUploading(true);

    try {
      const result = await uploadDocument(file, folder);

      if (result.success && result.filePath) {
        setSuccess(true);
        onUploadComplete(result.filePath, file.name, file.size, file.type);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50'}
        `}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          accept={ALLOWED_DOCUMENT_TYPES.join(',')}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-3">
          {uploading ? (
            <>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-slate-600">Uploading...</p>
            </>
          ) : success ? (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-green-600 font-medium">Upload successful!</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  Drop your file here, or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PDF, JPG, PNG, or DOCX (max {MAX_FILE_SIZE_MB}MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
