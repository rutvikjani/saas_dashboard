import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { exportToCSV, exportToExcel } from '@/lib/fileParser';

// Analytics
export const useOverview = () =>
  useQuery({ queryKey: ['overview'], queryFn: () => api.get('/analytics/overview').then(r => r.data) });

export const useTraffic = () =>
  useQuery({ queryKey: ['traffic'], queryFn: () => api.get('/analytics/traffic').then(r => r.data) });

// Revenue
export const useRevenueSummary = () =>
  useQuery({ queryKey: ['revenue-summary'], queryFn: () => api.get('/revenue/summary').then(r => r.data) });

export const useRevenue = () =>
  useQuery({ queryKey: ['revenue'], queryFn: () => api.get('/revenue').then(r => r.data) });

// Customers
export const useCustomers = (params: Record<string, any> = {}) =>
  useQuery({
    queryKey: ['customers', params],
    queryFn: () => api.get('/customers', { params }).then(r => r.data),
  });

export const useCustomerStats = () =>
  useQuery({ queryKey: ['customer-stats'], queryFn: () => api.get('/customers/stats').then(r => r.data) });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/customers', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); toast.success('Customer created!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create customer'),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/customers/${id}`, data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); toast.success('Customer updated!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update'),
  });
};

export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/customers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); toast.success('Customer deleted'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete'),
  });
};

// Projects
export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: () => api.get('/projects').then(r => r.data) });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/projects', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project created!'); },
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/projects/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId, ...data }: any) => api.put(`/projects/${projectId}/tasks/${taskId}`, data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Task updated!'); },
  });
};

// User profile
export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.put('/users/profile', data).then(r => r.data),
    onSuccess: () => { toast.success('Profile updated!'); },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: any) => api.put('/users/password', data).then(r => r.data),
    onSuccess: () => toast.success('Password changed!'),
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to change password'),
  });


export const useExportCustomers = () => {
  return useMutation({
    mutationFn: async (format: 'csv' | 'excel') => {
      const { data } = await api.get('/customers', { params: { limit: 10000 } });
      return { customers: data.customers, format };
    },
    onSuccess: ({ customers, format }) => {
      const exportData = customers.map((c: any) => ({
        name: c.name,
        email: c.email,
        company: c.company,
        phone: c.phone,
        plan: c.plan,
        status: c.status,
        country: c.country,
        mrr: c.mrr,
        joinedAt: new Date(c.joinedAt).toLocaleDateString(),
      }));
      if (format === 'csv') {
        exportToCSV(exportData, 'nova-customers');
      } else {
        exportToExcel(exportData, 'nova-customers');
      }
      toast.success('Export downloaded!');
    },
  });
};