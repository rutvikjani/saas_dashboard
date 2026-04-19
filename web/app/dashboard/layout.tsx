'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Spinner } from '@/components/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, fetchMe } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
  const check = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/auth/login'); setChecking(false); return; }
    await fetchMe();
    const store = useAuthStore.getState();
    if (!store.isAuthenticated) { router.push('/auth/login'); return; }
    setChecking(false);
  };
  check();
}, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`lg:translate-x-0 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:block fixed z-40`}>
        <Sidebar />
      </div>

      <div className="lg:pl-[260px]">
        <Topbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
