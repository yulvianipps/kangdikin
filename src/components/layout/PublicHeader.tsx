import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Leaf, Menu, X, LayoutDashboard } from 'lucide-react';

interface PublicHeaderProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  onSwitchToAdmin?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentTab = 'beranda',
  onSelectTab,
  onSwitchToAdmin,
}) => {
  const { isAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'program', label: 'Program' },
    { id: 'setoran', label: 'Setoran' },
    { id: 'penjualan', label: 'Penjualan' },
    { id: 'pemanfaatan', label: 'Pemanfaatan' },
    { id: 'rw', label: 'Rekap RW' },
    { id: 'laporan', label: 'Laporan' },
  ];

  const handleNavClick = (id: string) => {
    if (onSelectTab) onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Subtitle */}
          <div
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shrink-0">
              <Leaf className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  KANG DIKIN
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  DANA BERSAMA
                </span>
              </div>
              <p className="text-xs text-stone-500 line-clamp-1 max-w-xs sm:max-w-md">
                Kelola Lingkungan, Sadar Iklim dan Kesejahteraan Terintegrasi
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: tombol panel hanya muncul jika admin sudah login */}
          <div className="hidden sm:flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Masuk Panel Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {isAdmin && (
            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchToAdmin) onSwitchToAdmin();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-800 text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Masuk Panel Admin</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
