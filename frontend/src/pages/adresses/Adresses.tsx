import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { adressesService } from '../../services/adresses.service';

export default function Adresses() {
  const [adresses, setAdresses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rue: '', ville: '', codePostal: '', region: '', pays: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAdresses(); }, []);

  const fetchAdresses = () => {
    adressesService.getAll().then(r => setAdresses(r.data)).catch(() => {});
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adressesService.create(form);
      setForm({ rue: '', ville: '', codePostal: '', region: '', pays: '' });
      setShowForm(false);
      fetchAdresses();
    } catch {
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette adresse ?')) return;
    await adressesService.remove(id);
    fetchAdresses();
  };

  const filtered = adresses.filter(a =>
    (a.rue?.toLowerCase().includes(search.toLowerCase())) ||
    (a.ville?.toLowerCase().includes(search.toLowerCase())) ||
    (a.codePostal?.includes(search))
  );

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Adresses" />
      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex items-center justify-between mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une adresse..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-72 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Annuler' : '+ Ajouter adresse'}
          </button>
        </div>

        {showForm && (
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 mb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Rue"
                  value={form.rue}
                  onChange={e => setForm({ ...form, rue: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={form.ville}
                  onChange={e => setForm({ ...form, ville: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Code postal"
                  value={form.codePostal}
                  onChange={e => setForm({ ...form, codePostal: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Région"
                  value={form.region}
                  onChange={e => setForm({ ...form, region: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                />
                <input
                  type="text"
                  placeholder="Pays"
                  value={form.pays}
                  onChange={e => setForm({ ...form, pays: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                  required
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
                {['Rue', 'Ville', 'Code postal', 'Région', 'Pays', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: any) => (
                <tr key={a.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400">{a.rue}</td>
                  <td className="px-4 py-3 text-slate-400">{a.ville}</td>
                  <td className="px-4 py-3 text-slate-400">{a.codePostal}</td>
                  <td className="px-4 py-3 text-slate-400">{a.region || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{a.pays}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(a.id)}
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
                    Aucune adresse trouvée
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
