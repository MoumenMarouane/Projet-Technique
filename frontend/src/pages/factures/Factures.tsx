import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { facturesService } from '../../services/factures.service';
import PaiementForm from './PaiementForm';

export default function Factures() {
  const [factureId, setFactureId] = useState('');
  const [facture, setFacture] = useState<any>(null);
  const [showPaiement, setShowPaiement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!factureId) return;
    setLoading(true);
    setError('');
    try {
      const res = await facturesService.getOne(factureId);
      setFacture(res.data);
    } catch {
      setError('Facture introuvable');
      setFacture(null);
    } finally {
      setLoading(false);
    }
  };

  const totalVerse = facture?.paiements?.reduce(
    (sum: number, p: any) => sum + Number(p.montantVerse), 0
  ) ?? 0;

  const reste = facture ? Number(facture.montantTtc) - totalVerse : 0;

  const statutColor: Record<string, string> = {
    NON_PAYE: 'bg-red-950 text-red-400',
    PARTIEL: 'bg-orange-950 text-orange-400',
    SOLDE: 'bg-green-950 text-green-400',
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Factures" />
      <div className="flex-1 overflow-y-auto p-6">

        {/* Recherche */}
        <div className="flex gap-3 mb-6">
          <input
            value={factureId}
            onChange={e => setFactureId(e.target.value)}
            placeholder="Entrer l'ID de la facture..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-96 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {facture && (
          <div className="max-w-2xl">
            {/* Header facture */}
            <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-slate-100 font-medium">Facture #{facture.id?.slice(0, 8)}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{new Date(facture.dateEmission).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`text-[11px] px-3 py-1 rounded-full font-medium ${statutColor[facture.statutPaiement]}`}>
                  {facture.statutPaiement.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0f1117] rounded-lg p-3">
                  <p className="text-slate-500 text-[10px] mb-1">Montant HT</p>
                  <p className="text-slate-200 text-[13px] font-medium">{Number(facture.montantHt).toLocaleString()} MAD</p>
                </div>
                <div className="bg-[#0f1117] rounded-lg p-3">
                  <p className="text-slate-500 text-[10px] mb-1">TVA ({Number(facture.tva)}%)</p>
                  <p className="text-slate-200 text-[13px] font-medium">{(Number(facture.montantTtc) - Number(facture.montantHt)).toLocaleString()} MAD</p>
                </div>
                <div className="bg-[#0f1117] rounded-lg p-3">
                  <p className="text-slate-500 text-[10px] mb-1">Total TTC</p>
                  <p className="text-indigo-400 text-[13px] font-medium">{Number(facture.montantTtc).toLocaleString()} MAD</p>
                </div>
              </div>
            </div>

            {/* Paiements */}
            <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-300 text-[13px] font-medium">Paiements effectués</h4>
                {facture.statutPaiement !== 'SOLDE' && (
                  <button
                    onClick={() => setShowPaiement(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Ajouter paiement
                  </button>
                )}
              </div>

              {facture.paiements?.length === 0 ? (
                <p className="text-slate-500 text-[12px]">Aucun paiement enregistré</p>
              ) : (
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-[#2d3348]">
                      {['Méthode', 'Montant', 'Date', 'Référence'].map(h => (
                        <th key={h} className="pb-2 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {facture.paiements?.map((p: any, i: number) => (
                      <tr key={i} className="border-b border-[#1a2035] last:border-0">
                        <td className="py-2 text-slate-300">{p.methode}</td>
                        <td className="py-2 text-green-400">{Number(p.montantVerse).toLocaleString()} MAD</td>
                        <td className="py-2 text-slate-400">{new Date(p.datePaiement).toLocaleDateString('fr-FR')}</td>
                        <td className="py-2 text-slate-500">{p.reference ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Reste à payer */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2d3348]">
                <span className="text-slate-400 text-[12px]">Versé : {totalVerse.toLocaleString()} MAD</span>
                <span className={`text-[13px] font-medium ${reste > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                  {reste > 0 ? `Reste : ${reste.toLocaleString()} MAD` : 'Soldée ✓'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPaiement && facture && (
        <PaiementForm
          factureId={facture.id}
          reste={reste}
          onClose={() => setShowPaiement(false)}
          onSuccess={() => {
            setShowPaiement(false);
            facturesService.getOne(facture.id).then(r => setFacture(r.data));
          }}
        />
      )}
    </div>
  );
}