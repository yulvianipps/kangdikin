import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  ArrowDownLeft,
  ArrowUpRight,
  HeartHandshake,
  MapPin,
  Building,
  Globe,
  FileText,
  HelpCircle,
  BarChart3,
  Users,
  Calendar,
  Download,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Leaf,
} from 'lucide-react';

interface AdminLayoutProps {
  currentMenu: string;
  onSelectMenu: (menuId: string) => void;
  onSwitchToPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentMenu,
  onSelectMenu,
  onSwitchToPublic,
  children,
}) => {
  const { user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Define structured sidebar navigation
  const navSections = [
    {
      title: null,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'DATA',
      items: [
        { id: 'program', label: 'Program', icon: FolderKanban },
        { id: 'setoran', label: 'Setoran', icon: ArrowDownLeft },
        { id: 'penjualan', label: 'Penjualan', icon: ArrowUpRight },
        { id: 'pemanfaatan', label: 'Pemanfaatan', icon: HeartHandshake },
      ],
    },
    {
      title: 'WILAYAH',
      items: [
        { id: 'rw', label: 'RW', icon: MapPin },
        { id: 'rt', label: 'RT', icon: Building },
      ],
    },
    {
      title: 'WEBSITE',
      items: [
        { id: 'website-frontpage', label: 'Halaman Depan', icon: Globe },
        { id: 'website-program', label: 'Konten Program', icon: FileText },
        { id: 'website-about', label: 'Tentang', icon: HelpCircle },
      ],
    },
    {
      title: 'LAPORAN',
      items: [
        { id: 'laporan', label: 'Laporan', icon: BarChart3 },
        { id: 'rekap-rw', label: 'Rekap RW', icon: Users },
        { id: 'rekap-periode', label: 'Rekap Periode', icon: Calendar },
        { id: 'export', label: 'Export', icon: Download },
      ],
    },
    {
      title: 'SISTEM',
      items: [
        { id: 'pengguna', label: 'Pengguna', icon: User },
        { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
      ],
    },
  ];

  // Helper for current page title
  const getPageTitle = (menuId: string): string => {
    switch (menuId) {
      case 'dashboard':
        return 'Dashboard Utama';
      case 'program':
        return 'Data Program';
      case 'setoran':
        return 'Data Setoran Material';
      case 'penjualan':
        return 'Data Penjualan Komoditas';
      case 'pemanfaatan':
        return 'Data Pemanfaatan Dana';
      case 'rw':
        return 'Data Wilayah RW';
      case 'rt':
        return 'Data Wilayah RT';
      case 'website-frontpage':
        return 'Pengaturan Halaman Depan';
      case 'website-program':
        return 'Pengaturan Konten Program';
      case 'website-about':
        return 'Pengaturan Tentang KANG DIKIN';
      case 'laporan':
        return 'Laporan Buku Kas & Keuangan';
      case 'rekap-rw':
        return 'Rekapitulasi Capaian RW';
      case 'rekap-periode':
        return 'Rekapitulasi Periode';
      case 'export':
        return 'Pusat Unduh Data (Export)';
      case 'pengguna':
        return 'Manajemen Pengguna';
      case 'pengaturan':
        return 'Pengaturan Sistem';
      default:
        return 'Panel Admin';
    }
  };

  const handleMenuClick = (menuId: string) => {
    onSelectMenu(menuId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row text-stone-800">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight">KANG DIKIN</div>
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              ADMIN PANEL
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToPublic}
            className="px-2.5 py-1 text-xs font-semibold bg-stone-800 text-stone-300 rounded hover:bg-stone-700"
          >
            Lihat Public
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-950 text-stone-300 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header Brand */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Leaf className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">
                  KANG DIKIN
                </span>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  ADMIN PANEL
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
            {navSections.map((section, sIdx) => (
              <div key={sIdx}>
                {section.title && (
                  <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                    {section.title}
                  </div>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentMenu === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Logout Item in menu */}
            <div className="pt-2 border-t border-stone-800">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer Actions */}
          <div className="p-4 border-t border-stone-800 bg-stone-900/60 space-y-2">
            <button
              onClick={onSwitchToPublic}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website Public</span>
            </button>

            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-7 h-7 rounded-full bg-emerald-900 flex items-center justify-center text-xs font-bold text-emerald-300">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="flex-1 truncate">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-stone-400 truncate">
                  {user?.email || 'admin@kangdikin.id'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Clean Admin Topbar */}
        <header className="hidden lg:flex bg-white border-b border-stone-200 h-16 items-center justify-between px-8 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {getPageTitle(currentMenu)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onSwitchToPublic}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website Public</span>
            </button>

            <div className="h-6 w-px bg-stone-200" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-stone-600">
                {user?.name || 'Admin'}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
        />
      )}
    </div>
  );
};
