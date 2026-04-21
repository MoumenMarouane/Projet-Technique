import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { entreprisesService } from '../../services/entreprises.service';

export default function Entreprises() {
  const [entreprises, setEntreprises] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: '', registreCommerce: '', numeroImpot: '', telephoneEntreprise: '', emailEntreprise: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEntreprises(); }, []);

  const fetchEntreprises = () => {
    entreprisesService.getAll().then(r => setEntreprises(r.data)).catch(() => {});
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await entreprisesService.create(form);
      setForm({ nom: '', registreCommerce: '', numeroImpot: '', telephoneEntreprise: '', emailEntreprise: '' });
      setShowForm(false);
      fetchEntreprises();
    } catch {
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette entreprise ?')) return;
    await entreprisesService.remove(id);
    fetchEntreprises();
  };

  const filtered = entreprises.filter(e =>
    (e.nom?.toLowerCase().includes(search.toLowerCase())) ||
    (e.registreCommerce?.toLowerCase().includes(search.toLowerCase())) ||
    (e.emailEntreprise?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Entreprises" />
      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex items-center justify-between mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une entreprise..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-72 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Annuler' : '+ Ajouter entreprise'}
          </button>
        </div>

        {showForm && (
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 mb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom entreprise"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Registre commerce"
                  value={form.registreCommerce}
                  onChange={e => setForm({ ...form, registreCommerce: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                />
                <input
                  type="text"
                  placeholder="Numéro impôt"
                  value={form.numeroImpot}
                  onChange={e => setForm({ ...form, numeroImpot: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={form.telephoneEntreprise}
                  onChange={e => setForm({ ...form, telephoneEntreprise: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.emailEntreprise}
                  onChange={e => setForm({ ...form, emailEntreprise: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300 col-span-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                {['Nom', 'Registre commerce', 'N° impôt', 'Email', 'Téléphone', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e: any) => (
                <tr key={e.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400">{e.nom}</td>
                  <td className="px-4 py-3 text-slate-400">{e.registreCommerce || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{e.numeroImpot || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{e.emailEntreprise || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{e.telephoneEntreprise || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-400 hover:text-red-300 text-[11px] transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-[12px]">
                    Aucune entreprise trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
