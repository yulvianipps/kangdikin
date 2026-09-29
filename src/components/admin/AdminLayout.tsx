import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Truck,
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
  Settings,
  FolderKanban,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Leaf,
  ShieldCheck,
  TreePine,
  Recycle,
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
  const { user, isSuperAdmin, isStaff, userProgramName, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isArenStaff = isStaff && user?.assignedProgramId === 'prog-aren';
  const isKayuStaff = isStaff && user?.assignedProgramId === 'prog-kayu';
  const isBankSampahStaff = isStaff && user?.assignedProgramId === 'prog-bank-sampah';
  const isKomposStaff = isStaff && user?.assignedProgramId === 'prog-kompos-maggot';

  // Build role-isolated navigation sections
  const getNavSections = () => {
    // 1. PETUGAS AREN (HANYA BISA LIHAT & KELOLA AREN)
    if (isArenStaff) {
      return [
        {
          title: null,
          items: [
            { id: 'dashboard', label: 'Dashboard Aren', icon: LayoutDashboard },
          ],
        },
        {
          title: '🌾 DATA SENTRA AREN',
          items: [
            {
              id: 'biomassa-aren',
              label: 'Biomassa & Timbangan Aren',
              icon: Truck,
            },
            {
              id: 'setoran-aren',
              label: 'Setoran Bahan Aren',
              icon: ArrowDownLeft,
            },
            {
              id: 'penjualan-aren',
              label: 'Penjualan Produk Aren',
              icon: ArrowUpRight,
            },
            {
              id: 'pemanfaatan-aren',
              label: 'Pemanfaatan Dana Aren',
              icon: HeartHandshake,
            },
          ],
        },
        {
          title: '📊 LAPORAN KHUSUS AREN',
          items: [
            { id: 'rekap-periode', label: 'Rekap Periode Aren', icon: Calendar },
            { id: 'export', label: 'Export Data Aren', icon: Download },
          ],
        },
      ];
    }

    // 2. PETUGAS KAYU (HANYA BISA LIHAT & KELOLA KAYU)
    if (isKayuStaff) {
      return [
        {
          title: null,
          items: [
            { id: 'dashboard', label: 'Dashboard Kayu', icon: LayoutDashboard },
          ],
        },
        {
          title: '🪵 KEHUTANAN & KAYU RAKYAT',
          items: [
            {
              id: 'biomassa-kayu',
              label: 'Logistik & Timbang Kayu',
              icon: Truck,
            },
            {
              id: 'setoran-kayu',
              label: 'Setoran Kayu Rakyat',
              icon: ArrowDownLeft,
            },
            {
              id: 'penjualan-kayu',
              label: 'Penjualan Komoditas Kayu',
              icon: ArrowUpRight,
            },
            {
              id: 'pemanfaatan-kayu',
              label: 'Pemanfaatan Dana Kayu',
              icon: HeartHandshake,
            },
          ],
        },
        {
          title: '📊 LAPORAN KHUSUS KAYU',
          items: [
            { id: 'rekap-periode', label: 'Rekap Periode Kayu', icon: Calendar },
            { id: 'export', label: 'Export Data Kayu', icon: Download },
          ],
        },
      ];
    }

    // 3. PETUGAS BANK SAMPAH (HANYA BISA LIHAT & KELOLA BANK SAMPAH)
    if (isBankSampahStaff) {
      return [
        {
          title: null,
          items: [
            { id: 'dashboard', label: 'Dashboard Bank Sampah', icon: LayoutDashboard },
          ],
        },
        {
          title: '♻️ DATA BANK SAMPAH',
          items: [
            {
              id: 'setoran-sampah',
              label: 'Setoran Tabungan Sampah RW',
              icon: ArrowDownLeft,
            },
            {
              id: 'penjualan-sampah',
              label: 'Penjualan Sampah Daur Ulang',
              icon: ArrowUpRight,
            },
            {
              id: 'pemanfaatan-sampah',
              label: 'Pemanfaatan Bank Sampah',
              icon: HeartHandshake,
            },
          ],
        },
        {
          title: '🗺️ WILAYAH & REKAP',
          items: [
            { id: 'rw', label: 'Wilayah RW', icon: MapPin },
            { id: 'rt', label: 'Wilayah RT', icon: Building },
            { id: 'rekap-rw', label: 'Rekapitulasi Sampah RW', icon: Users },
            { id: 'rekap-periode', label: 'Rekap Periode', icon: Calendar },
            { id: 'export', label: 'Export Bank Sampah', icon: Download },
          ],
        },
      ];
    }

    // 4. PETUGAS KOMPOS & MAGGOT
    if (isKomposStaff) {
      return [
        {
          title: null,
          items: [
            { id: 'dashboard', label: 'Dashboard Kompos', icon: LayoutDashboard },
          ],
        },
        {
          title: '🪱 KOMPOS & MAGGOT BSF',
          items: [
            { id: 'setoran', label: 'Setoran Sampah Dapur', icon: ArrowDownLeft },
            { id: 'penjualan', label: 'Penjualan Maggot & Kompos', icon: ArrowUpRight },
            { id: 'pemanfaatan', label: 'Pemanfaatan Dana', icon: HeartHandshake },
            { id: 'rekap-periode', label: 'Rekap Periode', icon: Calendar },
            { id: 'export', label: 'Export Data', icon: Download },
          ],
        },
      ];
    }

    // 5. SUPER ADMIN: PEMISAHAN BAGIAN TERSTRUKTUR & JELAS
    return [
      {
        title: null,
        items: [
          { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
        ],
      },
      {
        title: '🌾 PROGRAM SENTRA AREN',
        items: [
          {
            id: 'biomassa-aren',
            label: 'Biomassa & Timbangan Aren',
            icon: Truck,
          },
          {
            id: 'setoran-aren',
            label: 'Setoran Bahan Aren',
            icon: ArrowDownLeft,
          },
          {
            id: 'penjualan-aren',
            label: 'Penjualan Produk Aren',
            icon: ArrowUpRight,
          },
          {
            id: 'pemanfaatan-aren',
            label: 'Pemanfaatan Dana Aren',
            icon: HeartHandshake,
          },
        ],
      },
      {
        title: '🪵 KEHUTANAN & KAYU RAKYAT',
        items: [
          {
            id: 'biomassa-kayu',
            label: 'Logistik & Timbang Kayu',
            icon: Truck,
          },
          {
            id: 'setoran-kayu',
            label: 'Setoran Kayu Rakyat',
            icon: ArrowDownLeft,
          },
          {
            id: 'penjualan-kayu',
            label: 'Penjualan Komoditas Kayu',
            icon: ArrowUpRight,
          },
          {
            id: 'pemanfaatan-kayu',
            label: 'Pemanfaatan Dana Kayu',
            icon: HeartHandshake,
          },
        ],
      },
      {
        title: '♻️ PROGRAM BANK SAMPAH',
        items: [
          {
            id: 'setoran-sampah',
            label: 'Setoran Sampah RW',
            icon: ArrowDownLeft,
          },
          {
            id: 'penjualan-sampah',
            label: 'Penjualan Sampah Daur Ulang',
            icon: ArrowUpRight,
          },
          {
            id: 'pemanfaatan-sampah',
            label: 'Pemanfaatan Bank Sampah',
            icon: HeartHandshake,
          },
        ],
      },
      {
        title: '🗺️ WILAYAH WARGA',
        items: [
          { id: 'rw', label: 'Data RW', icon: MapPin },
          { id: 'rt', label: 'Data RT', icon: Building },
        ],
      },
      {
        title: '📊 KEUANGAN & LAPORAN',
        items: [
          { id: 'laporan', label: 'Laporan Kas & Keuangan', icon: BarChart3 },
          { id: 'rekap-rw', label: 'Rekapitulasi RW', icon: Users },
          { id: 'rekap-periode', label: 'Rekap Periode', icon: Calendar },
          { id: 'export', label: 'Pusat Unduh Data (Export)', icon: Download },
        ],
      },
      {
        title: '⚙️ SISTEM & MASTER',
        items: [
          { id: 'program', label: 'Master Program Desa', icon: FolderKanban },
          { id: 'website-frontpage', label: 'Halaman Depan Web', icon: Globe },
          { id: 'website-program', label: 'Konten Program Web', icon: FileText },
          { id: 'pengguna', label: 'Manajemen Pengguna', icon: User },
          { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
        ],
      },
    ];
  };

  const navSections = getNavSections();

  // Helper for current page title
  const getPageTitle = (menuId: string): string => {
    switch (menuId) {
      case 'dashboard':
        return isArenStaff
          ? 'Dashboard Sentra Aren'
          : isKayuStaff
          ? 'Dashboard Kehutanan Kayu'
          : isBankSampahStaff
          ? 'Dashboard Bank Sampah'
          : 'Dashboard Utama KANG DIKIN';
      case 'biomassa':
      case 'biomassa-aren':
        return 'DAFTAR BIOMASSA SENTRA AREN (Timbangan & Logistik)';
      case 'biomassa-kayu':
        return 'LOGISTIK & TIMBANGAN KAYU RAKYAT (Kehutanan Lestari)';
      case 'program':
        return 'Data Program Desa';
      case 'setoran-aren':
        return 'Data Setoran Bahan Aren';
      case 'setoran-kayu':
        return 'Data Setoran Kayu Rakyat';
      case 'setoran-sampah':
      case 'setoran':
        return isArenStaff
          ? 'Data Setoran Bahan Aren'
          : isKayuStaff
          ? 'Data Setoran Kayu Rakyat'
          : 'Data Setoran Tabungan Bank Sampah';
      case 'penjualan-aren':
        return 'Data Penjualan Produk Aren (Gula Semut & Turunan)';
      case 'penjualan-kayu':
        return 'Data Penjualan Komoditas Kayu Rakyat';
      case 'penjualan-sampah':
      case 'penjualan':
        return isArenStaff
          ? 'Data Penjualan Produk Aren'
          : isKayuStaff
          ? 'Data Penjualan Komoditas Kayu'
          : 'Data Penjualan Sampah Daur Ulang';
      case 'pemanfaatan-aren':
        return 'Data Pemanfaatan Dana Sentra Aren';
      case 'pemanfaatan-kayu':
        return 'Data Pemanfaatan Dana Kehutanan Kayu';
      case 'pemanfaatan-sampah':
      case 'pemanfaatan':
        return isArenStaff
          ? 'Data Pemanfaatan Dana Sentra Aren'
          : isKayuStaff
          ? 'Data Pemanfaatan Dana Kehutanan Kayu'
          : 'Data Pemanfaatan Dana Bank Sampah';
      case 'rw':
        return 'Data Wilayah RW';
      case 'rt':
        return 'Data Wilayah RT';
      case 'website-frontpage':
        return 'Pengaturan Halaman Depan Web';
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
        return 'Manajemen Pengguna & Hak Akses';
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
              {isArenStaff ? 'SENTRA AREN' : isKayuStaff ? 'KEHUTANAN KAYU' : isBankSampahStaff ? 'BANK SAMPAH' : 'ADMIN PANEL'}
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
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                isArenStaff
                  ? 'bg-emerald-800 text-emerald-200'
                  : isKayuStaff
                  ? 'bg-amber-800 text-amber-200'
                  : isBankSampahStaff
                  ? 'bg-teal-800 text-teal-200'
                  : 'bg-emerald-800 text-emerald-200'
              }`}>
                {isKayuStaff ? <TreePine className="w-5 h-5" /> : isBankSampahStaff ? <Recycle className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">
                  KANG DIKIN
                </span>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                  isArenStaff
                    ? 'text-emerald-400'
                    : isKayuStaff
                    ? 'text-amber-400'
                    : isBankSampahStaff
                    ? 'text-teal-400'
                    : 'text-emerald-400'
                }`}>
                  {isArenStaff
                    ? 'SENTRA AREN'
                    : isKayuStaff
                    ? 'KEHUTANAN KAYU'
                    : isBankSampahStaff
                    ? 'BANK SAMPAH'
                    : 'ADMIN PANEL'}
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
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-800 text-white shadow-xs font-bold'
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout Keluar</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer Actions */}
          <div className="p-4 border-t border-stone-800 bg-stone-900/60 space-y-2">
            <button
              onClick={onSwitchToPublic}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website Public</span>
            </button>

            <div className="flex items-center gap-2.5 px-2 py-1.5 bg-stone-950/40 rounded-xl border border-stone-800/80">
              <div className="w-7 h-7 rounded-full bg-emerald-900 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
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
          <div className="flex items-center gap-3">
            <h2 className="text-base md:text-lg font-bold text-stone-900">
              {getPageTitle(currentMenu)}
            </h2>
            {isStaff ? (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Hak Akses Khusus: {userProgramName || 'Program'}</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
                👑 Super Admin (Akses Penuh Seluruh Bagian)
              </span>
            )}
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
              <div className="text-right">
                <span className="text-xs font-bold text-stone-900 block leading-tight">
                  {user?.name || 'Pengurus'}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
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
