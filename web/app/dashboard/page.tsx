'use client';
import { Users, DollarSign, TrendingUp, Activity, ArrowUpRight } from 'lucide-react';
import { useOverview } from '@/hooks/useQueries';
import { KpiCard, Card, Skeleton, Table, Th, Td, Badge } from '@/components/ui';
import { formatCurrency, formatNumber, getStatusColor, getPlanColor } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { format } from 'date-fns';

const CHART_COLORS = { mrr: '#6366f1', users: '#10b981' };

export default function OverviewPage() {
  const { data, isLoading } = useOverview();

  const kpis = data?.kpis || {};
  const revenueChart = data?.revenueChart || [];
  const userGrowth = data?.userGrowth || [];
  const activities = data?.activities || [];

  const growthData = userGrowth.map((g: any) => ({
    month: `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][g._id.month - 1]}`,
    users: g.count,
  }));

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total Customers"
          value={formatNumber(kpis.totalCustomers || 0)}
          change={8.2}
          icon={<Users size={16} className="text-brand-600 dark:text-brand-400" />}
          loading={isLoading}
        />
        <KpiCard
          title="Monthly Revenue"
          value={formatCurrency(kpis.mrr || 0)}
          change={12.5}
          icon={<DollarSign size={16} className="text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          loading={isLoading}
        />
        <KpiCard
          title="Active Users"
          value={formatNumber(kpis.activeCustomers || 0)}
          change={5.1}
          icon={<Activity size={16} className="text-sky-600 dark:text-sky-400" />}
          iconBg="bg-sky-50 dark:bg-sky-900/20"
          loading={isLoading}
        />
        <KpiCard
          title="Churn Rate"
          value={`${(kpis.churnRate || 0).toFixed(1)}%`}
          change={-1.2}
          icon={<TrendingUp size={16} className="text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          loading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue Growth</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly recurring revenue over time</p>
            </div>
            <span className="badge bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs">+12.5% MoM</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-52" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={revenueChart} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:[&>line]:stroke-gray-800" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="[&>text]:fill-gray-400" />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} className="[&>text]:fill-gray-400" />
                <Tooltip
                  contentStyle={{ background: 'var(--tooltip-bg, #fff)', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [formatCurrency(v), 'MRR']}
                />
                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2} fill="url(#mrrGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* User Growth */}
        <Card>
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">User Growth</h2>
            <p className="text-xs text-gray-400 mt-0.5">New signups per month</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-52" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={growthData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:[&>line]:stroke-gray-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} className="[&>text]:fill-gray-400" />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} className="[&>text]:fill-gray-400" />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Customers */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Customers</h2>
            <a href="/dashboard/customers" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </a>
          </div>
          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : (
            <Table>
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <Th>Customer</Th>
                  <Th>Plan</Th>
                  <Th>Status</Th>
                  <Th>MRR</Th>
                </tr>
              </thead>
              <tbody>
                {(data?.revenueChart || []).slice(0, 5).map((_: any, i: number) => {
                  const names = ['Emma Johnson', 'Liam Smith', 'Olivia Brown', 'Noah Davis', 'Ava Wilson'];
                  const plans = ['pro', 'enterprise', 'starter', 'pro', 'enterprise'];
                  const statuses = ['active', 'active', 'trial', 'active', 'active'];
                  const mrrs = [99, 499, 29, 99, 499];
                  return (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-400">
                            {names[i].split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{names[i]}</span>
                        </div>
                      </Td>
                      <Td><Badge className={getPlanColor(plans[i])}>{plans[i]}</Badge></Td>
                      <Td><Badge className={getStatusColor(statuses[i])}>{statuses[i]}</Badge></Td>
                      <Td className="font-medium text-gray-900 dark:text-white">{formatCurrency(mrrs[i])}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>

        {/* Activity Feed */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Activity Feed</h2>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="space-y-3">
            {isLoading
              ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-12" />)
              : activities.slice(0, 6).map((a: any, i: number) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 shrink-0 mt-0.5">
                      {a.userId?.name ? a.userId.name[0] : 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{a.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {a.createdAt ? format(new Date(a.createdAt), 'MMM d, h:mm a') : ''}
                      </p>
                    </div>
                  </div>
                ))
            }
          </div>
        </Card>
      </div>
    </div>
  );
}
