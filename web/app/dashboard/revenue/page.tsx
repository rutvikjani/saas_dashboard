'use client';
import { useRevenueSummary } from '@/hooks/useQueries';
import { Card, KpiCard, Skeleton } from '@/components/ui';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Users } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart
} from 'recharts';
import { useAuthStore } from '@/lib/authStore';
import { ShieldCheck } from 'lucide-react';

export default function RevenuePage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useRevenueSummary();
  const monthly = data?.monthlyData || [];

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <ShieldCheck className="text-red-500" size={28} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Access Restricted</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">You don't have permission to view revenue data.</p>
      </div>
    );
  }
  else{
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">MRR, ARR, churn, and billing overview.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="MRR" value={formatCurrency(data?.mrr || 0)} change={parseFloat(data?.mrrGrowth || 0)} icon={<DollarSign size={16} className="text-brand-600 dark:text-brand-400" />} loading={isLoading} />
        <KpiCard title="ARR" value={formatCurrency(data?.arr || 0)} change={parseFloat(data?.mrrGrowth || 0)} icon={<TrendingUp size={16} className="text-emerald-600" />} iconBg="bg-emerald-50 dark:bg-emerald-900/20" loading={isLoading} />
        <KpiCard title="Churn Rate" value={`${(data?.churnRate || 0).toFixed(1)}%`} change={-0.8} icon={<TrendingDown size={16} className="text-red-500" />} iconBg="bg-red-50 dark:bg-red-900/20" loading={isLoading} />
        <KpiCard title="Active Subscriptions" value={formatNumber(data?.activeSubscriptions || 0)} change={4.2} icon={<CreditCard size={16} className="text-sky-600" />} iconBg="bg-sky-50 dark:bg-sky-900/20" loading={isLoading} />
      </div>

      {/* MRR Chart */}
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">MRR Growth</h2>
            <p className="text-xs text-gray-400 mt-0.5">Monthly recurring revenue over time</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(data?.mrr || 0)}</p>
            <p className="text-xs text-emerald-600 font-medium">+{data?.mrrGrowth || 0}% MoM</p>
          </div>
        </div>
        {isLoading ? <Skeleton className="h-56" /> : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:[&>line]:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="[&>text]:fill-gray-400" />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} className="[&>text]:fill-gray-400" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [formatCurrency(v), 'MRR']} />
              <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2.5} fill="url(#mrrFill)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Revenue Breakdown</h2>
          {isLoading ? <Skeleton className="h-52" /> : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={monthly} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:[&>line]:stroke-gray-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} className="[&>text]:fill-gray-400" />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} className="[&>text]:fill-gray-400" />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [formatCurrency(v)]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="newRevenue" name="New" fill="#6366f1" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="expansionRevenue" name="Expansion" fill="#10b981" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="churnedRevenue" name="Churned" fill="#f87171" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Summary Table */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Billing Summary</h2>
          <div className="space-y-3">
            {[
              { label: 'Monthly Recurring Revenue', value: formatCurrency(data?.mrr || 0), accent: 'text-brand-600 dark:text-brand-400' },
              { label: 'Annual Recurring Revenue', value: formatCurrency(data?.arr || 0), accent: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Active Subscriptions', value: formatNumber(data?.activeSubscriptions || 0), accent: 'text-sky-600 dark:text-sky-400' },
              { label: 'Churn Rate', value: `${(data?.churnRate || 0).toFixed(1)}%`, accent: 'text-red-500' },
              { label: 'MoM Growth', value: `+${data?.mrrGrowth || 0}%`, accent: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Average Revenue per User', value: formatCurrency(data?.activeSubscriptions ? (data.mrr / data.activeSubscriptions) : 0), accent: 'text-amber-600 dark:text-amber-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800/60 last:border-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className={`text-sm font-bold ${item.accent}`}>{isLoading ? '—' : item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Table */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Month', 'MRR', 'New Revenue', 'Expansion', 'Churned', 'Net Change'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(6)].map((_, i) => (
                    <tr key={i}>{[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>)}</tr>
                  ))
                : monthly.map((m: any) => {
                    const net = (m.newRevenue + m.expansionRevenue) - m.churnedRevenue;
                    return (
                      <tr key={m.month} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{m.month}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(m.mrr)}</td>
                        <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{formatCurrency(m.newRevenue)}</td>
                        <td className="px-4 py-3 text-sky-600 dark:text-sky-400">{formatCurrency(m.expansionRevenue)}</td>
                        <td className="px-4 py-3 text-red-500">{formatCurrency(m.churnedRevenue)}</td>
                        <td className={`px-4 py-3 font-semibold ${net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {net >= 0 ? '+' : ''}{formatCurrency(net)}
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )}
}
