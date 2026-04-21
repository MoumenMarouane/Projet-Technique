import api from './api';

export const devisService = {
  getAll: () => api.get('/devis'),
  getOne: (id: string) => api.get(`/devis/${id}`),
  create: (data: any) => api.post('/devis', data),
  updateStatut: (id: string, statut: string) => api.patch(`/devis/${id}/statut`, { statut }),
};