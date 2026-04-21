import { useState } from 'react';
import { facturesService } from '../../services/factures.service';

interface Props {
  factureId: string;
  reste: number;
  onClose: () => void;
  onSuccess: () => void;
}

const METHODES = ['ESPECES', 'CHEQUE', 'ONLINE', 'VIREMENT'];

export default function PaiementForm({ factureId, reste, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ methode: 'ESPECES', montantVerse: '', reference: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await facturesService.addPaiement(factureId, {
        ...form,
        montantVerse: Number(form.montantVerse),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-100 font-medium">Ajouter un paiement</h2>
            <p className="text-slate-500 text-xs mt-0.5">Reste à payer : {reste.toLocaleString()} MAD</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Méthode de paiement</label>
            <div className="grid grid-cols-2 gap-2">
              {METHODES.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm({ ...form, methode: m })}
                  className={`py-2 text-[12px] rounded-lg border transition-colors ${
                    form.methode === m
                      ? 'bg-[#1e2a4a] text-indigo-400 border-indigo-800'
                      : 'border-[#2d3348] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">Montant (MAD)</label>
            <input
              type="number"
              value={form.montantVerse}
              onChange={e => setForm({ ...form, montantVerse: e.target.value })}
              max={reste}
              min={1}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">Référence (optionnel)</label>
            <input
              value={form.reference}
              onChange={e => setForm({ ...form, reference: e.target.value })}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="N° chèque, transaction..."
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
              {loading ? 'Enregistrement...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}