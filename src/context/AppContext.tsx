import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Program,
  ProgramCategory,
  RW,
  RT,
  Deposit,
  Sale,
  Utilization,
  ItemTypeMaster,
  UtilizationTypeMaster,
  FilterState,
  ToastMessage,
  FrontPageContent,
  FrontPageHero,
  StatItemConfig,
  FrontPageAbout,
  FrontPageCTA,
} from '../types';
import {
  INITIAL_PROGRAMS,
  INITIAL_PROGRAM_CATEGORIES,
  INITIAL_RWS,
  INITIAL_RTS,
  INITIAL_DEPOSITS,
  INITIAL_SALES,
  INITIAL_UTILIZATIONS,
  INITIAL_ITEM_TYPES,
  INITIAL_UTILIZATION_TYPES,
  INITIAL_FRONT_PAGE_CONTENT,
} from '../data/initialData';
import { isDateInRange } from '../utils/dateUtils';

export interface RWSummary {
  rwId: string;
  rwNumber: string;
  rwName: string;
  leader?: string;
  rtCount?: number;
  totalDepositsCount: number;
  totalWeightKg: number;
  totalSalesAmount: number;
  totalUtilizationAmount: number;
  totalUtilizationCount?: number;
}

interface AppContextType {
  user: User | null;
  currentUser: User;
  isAdmin: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateProfile: (profile: { name: string; email: string }) => void;

  programs: Program[];
  programCategories: ProgramCategory[];
  rws: RW[];
  rts: RT[];
  deposits: Deposit[];
  sales: Sale[];
  utilizations: Utilization[];
  itemTypes: ItemTypeMaster[];
  utilizationTypes: UtilizationTypeMaster[];

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
  activeProgram: Program | null;

  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Program Category actions (CRUD)
  addProgramCategory: (cat: Omit<ProgramCategory, 'id' | 'createdAt'>) => void;
  updateProgramCategory: (id: string, cat: Partial<ProgramCategory>) => void;
  deleteProgramCategory: (id: string) => boolean;

  // Program actions (CRUD)
  addProgram: (p: Omit<Program, 'id' | 'createdAt'>) => void;
  updateProgram: (id: string, p: Partial<Program>) => void;
  deleteProgram: (id: string) => void;

  // Deposit actions
  addDeposit: (d: Omit<Deposit, 'id' | 'createdAt'>) => void;
  updateDeposit: (id: string, d: Partial<Deposit>) => void;
  deleteDeposit: (id: string) => void;

  // Sale actions
  addSale: (s: Omit<Sale, 'id' | 'createdAt' | 'total'>) => void;
  updateSale: (id: string, s: Partial<Sale>) => void;
  deleteSale: (id: string) => void;

  // Utilization actions
  addUtilization: (u: Omit<Utilization, 'id' | 'createdAt'>) => void;
  updateUtilization: (id: string, u: Partial<Utilization>) => void;
  deleteUtilization: (id: string) => void;

  // Master RW / RT (CRUD)
  addRW: (rw: Omit<RW, 'id'>) => void;
  updateRW: (id: string, rw: Partial<RW>) => void;
  deleteRW: (id: string) => void;

  addRT: (rt: Omit<RT, 'id'>) => void;
  updateRT: (id: string, rt: Partial<RT>) => void;
  deleteRT: (id: string) => void;

  // Master Items & Util Types (CRUD)
  addItemType: (item: Omit<ItemTypeMaster, 'id'>) => void;
  updateItemType: (id: string, item: Partial<ItemTypeMaster>) => void;
  deleteItemType: (id: string) => void;

  addUtilizationType: (type: Omit<UtilizationTypeMaster, 'id'>) => void;
  updateUtilizationType: (id: string, type: Partial<UtilizationTypeMaster>) => void;
  deleteUtilizationType: (id: string) => void;

  // Front Page Content
  frontPageContent: FrontPageContent;
  updateHeroContent: (hero: Partial<FrontPageHero>) => void;
  updateStatsConfig: (stats: StatItemConfig[]) => void;
  updateAboutContent: (about: Partial<FrontPageAbout>) => void;
  updateCtaContent: (cta: Partial<FrontPageCTA>) => void;
  resetFrontPageContent: () => void;

  resetToDemoData: () => void;

  // Computed
  filteredDeposits: Deposit[];
  filteredSales: Sale[];
  filteredUtilizations: Utilization[];
  totalDepositsWeight: number;
  totalDepositsCount: number;
  totalSalesAmount: number;
  totalSalesWeight: number;
  totalUtilizationsAmount: number;
  danaBersamaBalance: number;
  rwSummaries: RWSummary[];
  getRWName: (rwId: string) => string;
  getRTName: (rtId: string) => string;
  getProgramName: (progId: string) => string;
  getProgramSlug: (progId: string) => string;
}

const STORAGE_KEYS = {
  USER: 'kd_user_session',
  PROGRAMS: 'kd_programs_v1',
  PROGRAM_CATEGORIES: 'kd_program_categories_v1',
  RWS: 'kd_rws_v1',
  RTS: 'kd_rts_v1',
  DEPOSITS: 'kd_deposits_v1',
  SALES: 'kd_sales_v1',
  UTILIZATIONS: 'kd_utilizations_v1',
  ITEM_TYPES: 'kd_item_types_v1',
  UTILIZATION_TYPES: 'kd_utilization_types_v1',
  FRONT_PAGE_CONTENT: 'kd_front_page_content_v1',
};

const DEFAULT_FILTERS: FilterState = {
  programId: 'all',
  rwId: 'all',
  rtId: 'all',
  period: 'all',
  startDate: '',
  endDate: '',
  searchQuery: '',
};

// Kredensial admin. Ubah lewat VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD di file .env
// (jangan commit .env). Nilai bawaan di bawah hanya untuk pengembangan lokal.
const ADMIN_EMAIL: string =
  ((import.meta.env.VITE_ADMIN_EMAIL as string | undefined) || 'admin@kangdikin.id').trim().toLowerCase();
const ADMIN_PASSWORD: string =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || 'admin123';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = user?.role === 'admin';

  // Data states with fallback to initial data
  const [programs, setPrograms] = useState<Program[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
    } catch {
      return INITIAL_PROGRAMS;
    }
  });

  const [programCategories, setProgramCategories] = useState<ProgramCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAM_CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_PROGRAM_CATEGORIES;
    } catch {
      return INITIAL_PROGRAM_CATEGORIES;
    }
  });

  const [rws, setRws] = useState<RW[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RWS);
      return saved ? JSON.parse(saved) : INITIAL_RWS;
    } catch {
      return INITIAL_RWS;
    }
  });

  const [rts, setRts] = useState<RT[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RTS);
      return saved ? JSON.parse(saved) : INITIAL_RTS;
    } catch {
      return INITIAL_RTS;
    }
  });

  const [deposits, setDeposits] = useState<Deposit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
      return saved ? JSON.parse(saved) : INITIAL_DEPOSITS;
    } catch {
      return INITIAL_DEPOSITS;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [utilizations, setUtilizations] = useState<Utilization[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UTILIZATIONS);
      return saved ? JSON.parse(saved) : INITIAL_UTILIZATIONS;
    } catch {
      return INITIAL_UTILIZATIONS;
    }
  });

  const [itemTypes, setItemTypes] = useState<ItemTypeMaster[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEM_TYPES);
      return saved ? JSON.parse(saved) : INITIAL_ITEM_TYPES;
    } catch {
      return INITIAL_ITEM_TYPES;
    }
  });

  const [utilizationTypes, setUtilizationTypes] = useState<UtilizationTypeMaster[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UTILIZATION_TYPES);
      return saved ? JSON.parse(saved) : INITIAL_UTILIZATION_TYPES;
    } catch {
      return INITIAL_UTILIZATION_TYPES;
    }
  });

  // Front page dynamic content state
  const [frontPageContent, setFrontPageContent] = useState<FrontPageContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FRONT_PAGE_CONTENT);
      return saved ? JSON.parse(saved) : INITIAL_FRONT_PAGE_CONTENT;
    } catch {
      return INITIAL_FRONT_PAGE_CONTENT;
    }
  });

  // Filters and Toasts
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FRONT_PAGE_CONTENT, JSON.stringify(frontPageContent));
  }, [frontPageContent]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRAM_CATEGORIES, JSON.stringify(programCategories));
  }, [programCategories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RWS, JSON.stringify(rws));
  }, [rws]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RTS, JSON.stringify(rts));
  }, [rts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UTILIZATIONS, JSON.stringify(utilizations));
  }, [utilizations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEM_TYPES, JSON.stringify(itemTypes));
  }, [itemTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UTILIZATION_TYPES, JSON.stringify(utilizationTypes));
  }, [utilizationTypes]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // Toast Helpers
  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Helpers
  const login = (email: string, pass: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'u-admin-1',
        name: 'Pengelola KANG DIKIN',
        email: ADMIN_EMAIL,
        role: 'admin',
      };
      setUser(adminUser);
      addToast('success', 'Login Berhasil', 'Selamat datang di Panel Admin KANG DIKIN.');
      return true;
    }
    addToast('error', 'Login Gagal', 'Email atau password salah.');
    return false;
  };

  const logout = () => {
    setUser(null);
    addToast('info', 'Logout', 'Anda telah keluar dari sesi Admin.');
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const resetToDemoData = () => {
    setPrograms(INITIAL_PROGRAMS);
    setProgramCategories(INITIAL_PROGRAM_CATEGORIES);
    setRws(INITIAL_RWS);
    setRts(INITIAL_RTS);
    setDeposits(INITIAL_DEPOSITS);
    setSales(INITIAL_SALES);
    setUtilizations(INITIAL_UTILIZATIONS);
    setItemTypes(INITIAL_ITEM_TYPES);
    setUtilizationTypes(INITIAL_UTILIZATION_TYPES);
    setFrontPageContent(INITIAL_FRONT_PAGE_CONTENT);
    setFilters(DEFAULT_FILTERS);
    addToast('info', 'Reset Data Berhasil', 'Data dikembalikan ke data awal percontohan.');
  };

  // Name resolution helpers
  const getRWName = (rwId: string): string => {
    const found = rws.find((r) => r.id === rwId);
    return found ? `RW ${found.number}` : rwId || '-';
  };

  const getRTName = (rtId: string): string => {
    const found = rts.find((r) => r.id === rtId);
    return found ? `RT ${found.number}` : rtId || '-';
  };

  const getProgramName = (progId: string): string => {
    const found = programs.find((p) => p.id === progId);
    return found ? found.name : 'Semua Program';
  };

  const getProgramSlug = (progId: string): string => {
    const found = programs.find((p) => p.id === progId);
    return found ? found.slug : '';
  };

  // Program Category CRUD
  const addProgramCategory = (cat: Omit<ProgramCategory, 'id' | 'createdAt'>) => {
    const id = 'cat-' + (cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) + '-' + Date.now().toString().slice(-4);
    const newCat: ProgramCategory = {
      ...cat,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProgramCategories((prev) => [...prev, newCat]);
    addToast('success', 'Kategori Berhasil Ditambahkan', `Kategori "${cat.name}" berhasil dibuat.`);
  };

  const updateProgramCategory = (id: string, data: Partial<ProgramCategory>) => {
    const oldCat = programCategories.find((c) => c.id === id);
    setProgramCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));

    // If category name changed, synchronize programs using the old category name
    if (data.name && oldCat && data.name !== oldCat.name) {
      setPrograms((prev) =>
        prev.map((p) => (p.category === oldCat.name ? { ...p, category: data.name! } : p))
      );
    }
    addToast('success', 'Kategori Diperbarui', 'Data kategori berhasil diperbarui.');
  };

  const deleteProgramCategory = (id: string): boolean => {
    const target = programCategories.find((c) => c.id === id);
    if (!target) return false;

    // Check if any program uses this category
    const usedCount = programs.filter((p) => p.category === target.name).length;
    if (usedCount > 0) {
      addToast(
        'error',
        'Gagal Menghapus Kategori',
        `Kategori "${target.name}" masih digunakan oleh ${usedCount} program aktif. Ubah kategori program terkait terlebih dahulu.`
      );
      return false;
    }

    setProgramCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Kategori Dihapus', `Kategori "${target.name}" telah dihapus.`);
    return true;
  };

  // Program CRUD
  const addProgram = (p: Omit<Program, 'id' | 'createdAt'>) => {
    const id = 'prog-' + (p.slug || p.name.toLowerCase().replace(/\s+/g, '-')) + '-' + Date.now().toString().slice(-4);
    const newProg: Program = {
      ...p,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPrograms((prev) => [...prev, newProg]);
    addToast('success', 'Program Ditambahkan', `Program "${p.name}" berhasil dibuat.`);
  };

  const updateProgram = (id: string, data: Partial<Program>) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    addToast('success', 'Program Diperbarui', 'Data program berhasil disimpan.');
  };

  const deleteProgram = (id: string) => {
    const target = programs.find((p) => p.id === id);
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Program Dihapus', `Program "${target?.name || ''}" berhasil dihapus.`);
  };

  // Deposit CRUD
  const addDeposit = (d: Omit<Deposit, 'id' | 'createdAt'>) => {
    const count = deposits.length + 1;
    const now = new Date();
    const prefix = `STR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(count).padStart(3, '0')}`;
    const newDeposit: Deposit = {
      ...d,
      id: 'dep-' + Date.now(),
      transaction_no: d.transaction_no || prefix,
      createdAt: new Date().toISOString(),
    };
    setDeposits((prev) => [newDeposit, ...prev]);
    addToast('success', 'Setoran Berhasil Dicatat', `Nomor transaksi ${newDeposit.transaction_no} (${newDeposit.weight} Kg)`);
  };

  const updateDeposit = (id: string, data: Partial<Deposit>) => {
    setDeposits((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
    addToast('success', 'Setoran Diperbarui', 'Perubahan data setoran berhasil disimpan.');
  };

  const deleteDeposit = (id: string) => {
    setDeposits((prev) => prev.filter((d) => d.id !== id));
    addToast('info', 'Setoran Dihapus', 'Data setoran telah dihapus dari sistem.');
  };

  // Sale CRUD
  const addSale = (s: Omit<Sale, 'id' | 'createdAt' | 'total'>) => {
    const count = sales.length + 1;
    const now = new Date();
    const prefix = `PJL-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(count).padStart(3, '0')}`;
    const total = Math.round(s.weight * s.price);
    const newSale: Sale = {
      ...s,
      id: 'sale-' + Date.now(),
      transaction_no: s.transaction_no || prefix,
      total,
      createdAt: new Date().toISOString(),
    };
    setSales((prev) => [newSale, ...prev]);
    addToast('success', 'Penjualan Berhasil Dicatat', `Nomor ${newSale.transaction_no} sejumlah Rp${total.toLocaleString('id-ID')}`);
  };

  const updateSale = (id: string, data: Partial<Sale>) => {
    setSales((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...data };
        if (data.weight !== undefined || data.price !== undefined) {
          updated.total = Math.round((data.weight ?? s.weight) * (data.price ?? s.price));
        }
        return updated;
      })
    );
    addToast('success', 'Penjualan Diperbarui', 'Perubahan transaksi penjualan berhasil disimpan.');
  };

  const deleteSale = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'Penjualan Dihapus', 'Data penjualan telah dihapus dari sistem.');
  };

  // Utilization CRUD
  const addUtilization = (u: Omit<Utilization, 'id' | 'createdAt'>) => {
    const count = utilizations.length + 1;
    const now = new Date();
    const prefix = `PMF-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(count).padStart(3, '0')}`;
    const newUtil: Utilization = {
      ...u,
      id: 'util-' + Date.now(),
      transaction_no: u.transaction_no || prefix,
      createdAt: new Date().toISOString(),
    };
    setUtilizations((prev) => [newUtil, ...prev]);
    addToast('success', 'Pemanfaatan Dicatat', `Penyaluran Rp${u.amount.toLocaleString('id-ID')} berhasil disimpan.`);
  };

  const updateUtilization = (id: string, data: Partial<Utilization>) => {
    setUtilizations((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    addToast('success', 'Pemanfaatan Diperbarui', 'Data pemanfaatan berhasil diperbarui.');
  };

  const deleteUtilization = (id: string) => {
    setUtilizations((prev) => prev.filter((u) => u.id !== id));
    addToast('info', 'Pemanfaatan Dihapus', 'Data pemanfaatan telah dihapus.');
  };

  // Master RW / RT
  const addRW = (rw: Omit<RW, 'id'>) => {
    const id = 'rw-' + rw.number.padStart(2, '0');
    setRws((prev) => [...prev, { ...rw, id }]);
    addToast('success', 'RW Ditambahkan', `RW ${rw.number} berhasil didaftarkan.`);
  };

  const updateRW = (id: string, data: Partial<RW>) => {
    setRws((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    addToast('success', 'RW Diperbarui', 'Data RW berhasil diubah.');
  };

  const deleteRW = (id: string) => {
    setRws((prev) => prev.filter((r) => r.id !== id));
    addToast('info', 'RW Dihapus', 'RW berhasil dihapus.');
  };

  const addRT = (rt: Omit<RT, 'id'>) => {
    const id = `rt-${rt.rw_id}-${rt.number.padStart(2, '0')}-${Date.now().toString().slice(-3)}`;
    setRts((prev) => [...prev, { ...rt, id }]);
    addToast('success', 'RT Ditambahkan', `RT ${rt.number} berhasil didaftarkan.`);
  };

  const updateRT = (id: string, data: Partial<RT>) => {
    setRts((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    addToast('success', 'RT Diperbarui', 'Data RT berhasil diubah.');
  };

  const deleteRT = (id: string) => {
    setRts((prev) => prev.filter((r) => r.id !== id));
    addToast('info', 'RT Dihapus', 'RT berhasil dihapus.');
  };

  // Items & Types (CRUD)
  const addItemType = (item: Omit<ItemTypeMaster, 'id'>) => {
    const id = 'item-' + Date.now();
    setItemTypes((prev) => [...prev, { ...item, id }]);
    addToast('success', 'Jenis Barang Ditambahkan', item.name);
  };

  const updateItemType = (id: string, data: Partial<ItemTypeMaster>) => {
    setItemTypes((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
    addToast('success', 'Jenis Barang Diperbarui', 'Data komoditas barang berhasil disimpan.');
  };

  const deleteItemType = (id: string) => {
    const target = itemTypes.find((i) => i.id === id);
    setItemTypes((prev) => prev.filter((i) => i.id !== id));
    addToast('info', 'Jenis Barang Dihapus', `Komoditas "${target?.name || ''}" berhasil dihapus.`);
  };

  const addUtilizationType = (type: Omit<UtilizationTypeMaster, 'id'>) => {
    const id = 'ut-' + Date.now();
    setUtilizationTypes((prev) => [...prev, { ...type, id }]);
    addToast('success', 'Jenis Pemanfaatan Ditambahkan', type.name);
  };

  const updateUtilizationType = (id: string, data: Partial<UtilizationTypeMaster>) => {
    setUtilizationTypes((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    addToast('success', 'Jenis Pemanfaatan Diperbarui', 'Data jenis pemanfaatan berhasil disimpan.');
  };

  const deleteUtilizationType = (id: string) => {
    const target = utilizationTypes.find((u) => u.id === id);
    setUtilizationTypes((prev) => prev.filter((t) => t.id !== id));
    addToast('info', 'Jenis Pemanfaatan Dihapus', `Jenis pemanfaatan "${target?.name || ''}" berhasil dihapus.`);
  };

  // Front Page Content Updaters
  const updateHeroContent = (hero: Partial<FrontPageHero>) => {
    setFrontPageContent((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }));
    addToast('success', 'Hero Diperbarui', 'Konten banner utama berhasil disimpan.');
  };

  const updateStatsConfig = (stats: StatItemConfig[]) => {
    setFrontPageContent((prev) => ({ ...prev, stats }));
    addToast('success', 'Statistik Diperbarui', 'Pengaturan statistik berhasil disimpan.');
  };

  const updateAboutContent = (about: Partial<FrontPageAbout>) => {
    setFrontPageContent((prev) => ({ ...prev, about: { ...prev.about, ...about } }));
    addToast('success', 'Tentang Diperbarui', 'Informasi Tentang KANG DIKIN berhasil disimpan.');
  };

  const updateCtaContent = (cta: Partial<FrontPageCTA>) => {
    setFrontPageContent((prev) => ({ ...prev, cta: { ...prev.cta, ...cta } }));
    addToast('success', 'Ajakan (CTA) Diperbarui', 'Konten ajakan warga berhasil disimpan.');
  };

  const resetFrontPageContent = () => {
    setFrontPageContent(INITIAL_FRONT_PAGE_CONTENT);
    addToast('info', 'Konten Direset', 'Konten halaman depan kembali ke pengaturan bawaan.');
  };

  // Public filtering: public users only see public items & active public programs
  const activePublicProgramIds = useMemo(() => {
    return programs.filter((p) => p.is_active && (isAdmin || p.is_public)).map((p) => p.id);
  }, [programs, isAdmin]);

  // Computed Filtered Lists
  const filteredDeposits = useMemo(() => {
    return deposits.filter((d) => {
      // Permission check
      if (!isAdmin && !d.is_public) return false;
      if (!isAdmin && !activePublicProgramIds.includes(d.program_id)) return false;

      // Program filter
      if (filters.programId !== 'all' && d.program_id !== filters.programId) {
        return false;
      }
      // RW filter
      if (filters.rwId !== 'all' && d.rw_id !== filters.rwId) {
        return false;
      }
      // RT filter
      if (filters.rtId !== 'all' && d.rt_id !== filters.rtId) {
        return false;
      }
      // Period filter
      if (!isDateInRange(d.date, filters.period, filters.startDate, filters.endDate)) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const rwName = getRWName(d.rw_id).toLowerCase();
        const progName = getProgramName(d.program_id).toLowerCase();
        const match =
          d.transaction_no.toLowerCase().includes(query) ||
          d.day.toLowerCase().includes(query) ||
          (d.notes && d.notes.toLowerCase().includes(query)) ||
          rwName.includes(query) ||
          progName.includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [deposits, filters, isAdmin, activePublicProgramIds, rws, programs]);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      // Permission check
      if (!isAdmin && !s.is_public) return false;
      if (!isAdmin && !activePublicProgramIds.includes(s.program_id)) return false;

      // Program filter
      if (filters.programId !== 'all' && s.program_id !== filters.programId) {
        return false;
      }
      // Period filter
      if (!isDateInRange(s.date, filters.period, filters.startDate, filters.endDate)) {
        return false;
      }
      // Item type filter
      if (filters.itemType && filters.itemType !== 'all' && s.item_type !== filters.itemType) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const progName = getProgramName(s.program_id).toLowerCase();
        const match =
          s.transaction_no.toLowerCase().includes(query) ||
          s.item_type.toLowerCase().includes(query) ||
          s.day.toLowerCase().includes(query) ||
          (s.buyer && s.buyer.toLowerCase().includes(query)) ||
          (s.notes && s.notes.toLowerCase().includes(query)) ||
          progName.includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [sales, filters, isAdmin, activePublicProgramIds, programs]);

  const filteredUtilizations = useMemo(() => {
    return utilizations.filter((u) => {
      // Permission check
      if (!isAdmin && !u.is_public) return false;
      if (!isAdmin && !activePublicProgramIds.includes(u.program_id)) return false;

      // Program filter
      if (filters.programId !== 'all' && u.program_id !== filters.programId) {
        return false;
      }
      // RW filter
      if (filters.rwId !== 'all' && u.rw_id !== filters.rwId) {
        return false;
      }
      // Utilization type filter
      if (filters.utilizationType && filters.utilizationType !== 'all' && u.type !== filters.utilizationType) {
        return false;
      }
      // Period filter
      if (!isDateInRange(u.date, filters.period, filters.startDate, filters.endDate)) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const rwName = getRWName(u.rw_id).toLowerCase();
        const progName = getProgramName(u.program_id).toLowerCase();
        const match =
          u.transaction_no.toLowerCase().includes(query) ||
          u.type.toLowerCase().includes(query) ||
          u.description.toLowerCase().includes(query) ||
          (u.recipient && u.recipient.toLowerCase().includes(query)) ||
          rwName.includes(query) ||
          progName.includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [utilizations, filters, isAdmin, activePublicProgramIds, rws, programs]);

  // Aggregates
  const totalDepositsWeight = useMemo(() => {
    return filteredDeposits.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);
  }, [filteredDeposits]);

  const totalDepositsCount = filteredDeposits.length;

  const totalSalesAmount = useMemo(() => {
    return filteredSales.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  }, [filteredSales]);

  const totalSalesWeight = useMemo(() => {
    return filteredSales.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);
  }, [filteredSales]);

  const totalUtilizationsAmount = useMemo(() => {
    return filteredUtilizations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [filteredUtilizations]);

  const danaBersamaBalance = totalSalesAmount - totalUtilizationsAmount;

  // RW Summaries
  const rwSummaries: RWSummary[] = useMemo(() => {
    return rws.map((rw) => {
      // Filtered deposits for this RW
      const rwDeps = filteredDeposits.filter((d) => d.rw_id === rw.id);
      const totalWeightKg = rwDeps.reduce((acc, c) => acc + (Number(c.weight) || 0), 0);
      const totalDepositsCount = rwDeps.length;

      // Note: Sales are program-wide or per-item, but we can compute approximate or direct allocation.
      // If RW contributed weight proportionally to total weight, we can allocate sales, or check if direct RW sales exist.
      // To satisfy section 9 table:
      // | RW | Total Setoran | Total Berat | Total Penjualan | Total Pemanfaatan |
      const totalWeightAll = deposits
        .filter((d) => filters.programId === 'all' || d.program_id === filters.programId)
        .reduce((acc, c) => acc + (Number(c.weight) || 0), 0);

      const rwShare = totalWeightAll > 0 ? totalWeightKg / totalWeightAll : 0;
      const totalSalesAmountAllocated = Math.round(totalSalesAmount * rwShare);

      // Utilizations directly record rw_id
      const rwUtils = filteredUtilizations.filter((u) => u.rw_id === rw.id);
      const totalUtilizationAmount = rwUtils.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

      const rwRTs = rts.filter((t) => t.rw_id === rw.id);
      return {
        rwId: rw.id,
        rwNumber: rw.number,
        rwName: rw.name,
        leader: rw.leader || `Pengurus RW ${rw.number}`,
        rtCount: rwRTs.length,
        totalDepositsCount,
        totalWeightKg,
        totalSalesAmount: totalSalesAmountAllocated,
        totalUtilizationAmount,
        totalUtilizationCount: rwUtils.length,
      };
    });
  }, [rws, rts, filteredDeposits, filteredSales, filteredUtilizations, totalSalesAmount, deposits, filters.programId]);

  const currentUser: User = user || {
    id: 'usr-admin-1',
    name: 'Administrator KANG DIKIN',
    email: 'admin@kangdikin.id',
    role: 'admin',
  };

  const updateProfile = (profile: { name: string; email: string }) => {
    setUser((prev) => (prev ? { ...prev, ...profile } : { id: 'usr-admin-1', role: 'admin', ...profile }));
    addToast('success', 'Profil Diperbarui', 'Data profil pengelola berhasil disimpan.');
  };

  const setFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const activeProgram = programs.find((p) => p.id === filters.programId) || null;

  return (
    <AppContext.Provider
      value={{
        user,
        currentUser,
        isAdmin,
        login,
        logout,
        updateProfile,
        programs,
        programCategories,
        rws,
        rts,
        deposits,
        sales,
        utilizations,
        itemTypes,
        utilizationTypes,
        filters,
        setFilters,
        setFilter,
        resetFilters,
        activeProgram,
        toasts,
        addToast,
        removeToast,
        addProgramCategory,
        updateProgramCategory,
        deleteProgramCategory,
        addProgram,
        updateProgram,
        deleteProgram,
        addDeposit,
        updateDeposit,
        deleteDeposit,
        addSale,
        updateSale,
        deleteSale,
        addUtilization,
        updateUtilization,
        deleteUtilization,
        addRW,
        updateRW,
        deleteRW,
        addRT,
        updateRT,
        deleteRT,
        addItemType,
        updateItemType,
        deleteItemType,
        addUtilizationType,
        updateUtilizationType,
        deleteUtilizationType,
        frontPageContent,
        updateHeroContent,
        updateStatsConfig,
        updateAboutContent,
        updateCtaContent,
        resetFrontPageContent,
        resetToDemoData,
        filteredDeposits,
        filteredSales,
        filteredUtilizations,
        totalDepositsWeight,
        totalDepositsCount,
        totalSalesAmount,
        totalSalesWeight,
        totalUtilizationsAmount,
        danaBersamaBalance,
        rwSummaries,
        getRWName,
        getRTName,
        getProgramName,
        getProgramSlug,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
