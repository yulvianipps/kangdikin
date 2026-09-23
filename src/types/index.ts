export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'public';
}

export interface ProgramCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  is_active: boolean;
  is_public: boolean;
  category: string;
  color: string;
  createdAt: string;
}

export interface RW {
  id: string;
  number: string; // e.g. "01", "02"
  name: string;   // e.g. "Dusun Karang Asri"
  status: 'active' | 'inactive';
  leader?: string;
}

export interface RT {
  id: string;
  rw_id: string;
  number: string; // e.g. "01", "02", "03"
  name: string;
  status: 'active' | 'inactive';
  leader?: string;
}

export interface Deposit {
  id: string;
  transaction_no: string; // e.g. "STR-001"
  program_id: string;
  date: string; // YYYY-MM-DD
  day: string;  // Senin, Selasa, etc.
  rw_id: string;
  rt_id: string;
  weight: number; // in Kg
  notes?: string;
  created_by: string;
  is_public: boolean;
  createdAt: string;
}

export interface Sale {
  id: string;
  transaction_no: string; // e.g. "PJL-001"
  program_id: string;
  date: string; // YYYY-MM-DD
  day: string;
  item_type: string; // Kardus, PET, Gula Aren, etc.
  weight: number; // in Kg
  price: number; // in Rp
  total: number; // auto calculated = weight * price
  buyer?: string;
  notes?: string;
  created_by: string;
  is_public: boolean;
  createdAt: string;
}

export interface Utilization {
  id: string;
  transaction_no: string; // e.g. "PMF-001"
  program_id: string;
  date: string; // YYYY-MM-DD
  day: string;
  rw_id: string; // Beneficiary RW
  type: string;  // Kegiatan lingkungan, Bantuan masyarakat, dll.
  amount: number; // Nilai rupiah
  description: string;
  recipient?: string;
  created_by: string;
  is_public: boolean;
  createdAt: string;
}

export interface ItemTypeMaster {
  id: string;
  program_id: string;
  name: string;
  unit: string;
  defaultPrice: number;
}

export interface UtilizationTypeMaster {
  id: string;
  name: string;
  description: string;
}

export type PeriodFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom';

export interface FilterState {
  programId: string; // 'all' or program id
  rwId: string;      // 'all' or rw id
  rtId: string;      // 'all' or rt id
  period: PeriodFilter;
  startDate: string;
  endDate: string;
  searchQuery: string;
  itemType?: string;
  utilizationType?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export interface FrontPageHero {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

export interface StatItemConfig {
  id: 'deposits' | 'weight' | 'sales' | 'utilization' | 'rws' | 'programs';
  label: string;
  visible: boolean;
  order: number;
}

export interface FrontPageAbout {
  title: string;
  description: string;
  image: string;
}

export interface FrontPageCTA {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface FrontPageContent {
  hero: FrontPageHero;
  stats: StatItemConfig[];
  about: FrontPageAbout;
  cta: FrontPageCTA;
}
