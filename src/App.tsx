import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';

// Public components
import { PublicHeader } from './components/layout/PublicHeader';
import { PublicFooter } from './components/layout/PublicFooter';
import { PublicLandingView } from './components/public/PublicLandingView';
import { PublicProgramsView } from './components/public/PublicProgramsView';
import { DepositTable } from './components/tables/DepositTable';
import { SaleTable } from './components/tables/SaleTable';
import { UtilizationTable } from './components/tables/UtilizationTable';
import { RWSummarySection } from './components/dashboard/RWSummarySection';
import { PeriodReportSection } from './components/dashboard/PeriodReportSection';
import { FilterBar } from './components/common/FilterBar';

// Admin components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProgramView } from './components/admin/AdminProgramView';
import { AdminDepositView } from './components/admin/AdminDepositView';
import { AdminSaleView } from './components/admin/AdminSaleView';
import { AdminUtilizationView } from './components/admin/AdminUtilizationView';
import { AdminRegionView } from './components/admin/AdminRegionView';
import { AdminFrontPageView } from './components/admin/AdminFrontPageView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

// Modals
import { LoginModal } from './components/modals/LoginModal';
import { DepositFormModal } from './components/modals/DepositFormModal';
import { SaleFormModal } from './components/modals/SaleFormModal';
import { UtilizationFormModal } from './components/modals/UtilizationFormModal';
import { ProgramFormModal } from './components/modals/ProgramFormModal';

import { Deposit, Sale, Utilization, Program } from './types';

// Alamat rahasia untuk membuka form login: https://domain-anda/#/masuk-pengurus
// Ganti dengan kata yang susah ditebak jika perlu.
const LOGIN_HASH = '#/masuk-pengurus';

const MainContent: React.FC = () => {
  const { isAdmin, hydrated } = useApp();

  // Mode: 'public' or 'admin'. When admin logs in, default to 'admin'
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');

  // Auto-switch to admin view when login succeeds
  useEffect(() => {
    if (isAdmin) {
      setViewMode('admin');
    } else {
      setViewMode('public');
    }
  }, [isAdmin]);

  // Public active tab
  const [publicTab, setPublicTab] = useState<
    'beranda' | 'program' | 'setoran' | 'penjualan' | 'pemanfaatan' | 'rw' | 'laporan'
  >('beranda');

  // Admin active menu
  const [adminMenu, setAdminMenu] = useState<string>('dashboard');

  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showUtilModal, setShowUtilModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);

  // Buka modal login hanya lewat alamat rahasia (tidak ada tombol login di halaman publik)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === LOGIN_HASH && !isAdmin) {
        setShowLoginModal(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [isAdmin]);

  // Edit states for modals
  const [editingDeposit, setEditingDeposit] = useState<Deposit | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editingUtil, setEditingUtil] = useState<Utilization | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Handlers for Admin actions
  const handleOpenAddDeposit = () => {
    setEditingDeposit(null);
    setShowDepositModal(true);
  };

  const handleOpenEditDeposit = (deposit: Deposit) => {
    setEditingDeposit(deposit);
    setShowDepositModal(true);
  };

  const handleOpenAddSale = () => {
    setEditingSale(null);
    setShowSaleModal(true);
  };

  const handleOpenEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setShowSaleModal(true);
  };

  const handleOpenAddUtil = () => {
    setEditingUtil(null);
    setShowUtilModal(true);
  };

  const handleOpenEditUtil = (util: Utilization) => {
    setEditingUtil(util);
    setShowUtilModal(true);
  };

  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setShowProgramModal(true);
  };

  const handleOpenEditProgram = (program: Program) => {
    setEditingProgram(program);
    setShowProgramModal(true);
  };

  // Tampilkan loading sampai data dari server siap
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-stone-500">
        Memuat data...
      </div>
    );
  }

  // ==========================================
  // RENDER ADMIN PANEL
  // ==========================================
  if (viewMode === 'admin' && isAdmin) {
    return (
      <AdminLayout
        currentMenu={adminMenu}
        onSelectMenu={(menuId) => setAdminMenu(menuId)}
        onSwitchToPublic={() => setViewMode('public')}
      >
        <ToastContainer />

        {/* Dynamic Admin View */}
        {adminMenu === 'dashboard' && (
          <AdminDashboard
            onNavigate={(menuId) => setAdminMenu(menuId)}
            onOpenAddDeposit={handleOpenAddDeposit}
            onOpenAddSale={handleOpenAddSale}
            onOpenAddUtilization={handleOpenAddUtil}
          />
        )}

        {adminMenu === 'program' && (
          <AdminProgramView
            onAddProgram={handleOpenAddProgram}
            onEditProgram={handleOpenEditProgram}
          />
        )}

        {adminMenu === 'setoran' && (
          <AdminDepositView
            onAddDeposit={handleOpenAddDeposit}
            onEditDeposit={handleOpenEditDeposit}
          />
        )}

        {adminMenu === 'penjualan' && (
          <AdminSaleView
            onAddSale={handleOpenAddSale}
            onEditSale={handleOpenEditSale}
          />
        )}

        {adminMenu === 'pemanfaatan' && (
          <AdminUtilizationView
            onAddUtilization={handleOpenAddUtil}
            onEditUtilization={handleOpenEditUtil}
          />
        )}

        {adminMenu === 'rw' && <AdminRegionView initialTab="rw" />}
        {adminMenu === 'rt' && <AdminRegionView initialTab="rt" />}

        {adminMenu === 'website-frontpage' && <AdminFrontPageView initialSubTab="hero" />}
        {adminMenu === 'website-program' && <AdminFrontPageView initialSubTab="programs" />}
        {adminMenu === 'website-about' && <AdminFrontPageView initialSubTab="about" />}

        {adminMenu === 'laporan' && <AdminReportsView initialSubTab="finance" />}
        {adminMenu === 'rekap-rw' && <AdminReportsView initialSubTab="rw" />}
        {adminMenu === 'rekap-periode' && <AdminReportsView initialSubTab="period" />}
        {adminMenu === 'export' && <AdminReportsView initialSubTab="export" />}

        {adminMenu === 'pengguna' && <AdminSettingsView />}
        {adminMenu === 'pengaturan' && <AdminSettingsView />}

        {/* Modals Container */}
        {showDepositModal && (
          <DepositFormModal
            initialData={editingDeposit}
            onClose={() => {
              setShowDepositModal(false);
              setEditingDeposit(null);
            }}
          />
        )}

        {showSaleModal && (
          <SaleFormModal
            initialData={editingSale}
            onClose={() => {
              setShowSaleModal(false);
              setEditingSale(null);
            }}
          />
        )}

        {showUtilModal && (
          <UtilizationFormModal
            initialData={editingUtil}
            onClose={() => {
              setShowUtilModal(false);
              setEditingUtil(null);
            }}
          />
        )}

        {showProgramModal && (
          <ProgramFormModal
            initialData={editingProgram}
            onClose={() => {
              setShowProgramModal(false);
              setEditingProgram(null);
            }}
          />
        )}
      </AdminLayout>
    );
  }

  // ==========================================
  // RENDER PUBLIC VIEW (Single Navbar, Read-only)
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-stone-100/70 text-stone-800 font-sans">
      <ToastContainer />

      {/* SINGLE PUBLIC NAVBAR */}
      <PublicHeader
        currentTab={publicTab}
        onSelectTab={(tab) => {
          if (['beranda', 'program', 'setoran', 'penjualan', 'pemanfaatan', 'rw', 'laporan'].includes(tab)) {
            setPublicTab(tab as any);
          }
        }}
        onSwitchToAdmin={() => setViewMode('admin')}
      />

      {/* PUBLIC MAIN CONTENT */}
      <main className="flex-1">
        {publicTab === 'beranda' && (
          <PublicLandingView
            onNavigate={(tab) => {
              if (['beranda', 'program', 'setoran', 'penjualan', 'pemanfaatan', 'rw', 'laporan'].includes(tab)) {
                setPublicTab(tab as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        )}

        {publicTab === 'program' && (
          <PublicProgramsView
            onNavigateTab={(tab) => {
              if (['setoran', 'penjualan', 'pemanfaatan'].includes(tab)) {
                setPublicTab(tab as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        )}

        {publicTab === 'setoran' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                Buku Setoran Material Warga
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Catatan publik transparansi volume setoran daur ulang dan agroforestri per RT/RW.
              </p>
            </div>
            <FilterBar />
            <DepositTable />
          </div>
        )}

        {publicTab === 'penjualan' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                Hasil Penjualan Komoditas
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Transparansi penerimaan kas dari penjualan material terpilah dan hasil panen komunitas.
              </p>
            </div>
            <FilterBar />
            <SaleTable />
          </div>
        )}

        {publicTab === 'pemanfaatan' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                Penyaluran Pemanfaatan Dana Bersama
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Laporan terbuka alokasi dana untuk bantuan sosial, program lingkungan, dan kemaslahatan warga.
              </p>
            </div>
            <FilterBar />
            <UtilizationTable />
          </div>
        )}

        {publicTab === 'rw' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                Rekapitulasi Partisipasi Per RW
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Capaian gotong royong dan kontribusi pemilahan warga di tiap rukun warga.
              </p>
            </div>
            <RWSummarySection />
          </div>
        )}

        {publicTab === 'laporan' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                Laporan Keuangan & Kas Bersama
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Neraca keuangan transparan dan perkembangan saldo dana bersama desa.
              </p>
            </div>
            <PeriodReportSection />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <PublicFooter
        onSelectTab={(tab) => {
          if (['beranda', 'program', 'setoran', 'penjualan', 'pemanfaatan', 'rw', 'laporan'].includes(tab)) {
            setPublicTab(tab as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Modals Container */}
      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false);
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}