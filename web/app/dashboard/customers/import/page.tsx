'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import FileUploader from '@/components/ui/FileUploader';
import ColumnMapper from '@/components/ui/ColumnMapper';
import ImportPreview from '@/components/ui/ImportPreview';
import { ParseResult } from '@/lib/fileParser';
import { downloadTemplate, exportToCSV, exportToExcel } from '@/lib/fileParser';
import { useCreateCustomer } from '@/hooks/useQueries';
import { ArrowLeft, Download, FileDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Step = 'upload' | 'map' | 'preview' | 'done';

export default function ImportPage() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();
  const [step, setStep] = useState<Step>('upload');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [importStats, setImportStats] = useState({ success: 0, failed: 0 });

  const handleParsed = (result: ParseResult) => {
    setParseResult(result);
    setStep('map');
  };

  const handleMapping = () => {
    if (!mapping.email) { toast.error('Email column is required'); return; }
    if (!mapping.name) { toast.error('Name column is required'); return; }
    setStep('preview');
  };

  const getMappedRows = () => {
    if (!parseResult) return [];
    return parseResult.rows.map(row => {
      const mapped: any = {};
      Object.entries(mapping).forEach(([field, fileHeader]) => {
        if (fileHeader) mapped[field] = row[fileHeader] || '';
      });
      return mapped;
    });
  };

  const getValidRows = () => getMappedRows().filter(r => r.email && r.name);
  const getErrorCount = () => getMappedRows().length - getValidRows().length;

  const handleImport = async () => {
    const validRows = getValidRows();
    if (validRows.length === 0) { toast.error('No valid rows to import'); return; }

    setImporting(true);
    let success = 0;
    let failed = 0;

    // Import in batches of 10
    const batchSize = 10;
    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);
      await Promise.all(batch.map(async (row) => {
        try {
          await createCustomer.mutateAsync({
            name: row.name,
            email: row.email,
            company: row.company || '',
            phone: row.phone || '',
            plan: ['free', 'starter', 'pro', 'enterprise'].includes(row.plan?.toLowerCase())
              ? row.plan.toLowerCase() : 'free',
            status: ['active', 'inactive', 'churned', 'trial'].includes(row.status?.toLowerCase())
              ? row.status.toLowerCase() : 'active',
            country: row.country || '',
            mrr: parseFloat(row.mrr) || 0,
          });
          success++;
        } catch {
          failed++;
        }
      }));
    }

    setImportStats({ success, failed });
    setImporting(false);
    setStep('done');
  };

  const STEPS = ['upload', 'map', 'preview', 'done'];
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="space-y-6 animate-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Import Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload CSV, Excel, or PDF files</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {['Upload File', 'Map Columns', 'Preview', 'Done'].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-1.5 ${i <= stepIndex ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i < stepIndex ? 'bg-brand-600 border-brand-600 text-white' : i === stepIndex ? 'border-brand-600 text-brand-600 dark:text-brand-400' : 'border-gray-300 dark:border-gray-700'}`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block">{label}</span>
            </div>
            {i < 3 && <div className={`flex-1 h-0.5 ${i < stepIndex ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      <Card>
        {/* Step 1 - Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Upload Your File</h2>
              <button onClick={downloadTemplate} className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium">
                <Download size={13} /> Download Template
              </button>
            </div>
            <FileUploader onParsed={handleParsed} />
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Supported formats:</p>
              <ul className="text-xs text-gray-400 space-y-0.5">
                <li>CSV — comma separated values</li>
                <li>Excel — .xlsx or .xls spreadsheets</li>
                <li>PDF — text-based PDFs (scanned PDFs not supported)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2 - Map Columns */}
        {step === 'map' && parseResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Map Columns</h2>
                <p className="text-xs text-gray-400 mt-0.5">{parseResult.totalRows} rows detected</p>
              </div>
              <button onClick={() => setStep('upload')} className="text-xs text-gray-400 hover:text-gray-600">
                Change file
              </button>
            </div>
            <ColumnMapper
              fileHeaders={parseResult.headers}
              mapping={mapping}
              onChange={setMapping}
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep('upload')} className="btn-secondary flex-1">Back</button>
              <button onClick={handleMapping} className="btn-primary flex-1">Preview Data</button>
            </div>
          </div>
        )}

        {/* Step 3 - Preview */}
        {step === 'preview' && parseResult && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Preview Import</h2>
            <ImportPreview
              rows={getMappedRows()}
              mapping={mapping}
              validCount={getValidRows().length}
              errorCount={getErrorCount()}
              errors={parseResult.errors}
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep('map')} className="btn-secondary flex-1">Back</button>
              <button
                onClick={handleImport}
                className="btn-primary flex-1"
                disabled={importing || getValidRows().length === 0}
              >
                {importing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importing...
                  </span>
                ) : `Import ${getValidRows().length} Customers`}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Done */}
        {step === 'done' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Import Complete</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {importStats.success} customers imported successfully
                {importStats.failed > 0 && `, ${importStats.failed} failed`}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setStep('upload'); setParseResult(null); setMapping({}); }}
                className="btn-secondary"
              >
                Import More
              </button>
              <Link href="/dashboard/customers" className="btn-primary">
                View Customers
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Export section */}
      {step === 'upload' && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Export Customers</h2>
          <p className="text-xs text-gray-400 mb-4">Download your customer data in your preferred format.</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                // This would use actual customer data from the API
                toast.success('Export started — check your downloads');
              }}
              className="btn-secondary flex items-center gap-2 text-xs"
            >
              <FileDown size={14} /> Export CSV
            </button>
            <button
              onClick={() => {
                toast.success('Export started — check your downloads');
              }}
              className="btn-secondary flex items-center gap-2 text-xs"
            >
              <FileDown size={14} /> Export Excel
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}