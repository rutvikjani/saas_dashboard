'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { Zap, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ email: 'admin@demo.com', password: 'password123' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Wake up Render API silently in background
    fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/health`)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Nova</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">Sign in to your dashboard</p>

        {/* Demo Banner */}
        <div className="mb-5 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-100 dark:border-brand-800">
          <p className="text-xs font-medium text-brand-700 dark:text-brand-400 mb-1">Demo credentials pre-filled</p>
          <p className="text-xs text-brand-600/70 dark:text-brand-500">admin@demo.com / password123</p>
        </div>

          {/* Free tier notice */}
        <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <span className="font-semibold">Live demo available below.</span> Please note: the backend uses free-tier hosting, so the first request may take a few seconds to initialize. Once active, the dashboard runs normally.
          </p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                className="input pr-10"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-5">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-brand-600 hover:text-brand-700 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
