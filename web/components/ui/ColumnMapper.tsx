'use client';
import { ChevronDown } from 'lucide-react';

const CUSTOMER_FIELDS = [
  { key: 'name', label: 'Full Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'company', label: 'Company', required: false },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'plan', label: 'Plan', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'country', label: 'Country', required: false },
  { key: 'mrr', label: 'MRR', required: false },
];

interface ColumnMapperProps {
  fileHeaders: string[];
  mapping: Record<string, string>;
  onChange: (mapping: Record<string, string>) => void;
}

export default function ColumnMapper({ fileHeaders, mapping, onChange }: ColumnMapperProps) {
  const handleChange = (customerField: string, fileHeader: string) => {
    onChange({ ...mapping, [customerField]: fileHeader });
  };

  // Auto-detect common column names
  const autoDetect = () => {
    const newMapping: Record<string, string> = {};
    const lowerHeaders = fileHeaders.map(h => h.toLowerCase());

    CUSTOMER_FIELDS.forEach(field => {
      const match = fileHeaders.find((h, i) => {
        const lower = lowerHeaders[i];
        if (field.key === 'name') return lower.includes('name') || lower.includes('full');
        if (field.key === 'email') return lower.includes('email') || lower.includes('mail');
        if (field.key === 'company') return lower.includes('company') || lower.includes('org') || lower.includes('business');
        if (field.key === 'phone') return lower.includes('phone') || lower.includes('mobile') || lower.includes('tel');
        if (field.key === 'plan') return lower.includes('plan') || lower.includes('tier') || lower.includes('subscription');
        if (field.key === 'status') return lower.includes('status') || lower.includes('state');
        if (field.key === 'country') return lower.includes('country') || lower.includes('location') || lower.includes('region');
        if (field.key === 'mrr') return lower.includes('mrr') || lower.includes('revenue') || lower.includes('amount');
        return false;
      });
      if (match) newMapping[field.key] = match;
    });

    onChange(newMapping);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Map your columns to Nova fields</p>
        <button onClick={autoDetect} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
          Auto-detect
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CUSTOMER_FIELDS.map(field => (
          <div key={field.key} className="flex items-center gap-2">
            <div className="w-28 shrink-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </p>
            </div>
            <select
              className="input text-xs flex-1"
              value={mapping[field.key] || ''}
              onChange={e => handleChange(field.key, e.target.value)}
            >
              <option value="">-- Skip --</option>
              {fileHeaders.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}