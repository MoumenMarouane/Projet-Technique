import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { ticketsService } from '../../services/tickets.service';

export default function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titre: '', description: '', priorite: 'NORMAL', statut: 'OUVERT' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = () => {
    ticketsService.getAll().then(r => setTickets(r.data)).catch(() => {});
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ticketsService.create(form);
      setForm({ titre: '', description: '', priorite: 'NORMAL', statut: 'OUVERT' });
      setShowForm(false);
      fetchTickets();
    } catch {
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce ticket ?')) return;
    await ticketsService.remove(id);
    fetchTickets();
  };

  const getPrioriteColor = (priorite: string) => {
    switch(priorite) {
      case 'HAUTE': return 'bg-red-950 text-red-400';
      case 'NORMAL': return 'bg-yellow-950 text-yellow-400';
      case 'BASSE': return 'bg-green-950 text-green-400';
      default: return 'bg-gray-900 text-gray-400';
    }
  };

  const getStatutColor = (statut: string) => {
    switch(statut) {
      case 'OUVERT': return 'bg-indigo-950 text-indigo-400';
      case 'EN_COURS': return 'bg-blue-950 text-blue-400';
      case 'FERMÉ': return 'bg-gray-900 text-gray-400';
      default: return 'bg-gray-900 text-gray-400';
    }
  };

  const filtered = tickets.filter(t =>
    (t.titre?.toLowerCase().includes(search.toLowerCase())) ||
    (t.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Tickets" />
      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex items-center justify-between mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un ticket..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-72 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Annuler' : '+ Créer ticket'}
          </button>
        </div>

        {showForm && (
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 mb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Titre"
                value={form.titre}
                onChange={e => setForm({ ...form, titre: e.target.value })}
                className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300 min-h-24"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.priorite}
                  onChange={e => setForm({ ...form, priorite: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                >
                  <option value="BASSE">Basse</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HAUTE">Haute</option>
                </select>
                <select
                  value={form.statut}
                  onChange={e => setForm({ ...form, statut: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                >
                  <option value="OUVERT">Ouvert</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="FERMÉ">Fermé</option>
                </select>
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
                {['Titre', 'Priorité', 'Statut', 'Date création', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{t.titre}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPrioriteColor(t.priorite)}`}>
                      {t.priorite === 'HAUTE' ? 'Haute' : t.priorite === 'NORMAL' ? 'Normal' : 'Basse'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatutColor(t.statut)}`}>
                      {t.statut === 'OUVERT' ? 'Ouvert' : t.statut === 'EN_COURS' ? 'En cours' : 'Fermé'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-400 hover:text-red-300 text-[11px] transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-[12px]">
                    Aucun ticket trouvé
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
