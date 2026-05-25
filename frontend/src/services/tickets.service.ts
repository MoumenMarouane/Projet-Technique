import api from './api';

export const ticketsService = {
  getAll: () => api.get('/tickets'),
  getOne: (id: string) => api.get(`/tickets/${id}`),
};
