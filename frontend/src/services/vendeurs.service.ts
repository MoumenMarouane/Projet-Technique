import api from './api';
export const vendeursService = {
  getProfile: () => api.get('/vendeurs/me'),
  update: (data: unknown) => api.patch('/vendeurs/me', data),
};