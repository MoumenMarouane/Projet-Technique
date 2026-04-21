import api from './api';

export const contactsService = {
  getAll: () => api.get('/contacts'),
  getOne: (id: string) => api.get(`/contacts/${id}`),
  create: (data: any) => api.post('/contacts', data),
  update: (id: string, data: any) => api.patch(`/contacts/${id}`, data),
  remove: (id: string) => api.delete(`/contacts/${id}`),
};
