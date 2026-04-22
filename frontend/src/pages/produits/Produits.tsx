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

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Produits" />
      <div className="flex-1 overflow-y-auto p-6">

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

        <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                {['Nom', 'Catégorie', 'Prix', 'Stock', 'Caractéristiques', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-200 font-medium">{p.nom}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-950 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full">
                      {p.categorie?.nom ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{Number(p.prix).toLocaleString()} MAD</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-orange-400' : 'text-red-400'}`}>
                      {p.stock} unités
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {p.caracValeurs?.length > 0
                      ? p.caracValeurs.map((c: any) => `${c.caracType?.nom}: ${c.valeur}`).join(' · ')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelected(p); setShowForm(true); }}
                        className="text-indigo-400 hover:text-indigo-300 text-[11px] px-2 py-1 rounded border border-indigo-900 hover:border-indigo-700 transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-300 text-[11px] px-2 py-1 rounded border border-red-900 hover:border-red-700 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-[12px]">
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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