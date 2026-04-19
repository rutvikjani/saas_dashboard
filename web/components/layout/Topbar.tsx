'use client';
import { Bell, Search, Sun, Moon, Menu } from 'lucide-react';
import { useThemeStore } from '@/lib/themeStore';
import { useAuthStore } from '@/lib/authStore';
import { useState } from 'react';

export default function Topbar({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const { theme, toggle } = useThemeStore();
  const { user } = useAuthStore();
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    { id: 1, text: 'New customer signed up', time: '2m ago', dot: 'bg-green-500' },
    { id: 2, text: 'Revenue milestone: $50K MRR', time: '1h ago', dot: 'bg-brand-500' },
    { id: 3, text: 'Project "API v3" is 80% done', time: '3h ago', dot: 'bg-amber-500' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center px-6 gap-4">
      <button onClick={onMobileMenuToggle} className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                <span className="text-xs text-brand-600 cursor-pointer hover:underline">Mark all read</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-400">
          {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
        </div>
      </div>
    </header>
  );
}
