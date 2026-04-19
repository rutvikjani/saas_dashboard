'use client';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Card
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card p-5', className)} {...props}>
      {children}
    </div>
  );
}

// Skeleton
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800', className)} />;
}

// KPI Card
interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconBg?: string;
  loading?: boolean;
}

export function KpiCard({ title, value, change, icon, iconBg = 'bg-brand-50 dark:bg-brand-900/20', loading }: KpiCardProps) {
  if (loading) return (
    <Card>
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </Card>
  );

  const isPositive = (change ?? 0) >= 0;
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{value}</p>
      {change !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500')}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(change).toFixed(1)}% from last month</span>
        </div>
      )}
    </Card>
  );
}

// Badge
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('badge', className)}>{children}</span>;
}

// Modal
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full animate-in', sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Table
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn('px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', className)}>{children}</th>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3 text-gray-700 dark:text-gray-300', className)}>{children}</td>;
}

// Progress Bar
export function ProgressBar({ value, color = 'bg-brand-600', className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn('h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// Empty State
export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-gray-300 dark:text-gray-700">{icon}</div>}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
      {description && <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{description}</p>}
    </div>
  );
}

// Spinner
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('w-5 h-5 border-2 border-gray-200 border-t-brand-600 rounded-full animate-spin', className)} />
  );
}
