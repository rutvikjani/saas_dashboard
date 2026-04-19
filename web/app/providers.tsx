'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/themeStore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = useThemeStore.getState().theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-gray-900 !text-white !border !border-gray-700 !text-sm',
          duration: 3000,
        }}
      />
    </QueryClientProvider>
  );
}