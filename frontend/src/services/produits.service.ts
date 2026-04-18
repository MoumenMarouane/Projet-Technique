import api from './api';

export const produitsService = {
  getAll: () => api.get('/produits'),
  getOne: (id: string) => api.get(`/produits/${id}`),
  create: (data: any) => api.post('/produits', data),
  update: (id: string, data: any) => api.patch(`/produits/${id}`, data),
  remove: (id: string) => api.delete(`/produits/${id}`),
  addCaracValeur: (id: string, data: any) => api.post(`/produits/${id}/carac-valeurs`, data),
};