import api from './api';

export const entreprisesService = {
  getAll: () => api.get('/entreprises'),
  getOne: (id: string) => api.get(`/entreprises/${id}`),
  create: (data: any) => api.post('/entreprises', data),
  update: (id: string, data: any) => api.patch(`/entreprises/${id}`, data),
  remove: (id: string) => api.delete(`/entreprises/${id}`),
};
