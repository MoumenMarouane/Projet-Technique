import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { produitsService } from '../../services/produits.service';
import { categoriesService } from '../../services/categories.service';
import ProduitForm from './ProduitForm';

export default function Produits() {
  const [produits, setProduits] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProduits();
    categoriesService.getAll().then(r => setCategories(r.data));
  }, []);

  const fetchProduits = () => {
    produitsService.getAll().then(r => setProduits(r.data));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await produitsService.remove(id);
    fetchProduits();
  };

  const filtered = produits.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  );

  // Stock total = somme des stocks de toutes les variantes
  const getTotalStock = (produit: any) => {
    if (!produit.variantes?.length) return 0;
    return produit.variantes.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0);
  };

  // Résumé des variantes pour affichage compact
  const getVariantesSummary = (produit: any) => {
    if (!produit.variantes?.length) return null;
    return produit.variantes.length;
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Produits" />
      <div className="flex-1 overflow-y-auto p-6">

        {/* Barre de recherche + bouton */}
        <div className="flex items-center justify-between mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-72 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => { setSelected(null); setShowForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Ajouter produit
          </button>
        </div>

        {/* Grille produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p: any) => {
            const totalStock = getTotalStock(p);
            const nbVariantes = getVariantesSummary(p);
            const isExpanded = expandedId === p.id;

            return (
              <div
                key={p.id}
                className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden hover:border-[#3d4568] transition-colors"
              >
                {/* Photo du produit */}
                <div className="relative h-40 bg-[#0f1117] flex items-center justify-center overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-700">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[11px]">Aucune photo</span>
                    </div>
                  )}
                  {/* Badge catégorie */}
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-900/50">
                    {p.categorie?.libelle ?? '—'}
                  </span>
                  {/* Badge stock */}
                  <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-medium
                    ${totalStock > 10
                      ? 'bg-green-950/80 text-green-400 border border-green-900/50'
                      : totalStock > 0
                        ? 'bg-orange-950/80 text-orange-400 border border-orange-900/50'
                        : 'bg-red-950/80 text-red-400 border border-red-900/50'
                    }`}>
                    {totalStock} en stock
                  </span>
                </div>

                {/* Infos produit */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-slate-100 font-medium text-[13px] leading-snug">{p.nom}</h3>
                    <span className="text-indigo-400 font-semibold text-[13px] ml-2 whitespace-nowrap">
                      {Number(p.prixUnitaire).toLocaleString()} MAD
                    </span>
                  </div>

                  {p.description && (
                    <p className="text-slate-500 text-[11px] mb-3 line-clamp-2">{p.description}</p>
                  )}

                  {/* Résumé variantes */}
                  {nbVariantes !== null && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      className="w-full text-left mb-3"
                    >
                      <div className="flex items-center justify-between bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 hover:border-indigo-900 transition-colors">
                        <span className="text-slate-400 text-[11px]">
                          {nbVariantes} variante{nbVariantes > 1 ? 's' : ''}
                        </span>
                        <svg
                          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                  )}

                  {/* Détail variantes (expandable) */}
                  {isExpanded && p.variantes?.length > 0 && (
                    <div className="mb-3 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                      {p.variantes.map((v: any) => {
                        const labels = v.items?.map((item: any) =>
                          `${item.attributOption?.attributType?.nom ?? ''}: ${item.attributOption?.valeur ?? ''}`
                        ) ?? [];
                        return (
                          <div key={v.id} className="bg-[#0f1117] border border-[#2d3348] rounded-lg px-3 py-2 flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {labels.map((label: string, i: number) => (
                                <span key={i} className="text-[10px] bg-indigo-950/60 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-900/30">
                                  {label}
                                </span>
                              ))}
                              {labels.length === 0 && (
                                <span className="text-slate-600 text-[10px]">Variante sans attribut</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              {v.prixModif && (
                                <span className="text-[10px] text-amber-400">{Number(v.prixModif).toLocaleString()} MAD</span>
                              )}
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded
                                ${v.stock > 5 ? 'text-green-400' : v.stock > 0 ? 'text-orange-400' : 'text-red-400'}`}>
                                {v.stock}x
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelected(p); setShowForm(true); }}
                      className="flex-1 text-indigo-400 hover:text-indigo-300 text-[11px] py-1.5 rounded border border-indigo-900 hover:border-indigo-700 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 text-red-400 hover:text-red-300 text-[11px] py-1.5 rounded border border-red-900 hover:border-red-700 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-3 py-16 text-center text-slate-500 text-[13px]">
              Aucun produit trouvé
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ProduitForm
          produit={selected}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchProduits(); }}
        />
      )}
    </div>
  );
}