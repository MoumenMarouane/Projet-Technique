import { useState, useEffect } from 'react';
import { produitsService } from '../../services/produits.service';

interface Props {
  produit?: any;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProduitForm({ produit, categories, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    nom: '',
    description: '',
    prixUnitaire: '',
    stock: '',
    categorieId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (produit) {
      setForm({
        nom: produit.nom,
        description: produit.description ?? '',
        prixUnitaire: produit.prixUnitaire,
        stock: produit.stock,
        categorieId: produit.categorieId,
      });
    }
  }, [produit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = {
        ...form,
        prixUnitaire: Number(form.prixUnitaire),
        stock: Number(form.stock),
      };
      if (produit) {
        await produitsService.update(produit.id, data);
      } else {
        await produitsService.create(data);
      }
      onSuccess();
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-100 font-medium">
            {produit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Nom</label>
            <input
              value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">Catégorie</label>
            <select
              value={form.categorieId}
              onChange={e => setForm({ ...form, categorieId: e.target.value })}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.libelle}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Prix (MAD)</label>
              <input
                type="number"
                value={form.prixUnitaire}
                onChange={e => setForm({ ...form, prixUnitaire: e.target.value })}
                className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg hover:border-slate-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}