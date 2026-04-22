import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { clientsService } from '../../services/clients.service';

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    clientsService.getAll().then(r => setClients(r.data)).catch(() => {});
  }, []);

  const filtered = clients.filter(c =>
    `${c.nom ?? ''} ${c.prenom ?? ''} ${c.email ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Clients" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-72 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                {['Nom', 'Prénom', 'Email', 'Type', 'Commandes', 'Devis'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-200 font-medium">{c.nom}</td>
                  <td className="px-4 py-3 text-slate-400">{c.prenom ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{c.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      c.typeClient === 'PROFESSIONNEL' ? 'bg-indigo-950 text-indigo-400' : 'bg-gray-900 text-gray-400'
                    }`}>
                      {c.typeClient === 'PROFESSIONNEL' ? 'Pro' : 'Particulier'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{c.commandes?.length ?? 0}</td>
                  <td className="px-4 py-3 text-slate-300">{c.devis?.length ?? 0}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-[12px]">
                    Aucun client trouvé
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