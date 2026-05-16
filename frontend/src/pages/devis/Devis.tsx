import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { devisService } from '../../services/devis.service';
import DevisForm from './DevisForm';

const STATUTS = ['Tous', 'EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'EXPIRE'];

const statutColors: Record<string, string> = {
  EN_ATTENTE: 'bg-orange-950 text-orange-400',
  ACCEPTE: 'bg-green-950 text-green-400',
  REFUSE: 'bg-red-950 text-red-400',
  EXPIRE: 'bg-gray-900 text-gray-400',
};

export default function Devis() {
  const [devis, setDevis] = useState<any[]>([]);
  const [filtre, setFiltre] = useState('Tous');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchDevis(); }, []);

  const fetchDevis = () => {
    devisService.getAll().then(r => setDevis(r.data));
  };

  const handleStatut = async (id: string, statut: string) => {
    await devisService.updateStatut(id, statut);
    fetchDevis();
  };

  const filtered = devis.filter(d =>
    filtre === 'Tous' ? true : d.statut === filtre
  );

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Devis" />
      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
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
                {s === 'Tous' ? 'Tous' : s}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Nouveau devis
          </button>
        </div>

        <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                {['#', 'Articles', 'Date', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: any) => (
                <tr key={d.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400">#{d.id?.slice(0, 6)}</td>
                  <td className="px-4 py-3 text-slate-300">
                    
{d.lignes?.map((l: any, i: number) => (
  <div key={i} className="text-[11px]">
    {l.variante?.items?.map((item: any) => item.attributOption?.valeur).join(' / ') || '—'}
    {' × '}{l.quantite}
    {' — '}{(Number(l.prixUnitaireSnap) * l.quantite).toLocaleString()} MAD
  </div>
))}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(d.dateDevis).toLocaleDateString('fr-FR')}                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statutColors[d.statut]}`}>
                      {d.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
{(d.statut === 'EN_ATTENTE' || d.statut === 'BROUILLON') && (
                        <>
                          <button
                            onClick={() => handleStatut(d.id, 'ACCEPTE')}
                            className="text-green-400 text-[11px] px-2 py-1 rounded border border-green-900 hover:border-green-700 transition-colors"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => handleStatut(d.id, 'REFUSE')}
                            className="text-red-400 text-[11px] px-2 py-1 rounded border border-red-900 hover:border-red-700 transition-colors"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-[12px]">
                    Aucun devis trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <DevisForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchDevis(); }}
        />
      )}
    </div>
  );
}
