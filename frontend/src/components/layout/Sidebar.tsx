import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', section: 'Principal' },
  { label: 'Commandes', path: '/commandes', section: 'Principal' },
  { label: 'Devis', path: '/devis', section: 'Principal' },
  { label: 'Clients', path: '/clients', section: 'Principal' },
  { label: 'Produits', path: '/produits', section: 'Catalogue' },
  { label: 'Catégories', path: '/categories', section: 'Catalogue' },
  { label: 'Factures', path: '/factures', section: 'Finance' },
  { label: 'Paiements', path: '/paiements', section: 'Finance' },
];

const sections = ['Principal', 'Catalogue', 'Finance'];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  return (
    <div className="w-[220px] bg-[#161b27] border-r border-[#2d3348] flex flex-col h-screen">
      <div className="px-4 py-5 border-b border-[#2d3348]">
        <span className="text-white text-[15px] font-medium">
          <span className="text-indigo-400">Gestion</span>Pro
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {sections.map(section => (
          <div key={section}>
            <p className="px-4 pt-4 pb-1 text-[10px] text-gray-600 uppercase tracking-widest">
              {section}
            </p>
            {navItems
              .filter(item => item.section === section)
              .map(item => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`mx-2 px-3 py-2 rounded-lg text-[13px] cursor-pointer mb-0.5 ${
                    location.pathname === item.path
                      ? 'bg-[#1e2a4a] text-indigo-400'
                      : 'text-slate-400 hover:bg-[#1e2538] hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-[#2d3348]">
        <div className="flex gap-2 mb-2">
          <button className="flex-1 py-1 text-[11px] rounded-md border border-[#2d3348] text-indigo-400 border-indigo-800 bg-[#1e2a4a]">FR</button>
          <button className="flex-1 py-1 text-[11px] rounded-md border border-[#2d3348] text-slate-400">EN</button>
        </div>
        <button
          onClick={logout}
          className="w-full py-2 text-[12px] rounded-lg border border-[#2d3348] text-slate-400 hover:text-red-400 hover:border-red-900 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}