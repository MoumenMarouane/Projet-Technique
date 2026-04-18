import { commandesService } from '../../services/commandes.service';

interface Props {
  commande: any;
  onClose: () => void;
}

export default function CommandeDetail({ commande, onClose }: Props) {
  const total = commande.lignes?.reduce(
    (sum: number, l: any) => sum + Number(l.prixUnitaireSnap) * l.quantite, 0
  ) ?? 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-100 font-medium">Commande #{commande.id?.slice(0, 6)}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{new Date(commande.dateCommande).toLocaleDateString('fr-FR')}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
        </div>

        {/* Infos */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#0f1117] rounded-lg p-3">
            <p className="text-slate-500 text-[10px] mb-1">Type</p>
            <p className="text-slate-200 text-[12px]">{commande.type}</p>
          </div>
          <div className="bg-[#0f1117] rounded-lg p-3">
            <p className="text-slate-500 text-[10px] mb-1">Statut</p>
            <p className="text-slate-200 text-[12px]">{commande.statut?.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Lignes */}
        <p className="text-slate-400 text-[11px] mb-2 font-medium">Articles commandés</p>
        <div className="bg-[#0f1117] rounded-lg overflow-hidden mb-4">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                <th className="px-3 py-2 text-left text-[11px] text-slate-500 font-normal">Produit</th>
                <th className="px-3 py-2 text-left text-[11px] text-slate-500 font-normal">Qté</th>
                <th className="px-3 py-2 text-left text-[11px] text-slate-500 font-normal">Prix unit.</th>
                <th className="px-3 py-2 text-left text-[11px] text-slate-500 font-normal">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {commande.lignes?.map((l: any, i: number) => (
                <tr key={i} className="border-b border-[#1a2035] last:border-0">
                  <td className="px-3 py-2 text-slate-300">{l.produit?.nom ?? '—'}</td>
                  <td className="px-3 py-2 text-slate-400">{l.quantite}</td>
                  <td className="px-3 py-2 text-slate-400">{Number(l.prixUnitaireSnap).toLocaleString()} MAD</td>
                  <td className="px-3 py-2 text-slate-300">{(Number(l.prixUnitaireSnap) * l.quantite).toLocaleString()} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center p-3 bg-[#0f1117] rounded-lg mb-4">
          <span className="text-slate-400 text-[12px]">Total</span>
          <span className="text-slate-100 font-medium">{total.toLocaleString()} MAD</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg hover:border-slate-600 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}