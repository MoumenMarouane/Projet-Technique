import { useState, useEffect } from 'react';
import { devisService } from '../../services/devis.service';
import { produitsService } from '../../services/produits.service';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function DevisForm({ onClose, onSuccess }: Props) {
  const [produits, setProduits] = useState<any[]>([]);
  const [vendeurId, setVendeurId] = useState('');
  const [lignes, setLignes] = useState([{ produitId: '', quantite: 1, prixUnitaireSnap: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    produitsService.getAll().then(r => setProduits(r.data));
  }, []);

  const addLigne = () => setLignes([...lignes, { produitId: '', quantite: 1, prixUnitaireSnap: 0 }]);

  const updateLigne = (i: number, field: string, value: any) => {
    const updated = [...lignes];
    updated[i] = { ...updated[i], [field]: value };
    if (field === 'produitId') {
      const produit = produits.find(p => p.id === value);
      if (produit) updated[i].prixUnitaireSnap = Number(produit.prixUnitaire);
    }
    setLignes(updated);
  };

  const removeLigne = (i: number) => setLignes(lignes.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await devisService.create({ vendeurId, lignes });
      onSuccess();
    } catch {
      setError('Erreur lors de la création du devis');
    } finally {
      setLoading(false);
    }
  };

  const total = lignes.reduce((sum, l) => sum + l.prixUnitaireSnap * l.quantite, 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-100 font-medium">Nouveau devis</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">ID Vendeur</label>
            <input
              value={vendeurId}
              onChange={e => setVendeurId(e.target.value)}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="ID du vendeur"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-400 text-xs">Articles</label>
              <button type="button" onClick={addLigne} className="text-indigo-400 text-[11px] hover:text-indigo-300">
                + Ajouter ligne
              </button>
            </div>

            {lignes.map((ligne, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select
                  value={ligne.produitId}
                  onChange={e => updateLigne(i, 'produitId', e.target.value)}
                  className="flex-1 bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Produit</option>
                  {produits.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                </select>
                <input
                  type="number"
                  value={ligne.quantite}
                  onChange={e => updateLigne(i, 'quantite', Number(e.target.value))}
                  className="w-16 bg-[#0f1117] border border-[#2d3348] rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  min={1}
                  required
                />
                <span className="flex items-center text-slate-400 text-[11px] min-w-[70px]">
                  {(ligne.prixUnitaireSnap * ligne.quantite).toLocaleString()} MAD
                </span>
                {lignes.length > 1 && (
                  <button type="button" onClick={() => removeLigne(i)} className="text-red-400 hover:text-red-300 text-lg">×</button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-3 bg-[#0f1117] rounded-lg">
            <span className="text-slate-400 text-[12px]">Total estimé</span>
            <span className="text-slate-100 font-medium">{total.toLocaleString()} MAD</span>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
              {loading ? 'Création...' : 'Créer le devis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}