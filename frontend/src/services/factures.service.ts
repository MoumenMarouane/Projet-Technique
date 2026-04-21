import api from './api';

export const facturesService = {
  getOne: (id: string) => api.get(`/factures/${id}`),
  getByCommande: (commandeId: string) => api.get(`/factures/commande/${commandeId}`),
  addPaiement: (id: string, data: any) => api.post(`/factures/${id}/paiements`, data),
};