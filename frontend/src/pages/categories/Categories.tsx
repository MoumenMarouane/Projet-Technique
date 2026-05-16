import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { categoriesService } from '../../services/categories.service';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ libelle: '', description: '' });
  const [loading, setLoading] = useState(false);

  // Modal : ajouter un AttributType à une catégorie
  const [showAttributType, setShowAttributType] = useState(false);
  const [attributTypeForm, setAttributTypeForm] = useState({ nom: '', estUnique: false, categorieId: '' });

  // Modal : ajouter une AttributOption à un AttributType
  const [showOption, setShowOption] = useState(false);
  const [optionForm, setOptionForm] = useState({ valeur: '', attributTypeId: '', attributTypeNom: '' });

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

  const handleAddAttributType = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await categoriesService.addAttributType(attributTypeForm.categorieId, {
      nom: attributTypeForm.nom,
      estUnique: attributTypeForm.estUnique,
    });
    setAttributTypeForm({ nom: '', estUnique: false, categorieId: '' });
    setShowAttributType(false);
    setLoading(false);
    fetchCategories();
  };

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await categoriesService.addAttributOption(optionForm.attributTypeId, {
      valeur: optionForm.valeur,
    });
    setOptionForm({ valeur: '', attributTypeId: '', attributTypeNom: '' });
    setShowOption(false);
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
            onClick={() => setShowAttributType(true)}
            className="border border-indigo-800 text-indigo-400 text-sm px-4 py-2 rounded-lg hover:bg-indigo-950 transition-colors"
          >
            + Axe de variation
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

              {/* Axes de variation (AttributTypes) */}
              <div>
                <p className="text-slate-500 text-[10px] mb-2 uppercase tracking-wider">
                  Axes de variation
                </p>

                {cat.attributTypes?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {cat.attributTypes.map((at: any) => (
                      <div key={at.id} className="bg-[#0f1117] border border-[#2d3348] rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 text-[11px] font-medium">{at.nom}</span>
                            {at.estUnique && (
                              <span className="text-[9px] bg-amber-900/40 text-amber-400 px-1.5 py-0.5 rounded">
                                🔑 Unique
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setOptionForm({ valeur: '', attributTypeId: at.id, attributTypeNom: at.nom });
                              setShowOption(true);
                            }}
                            className="text-[10px] text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded hover:border-indigo-600 transition-colors"
                          >
                            + Option
                          </button>
                        </div>
                        {/* Options */}
                        <div className="flex flex-wrap gap-1">
                          {at.options?.length > 0 ? at.options.map((opt: any) => (
                            <span key={opt.id} className="text-[10px] bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-900/40">
                              {opt.valeur}
                            </span>
                          )) : (
                            <span className="text-slate-600 text-[10px]">Aucune option</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[11px]">Aucun axe défini</span>
                    <button
                      onClick={() => {
                        setAttributTypeForm({ nom: '', estUnique: false, categorieId: cat.id });
                        setShowAttributType(true);
                      }}
                      className="text-[10px] text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded hover:border-indigo-600 transition-colors"
                    >
                      + Ajouter un axe
                    </button>
                  </div>
                )}
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

      {/* Modal nouvel AttributType */}
      {showAttributType && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-100 font-medium">Nouvel axe de variation</h2>
              <button onClick={() => setShowAttributType(false)} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
            </div>
            <form onSubmit={handleAddAttributType} className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Catégorie</label>
                <select
                  value={attributTypeForm.categorieId}
                  onChange={e => setAttributTypeForm({ ...attributTypeForm, categorieId: e.target.value })}
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
                <label className="text-slate-400 text-xs mb-1 block">Nom de l'axe</label>
                <input
                  value={attributTypeForm.nom}
                  onChange={e => setAttributTypeForm({ ...attributTypeForm, nom: e.target.value })}
                  placeholder="ex: Couleur, Taille, N° série..."
                  className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex items-center gap-3 bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2">
                <input
                  type="checkbox"
                  id="estUnique"
                  checked={attributTypeForm.estUnique}
                  onChange={e => setAttributTypeForm({ ...attributTypeForm, estUnique: e.target.checked })}
                  className="accent-indigo-500"
                />
                <label htmlFor="estUnique" className="text-slate-300 text-sm cursor-pointer">
                  Identifiant unique <span className="text-slate-500 text-xs">(ex: N° série → quantité forcée à 1)</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAttributType(false)} className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg">Annuler</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
                  {loading ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal nouvelle AttributOption */}
      {showOption && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-slate-100 font-medium">Nouvelle option</h2>
                <p className="text-slate-500 text-xs mt-0.5">Axe : {optionForm.attributTypeNom}</p>
              </div>
              <button onClick={() => setShowOption(false)} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
            </div>
            <form onSubmit={handleAddOption} className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Valeur</label>
                <input
                  value={optionForm.valeur}
                  onChange={e => setOptionForm({ ...optionForm, valeur: e.target.value })}
                  placeholder="ex: Rouge, 39, 128Go, SN-ABC123..."
                  className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowOption(false)} className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg">Annuler</button>
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