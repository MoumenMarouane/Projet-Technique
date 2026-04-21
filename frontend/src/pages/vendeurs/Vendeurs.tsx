import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { vendeursService } from '../../services/vendeurs.service';

export default function Vendeurs() {
  const [vendeurs, setVendeurs] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchVendeurs(); }, []);

  const fetchVendeurs = () => {
    vendeursService.getAll().then(r => setVendeurs(r.data)).catch(() => {});
  };

  const filtered = vendeurs.filter(v =>
    (v.id?.toLowerCase().includes(search.toLowerCase())) ||
    (v.specialisation?.toLowerCase().includes(search.toLowerCase())) ||
    (v.statut?.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatutColor = (statut: string) => {
    switch(statut) {
      case 'ACTIF': return 'text-green-400';
      case 'INACTIF': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Vendeurs" />
      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex items-center justify-between mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un vendeur..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-72 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                {['ID', 'Spécialisation', 'Statut', 'Date création', 'Adresses', 'Contacts'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v: any) => (
                <tr key={v.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono">#{v.id?.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-slate-400">{v.specialisation || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium ${getStatutColor(v.statut)}`}>
                      {v.statut || 'Actif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {v.createdAt ? new Date(v.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{v.adresses?.length ?? 0}</td>
                  <td className="px-4 py-3 text-slate-300">{v.contacts?.length ?? 0}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-[12px]">
                    Aucun vendeur trouvé
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
