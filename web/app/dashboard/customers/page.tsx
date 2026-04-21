'use client';
import { useState } from 'react';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '@/hooks/useQueries';
import { useAuthStore } from '@/lib/authStore';
import { Card, Table, Th, Td, Badge, Modal, Skeleton, EmptyState } from '@/components/ui';
import { formatCurrency, getStatusColor, getPlanColor, getInitials } from '@/lib/utils';
import { Search, Plus, Pencil, Trash2, Users, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const PLANS = ['', 'free', 'starter', 'pro', 'enterprise'];
const STATUSES = ['', 'active', 'inactive', 'churned', 'trial'];

interface CustomerForm {
  name: string; email: string; company: string; phone: string;
  plan: string; status: string; country: string;
}

const emptyForm: CustomerForm = { name: '', email: '', company: '', phone: '', plan: 'free', status: 'active', country: '' };

export default function CustomersPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [plan, setPlan] = useState('');
  const [modal, setModal] = useState<{ type: 'create' | 'edit' | 'delete'; customer?: any } | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);

  const { data, isLoading } = useCustomers({ page, limit: 10, search, status, plan });
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const openCreate = () => { setForm(emptyForm); setModal({ type: 'create' }); };
  const openEdit = (c: any) => { setForm({ name: c.name, email: c.email, company: c.company || '', phone: c.phone || '', plan: c.plan, status: c.status, country: c.country || '' }); setModal({ type: 'edit', customer: c }); };
  const openDelete = (c: any) => setModal({ type: 'delete', customer: c });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modal?.type === 'create') await createCustomer.mutateAsync(form);
    else if (modal?.type === 'edit') await updateCustomer.mutateAsync({ id: modal.customer._id, ...form });
    setModal(null);
  };

  const customers = data?.customers || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{total} total customers</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard/customers/import"
              className="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2"
            >
              <Upload size={14} />
              <span className="hidden sm:inline">Import</span>
            </Link>
            <button
              onClick={openCreate}
              className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Customer</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Card */}
      <Card>
        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 mb-4 sm:mb-5">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className="input pl-9"
              placeholder="Search customers..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </form>
          <div className="flex gap-2">
            <select className="input flex-1 sm:w-36" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              {STATUSES.map(s => <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Status'}</option>)}
            </select>
            <select className="input flex-1 sm:w-36" value={plan} onChange={e => { setPlan(e.target.value); setPage(1); }}>
              {PLANS.map(p => <option key={p} value={p}>{p ? p.charAt(0).toUpperCase() + p.slice(1) : 'All Plans'}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : customers.length === 0 ? (
          <EmptyState title="No customers found" description="Try adjusting your filters" icon={<Users size={40} />} />
        ) : (
          <div className="overflow-x-auto -mx-5">
            <Table>
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <Th>Customer</Th>
                  <Th className="hidden md:table-cell">Company</Th>
                  <Th className="hidden sm:table-cell">Plan</Th>
                  <Th>Status</Th>
                  <Th className="hidden md:table-cell">MRR</Th>
                  <Th className="hidden lg:table-cell">Joined</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c: any) => (
                  <tr key={c._id} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-400 shrink-0">
                          {getInitials(c.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[160px]">{c.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[100px] sm:max-w-[160px]">{c.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="hidden md:table-cell text-sm">{c.company || '—'}</Td>
                    <Td className="hidden sm:table-cell"><Badge className={getPlanColor(c.plan)}>{c.plan}</Badge></Td>
                    <Td><Badge className={getStatusColor(c.status)}>{c.status}</Badge></Td>
                    <Td className="hidden md:table-cell font-medium text-gray-900 dark:text-white text-sm">{c.mrr ? formatCurrency(c.mrr) : '—'}</Td>
                    <Td className="hidden lg:table-cell text-gray-500 text-sm">{format(new Date(c.joinedAt), 'MMM d, yyyy')}</Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        {isAdmin ? (
                          <>
                            <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => openDelete(c)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-700 pr-1">View only</span>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 hidden sm:block">Page {page} of {pages} · {total} results</p>
            <p className="text-xs text-gray-500 sm:hidden">{page}/{pages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft size={16} />
              </button>
              {[...Array(Math.min(5, pages))].map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded text-xs font-medium transition-colors ${page === p ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{p}</button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-1.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal open={modal?.type === 'create' || modal?.type === 'edit'} onClose={() => setModal(null)} title={modal?.type === 'create' ? 'Add Customer' : 'Edit Customer'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
              <input required className="input" placeholder="Emma Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
              <input required type="email" className="input" placeholder="emma@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company</label>
              <input className="input" placeholder="Acme Corp" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
              <input className="input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Plan</label>
              <select className="input" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}>
                {['free', 'starter', 'pro', 'enterprise'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
              <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {['active', 'inactive', 'churned', 'trial'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Country</label>
            <input className="input" placeholder="United States" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={createCustomer.isPending || updateCustomer.isPending}>
              {createCustomer.isPending || updateCustomer.isPending ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={modal?.type === 'delete'} onClose={() => setModal(null)} title="Delete Customer" size="sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-500" size={20} />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Delete <span className="font-semibold">{modal?.customer?.name}</span>?</p>
          <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={async () => { await deleteCustomer.mutateAsync(modal!.customer._id); setModal(null); }}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              disabled={deleteCustomer.isPending}
            >
              {deleteCustomer.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}