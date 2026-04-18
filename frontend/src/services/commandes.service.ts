import api from './api';

export const commandesService = {
  getAll: () => api.get('/commandes'),
  getOne: (id: string) => api.get(`/commandes/${id}`),
  create: (data: any) => api.post('/commandes', data),
  updateStatut: (id: string, statut: string) => api.patch(`/commandes/${id}/statut`, { statut }),
};