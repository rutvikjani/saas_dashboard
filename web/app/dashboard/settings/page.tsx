'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useUpdateProfile, useChangePassword } from '@/hooks/useQueries';
import { Card } from '@/components/ui';
import { User, Lock, Bell, Palette, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/lib/themeStore';

const ALL_TABS = [
  { id: 'profile', label: 'Profile', icon: User, adminOnly: false },
  { id: 'company', label: 'Company', icon: Building, adminOnly: true },
  { id: 'password', label: 'Password', icon: Lock, adminOnly: false },
  { id: 'appearance', label: 'Appearance', icon: Palette, adminOnly: false },
  { id: 'notifications', label: 'Notifications', icon: Bell, adminOnly: false },
];

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const isAdmin = user?.role === 'admin';
  const TABS = ALL_TABS.filter(t => !t.adminOnly || isAdmin);
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: '', company: '', avatar: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState({ email: true, newCustomer: true, revenue: true, security: true });

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || '', company: user.company || '', avatar: user.avatar || '' });
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateProfile.mutateAsync(profileForm);
    setUser(updated);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { alert('Passwords do not match'); return; }
    await changePassword.mutateAsync({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Tabs - horizontal on mobile, vertical on desktop */}
        <div className="lg:w-56 shrink-0">
          <Card className="p-2">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap', tab === id ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800')}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === 'profile' && (
            <Card>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                <p className="text-xs text-gray-400 mt-1">Update your personal details.</p>
              </div>
              <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-lg sm:text-xl font-bold text-brand-700 dark:text-brand-400">
                  {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium capitalize">{user?.role}</span>
                </div>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input className="input" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email (read-only)</label>
                    <input className="input opacity-60 cursor-not-allowed" value={user?.email || ''} readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Avatar URL</label>
                  <input className="input" placeholder="https://example.com/avatar.png" value={profileForm.avatar} onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </Card>
          )}

          {tab === 'company' && (
            <Card>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Company Settings</h2>
                <p className="text-xs text-gray-400 mt-1">Update your company information.</p>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company Name</label>
                  <input className="input" placeholder="Acme Corp" value={profileForm.company} onChange={e => setProfileForm({ ...profileForm, company: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Industry</label>
                  <select className="input">
                    <option>SaaS / Software</option>
                    <option>E-commerce</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company Size</label>
                  <select className="input">
                    <option>1–10</option>
                    <option>11–50</option>
                    <option>51–200</option>
                    <option>200+</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </Card>
          )}

          {tab === 'password' && (
            <Card>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Change Password</h2>
                <p className="text-xs text-gray-400 mt-1">Use a strong password of at least 8 characters.</p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                  <input type="password" required className="input" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                  <input type="password" required minLength={6} className="input" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                  <input type="password" required className="input" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" disabled={changePassword.isPending}>
                  {changePassword.isPending ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </Card>
          )}

          {tab === 'appearance' && (
            <Card>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Appearance</h2>
                <p className="text-xs text-gray-400 mt-1">Customize the look and feel.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                <div className="flex gap-3">
                  {(['light', 'dark'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn('p-4 rounded-xl border-2 text-sm font-medium transition-all flex-1 max-w-[120px]', theme === t ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400')}
                    >
                      <div className={cn('w-8 h-8 rounded-lg mb-2 mx-auto', t === 'dark' ? 'bg-gray-900' : 'bg-white border border-gray-200')} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-xs text-gray-400 mt-1">Choose what you want to be notified about.</p>
              </div>
              <div className="space-y-1">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'newCustomer', label: 'New Customer Alerts', desc: 'When a new customer signs up' },
                  { key: 'revenue', label: 'Revenue Updates', desc: 'Daily revenue summaries' },
                  { key: 'security', label: 'Security Alerts', desc: 'Unusual login activity' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                      className={cn('relative w-10 h-6 rounded-full transition-colors shrink-0 ml-4', notifications[item.key as keyof typeof notifications] ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700')}
                    >
                      <span className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform', notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-1')} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <button className="btn-primary">Save Preferences</button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}