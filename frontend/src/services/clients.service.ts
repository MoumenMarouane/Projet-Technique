import api from './api';

export const clientsService = {
  getAll: () => api.get('/clients'),
  getOne: (id: string) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients', data),
  createAnonymous: (data: any) => api.post('/clients/anonymous', data),
};