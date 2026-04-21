'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, FileSpreadsheet, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseFile, ParseResult } from '@/lib/fileParser';

interface FileUploaderProps {
  onParsed: (result: ParseResult, file: File) => void;
  accept?: string;
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  csv: <FileText className="text-green-500" size={24} />,
  xlsx: <FileSpreadsheet className="text-emerald-500" size={24} />,
  xls: <FileSpreadsheet className="text-emerald-500" size={24} />,
  pdf: <FileText className="text-red-500" size={24} />,
};

const ACCEPTED_TYPES = '.csv,.xlsx,.xls,.pdf';

export default function FileUploader({ onParsed }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError('');
    setCurrentFile(file);
    try {
      const result = await parseFile(file);
      if (result.totalRows === 0 && result.errors.length > 0) {
        setError(result.errors[0]);
      } else {
        onParsed(result, file);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const ext = currentFile?.name.split('.').pop()?.toLowerCase() || '';

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
        isDragging
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        className="hidden"
      />

      {isProcessing ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Processing {currentFile?.name}...</p>
        </div>
      ) : currentFile && !error ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-green-500" size={24} />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{currentFile.name}</p>
          <p className="text-xs text-gray-400">File parsed successfully — click to upload a different file</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Upload className="text-gray-400" size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drop your file here or <span className="text-brand-600">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports CSV, Excel (.xlsx, .xls), and PDF</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">CSV</span>
            <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded">XLSX</span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">XLS</span>
            <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">PDF</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-500 text-xs justify-center">
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
}