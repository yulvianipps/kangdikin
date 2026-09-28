import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Leaf, Menu, X, LayoutDashboard, Lock, LogOut, Shield, User } from 'lucide-react';

interface PublicHeaderProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  onSwitchToAdmin?: () => void;
  onOpenLogin?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentTab = 'beranda',
  onSelectTab,
  onSwitchToAdmin,
  onOpenLogin,
}) => {
  const { user, isAdmin, isSuperAdmin, isStaff, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'program', label: 'Program Lingkungan' },
    { id: 'edukasi', label: 'Edukasi & Pemilahan' },
    { id: 'posko', label: 'Posko Timbang RW' },
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
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shrink-0 group-hover:bg-emerald-700 transition-colors">
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

          {/* Right Action: Login / Admin status */}
          <div className="hidden sm:flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-stone-900">
                    {isSuperAdmin
                      ? 'Super Admin'
                      : user?.assignedProgramName
                      ? `Pengelola ${user.assignedProgramName}`
                      : 'Pengurus'}
                  </span>
                </div>

                <button
                  onClick={onSwitchToAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Buka Panel</span>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
                  title="Keluar dari sesi"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                <span>Masuk Pengurus</span>
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

          <div className="pt-4 border-t border-stone-100 space-y-2">
            {isAdmin ? (
              <>
                <div className="px-3 py-2 bg-stone-50 rounded-lg text-xs text-stone-600 flex items-center justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-stone-900">
                    {isSuperAdmin
                      ? 'Super Admin'
                      : user?.assignedProgramName
                      ? `Pengelola ${user.assignedProgramName}`
                      : 'Pengurus'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSwitchToAdmin) onSwitchToAdmin();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-800 text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Buka Panel Pengurus</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar dari Sesi</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenLogin) onOpenLogin();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 text-stone-800 border border-stone-200"
              >
                <Lock className="w-4 h-4 text-stone-600" />
                <span>Masuk Pengurus & Kader</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
