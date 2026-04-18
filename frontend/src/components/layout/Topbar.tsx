import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface TopBarProps {
  title: string;
  onViewChange?: (view: 'general' | 'analytics') => void;
  showViewToggle?: boolean;
}

export default function TopBar({ title, onViewChange, showViewToggle }: TopBarProps) {
  const { user } = useAuthStore();
  const [activeView, setActiveView] = useState<'general' | 'analytics'>('general');

  const handleViewChange = (view: 'general' | 'analytics') => {
    setActiveView(view);
    onViewChange?.(view);
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'US';

  return (
    <div className="h-[52px] bg-[#161b27] border-b border-[#2d3348] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <span className="text-[15px] font-medium text-slate-100">{title}</span>
        {showViewToggle && (
          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange('general')}
              className={`px-3 py-1 rounded-lg text-[12px] border transition-colors ${
                activeView === 'general'
                  ? 'bg-[#1e2a4a] text-indigo-400 border-indigo-800'
                  : 'border-[#2d3348] text-slate-400'
              }`}
            >
              Vue générale
            </button>
            <button
              onClick={() => handleViewChange('analytics')}
              className={`px-3 py-1 rounded-lg text-[12px] border transition-colors ${
                activeView === 'analytics'
                  ? 'bg-[#1e2a4a] text-indigo-400 border-indigo-800'
                  : 'border-[#2d3348] text-slate-400'
              }`}
            >
              Analyses
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="bg-[#1e2a4a] text-indigo-400 text-[11px] px-3 py-1 rounded-full">
          {user?.role || 'USER'}
        </span>
        <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center text-[12px] font-medium text-indigo-300">
          {initials}
        </div>
      </div>
    </div>
  );
}