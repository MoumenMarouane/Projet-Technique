import { useState, useEffect } from 'react';
import { devisService } from '../../services/devis.service';
import { produitsService } from '../../services/produits.service';
import { vendeursService } from '../../services/vendeurs.service';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface Ligne {
  varianteId: string;
  quantite: number;
  prixUnitaireSnap: number;
  produitNom: string;
  varianteLabel: string;
}

export default function DevisForm({ onClose, onSuccess }: Props) {
  const [vendeurs, setVendeurs] = useState<any[]>([]);
  const [vendeurId, setVendeurId] = useState('');
  const [produits, setProduits] = useState<any[]>([]);
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedProduitId, setSelectedProduitId] = useState('');
  const [selectedVarianteId, setSelectedVarianteId] = useState('');
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    vendeursService.getAll().then(r => setVendeurs(r.data));
  }, []);

  useEffect(() => {
    if (vendeurId) {
      produitsService.getAll().then(r => {
        setProduits(r.data.filter((p: any) => p.vendeurId === vendeurId));
      });
      setLignes([]);
      setSelectedProduitId('');
      setSelectedVarianteId('');
    }
  }, [vendeurId]);

  const produitSelectionne = produits.find(p => p.id === selectedProduitId);
  const variantes = produitSelectionne?.variantes ?? [];
  const varianteSelectionnee = variantes.find((v: any) => v.id === selectedVarianteId);

  const getVarianteLabel = (variante: any) => {
    if (!variante?.items?.length) return `Variante (stock: ${variante?.stock ?? 0})`;
    return variante.items.map((item: any) => item.attributOption?.valeur ?? '').join(' / ')
      + ` — stock: ${variante.stock}`;
  };

  const getPrix = (produit: any, variante: any) =>
    variante?.prixModif ? Number(variante.prixModif) : Number(produit?.prixUnitaire ?? 0);

  const handleAjouterLigne = () => {
    if (!selectedVarianteId || !varianteSelectionnee) return;
    if (varianteSelectionnee.stock < quantite) {
      setError(`Stock insuffisant (disponible: ${varianteSelectionnee.stock})`);
      return;
    }
    const prix = getPrix(produitSelectionne, varianteSelectionnee);
    setLignes([...lignes, {
      varianteId: selectedVarianteId,
      quantite,
      prixUnitaireSnap: prix,
      produitNom: produitSelectionne?.nom ?? '',
      varianteLabel: getVarianteLabel(varianteSelectionnee),
    }]);
    setSelectedProduitId('');
    setSelectedVarianteId('');
    setQuantite(1);
    setError('');
  };

  const removeLigne = (i: number) => setLignes(lignes.filter((_, idx) => idx !== i));
  const total = lignes.reduce((sum, l) => sum + l.prixUnitaireSnap * l.quantite, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lignes.length === 0) { setError('Ajoutez au moins un article'); return; }
    setLoading(true);
    setError('');
    try {
      await devisService.create({
        vendeurId,
        lignes: lignes.map(l => ({
          varianteId: l.varianteId,
          quantite: l.quantite,
          prixUnitaireSnap: l.prixUnitaireSnap,
        })),
      });
      onSuccess();
    } catch {
      setError('Erreur lors de la création du devis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-100 font-medium">Nouveau devis</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Vendeur */}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Boutique</label>
            <select
              value={vendeurId}
              onChange={e => setVendeurId(e.target.value)}
              className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Sélectionner une boutique</option>
              {vendeurs.map((v: any) => (
                <option key={v.id} value={v.id}>{v.boutiqueNom}</option>
              ))}
            </select>
          </div>

          {/* Ajout article */}
          {vendeurId && (
            <div className="bg-[#0f1117] border border-[#2d3348] rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-3 font-medium">Ajouter un article</p>

              {produits.length === 0 ? (
                <p className="text-slate-500 text-[11px]">Aucun produit disponible</p>
              ) : (
                <>
                  <select
                    value={selectedProduitId}
                    onChange={e => { setSelectedProduitId(e.target.value); setSelectedVarianteId(''); }}
                    className="w-full bg-[#161b27] border border-[#2d3348] rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 mb-2"
                  >
                    <option value="">Choisir un produit</option>
                    {produits.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.nom} — {Number(p.prixUnitaire).toLocaleString()} MAD</option>
                    ))}
                  </select>

                  {selectedProduitId && variantes.length > 0 && (
                    <select
                      value={selectedVarianteId}
                      onChange={e => setSelectedVarianteId(e.target.value)}
                      className="w-full bg-[#161b27] border border-[#2d3348] rounded-lg px-2 py-1.5 text-[12px] text-white focus:outline-none focus:border-indigo-500 mb-2"
                    >
                      <option value="">Choisir une variante</option>
                      {variantes.map((v: any) => (
                        <option key={v.id} value={v.id} disabled={v.stock === 0}>
                          {getVarianteLabel(v)}
                          {v.prixModif ? ` — ${Number(v.prixModif).toLocaleString()} MAD` : ` — ${Number(produitSelectionne?.prixUnitaire).toLocaleString()} MAD`}
                        </option>
                      ))}
                    </select>
                  )}

                  {selectedVarianteId && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={quantite}
                        onChange={e => setQuantite(Number(e.target.value))}
                        min={1}
                        max={varianteSelectionnee?.stock ?? 1}
                        className="w-20 bg-[#161b27] border border-[#2d3348] rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-slate-400 text-[11px]">
                        = {(getPrix(produitSelectionne, varianteSelectionnee) * quantite).toLocaleString()} MAD
                      </span>
                      <button
                        type="button"
                        onClick={handleAjouterLigne}
                        className="ml-auto px-3 py-1.5 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        + Ajouter
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Lignes ajoutées */}
          {lignes.length > 0 && (
            <div>
              <p className="text-slate-400 text-xs mb-2 font-medium">Articles sélectionnés</p>
              {lignes.map((l, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 mb-1.5">
                  <div>
                    <p className="text-slate-200 text-[12px] font-medium">{l.produitNom}</p>
                    <p className="text-slate-500 text-[10px]">{l.varianteLabel} × {l.quantite}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-indigo-400 text-[12px] font-medium">
                      {(l.prixUnitaireSnap * l.quantite).toLocaleString()} MAD
                    </span>
                    <button type="button" onClick={() => removeLigne(i)} className="text-red-400 hover:text-red-300 text-lg">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {lignes.length > 0 && (
            <div className="flex justify-between items-center p-3 bg-[#0f1117] rounded-lg">
              <span className="text-slate-400 text-[12px]">Total estimé</span>
              <span className="text-slate-100 font-semibold">{total.toLocaleString()} MAD</span>
            </div>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg hover:border-slate-600 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={loading || lignes.length === 0}
              className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Création...' : 'Créer le devis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}