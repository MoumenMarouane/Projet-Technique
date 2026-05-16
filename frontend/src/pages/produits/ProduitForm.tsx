
import { useState, useEffect } from 'react';
import { produitsService, categoriesService } from '../../services/produits.service';
import type { AttributType, AttributOption } from '../../types/index';
interface Props {
  produit?: any;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
}

// Produit cartésien de plusieurs tableaux
function cartesian(arrays: string[][]): string[][] {
  if (arrays.length === 0) return [[]];
  return arrays.reduce<string[][]>(
    (acc, arr) => acc.flatMap(a => arr.map(b => [...a, b])),
    [[]]
  );
}

type Step = 1 | 2;

interface VarianteRow {
  optionIds: string[];   // une option par attributType
  labels: string[];      // ex: ["Rouge", "39"]
  stock: number;
  prixModif: string;
  isUnique: boolean;     // si une option est estUnique → stock forcé 1
}

export default function ProduitForm({ produit, categories, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdProduitId, setCreatedProduitId] = useState<string | null>(produit?.id ?? null);

  // ── Étape 1 : infos de base ──────────────────────────────
  const [form, setForm] = useState({
    nom: produit?.nom ?? '',
    description: produit?.description ?? '',
    prixUnitaire: produit?.prixUnitaire ?? '',
    categorieId: produit?.categorieId ?? '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>(produit?.imageUrl ?? '');

  // ── Attributs de la catégorie sélectionnée ───────────────
  const [attributTypes, setAttributTypes] = useState<AttributType[]>([]);

  useEffect(() => {
    if (form.categorieId) {
      categoriesService.getAttributTypes(form.categorieId)
        .then(r => setAttributTypes(r.data))
        .catch(() => setAttributTypes([]));
    } else {
      setAttributTypes([]);
    }
  }, [form.categorieId]);

  // ── Étape 2 : variantes ───────────────────────────────────
  const [varianteRows, setVarianteRows] = useState<VarianteRow[]>([]);

  // Génère le produit cartésien quand les attributTypes chargent
  useEffect(() => {
    if (attributTypes.length === 0) { setVarianteRows([]); return; }
    const allOptions = attributTypes.map(at => at.options ?? []);
    if (allOptions.some(o => o.length === 0)) return; // pas encore toutes les options

    const combinations = cartesian(allOptions.map(opts => opts.map(o => o.id)));
    const rows: VarianteRow[] = combinations.map(optionIds => {
      const labels = optionIds.map((oid, i) => {
        const opt = allOptions[i].find(o => o.id === oid);
        return opt?.valeur ?? '';
      });
      const isUnique = optionIds.some((oid, i) => {
        const opt = allOptions[i].find(o => o.id === oid);
        return attributTypes[i]?.estUnique ?? false;
      });
      return { optionIds, labels, stock: isUnique ? 1 : 0, prixModif: '', isUnique };
    });
    setVarianteRows(rows);
  }, [attributTypes]);

  // ── Étape 1 → créer le produit ───────────────────────────
const handleStep1 = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    let pid = produit?.id;
    if (produit) {
      await produitsService.update(produit.id, {
        ...form,
        prixUnitaire: Number(form.prixUnitaire),
      });
    } else {
      const res = await produitsService.create({
        ...form,
        prixUnitaire: Number(form.prixUnitaire),
      });
      pid = res.data.id;
    }
    setCreatedProduitId(pid);

    // Upload image si sélectionnée
    if (imageFile && pid) {
      await produitsService.uploadImage(pid, imageFile);
    }

    setStep(2);
  } catch {
    setError('Erreur lors de la sauvegarde du produit');
  } finally {
    setLoading(false);
  }
};
  // ── Étape 2 → créer les variantes ────────────────────────
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdProduitId) return;
    setLoading(true);
    setError('');
    try {
      for (const row of varianteRows) {
        await produitsService.createVariante(createdProduitId, {
          attributOptionIds: row.optionIds,
          stock: row.isUnique ? 1 : row.stock,
          prixModif: row.prixModif ? Number(row.prixModif) : undefined,
        });
      }
      onSuccess();
    } catch {
      setError('Erreur lors de la création des variantes');
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (i: number, field: 'stock' | 'prixModif', value: string) => {
    setVarianteRows(rows =>
      rows.map((r, idx) => idx === i ? { ...r, [field]: field === 'stock' ? Number(value) : value } : r)
    );
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b27] border border-[#2d3348] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2d3348]">
          <div>
            <h2 className="text-slate-100 font-medium text-lg">
              {produit ? 'Modifier le produit' : 'Ajouter un produit'}
            </h2>
            <div className="flex gap-2 mt-2">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium
                    ${step === s ? 'bg-indigo-600 text-white' : step > s ? 'bg-green-600 text-white' : 'bg-[#2d3348] text-slate-500'}`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className="text-xs text-slate-500">
                    {s === 1 ? 'Infos de base' : 'Variantes & stock'}
                  </span>
                  {s < 2 && <span className="text-slate-600 mx-1">→</span>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-2xl leading-none">×</button>
        </div>

        {/* ── ÉTAPE 1 ── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="p-6 flex flex-col gap-4">
            {/* Upload photo */}
<div>
  <label className="text-slate-400 text-xs mb-1 block">Photo du produit</label>
  {imagePreview && (
    <img
      src={imagePreview}
      alt="aperçu"
      className="w-full h-40 object-cover rounded-lg mb-2 border border-[#2d3348]"
    />
  )}
  <label className="flex items-center gap-2 cursor-pointer w-full bg-[#0f1117] border border-dashed border-[#2d3348] hover:border-indigo-500 rounded-lg px-3 py-4 text-sm text-slate-500 hover:text-slate-300 transition-colors justify-center">
    <span>📷 {imageFile ? imageFile.name : 'Choisir une photo'}</span>
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={e => {
        const f = e.target.files?.[0];
        if (f) {
          setImageFile(f);
          setImagePreview(URL.createObjectURL(f));
        }
      }}
    />
  </label>
</div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Nom du produit</label>
              <input
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 text-xs mb-1 block">Catégorie</label>
              <select
                value={form.categorieId}
                onChange={e => setForm({ ...form, categorieId: e.target.value })}
                className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.libelle}</option>
                ))}
              </select>
            </div>

            {/* Aperçu des attributs de la catégorie */}
            {attributTypes.length > 0 && (
              <div className="bg-indigo-950/30 border border-indigo-900/40 rounded-lg p-3">
                <p className="text-indigo-400 text-xs font-medium mb-2">
                  Axes de variation pour cette catégorie :
                </p>
                <div className="flex flex-wrap gap-2">
                  {attributTypes.map(at => (
                    <span key={at.id} className="text-xs bg-indigo-900/40 text-indigo-300 px-2 py-1 rounded-full">
                      {at.nom} {at.estUnique ? '🔑' : ''}
                      {at.options?.length ? ` (${at.options.length} options)` : ' — aucune option'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-400 text-xs mb-1 block">Prix de base (MAD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.prixUnitaire}
                onChange={e => setForm({ ...form, prixUnitaire: e.target.value })}
                className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 text-xs mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg hover:border-slate-600 transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
                {loading ? 'Enregistrement...' : 'Suivant →'}
              </button>
            </div>
          </form>
        )}

        {/* ── ÉTAPE 2 ── */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="p-6 flex flex-col gap-4">
            {varianteRows.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  Cette catégorie n'a pas encore d'attributs définis.
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Ajoutez des attributs (Couleur, Taille...) à la catégorie d'abord.
                </p>
                <button type="button" onClick={onSuccess}
                  className="mt-4 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Terminer sans variantes
                </button>
              </div>
            ) : (
              <>
                <p className="text-slate-400 text-sm">
                  {varianteRows.length} combinaison{varianteRows.length > 1 ? 's' : ''} générée{varianteRows.length > 1 ? 's' : ''} — saisissez le stock et le prix pour chaque variante.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2d3348]">
                        {attributTypes.map(at => (
                          <th key={at.id} className="text-left text-slate-500 text-xs pb-2 pr-4">
                            {at.nom}
                          </th>
                        ))}
                        <th className="text-left text-slate-500 text-xs pb-2 pr-4">Stock</th>
                        <th className="text-left text-slate-500 text-xs pb-2">Prix modifié (opt.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d3348]">
                      {varianteRows.map((row, i) => (
                        <tr key={i}>
                          {row.labels.map((label, j) => (
                            <td key={j} className="py-2 pr-4">
                              <span className="text-white text-xs bg-[#2d3348] px-2 py-1 rounded">
                                {label}
                              </span>
                            </td>
                          ))}
                          <td className="py-2 pr-4">
                            {row.isUnique ? (
                              <span className="text-amber-400 text-xs">1 (forcé 🔑)</span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={row.stock}
                                onChange={e => updateRow(i, 'stock', e.target.value)}
                                className="w-20 bg-[#0f1117] border border-[#2d3348] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                              />
                            )}
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="—"
                              value={row.prixModif}
                              onChange={e => updateRow(i, 'prixModif', e.target.value)}
                              className="w-24 bg-[#0f1117] border border-[#2d3348] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-2 text-sm border border-[#2d3348] text-slate-400 rounded-lg hover:border-slate-600 transition-colors">
                    ← Retour
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50">
                    {loading ? 'Création...' : '✓ Créer les variantes'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}