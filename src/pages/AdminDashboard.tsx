import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  CalendarCheck, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardOverview from '../components/admin/DashboardOverview';
import MenuManager from '../components/admin/MenuManager';
import ReservationManager from '../components/admin/ReservationManager';
import ContactManager from '../components/admin/ContactManager';
import SettingsEditor from '../components/admin/SettingsEditor';
import PostManager from '../components/admin/PostManager';

export default function AdminDashboard() {
  const location = useLocation();
  const { logout } = useAuth();

  const sidebarLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Menu', path: '/admin/menu', icon: Utensils },
    { name: 'Reservations', path: '/admin/reservations', icon: CalendarCheck },
    { name: 'CMS / Posts', path: '/admin/posts', icon: FileText },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-secondary text-white hidden lg:flex flex-col fixed h-full z-40">
        <div className="p-8 pb-12">
          <Link to="/" className="text-2xl font-display font-black tracking-tighter">
            OYAH<span className="text-primary">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center">
                  <Icon size={20} className="mr-3" />
                  <span className="font-bold text-sm tracking-tight">{link.name}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <button 
            onClick={logout}
            className="w-full flex items-center p-4 text-white/40 hover:text-white transition-colors group"
          >
            <LogOut size={18} className="mr-3 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-bold">Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        <header className="bg-white border-b border-gray-100 p-8 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-secondary tracking-tight">
                {sidebarLinks.find(l => l.path === location.pathname)?.name || 'Admin Area'}
              </h1>
              <div className="flex items-center text-xs text-gray-400 mt-1 space-x-2">
                <span>Dashboard</span>
                <ChevronRight size={12} />
                <span className="text-secondary font-bold tracking-widest uppercase">
                  {sidebarLinks.find(l => l.path === location.pathname)?.name || 'Current Page'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-secondary">Admin User</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-primary">Chief Master</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface border border-gray-100 flex items-center justify-center font-black text-primary overflow-hidden">
                 <img src="https://picsum.photos/seed/admin-avatar/100/100" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12">
           <Routes>
             <Route path="/" element={<DashboardOverview />} />
             <Route path="/menu" element={<MenuManager />} />
             <Route path="/reservations" element={<ReservationManager />} />
             <Route path="/posts" element={<PostManager />} />
             <Route path="/messages" element={<ContactManager />} />
             <Route path="/settings" element={<SettingsEditor />} />
           </Routes>
        </div>
      </main>
    </div>
  );
}
