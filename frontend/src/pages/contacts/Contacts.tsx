import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { contactsService } from '../../services/contacts.service';

export default function Contacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', emailContact: '', cin: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = () => {
    contactsService.getAll().then(r => setContacts(r.data)).catch(() => {});
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactsService.create(form);
      setForm({ nom: '', prenom: '', telephone: '', emailContact: '', cin: '' });
      setShowForm(false);
      fetchContacts();
    } catch {
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce contact ?')) return;
    await contactsService.remove(id);
    fetchContacts();
  };

  const filtered = contacts.filter(c =>
    (c.nom?.toLowerCase().includes(search.toLowerCase())) ||
    (c.prenom?.toLowerCase().includes(search.toLowerCase())) ||
    (c.emailContact?.toLowerCase().includes(search.toLowerCase())) ||
    (c.telephone?.includes(search))
  );

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Contacts" />
      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex items-center justify-between mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un contact..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-72 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Annuler' : '+ Ajouter contact'}
          </button>
        </div>

        {showForm && (
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 mb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Prénom"
                  value={form.prenom}
                  onChange={e => setForm({ ...form, prenom: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                  required
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={form.telephone}
                  onChange={e => setForm({ ...form, telephone: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.emailContact}
                  onChange={e => setForm({ ...form, emailContact: e.target.value })}
                  className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-slate-300"
                />
                <input
                  type="text"
                  placeholder="CIN"
                  value={form.cin}
                  onChange={e => setForm({ ...form, cin: e.target.value })}
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
                {['Nom', 'Prénom', 'Email', 'Téléphone', 'CIN', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400">{c.nom}</td>
                  <td className="px-4 py-3 text-slate-400">{c.prenom}</td>
                  <td className="px-4 py-3 text-slate-400">{c.emailContact || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{c.telephone || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{c.cin || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
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
                    Aucun contact trouvé
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
