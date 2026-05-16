import api from './api';

export const produitsService = {
  // ── CRUD produit ──────────────────────────────────────────
  getAll: () => api.get('/produits'),
  getOne: (id: string) => api.get(`/produits/${id}`),
  create: (data: any) => api.post('/produits', data),
  update: (id: string, data: any) => api.patch(`/produits/${id}`, data),
  remove: (id: string) => api.delete(`/produits/${id}`),

  // ── Variantes ─────────────────────────────────────────────
  getVariantes: (produitId: string) =>
    api.get(`/produits/${produitId}/variantes`),

  createVariante: (produitId: string, data: {
    attributOptionIds: string[];
    stock: number;
    prixModif?: number;
  }) => api.post(`/produits/${produitId}/variantes`, data),

  updateStock: (varianteId: string, stock: number) =>
    api.patch(`/produits/variantes/${varianteId}/stock`, { stock }),

  // ── Upload image ───────────────────────────────────────────
  uploadImage: (produitId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/produits/${produitId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── Catégories avec attributs ──────────────────────────────
export const categoriesService = {
  getAll: () => api.get('/categories'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  remove: (id: string) => api.delete(`/categories/${id}`),

  getAttributTypes: (categorieId: string) =>
    api.get(`/categories/${categorieId}/attributs`),
  addAttributType: (categorieId: string, data: { nom: string; estUnique?: boolean }) =>
    api.post(`/categories/${categorieId}/attributs`, data),

  getAttributOptions: (attributTypeId: string) =>
    api.get(`/categories/attributs/${attributTypeId}/options`),
  addAttributOption: (attributTypeId: string, data: { valeur: string }) =>
    api.post(`/categories/attributs/${attributTypeId}/options`, data),
};