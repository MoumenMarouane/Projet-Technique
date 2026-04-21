import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { usersService } from '../../services/users.service';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    usersService.getAll().then(r => setUsers(r.data)).catch(() => {});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await usersService.remove(id);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    (u.email?.toLowerCase().includes(search.toLowerCase())) ||
    (u.role?.toLowerCase().includes(search.toLowerCase()))
  );

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-red-950 text-red-400';
      case 'VENDEUR': return 'bg-blue-950 text-blue-400';
      case 'CLIENT': return 'bg-green-950 text-green-400';
      default: return 'bg-gray-900 text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Utilisateurs" />
      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex items-center justify-between mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="bg-[#161b27] border border-[#2d3348] rounded-lg px-4 py-2 text-sm text-slate-300 w-72 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="bg-[#161b27] border border-[#2d3348] rounded-xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#2d3348]">
                {['ID', 'Email', 'Rôle', 'Date création', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-slate-500 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => (
                <tr key={u.id} className="border-b border-[#1a2035] last:border-0 hover:bg-[#1a2035] transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono">#{u.id?.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-slate-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRoleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-400 hover:text-red-300 text-[11px] transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-[12px]">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
