import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { ticketsService } from '../../services/tickets.service';
import { produitsService } from '../../services/produits.service';
import { clientsService } from '../../services/clients.service';
import { commandesService } from '../../services/commandes.service';
import { vendeursService } from '../../services/vendeurs.service';
import { useAuthStore } from '../../store/authStore';

interface Ligne {
  varianteId: string;
  quantite: number;
  prixUnitaireSnap: number;
  label: string;
}

export default function Tickets() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [produits, setProduits] = useState<any[]>([]);
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [selectedProduitId, setSelectedProduitId] = useState('');
  const [selectedVarianteId, setSelectedVarianteId] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    ticketsService.getAll().then(r => setTickets(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (showForm) {
      produitsService.getAll().then(r => setProduits(r.data));
    }
  }, [showForm]);

  const produitSelectionne = produits.find(p => p.id === selectedProduitId);
  const variantes = produitSelectionne?.variantes ?? [];
  const varianteSelectionnee = variantes.find((v: any) => v.id === selectedVarianteId);

  const getVarianteLabel = (v: any) => {
    if (!v?.items?.length) return `stock: ${v?.stock ?? 0}`;
    return v.items.map((item: any) => item.attributOption?.valeur ?? '').join(' / ')
      + ` — stock: ${v.stock}`;
  };

  const getPrix = (produit: any, variante: any) =>
    variante?.prixModif ? Number(variante.prixModif) : Number(produit?.prixUnitaire ?? 0);

  const handleAjouter = () => {
    if (!varianteSelectionnee) return;
    if (varianteSelectionnee.stock < quantite) {
      setError(`Stock insuffisant (dispo: ${varianteSelectionnee.stock})`);
      return;
    }
    const prix = getPrix(produitSelectionne, varianteSelectionnee);
    setLignes([...lignes, {
      varianteId: selectedVarianteId,
      quantite,
      prixUnitaireSnap: prix,
      label: `${produitSelectionne?.nom} — ${getVarianteLabel(varianteSelectionnee)}`,
    }]);
    setSelectedProduitId('');
    setSelectedVarianteId('');
    setQuantite(1);
    setError('');
  };

  const handleSubmit = async () => {
    if (lignes.length === 0) { setError('Ajoutez au moins un article'); return; }
    setLoading(true);
    setError('');
    try {
      // 1. Créer client anonyme
      const clientRes = await clientsService.createAnonymous({ type: 'ANONYME' });
      const clientId = clientRes.data.id;
      

      // 2. Récupérer vendeurId
      const vendeurRes = await vendeursService.getProfile();
      const vendeur = vendeurRes.data;

      // 3. Créer commande anonyme → ticket auto
      await commandesService.create({
        clientId,
        vendeurId: vendeur.id,
        type: 'ANONYME',
        lignes: lignes.map(l => ({
          varianteId: l.varianteId,
          quantite: l.quantite,
          prixUnitaireSnap: l.prixUnitaireSnap,
        })),
      });

      setLignes([]);
      setShowForm(false);
      ticketsService.getAll().then(r => setTickets(r.data));
    } catch {
      setError('Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  };

  const total = lignes.reduce((sum, l) => sum + l.prixUnitaireSnap * l.quantite, 0);

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Tickets de caisse" />
      <div className="flex-1 overflow-y-auto p-6">

        {/* Header */}
        {user?.role === 'VENDEUR' && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {showForm ? 'Annuler' : '+ Nouveau ticket'}
            </button>
          </div>
        )}

        {/* Formulaire */}
        {showForm && (
          <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-5 mb-6">
            <h3 className="text-slate-200 text-sm font-medium mb-4">Vente en caisse</h3>

            <div className="bg-[#0f1117] border border-[#2d3348] rounded-lg p-3 mb-4">
              <p className="text-slate-400 text-xs mb-3">Ajouter un article</p>

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
                    className="w-20 bg-[#161b27] border border-[#2d3348] rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none"
                  />
                  <span className="text-slate-400 text-[11px]">
                    = {(getPrix(produitSelectionne, varianteSelectionnee) * quantite).toLocaleString()} MAD
                  </span>
                  <button
                    type="button"
                    onClick={handleAjouter}
                    className="ml-auto px-3 py-1.5 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    + Ajouter
                  </button>
                </div>
              )}
            </div>

            {/* Lignes */}
            {lignes.map((l, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 mb-1.5">
                <div>
                  <p className="text-slate-200 text-[12px]">{l.label}</p>
                  <p className="text-slate-500 text-[10px]">× {l.quantite}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400 text-[12px]">{(l.prixUnitaireSnap * l.quantite).toLocaleString()} MAD</span>
                  <button onClick={() => setLignes(lignes.filter((_, idx) => idx !== i))} className="text-red-400 text-lg">×</button>
                </div>
              </div>
            ))}

            {lignes.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-[#0f1117] rounded-lg mt-2 mb-4">
                <span className="text-slate-400 text-[12px]">Total</span>
                <span className="text-slate-100 font-semibold">{total.toLocaleString()} MAD</span>
              </div>
            )}

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || lignes.length === 0}
              className="w-full py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Émettre le ticket'}
            </button>
          </div>
        )}

        {/* Table tickets */}
        <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                {['#', 'Commande', 'Montant total', 'Date émission'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t: any) => (
                <tr key={t.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400">#{t.id?.slice(0, 6)}</td>
                  <td className="px-4 py-3 text-slate-400">#{t.commandeId?.slice(0, 6)}</td>
                  <td className="px-4 py-3 text-indigo-400 font-medium">{Number(t.montantTotal).toLocaleString()} MAD</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(t.dateEmission).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-[12px]">Aucun ticket trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}