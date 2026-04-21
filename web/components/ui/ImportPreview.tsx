'use client';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImportPreviewProps {
  rows: any[];
  mapping: Record<string, string>;
  validCount: number;
  errorCount: number;
  errors: string[];
}

export default function ImportPreview({ rows, mapping, validCount, errorCount, errors }: ImportPreviewProps) {
  const previewRows = rows.slice(0, 5);
  const mappedFields = Object.entries(mapping).filter(([, v]) => v);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{rows.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total Rows</p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{validCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">Valid</p>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <p className="text-xl font-bold text-red-500">{errorCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">Errors</p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={13} className="text-amber-500" />
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Warnings</p>
          </div>
          {errors.slice(0, 3).map((e, i) => (
            <p key={i} className="text-xs text-amber-600 dark:text-amber-500">{e}</p>
          ))}
        </div>
      )}

      {/* Preview Table */}
      <div>
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preview (first 5 rows)
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-3 py-2 text-left text-gray-500 font-medium">Status</th>
                {mappedFields.map(([field]) => (
                  <th key={field} className="px-3 py-2 text-left text-gray-500 font-medium capitalize">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, i) => {
                const hasEmail = mapping.email && row[mapping.email];
                const hasName = mapping.name && row[mapping.name];
                const isValid = hasEmail && hasName;
                return (
                  <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-3 py-2">
                      {isValid
                        ? <CheckCircle2 size={13} className="text-green-500" />
                        : <XCircle size={13} className="text-red-500" />
                      }
                    </td>
                    {mappedFields.map(([field, fileHeader]) => (
                      <td key={field} className={cn(
                        'px-3 py-2 text-gray-700 dark:text-gray-300 max-w-[120px] truncate',
                        !row[fileHeader] && field === 'email' ? 'text-red-400' : ''
                      )}>
                        {row[fileHeader] || <span className="text-gray-300 dark:text-gray-700">—</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length > 5 && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            ...and {rows.length - 5} more rows
          </p>
        )}
      </div>
    </div>
  );
}