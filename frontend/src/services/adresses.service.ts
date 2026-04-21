import api from './api';

export const adressesService = {
  getAll: () => api.get('/adresses'),
  getOne: (id: string) => api.get(`/adresses/${id}`),
  create: (data: any) => api.post('/adresses', data),
  update: (id: string, data: any) => api.patch(`/adresses/${id}`, data),
  remove: (id: string) => api.delete(`/adresses/${id}`),
};
