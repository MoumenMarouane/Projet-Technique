import api from './api';

export const categoriesService = {
  getAll: () => api.get('/categories'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  remove: (id: string) => api.delete(`/categories/${id}`),

  // Nouveau système : AttributType (remplace addCaracType)
  getAttributTypes: (categorieId: string) =>
    api.get(`/categories/${categorieId}/attributs`),

  addAttributType: (categorieId: string, data: { nom: string; estUnique?: boolean }) =>
    api.post(`/categories/${categorieId}/attributs`, data),

  // Nouveau système : AttributOption
  getAttributOptions: (attributTypeId: string) =>
    api.get(`/categories/attributs/${attributTypeId}/options`),

  addAttributOption: (attributTypeId: string, data: { valeur: string }) =>
    api.post(`/categories/attributs/${attributTypeId}/options`, data),
};