import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';

// Public components
import { PublicHeader } from './components/layout/PublicHeader';
import { PublicFooter } from './components/layout/PublicFooter';
import { PublicLandingView } from './components/public/PublicLandingView';
import { PublicProgramsView } from './components/public/PublicProgramsView';
import { PublicEducationView } from './components/public/PublicEducationView';
import { PublicPoskoView } from './components/public/PublicPoskoView';
import { PublicRestrictedAccessView } from './components/public/PublicRestrictedAccessView';

// Admin components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProgramView } from './components/admin/AdminProgramView';
import { AdminDepositView } from './components/admin/AdminDepositView';
import { AdminSaleView } from './components/admin/AdminSaleView';
import { AdminUtilizationView } from './components/admin/AdminUtilizationView';
import { AdminBiomassView } from './components/admin/AdminBiomassView';
import { AdminRegionView } from './components/admin/AdminRegionView';
import { AdminFrontPageView } from './components/admin/AdminFrontPageView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

// Modals
import { LoginModal } from './components/modals/LoginModal';
import { DepositFormModal } from './components/modals/DepositFormModal';
import { BiomassFormModal } from './components/modals/BiomassFormModal';
import { SaleFormModal } from './components/modals/SaleFormModal';
import { UtilizationFormModal } from './components/modals/UtilizationFormModal';
import { ProgramFormModal } from './components/modals/ProgramFormModal';

import { Deposit, Sale, Utilization, Program, BiomassEntry } from './types';

// Alamat rahasia untuk membuka form login: https://domain-anda/#/masuk-pengurus
// Ganti dengan kata yang susah ditebak jika perlu.
const LOGIN_HASH = '#/masuk-pengurus';

const MainContent: React.FC = () => {
  const { isAdmin, isStaff, user, hydrated } = useApp();

  // Mode: 'public' or 'admin'. When admin logs in, default to 'admin'
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');

  // Auto-switch to admin view when login succeeds & route to their assigned section
  useEffect(() => {
    if (isAdmin) {
      setViewMode('admin');
      if (isStaff && user?.assignedProgramId === 'prog-aren') {
        setAdminMenu('biomassa-aren');
      } else if (isStaff && user?.assignedProgramId === 'prog-kayu') {
        setAdminMenu('biomassa-kayu');
      }
    } else {
      setViewMode('public');
    }
  }, [isAdmin, isStaff, user?.assignedProgramId]);

  // Public active tab
  const [publicTab, setPublicTab] = useState<string>('beranda');

  // Admin active menu
  const [adminMenu, setAdminMenu] = useState<string>('dashboard');

  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBiomassModal, setShowBiomassModal] = useState(false);
  const [biomassCategory, setBiomassCategory] = useState<'aren' | 'kayu' | 'all'>('aren');
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
  const [editingBiomass, setEditingBiomass] = useState<BiomassEntry | null>(null);
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

  const handleOpenAddBiomass = (cat?: 'aren' | 'kayu') => {
    setEditingBiomass(null);
    setBiomassCategory(cat || (adminMenu === 'biomassa-kayu' ? 'kayu' : 'aren'));
    setShowBiomassModal(true);
  };

  const handleOpenEditBiomass = (entry: BiomassEntry) => {
    setEditingBiomass(entry);
    const isKayu =
      (entry.biomass_type && entry.biomass_type.toLowerCase().includes('kayu')) ||
      (entry.group_category && entry.group_category.toLowerCase().includes('indramayu'));
    setBiomassCategory(isKayu ? 'kayu' : 'aren');
    setShowBiomassModal(true);
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

        {(adminMenu === 'biomassa' || adminMenu === 'biomassa-aren') && (
          <AdminBiomassView
            initialCategory="aren"
            onAddBiomass={(cat) => handleOpenAddBiomass(cat || 'aren')}
            onEditBiomass={handleOpenEditBiomass}
          />
        )}

        {adminMenu === 'biomassa-kayu' && (
          <AdminBiomassView
            initialCategory="kayu"
            onAddBiomass={(cat) => handleOpenAddBiomass(cat || 'kayu')}
            onEditBiomass={handleOpenEditBiomass}
          />
        )}

        {adminMenu === 'program' && (
          <AdminProgramView
            onAddProgram={handleOpenAddProgram}
            onEditProgram={handleOpenEditProgram}
          />
        )}

        {(adminMenu === 'setoran' || adminMenu === 'setoran-sampah') && (
          <AdminDepositView
            programScope={isStaff ? undefined : 'prog-bank-sampah'}
            onAddDeposit={handleOpenAddDeposit}
            onEditDeposit={handleOpenEditDeposit}
          />
        )}

        {adminMenu === 'setoran-aren' && (
          <AdminDepositView
            programScope="prog-aren"
            onAddDeposit={handleOpenAddDeposit}
            onEditDeposit={handleOpenEditDeposit}
          />
        )}

        {adminMenu === 'setoran-kayu' && (
          <AdminDepositView
            programScope="prog-kayu"
            onAddDeposit={handleOpenAddDeposit}
            onEditDeposit={handleOpenEditDeposit}
          />
        )}

        {(adminMenu === 'penjualan' || adminMenu === 'penjualan-sampah') && (
          <AdminSaleView
            programScope={isStaff ? undefined : 'prog-bank-sampah'}
            onAddSale={handleOpenAddSale}
            onEditSale={handleOpenEditSale}
          />
        )}

        {adminMenu === 'penjualan-aren' && (
          <AdminSaleView
            programScope="prog-aren"
            onAddSale={handleOpenAddSale}
            onEditSale={handleOpenEditSale}
          />
        )}

        {adminMenu === 'penjualan-kayu' && (
          <AdminSaleView
            programScope="prog-kayu"
            onAddSale={handleOpenAddSale}
            onEditSale={handleOpenEditSale}
          />
        )}

        {(adminMenu === 'pemanfaatan' || adminMenu === 'pemanfaatan-sampah') && (
          <AdminUtilizationView
            programScope={isStaff ? undefined : 'prog-bank-sampah'}
            onAddUtilization={handleOpenAddUtil}
            onEditUtilization={handleOpenEditUtil}
          />
        )}

        {adminMenu === 'pemanfaatan-aren' && (
          <AdminUtilizationView
            programScope="prog-aren"
            onAddUtilization={handleOpenAddUtil}
            onEditUtilization={handleOpenEditUtil}
          />
        )}

        {adminMenu === 'pemanfaatan-kayu' && (
          <AdminUtilizationView
            programScope="prog-kayu"
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

        {adminMenu === 'pengguna' && <AdminSettingsView initialTab="users" />}
        {adminMenu === 'pengaturan' && <AdminSettingsView initialTab="mysql" />}

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

        {showBiomassModal && (
          <BiomassFormModal
            initialData={editingBiomass}
            targetCategory={biomassCategory}
            onClose={() => {
              setShowBiomassModal(false);
              setEditingBiomass(null);
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
          setPublicTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSwitchToAdmin={() => setViewMode('admin')}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* PUBLIC MAIN CONTENT */}
      <main className="flex-1">
        {publicTab === 'beranda' && (
          <PublicLandingView
            onNavigate={(tab) => {
              setPublicTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {publicTab === 'program' && (
          <PublicProgramsView
            onNavigateTab={(tab) => {
              setPublicTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {publicTab === 'edukasi' && <PublicEducationView />}

        {publicTab === 'posko' && <PublicPoskoView />}

        {/* Akses Terbatas untuk Buku Transaksi / Data Internal Petugas */}
        {['setoran', 'penjualan', 'pemanfaatan', 'biomassa', 'rw', 'laporan'].includes(publicTab) && (
          <PublicRestrictedAccessView
            onOpenLogin={() => setShowLoginModal(true)}
            onBackToHome={() => {
              setPublicTab('beranda');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <PublicFooter
        onSelectTab={(tab) => {
          setPublicTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* Modals Container */}
      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false);
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }}
          onSuccess={() => {
            setViewMode('admin');
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