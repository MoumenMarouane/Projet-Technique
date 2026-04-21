import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  title: string;
  showViewToggle?: boolean;
  onViewChange?: (view: 'general' | 'analytics') => void;
}

export default function MainLayout({ title, showViewToggle, onViewChange }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} showViewToggle={showViewToggle} onViewChange={onViewChange} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}