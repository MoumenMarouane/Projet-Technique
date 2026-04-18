import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import api from '../../services/api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const caData = [
  { mois: 'Oct', ca: 45000 },
  { mois: 'Nov', ca: 62000 },
  { mois: 'Déc', ca: 78000 },
  { mois: 'Jan', ca: 55000 },
  { mois: 'Fév', ca: 91000 },
  { mois: 'Mar', ca: 110000 },
  { mois: 'Avr', ca: 124500 },
];

const statutData = [
  { name: 'Livrées', value: 40, color: '#22c55e' },
  { name: 'En attente', value: 25, color: '#f97316' },
  { name: 'Confirmées', value: 20, color: '#818cf8' },
  { name: 'Annulées', value: 15, color: '#ef4444' },
];

const produitsData = [
  { nom: 'Laptop', qte: 120 },
  { nom: 'TV 55"', qte: 95 },
  { nom: 'iPhone', qte: 74 },
  { nom: 'Tablette', qte: 52 },
  { nom: 'Clavier', qte: 38 },
];

const paiementsData = [
  { mois: 'Jan', soldes: 32000, partiels: 12000 },
  { mois: 'Fév', soldes: 45000, partiels: 18000 },
  { mois: 'Mar', soldes: 61000, partiels: 22000 },
  { mois: 'Avr', soldes: 78000, partiels: 15000 },
];

export default function Dashboard() {
  const [view, setView] = useState<'general' | 'analytics'>('general');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Dashboard"
        showViewToggle
        onViewChange={setView}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {view === 'general' ? (
          <div>
            {/* Stats cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Chiffre d'affaires", value: `${stats?.chiffreAffaires?.toLocaleString() ?? 0} MAD`, sub: '+12% ce mois', up: true },
                { label: 'Commandes', value: stats?.totalCommandes ?? 0, sub: '+8% ce mois', up: true },
                { label: 'Produits actifs', value: stats?.totalProduits ?? 0, sub: '-2 cette semaine', up: false },
                { label: 'Devis en attente', value: 12, sub: '3 expirent bientôt', up: false },
              ].map((card, i) => (
                <div key={i} className="bg-[#161b27] border border-[#2d3348] rounded-xl p-4">
                  <p className="text-[11px] text-slate-500 mb-1">{card.label}</p>
                  <p className="text-[22px] font-medium text-slate-100">{card.value}</p>
                  <p className={`text-[11px] mt-1 ${card.up ? 'text-green-400' : 'text-orange-400'}`}>{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Commandes récentes */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-medium text-slate-200">Commandes récentes</p>
              <button className="text-[11px] px-3 py-1 rounded-lg border border-indigo-800 text-indigo-400">Voir tout</button>
            </div>
            <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden mb-6">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-[#2d3348]">
                    {['#', 'Client', 'Produits', 'Montant', 'Statut', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats?.commandesRecentes ?? []).map((cmd: any, i: number) => (
                    <tr key={i} className="border-b border-[#1a2035] last:border-0">
                      <td className="px-4 py-3 text-slate-400">#{cmd.id?.slice(0, 6)}</td>
                      <td className="px-4 py-3 text-slate-300">Client</td>
                      <td className="px-4 py-3 text-slate-400">{cmd.lignes?.length} article(s)</td>
                      <td className="px-4 py-3 text-slate-300">— MAD</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          cmd.statut === 'LIVREE' ? 'bg-green-950 text-green-400' :
                          cmd.statut === 'EN_ATTENTE' ? 'bg-orange-950 text-orange-400' :
                          cmd.statut === 'CONFIRMEE' ? 'bg-indigo-950 text-indigo-400' :
                          'bg-red-950 text-red-400'
                        }`}>{cmd.statut}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{new Date(cmd.dateCommande).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            {/* Stats analytiques */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'CA total', value: '124 500 MAD', sub: '+12% vs mois dernier' },
                { label: 'Taux conversion devis', value: '68%', sub: '+5% vs mois dernier' },
                { label: 'Panier moyen', value: '357 MAD', sub: '+3% vs mois dernier' },
                { label: 'Paiements en attente', value: '18 200 MAD', sub: '3 factures partielles' },
              ].map((card, i) => (
                <div key={i} className="bg-[#161b27] border border-[#2d3348] rounded-xl p-4">
                  <p className="text-[11px] text-slate-500 mb-1">{card.label}</p>
                  <p className="text-[18px] font-medium text-slate-100">{card.value}</p>
                  <p className="text-[11px] mt-1 text-green-400">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-2 gap-4">
              {/* CA par mois */}
              <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-4">
                <p className="text-[12px] text-slate-400 mb-4">Chiffre d'affaires par mois (MAD)</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={caData}>
                    <XAxis dataKey="mois" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e2538', border: '0.5px solid #2d3348', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                    <Line type="monotone" dataKey="ca" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Commandes par statut */}
              <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-4">
                <p className="text-[12px] text-slate-400 mb-4">Commandes par statut</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={statutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                      {statutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e2538', border: '0.5px solid #2d3348', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Produits les plus vendus */}
              <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-4">
                <p className="text-[12px] text-slate-400 mb-4">Produits les plus vendus</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={produitsData}>
                    <XAxis dataKey="nom" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e2538', border: '0.5px solid #2d3348', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                    <Bar dataKey="qte" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Paiements */}
              <div className="bg-[#161b27] border border-[#2d3348] rounded-xl p-4">
                <p className="text-[12px] text-slate-400 mb-4">Paiements soldés vs partiels</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={paiementsData}>
                    <XAxis dataKey="mois" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e2538', border: '0.5px solid #2d3348', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    <Bar dataKey="soldes" name="Soldés" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="partiels" name="Partiels" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}