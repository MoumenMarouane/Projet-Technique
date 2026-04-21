import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { categoriesService } from '../../services/categories.service';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ libelle: '', description: '' });
  const [caracForm, setCaracForm] = useState({ nom: '', categorieId: '' });
  const [showCarac, setShowCarac] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = () => {
    categoriesService.getAll().then(r => setCategories(r.data));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await categoriesService.create(form);
    setForm({ libelle: '', description: '' });
    setShowForm(false);
    setLoading(false);
    fetchCategories();
  };

  const handleAddCarac = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await categoriesService.addCaracType(caracForm.categorieId, { nom: caracForm.nom });
    setCaracForm({ nom: '', categorieId: '' });
    setShowCarac(false);
    setLoading(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await categoriesService.remove(id);
    fetchCategories();
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Catégories" />
      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex gap-3 justify-end mb-6">
          <button
            onClick={() => setShowCarac(true)}
            className="border border-indigo-800 text-indigo-400 text-sm px-4 py-2 rounded-lg hover:bg-indigo-950 transition-colors"
          >
            + Caractéristique
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Nouvelle catégorie
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-[#161b27] border border-[#2d3348] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-slate-200 font-medium text-[13px]">{cat.libelle}</h3>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-400 text-[11px] px-2 py-1 rounded border border-red-900 hover:border-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
              {cat.description && (
                <p className="text-slate-500 text-[11px] mb-3">{cat.description}</p>
              )}
              <div>
                <p className="text-slate-500 text-[10px] mb-2 uppercase tracking-wider">Caractéristiques</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.caracTypes?.length > 0 ? cat.caracTypes.map((ct: any) => (
                    <span key={ct.id} className="bg-[#0f1117] text-slate-300 text-[10px] px-2 py-1 rounded-md border border-[#2d3348]">
                      {ct.nom}
                    </span>
                  )) : (
                    <span className="text-slate-600 text-[11px]">Aucune caractéristique</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal nouvelle catégorie */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-100 font-medium">Nouvelle catégorie</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Libellé</label>
                <input
                  value={form.libelle}
                  onChange={e => setForm({ ...form, libelle: e.target.value })}
                  className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
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
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg">Annuler</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
                  {loading ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal nouvelle caractéristique */}
      {showCarac && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-100 font-medium">Nouvelle caractéristique</h2>
              <button onClick={() => setShowCarac(false)} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
            </div>
            <form onSubmit={handleAddCarac} className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Catégorie</label>
                <select
                  value={caracForm.categorieId}
                  onChange={e => setCaracForm({ ...caracForm, categorieId: e.target.value })}
                  className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.libelle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Nom de la caractéristique</label>
                <input
                  value={caracForm.nom}
                  onChange={e => setCaracForm({ ...caracForm, nom: e.target.value })}
                  placeholder="ex: RAM, Processeur, Taille écran..."
                  className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCarac(false)} className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg">Annuler</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
                  {loading ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}