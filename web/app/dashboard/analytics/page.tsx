'use client';
import { useTraffic } from '@/hooks/useQueries';
import { Card, Skeleton, KpiCard } from '@/components/ui';
import { Globe, MousePointer, Smartphone, Monitor, Tablet } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuthStore } from '@/lib/authStore';
import { ShieldCheck } from 'lucide-react';

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  Desktop: <Monitor size={14} />,
  Mobile: <Smartphone size={14} />,
  Tablet: <Tablet size={14} />,
};
const DEVICE_COLORS = ['#6366f1', '#10b981', '#f59e0b'];
const CHANNEL_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useTraffic();
  const traffic = data?.traffic || [];
  const deviceSources = data?.deviceSources || [];
  const channelSources = data?.channelSources || [];

  const latestMonth = traffic[traffic.length - 1] || {};

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <ShieldCheck className="text-red-500" size={28} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Access Restricted</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">You don't have permission to view analytics.</p>
      </div>
    );
  }
  else{
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Traffic, conversion, and performance metrics.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Total Visits" value={formatNumber(latestMonth.visits || 0)} change={9.3} icon={<Globe size={16} className="text-brand-600 dark:text-brand-400" />} loading={isLoading} />
        <KpiCard title="Unique Visitors" value={formatNumber(latestMonth.uniqueVisitors || 0)} change={7.1} icon={<MousePointer size={16} className="text-emerald-600" />} iconBg="bg-emerald-50 dark:bg-emerald-900/20" loading={isLoading} />
        <KpiCard title="Bounce Rate" value={`${latestMonth.bounceRate || 0}%`} change={-2.4} icon={<Globe size={16} className="text-amber-600" />} iconBg="bg-amber-50 dark:bg-amber-900/20" loading={isLoading} />
        <KpiCard title="Conversion Rate" value={`${latestMonth.conversionRate || 0}%`} change={1.8} icon={<MousePointer size={16} className="text-sky-600" />} iconBg="bg-sky-50 dark:bg-sky-900/20" loading={isLoading} />
      </div>

      {/* Traffic Trend */}
      <Card>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Traffic Trend</h2>
          <p className="text-xs text-gray-400 mt-0.5">Visits and unique visitors over 12 months</p>
        </div>
        {isLoading ? <Skeleton className="h-56" /> : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={traffic} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:[&>line]:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="[&>text]:fill-gray-400" />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} className="[&>text]:fill-gray-400" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [formatNumber(v)]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={2} dot={false} name="Visits" />
              <Line type="monotone" dataKey="uniqueVisitors" stroke="#10b981" strokeWidth={2} dot={false} name="Unique Visitors" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Device & Channel Sources */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Device Sources */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Device Sources</h2>
          <div className="flex items-center gap-6">
            {isLoading ? <Skeleton className="h-44 w-full" /> : (
              <>
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={deviceSources} dataKey="percentage" nameKey="device" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                      {deviceSources.map((_: any, i: number) => (
                        <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {deviceSources.map((d: any, i: number) => (
                    <div key={d.device} className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DEVICE_COLORS[i] }} />
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        {DEVICE_ICONS[d.device]} {d.device}
                      </div>
                      <div className="ml-auto text-sm font-semibold text-gray-900 dark:text-white">{d.percentage}%</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Channel Sources */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Traffic Channels</h2>
          {isLoading ? <Skeleton className="h-44" /> : (
            <div className="space-y-3">
              {channelSources.map((c: any, i: number) => (
                <div key={c.channel}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{c.channel}</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{c.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${c.percentage}%`, background: CHANNEL_COLORS[i % CHANNEL_COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Monthly Performance Table */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Performance</h2>
        {isLoading ? <Skeleton className="h-60" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {['Month', 'Visits', 'Unique Visitors', 'Page Views', 'Bounce Rate', 'Conversion'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {traffic.map((t: any) => (
                  <tr key={t.month} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{t.month}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatNumber(t.visits)}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatNumber(t.uniqueVisitors)}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatNumber(t.pageViews)}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.bounceRate}%</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${parseFloat(t.conversionRate) >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {t.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )}
}
