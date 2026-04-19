import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getPlanColor(plan: string): string {
  const colors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    pro: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  return colors[plan] || colors.free;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    churned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    trial: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  };
  return colors[status] || colors.inactive;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'text-slate-500',
    medium: 'text-amber-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };
  return colors[priority] || colors.low;
}
