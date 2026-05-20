import { create } from 'zustand';
import api from '../lib/api';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface LeadState {
  leads: Lead[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchLeads: (params?: any) => Promise<void>;
  createLead: (data: Partial<Lead>) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  loading: false,
  error: null,
  fetchLeads: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/leads', { params });
      set({
        leads: response.data.data,
        pagination: response.data.pagination,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch leads', loading: false });
    }
  },
  createLead: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/leads', data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create lead', loading: false });
      throw error;
    }
  },
  updateLead: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/leads/${id}`, data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to update lead', loading: false });
      throw error;
    }
  },
  deleteLead: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/leads/${id}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to delete lead', loading: false });
      throw error;
    }
  },
}));
