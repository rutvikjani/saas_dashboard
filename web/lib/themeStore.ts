import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggle: () => void;
  setTheme: (t: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next === 'dark');
        }
      },
      setTheme: (t) => {
        set({ theme: t });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', t === 'dark');
        }
      },
    }),
    { name: 'theme-storage' }
  )
);
