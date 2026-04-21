import api from './api';

export const ticketsService = {
  getAll: () => api.get('/tickets'),
  getOne: (id: string) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  update: (id: string, data: any) => api.patch(`/tickets/${id}`, data),
  remove: (id: string) => api.delete(`/tickets/${id}`),
};
