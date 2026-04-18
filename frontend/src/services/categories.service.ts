import api from './api';

export const categoriesService = {
  getAll: () => api.get('/categories'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  remove: (id: string) => api.delete(`/categories/${id}`),
  addCaracType: (id: string, data: any) => api.post(`/categories/${id}/carac-types`, data),
};