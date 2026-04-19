'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, Users, DollarSign,
  FolderKanban, Settings, LogOut, Zap, ChevronRight, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, adminOnly: false },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, adminOnly: true },
  { label: 'Customers', href: '/dashboard/customers', icon: Users, adminOnly: false },
  { label: 'Revenue', href: '/dashboard/revenue', icon: DollarSign, adminOnly: true },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban, adminOnly: false },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, adminOnly: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/auth/login');
  };

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col z-40">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Nova</span>
          <span className="ml-auto text-xs font-medium px-1.5 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded">Beta</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Menu</p>
        {visibleItems.map(({ label, href, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              <Icon className={cn('shrink-0', active ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300')} size={18} />
              {label}
              {active && <ChevronRight className="ml-auto w-3.5 h-3.5 text-brand-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Role Badge */}
      <div className="px-4 pb-2">
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium',
          isAdmin
            ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
        )}>
          <ShieldCheck size={13} />
          {isAdmin ? 'Admin — Full Access' : 'Staff — Limited Access'}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-400 shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 truncate capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}