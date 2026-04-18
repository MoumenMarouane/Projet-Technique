import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { commandesService } from '../../services/commandes.service';
import CommandeDetail from './CommandeDetail';

const STATUTS = ['Tous', 'EN_ATTENTE', 'CONFIRMEE', 'EN_COURS', 'LIVREE', 'ANNULEE'];

const statutColors: Record<string, string> = {
  LIVREE: 'bg-green-950 text-green-400',
  EN_ATTENTE: 'bg-orange-950 text-orange-400',
  CONFIRMEE: 'bg-indigo-950 text-indigo-400',
  EN_COURS: 'bg-blue-950 text-blue-400',
  ANNULEE: 'bg-red-950 text-red-400',
};

export default function Commandes() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [filtre, setFiltre] = useState('Tous');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    commandesService.getAll().then(r => setCommandes(r.data));
  }, []);

  const filtered = commandes.filter(c =>
    filtre === 'Tous' ? true : c.statut === filtre
  );

  const handleStatut = async (id: string, statut: string) => {
    await commandesService.updateStatut(id, statut);
    commandesService.getAll().then(r => setCommandes(r.data));
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Commandes" />
      <div className="flex-1 overflow-y-auto p-6">

        {/* Filtres statut */}
        <div className="flex gap-2 mb-6">
          {STATUTS.map(s => (
            <button
              key={s}
              onClick={() => setFiltre(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] border transition-colors ${
                filtre === s
                  ? 'bg-[#1e2a4a] text-indigo-400 border-indigo-800'
                  : 'border-[#2d3348] text-slate-400 hover:border-slate-600'
              }`}
            >
              {s === 'Tous' ? 'Toutes' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                {['#', 'Type', 'Articles', 'Date', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400">#{c.id?.slice(0, 6)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.type === 'ANONYME' ? 'bg-gray-900 text-gray-400' : 'bg-indigo-950 text-indigo-400'}`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{c.lignes?.length} article(s)</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(c.dateCommande).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statutColors[c.statut]}`}>
                      {c.statut.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(c)}
                        className="text-indigo-400 text-[11px] px-2 py-1 rounded border border-indigo-900 hover:border-indigo-700 transition-colors"
                      >
                        Détail
                      </button>
                      {c.statut === 'EN_ATTENTE' && (
                        <button
                          onClick={() => handleStatut(c.id, 'CONFIRMEE')}
                          className="text-green-400 text-[11px] px-2 py-1 rounded border border-green-900 hover:border-green-700 transition-colors"
                        >
                          Confirmer
                        </button>
                      )}
                      {c.statut === 'CONFIRMEE' && (
                        <button
                          onClick={() => handleStatut(c.id, 'LIVREE')}
                          className="text-blue-400 text-[11px] px-2 py-1 rounded border border-blue-900 hover:border-blue-700 transition-colors"
                        >
                          Livrer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-[12px]">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <CommandeDetail commande={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}