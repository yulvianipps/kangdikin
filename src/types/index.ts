export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'public';
  assignedProgramId?: string;
  assignedProgramName?: string;
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

export interface BiomassPartner {
  id: string;
  name: string;        // e.g. "Stokpile Indramayu", "Fasprod Ciamis"
  code?: string;       // e.g. "STK-IDM", "FAS-CMS"
  location?: string;   // e.g. "Indramayu, Jawa Barat"
  type?: 'stokpile' | 'fasprod' | 'kelompok_tani' | 'mitra_lain';
  description?: string;
  createdAt: string;
}

export interface BiomassTypeMaster {
  id: string;
  name: string;        // e.g. "Aren", "Serbuk Aren", "Kayu Limbah", "Sekam Padi", "Briket Biomassa"
  description?: string;
  defaultPrice?: number;
}

export interface BiomassEntry {
  id: string;
  transaction_no: string;      // e.g. "BIO-2026-001"
  date: string;                // tanggal (YYYY-MM-DD)
  day: string;                 // Sabtu, Minggu, Senin, etc.
  shift: string;               // shift (Shift 1, Shift 2, Reguler, etc.)
  activity_type: string;       // jenis aktifitas (Bongkar Kayu, Pasok Biomassa, dll)
  partner_id?: string;         // ID kelompok / stokpile
  group_category: string;      // nama kelompok/stokpile (misal: "Stokpile Indramayu", "Fasprod Ciamis")
  biomass_type?: string;       // jenis biomassa (misal: "Aren", "Kayu Sengon", "Sekam Padi")
  vehicle_plate: string;       // no pol truk (misal: Z 9415 TA)
  driver_name: string;         // nama sopir
  arrival_time: string;        // jam tiba (HH:mm)
  departure_time: string;      // jam berangkat (HH:mm)
  gross_weight: number;        // berat kotor (Kg)
  tare_weight: number;         // berat kosong (Kg)
  net_weight: number;          // netto (Kg) = gross_weight - tare_weight
  condition?: string;          // misal: "kering", "basah"
  notes?: string;              // catatan tambahan (misal: "basah")
  created_by?: string;
  createdAt: string;
}
