import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedRow {
  [key: string]: string;
}

export interface ParseResult {
  headers: string[];
  rows: ParsedRow[];
  totalRows: number;
  errors: string[];
}

// Parse CSV
const parseCSV = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as ParsedRow[];
        const errors = results.errors.map(e => `Row ${e.row}: ${e.message}`);
        resolve({ headers, rows, totalRows: rows.length, errors });
      },
      error: (error) => {
        resolve({ headers: [], rows: [], totalRows: 0, errors: [error.message] });
      }
    });
  });
};

// Parse Excel
const parseExcel = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length === 0) {
          resolve({ headers: [], rows: [], totalRows: 0, errors: ['File is empty'] });
          return;
        }

        const headers = jsonData[0].map(String);
        const rows = jsonData.slice(1)
          .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
          .map(row => {
            const obj: ParsedRow = {};
            headers.forEach((header, i) => {
              obj[header] = row[i] !== undefined ? String(row[i]) : '';
            });
            return obj;
          });

        resolve({ headers, rows, totalRows: rows.length, errors: [] });
      } catch (err: any) {
        resolve({ headers: [], rows: [], totalRows: 0, errors: [err.message] });
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

// Parse PDF - extract text and try to find tabular data
const parsePDF = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());

        // Try to detect if it looks like customer data
        const rows: ParsedRow[] = [];
        const errors: string[] = ['PDF parsing extracts raw text. Please verify the data carefully.'];

        lines.forEach((line, i) => {
          if (i === 0) return; // skip header
          const parts = line.split(/\s{2,}|\t/);
          if (parts.length >= 2) {
            rows.push({
              'Raw Text': line,
              'Column 1': parts[0] || '',
              'Column 2': parts[1] || '',
              'Column 3': parts[2] || '',
            });
          }
        });

        resolve({
          headers: ['Raw Text', 'Column 1', 'Column 2', 'Column 3'],
          rows: rows.slice(0, 100),
          totalRows: rows.length,
          errors
        });
      } catch (err: any) {
        resolve({ headers: [], rows: [], totalRows: 0, errors: [err.message] });
      }
    };
    reader.readAsText(file);
  });
};

// Main parser - detects file type automatically
export const parseFile = async (file: File): Promise<ParseResult> => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const type = file.type;

  if (ext === 'csv' || type === 'text/csv') {
    return parseCSV(file);
  } else if (ext === 'xlsx' || ext === 'xls' || type.includes('spreadsheet') || type.includes('excel')) {
    return parseExcel(file);
  } else if (ext === 'pdf' || type === 'application/pdf') {
    return parsePDF(file);
  } else {
    // Try CSV as fallback
    return parseCSV(file);
  }
};

// Export customers to CSV
export const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Export customers to Excel
export const exportToExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Download sample CSV template
export const downloadTemplate = () => {
  const sampleData = [
    {
      name: 'Emma Johnson',
      email: 'emma@example.com',
      company: 'Acme Corp',
      phone: '+1 (555) 000-0001',
      plan: 'pro',
      status: 'active',
      country: 'United States',
      mrr: '99'
    },
    {
      name: 'Liam Smith',
      email: 'liam@example.com',
      company: 'TechFlow',
      phone: '+1 (555) 000-0002',
      plan: 'enterprise',
      status: 'active',
      country: 'United Kingdom',
      mrr: '499'
    }
  ];
  exportToCSV(sampleData, 'nova-customers-template');
};