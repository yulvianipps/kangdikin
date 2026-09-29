import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BiomassEntry, BiomassPartner, BiomassTypeMaster } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { BiomassMasterManagerModal } from '../modals/BiomassMasterManagerModal';
import { BiomassDetailModal } from '../modals/BiomassDetailModal';
import { Pagination } from '../common/Pagination';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Layers,
  Scale,
  Calendar,
  Clock,
  User,
  ArrowUpDown,
  Download,
  Edit2,
  Trash2,
  Eye,
  Settings,
  Building2,
  Tag,
  Copy,
  Check,
  CheckCircle2,
  FileText,
  TreePine,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface AdminBiomassViewProps {
  initialCategory?: 'aren' | 'kayu' | 'all';
  onAddBiomass: (category?: 'aren' | 'kayu') => void;
  onEditBiomass: (entry: BiomassEntry) => void;
}

export const AdminBiomassView: React.FC<AdminBiomassViewProps> = ({
  initialCategory = 'aren',
  onAddBiomass,
  onEditBiomass,
}) => {
  const {
    biomassEntries,
    deleteBiomassEntry,
    biomassPartners,
    biomassTypes,
    addToast,
    user,
    isStaff,
    isSuperAdmin,
  } = useApp();

  const isArenStaff = isStaff && user?.assignedProgramId === 'prog-aren';
  const isKayuStaff = isStaff && user?.assignedProgramId === 'prog-kayu';
  const isBankSampahStaff = isStaff && user?.assignedProgramId === 'prog-bank-sampah';

  // Active Category Scope: 'aren' | 'kayu' | 'all'
  const defaultCategory = isArenStaff
    ? 'aren'
    : isKayuStaff
    ? 'kayu'
    : initialCategory;
  const [activeCategory, setActiveCategory] = useState<'aren' | 'kayu' | 'all'>(defaultCategory);

  // Filters state
  const [filterPartner, setFilterPartner] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // View Mode: 'table' (Log tabel khusus sesuai permintaan user)
  // | 'daily_format' (Catatan harian sesuai format WA)
  // | 'partners_summary' (Rekap per Stokpile/Sentra)
  const [viewMode, setViewMode] = useState<'table' | 'daily_format' | 'partners_summary'>('table');

  // Detail modal state (Read-only view for all staff)
  const [selectedDetailEntry, setSelectedDetailEntry] = useState<BiomassEntry | null>(null);

  // Deletion modal state
  const [deletingEntry, setDeletingEntry] = useState<BiomassEntry | null>(null);

  // Master manager modal state
  const [showMasterManager, setShowMasterManager] = useState(false);
  const [masterManagerTab, setMasterManagerTab] = useState<'partners' | 'types'>('partners');

  // Copy status
  const [copiedText, setCopiedText] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Helper check for Aren entries
  const isArenEntry = (b: BiomassEntry): boolean => {
    const text = `${b.biomass_type || ''} ${b.group_category || ''} ${b.activity_type || ''} ${b.notes || ''}`.toLowerCase();
    return (
      text.includes('aren') ||
      text.includes('nira') ||
      text.includes('ciamis') ||
      b.partner_id === 'prt-cms' ||
      b.transaction_no.startsWith('ARN')
    );
  };

  // Helper check for Kayu entries
  const isKayuEntry = (b: BiomassEntry): boolean => {
    const text = `${b.biomass_type || ''} ${b.group_category || ''} ${b.activity_type || ''} ${b.notes || ''}`.toLowerCase();
    return (
      text.includes('kayu') ||
      text.includes('sengon') ||
      text.includes('mahoni') ||
      text.includes('indramayu') ||
      text.includes('subang') ||
      b.partner_id === 'prt-idm' ||
      b.partner_id === 'prt-sub' ||
      b.transaction_no.startsWith('KYU')
    );
  };

  // Filtered dataset with strict RBAC isolation
  const filtered = useMemo(() => {
    return biomassEntries.filter((b) => {
      // 1. Strict Staff Role Isolation:
      // Petugas Aren HANYA BISA LIHAT AREN, tidak bisa lihat Kayu atau lainnya!
      if (isArenStaff) {
        if (!isArenEntry(b)) return false;
      }
      // Petugas Kayu HANYA BISA LIHAT KAYU, tidak bisa lihat Aren atau lainnya!
      else if (isKayuStaff) {
        if (!isKayuEntry(b)) return false;
      }
      // Petugas Bank Sampah tidak mengelola biomassa
      else if (isBankSampahStaff) {
        return false;
      }
      // 2. Super Admin or unrestricted user selecting specific category tab:
      else if (activeCategory === 'aren') {
        if (!isArenEntry(b)) return false;
      } else if (activeCategory === 'kayu') {
        if (!isKayuEntry(b)) return false;
      }

      // 3. Dropdown filters
      if (filterPartner !== 'all' && b.group_category !== filterPartner) return false;
      if (filterType !== 'all' && b.biomass_type !== filterType) return false;
      if (filterShift !== 'all' && !b.shift.toLowerCase().includes(filterShift.toLowerCase())) return false;
      if (filterDate && b.date !== filterDate) return false;
      if (filterCondition === 'basah' && !(b.condition === 'basah' || b.notes?.toLowerCase().includes('basah'))) {
        return false;
      }
      if (filterCondition === 'kering' && (b.condition === 'basah' || b.notes?.toLowerCase().includes('basah'))) {
        return false;
      }

      // 4. Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          b.transaction_no.toLowerCase().includes(query) ||
          b.vehicle_plate.toLowerCase().includes(query) ||
          (b.driver_name && b.driver_name.toLowerCase().includes(query)) ||
          (b.activity_type && b.activity_type.toLowerCase().includes(query)) ||
          (b.biomass_type && b.biomass_type.toLowerCase().includes(query)) ||
          b.group_category.toLowerCase().includes(query) ||
          (b.notes && b.notes.toLowerCase().includes(query)) ||
          b.day.toLowerCase().includes(query);
        if (!match) return false;
      }

      return true;
    });
  }, [
    biomassEntries,
    activeCategory,
    filterPartner,
    filterType,
    filterShift,
    filterDate,
    filterCondition,
    search,
    isArenStaff,
    isKayuStaff,
    isBankSampahStaff,
  ]);

  // Aggregations
  const totalGrossKg = useMemo(
    () => filtered.reduce((acc, curr) => acc + (Number(curr.gross_weight) || 0), 0),
    [filtered]
  );
  const totalTareKg = useMemo(
    () => filtered.reduce((acc, curr) => acc + (Number(curr.tare_weight) || 0), 0),
    [filtered]
  );
  const totalNetKg = useMemo(
    () => filtered.reduce((acc, curr) => acc + (Number(curr.net_weight) || 0), 0),
    [filtered]
  );

  // Structured daily data for format view
  const dailyStructuredData = useMemo(() => {
    const dateMap: Record<string, BiomassEntry[]> = {};
    filtered.forEach((entry) => {
      const d = entry.date;
      if (!dateMap[d]) dateMap[d] = [];
      dateMap[d].push(entry);
    });

    const sortedDates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a));

    return sortedDates.map((d) => {
      const dayEntries = dateMap[d];
      const first = dayEntries[0];
      const dayLabel = `${first?.day || ''}, ${d}`;
      const totalDayNet = dayEntries.reduce((acc, c) => acc + c.net_weight, 0);

      // Group by group_category
      const groupMap: Record<string, BiomassEntry[]> = {};
      dayEntries.forEach((entry) => {
        const gName = entry.group_category || 'Sentra Utama';
        if (!groupMap[gName]) groupMap[gName] = [];
        groupMap[gName].push(entry);
      });

      const groups = Object.keys(groupMap).map((gName) => {
        const items = groupMap[gName];
        const totalGroupNet = items.reduce((acc, c) => acc + c.net_weight, 0);
        return {
          groupName: gName,
          totalGroupNet,
          items,
        };
      });

      return {
        dateStr: d,
        dayLabel,
        totalDayNet,
        groups,
      };
    });
  }, [filtered]);

  // Summary per partner/sentra
  const partnerSummaries = useMemo(() => {
    const map: Record<
      string,
      {
        partnerName: string;
        trips: number;
        totalGross: number;
        totalTare: number;
        totalNet: number;
        lastDate: string;
      }
    > = {};

    filtered.forEach((entry) => {
      const pName = entry.group_category || 'Mitra Lain';
      if (!map[pName]) {
        map[pName] = {
          partnerName: pName,
          trips: 0,
          totalGross: 0,
          totalTare: 0,
          totalNet: 0,
          lastDate: entry.date,
        };
      }
      map[pName].trips += 1;
      map[pName].totalGross += entry.gross_weight;
      map[pName].totalTare += entry.tare_weight;
      map[pName].totalNet += entry.net_weight;
      if (entry.date > map[pName].lastDate) {
        map[pName].lastDate = entry.date;
      }
    });

    return Object.values(map).sort((a, b) => b.totalNet - a.totalNet);
  }, [filtered]);

  // Pagination for table view
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Text generator for WhatsApp report
  const generateFormatWhatsAppText = (): string => {
    if (dailyStructuredData.length === 0) return 'Tidak ada data biomassa.';

    let text = `*LAPORAN TIMBANGAN OPERASIONAL BIOMASSA ${
      activeCategory === 'aren'
        ? 'SENTRA AREN'
        : activeCategory === 'kayu'
        ? 'KEHUTANAN KAYU'
        : 'KANG DIKIN'
    }*\n\n`;

    dailyStructuredData.forEach((dayData) => {
      text += `📅 *${dayData.dayLabel}*\n`;

      dayData.groups.forEach((group) => {
        text += `\n🏢 *${group.groupName}*\n`;
        group.items.forEach((item, idx) => {
          const wetMark =
            item.condition === 'basah' || item.notes?.toLowerCase().includes('basah')
              ? ' (basah)'
              : '';
          const driverInfo = item.driver_name ? ` [Sopir: ${item.driver_name}]` : '';
          const shiftInfo = item.shift ? ` - ${item.shift}` : '';
          text += `${idx + 1}. ${item.vehicle_plate}${driverInfo}${shiftInfo}: ${item.gross_weight.toLocaleString(
            'id-ID'
          )} - ${item.tare_weight.toLocaleString('id-ID')} = *${item.net_weight.toLocaleString(
            'id-ID'
          )} Kg*${wetMark}\n`;
        });
        text += `➡️ *Subtotal ${group.groupName}: ${group.totalGroupNet.toLocaleString(
          'id-ID'
        )} Kg*\n`;
      });

      text += `\n⭐ *TOTAL HARIAN (${dayData.dateStr}): ${dayData.totalDayNet.toLocaleString(
        'id-ID'
      )} Kg (${(dayData.totalDayNet / 1000).toFixed(2)} Ton)*\n`;
      text += `-------------------------------------------\n\n`;
    });

    text += `\n*TOTAL KESELURUHAN PASOKAN BERSIH: ${totalNetKg.toLocaleString(
      'id-ID'
    )} Kg (${(totalNetKg / 1000).toFixed(2)} Ton)*\n`;
    text += `*DANA BERSAMA - KANG DIKIN TERINTEGRASI*`;

    return text;
  };

  const handleCopyText = () => {
    const text = generateFormatWhatsAppText();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    addToast('success', 'Teks Berhasil Disalin', 'Format laporan harian siap ditempel ke WhatsApp.');
    setTimeout(() => setCopiedText(false), 3000);
  };

  // If user is Bank Sampah staff, they are restricted from viewing Biomassa
  if (isBankSampahStaff) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center max-w-lg mx-auto my-12 shadow-sm space-y-4">
        <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-stone-900">Akses Dikhususkan untuk Bank Sampah</h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Akun Anda memiliki hak akses khusus <strong>Pengelola Bank Sampah</strong>. Modul timbangan biomassa, logistik aren, dan kayu hanya dapat diakses oleh petugas bagian masing-masing atau Super Admin.
        </p>
      </div>
    );
  }

  const isArenMode = activeCategory === 'aren' || isArenStaff;
  const isKayuMode = activeCategory === 'kayu' || isKayuStaff;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl text-white shadow-lg relative overflow-hidden transition-colors ${
        isArenMode
          ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-800'
          : isKayuMode
          ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 border border-amber-800'
          : 'bg-gradient-to-r from-stone-950 via-stone-900 to-emerald-950 border border-stone-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                isArenMode
                  ? 'bg-emerald-400 text-emerald-950'
                  : isKayuMode
                  ? 'bg-amber-400 text-amber-950'
                  : 'bg-stone-300 text-stone-950'
              }`}>
                {isArenMode
                  ? '🌾 Sentra Aren (Khusus)'
                  : isKayuMode
                  ? '🪵 Kehutanan Kayu (Khusus)'
                  : '📊 Semua Biomassa'}
              </span>
              <span className="text-xs text-white/70">
                Pencatatan Terisolasi & Akuntabel (DANA BERSAMA)
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
              {isArenMode
                ? 'Pencatatan Biomassa Sentra Aren'
                : isKayuMode
                ? 'Logistik & Timbangan Kayu Rakyat'
                : 'Pencatatan & Logistik Biomassa'}
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-2xl">
              {isArenMode
                ? 'Pencatatan khusus armada pengangkutan nira, pelepah cacah, serbuk aren, dan ampas pengolahan. Tabel lengkap: Tanggal, Shift, Jenis Aktifitas, Nopol Truk, Sopir (Yulviani Puteri Puspita Sari), Jam Tiba, Jam Berangkat, Berat Kotor, Berat Kosong, dan Berat Netto.'
                : isKayuMode
                ? 'Pencatatan pasokan kayu sengon, mahoni, ranting, dan kayu bakar dari kelompok tani kehutanan masyarakat tebang lestari.'
                : 'Dashboard pemantauan pasokan biomassa terpadu untuk pengeringan, pembriketan, dan sirkularitas desa.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors flex items-center gap-1.5 border border-white/15"
              title="Salin rekap berformat catatan harian ke WhatsApp"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Format Laporan</span>
                </>
              )}
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => {
                  setMasterManagerTab('partners');
                  setShowMasterManager(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors flex items-center gap-1.5 border border-white/15"
              >
                <Settings className="w-4 h-4" />
                <span>Kelola Master</span>
              </button>
            )}

            {isSuperAdmin ? (
              <button
                onClick={() => onAddBiomass(isArenMode ? 'aren' : isKayuMode ? 'kayu' : undefined)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5 ${
                  isArenMode
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950'
                    : isKayuMode
                    ? 'bg-amber-400 hover:bg-amber-300 text-amber-950'
                    : 'bg-white hover:bg-stone-100 text-stone-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isArenMode
                    ? 'Catat Timbang Aren'
                    : isKayuMode
                    ? 'Catat Timbang Kayu'
                    : 'Tambah Data Timbang'}
                </span>
              </button>
            ) : (
              <div className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-300" />
                <span>Akses: Lihat Semua & Detail</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scope Switcher for Super Admin (Biar tidak tercampur aduk) */}
      {isSuperAdmin && (
        <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-500 px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span>Pemisahan Bagian:</span>
            </span>

            <button
              onClick={() => {
                setActiveCategory('aren');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === 'aren'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>🌾 Khusus Sentra Aren</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeCategory === 'aren' ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-200 text-stone-700'
              }`}>
                {biomassEntries.filter(isArenEntry).length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('kayu');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === 'kayu'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>🪵 Khusus Kehutanan Kayu</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeCategory === 'kayu' ? 'bg-amber-950 text-amber-200' : 'bg-stone-200 text-stone-700'
              }`}>
                {biomassEntries.filter(isKayuEntry).length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('all');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>📊 Semua Biomassa</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeCategory === 'all' ? 'bg-stone-950 text-stone-200' : 'bg-stone-200 text-stone-700'
              }`}>
                {biomassEntries.length}
              </span>
            </button>
          </div>

          <span className="text-[11px] text-stone-400 italic px-2">
            *Setiap kader hanya bisa melihat bagiannya masing-masing.
          </span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              {isArenMode ? 'Ritase Armada Aren' : isKayuMode ? 'Ritase Armada Kayu' : 'Total Ritase Armada'}
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isArenMode ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
            {filtered.length}{' '}
            <span className="text-xs font-normal text-stone-500">Truk Masuk</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {dailyStructuredData.length} Hari Pengiriman Tercatat
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Berat Kotor (Gross)</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-800 mt-2 font-mono">
            {totalGrossKg.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-stone-500">Kg</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {(totalGrossKg / 1000).toFixed(2)} Ton muatan kotor
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Berat Kosong (Tara)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-2 font-mono">
            {totalTareKg.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-stone-500">Kg</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {(totalTareKg / 1000).toFixed(2)} Ton bobot kosong armada
          </span>
        </div>

        <div className={`p-4 rounded-2xl text-white shadow-md border ${
          isArenMode
            ? 'bg-emerald-950 border-emerald-900'
            : isKayuMode
            ? 'bg-amber-950 border-amber-900'
            : 'bg-stone-950 border-stone-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isArenMode ? 'text-emerald-300' : 'text-amber-300'}`}>
              Total Bersih (Netto)
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isArenMode ? 'bg-emerald-800 text-emerald-200' : 'bg-amber-800 text-amber-200'
            }`}>
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold mt-2 font-mono ${
            isArenMode ? 'text-emerald-300' : 'text-amber-300'
          }`}>
            {totalNetKg.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-white">Kg</span>
          </div>
          <span className="text-[11px] text-white/80 mt-1 block">
            {(totalNetKg / 1000).toFixed(2)} Ton pasokan bersih {isArenMode ? 'Aren' : isKayuMode ? 'Kayu' : 'Biomassa'}
          </span>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl flex-wrap">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-800" />
              <span>
                {isArenMode
                  ? `Tabel Log Aren (${filtered.length})`
                  : isKayuMode
                  ? `Tabel Log Kayu (${filtered.length})`
                  : `Log Tabel Lengkap (${filtered.length})`}
              </span>
            </button>

            <button
              onClick={() => setViewMode('daily_format')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'daily_format'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-800" />
              <span>Format Catatan Harian (WA)</span>
            </button>

            <button
              onClick={() => setViewMode('partners_summary')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'partners_summary'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>Rekap per Sentra / Stokpile ({partnerSummaries.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari plat (Z 9415 TA), sopir (Yulviani), shift..."
              className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-stone-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">
              Sentra Mitra / Stokpile
            </label>
            <select
              value={filterPartner}
              onChange={(e) => setFilterPartner(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua Sentra & Stokpile</option>
              {biomassPartners.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">
              Shift Kerja
            </label>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua Shift</option>
              <option value="Shift 1">Shift 1 (Pagi)</option>
              <option value="Shift 2">Shift 2 (Siang)</option>
              <option value="Shift 3">Shift 3 (Malam)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">
              Kondisi Muatan
            </label>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua Kondisi</option>
              <option value="kering">Kering Normal</option>
              <option value="basah">Basah</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">
              Tanggal Operasional
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: TABEL LOG DETAIL LENGKAP (KHUSUS SESUAI PERMINTAAN USER: TANGGAL, SHIFT, JENIS AKTIFITAS, NOPOL TRUK, SOPIR, JAM TIBA, JAM BERANGKAT, BERAT KOTOR, BERAT KOSONG, BERAT NETTO) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-stone-800">
                {isArenMode
                  ? 'Tabel Log Penimbangan Biomassa Aren'
                  : isKayuMode
                  ? 'Tabel Log Logistik Kayu Rakyat'
                  : 'Tabel Log Penimbangan Biomassa'}
              </span>
              <span className="text-xs text-stone-500">({filtered.length} transaksi)</span>
            </div>
            <div className="text-xs text-stone-500 font-mono">
              Netto: <strong className="text-emerald-900">{totalNetKg.toLocaleString('id-ID')} Kg</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-3.5 py-3 text-center w-12">No</th>
                  <th className="px-3.5 py-3">Tanggal</th>
                  <th className="px-3.5 py-3">Shift</th>
                  <th className="px-3.5 py-3">Jenis Aktifitas</th>
                  <th className="px-3.5 py-3">Nopol Truk</th>
                  <th className="px-3.5 py-3">Sopir</th>
                  <th className="px-3.5 py-3 text-center">Jam Tiba</th>
                  <th className="px-3.5 py-3 text-center">Jam Berangkat</th>
                  <th className="px-3.5 py-3 text-right">Berat Kotor</th>
                  <th className="px-3.5 py-3 text-right">Berat Kosong</th>
                  <th className="px-3.5 py-3 text-right bg-emerald-50/80 text-emerald-950 font-bold">
                    Berat Netto
                  </th>
                  <th className="px-3.5 py-3">Catatan</th>
                  <th className="px-3.5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-5 py-12 text-center text-stone-400">
                      <Truck className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                      <p className="font-semibold text-stone-700">
                        Tidak ada catatan penimbangan yang cocok dengan kriteria filter.
                      </p>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Silakan klik tombol "Catat Timbang" di atas untuk menambah armada baru.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedEntries.map((entry, idx) => (
                    <tr key={entry.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* No Urut */}
                      <td className="px-3.5 py-3 text-center font-mono text-stone-400 text-[11px]">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>

                      {/* 1. Tanggal */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <div className="font-bold text-stone-800">{entry.date}</div>
                        <div className="text-[10px] text-stone-500 font-medium">{entry.day}</div>
                      </td>

                      {/* 2. Shift */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          entry.shift.includes('Pagi')
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : entry.shift.includes('Siang')
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          {entry.shift}
                        </span>
                      </td>

                      {/* 3. Jenis Aktifitas */}
                      <td className="px-3.5 py-3 font-medium text-stone-800">
                        <div>{entry.activity_type || 'Bongkar Muatan Biomassa'}</div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-stone-400" />
                          <span>{entry.group_category}</span>
                        </div>
                      </td>

                      {/* 4. Nopol Truk */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className="font-mono font-extrabold text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 tracking-wider">
                          {entry.vehicle_plate}
                        </span>
                      </td>

                      {/* 5. Sopir */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                          <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{entry.driver_name || '-'}</span>
                        </div>
                      </td>

                      {/* 6. Jam Tiba */}
                      <td className="px-3.5 py-3 text-center whitespace-nowrap font-mono text-stone-700">
                        <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-stone-200">
                          <Clock className="w-3 h-3 text-emerald-800" />
                          {entry.arrival_time || '-'}
                        </span>
                      </td>

                      {/* 7. Jam Berangkat */}
                      <td className="px-3.5 py-3 text-center whitespace-nowrap font-mono text-stone-700">
                        <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-stone-200">
                          <Clock className="w-3 h-3 text-stone-500" />
                          {entry.departure_time || '-'}
                        </span>
                      </td>

                      {/* 8. Berat Kotor */}
                      <td className="px-3.5 py-3 text-right font-mono text-stone-600 whitespace-nowrap">
                        {entry.gross_weight.toLocaleString('id-ID')} Kg
                      </td>

                      {/* 9. Berat Kosong */}
                      <td className="px-3.5 py-3 text-right font-mono text-stone-600 whitespace-nowrap">
                        {entry.tare_weight.toLocaleString('id-ID')} Kg
                      </td>

                      {/* 10. Berat Netto */}
                      <td className="px-3.5 py-3 text-right font-mono font-extrabold text-emerald-950 bg-emerald-50/70 whitespace-nowrap border-x border-emerald-100">
                        {entry.net_weight.toLocaleString('id-ID')} Kg
                      </td>

                      {/* Catatan / Kondisi */}
                      <td className="px-3.5 py-3 text-[11px]">
                        {entry.condition === 'basah' || entry.notes?.toLowerCase().includes('basah') ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                            basah
                          </span>
                        ) : (
                          <span className="text-stone-500">{entry.notes || '-'}</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-3.5 py-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedDetailEntry(entry)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-emerald-800 hover:bg-emerald-100 bg-emerald-50 rounded-lg transition-colors font-bold text-xs border border-emerald-200"
                          title="Lihat Rincian Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Detail</span>
                        </button>

                        {isSuperAdmin && (
                          <>
                            <button
                              onClick={() => onEditBiomass(entry)}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit data timbang"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingEntry(entry)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus data timbang"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-stone-200">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filtered.length / pageSize) || 1}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      )}

      {/* VIEW 2: FORMAT CATATAN HARIAN (FORMAT PERSIS WA: Tanggal -> Sentra -> 1. Plat: Kotor - Kosong = Netto) */}
      {viewMode === 'daily_format' && (
        <div className="space-y-6">
          {dailyStructuredData.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-500">
              <Truck className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800">Tidak ada data penimbangan biomassa</p>
              <p className="text-xs text-stone-400 mt-1">
                Silakan tambah data timbang baru atau ubah kriteria filter pencarian.
              </p>
            </div>
          ) : (
            dailyStructuredData.map((dayGroup) => (
              <div
                key={dayGroup.dateStr}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden"
              >
                {/* Header Kartu Harian */}
                <div className="bg-stone-50 px-5 py-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        {dayGroup.dayLabel}
                      </h4>
                      <span className="text-[11px] text-stone-500 font-mono">
                        Kode Tanggal: {dayGroup.dateStr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-600 font-medium">
                      Subtotal Harian:
                    </span>
                    <span className="text-base font-extrabold font-mono text-emerald-950 bg-emerald-100/80 px-3 py-1 rounded-xl border border-emerald-300">
                      {dayGroup.totalDayNet.toLocaleString('id-ID')} Kg{' '}
                      <span className="text-[11px] font-normal text-emerald-800">
                        ({(dayGroup.totalDayNet / 1000).toFixed(2)} Ton)
                      </span>
                    </span>
                  </div>
                </div>

                {/* Body: Groups (Sentra / Stokpile) */}
                <div className="p-5 space-y-6">
                  {dayGroup.groups.map((grp, gIdx) => (
                    <div key={gIdx} className="space-y-3">
                      {/* Judul Kelompok / Stokpile */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-700" />
                          <span className="font-bold text-stone-900 text-sm">
                            {grp.groupName}
                          </span>
                          <span className="text-xs text-stone-500 font-normal">
                            ({grp.items.length} Ritase)
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-stone-700">
                          Total Sentra: {grp.totalGroupNet.toLocaleString('id-ID')} Kg
                        </span>
                      </div>

                      {/* Baris Nomor Armada */}
                      <div className="space-y-2 font-mono text-xs">
                        {grp.items.map((item, iIdx) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 border border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-bold text-stone-500 w-5">
                                {iIdx + 1}.
                              </span>

                              <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 font-extrabold text-stone-900 text-xs tracking-wider">
                                {item.vehicle_plate}
                              </span>

                              {item.driver_name && (
                                <span className="text-xs font-sans text-stone-700 flex items-center gap-1 font-semibold">
                                  <User className="w-3.5 h-3.5 text-stone-400" />
                                  <span>{item.driver_name}</span>
                                </span>
                              )}

                              <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-stone-200/70 text-stone-700">
                                {item.shift}
                              </span>

                              {item.biomass_type && (
                                <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold">
                                  {item.biomass_type}
                                </span>
                              )}
                            </div>

                            {/* Rumus Berat Kotor - Berat Kosong = Netto */}
                            <div className="flex items-center gap-3 self-end md:self-center">
                              <span className="text-stone-600 text-xs">
                                {item.gross_weight.toLocaleString('id-ID')} - {item.tare_weight.toLocaleString('id-ID')} =
                              </span>
                              <span className="text-emerald-950 font-bold text-sm bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                                {item.net_weight.toLocaleString('id-ID')} Kg
                              </span>

                              {item.condition === 'basah' ||
                              item.notes?.toLowerCase().includes('basah') ? (
                                <span className="text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded font-bold text-[10px] uppercase">
                                  basah
                                </span>
                              ) : null}

                              <div className="flex items-center gap-1 ml-2">
                                <button
                                  onClick={() => setSelectedDetailEntry(item)}
                                  className="p-1 text-emerald-700 hover:bg-emerald-100 rounded"
                                  title="Lihat Detail"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                {isSuperAdmin && (
                                  <>
                                    <button
                                      onClick={() => onEditBiomass(item)}
                                      className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setDeletingEntry(item)}
                                      className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                                      title="Hapus"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW 3: REKAPITULASI PER SENTRA / STOKPILE */}
      {viewMode === 'partners_summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partnerSummaries.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-500">
              Tidak ada data rekap per sentra.
            </div>
          ) : (
            partnerSummaries.map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm">{p.partnerName}</h4>
                      <span className="text-[11px] text-stone-400">
                        Update Terakhir: {p.lastDate}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                    {p.trips} Ritase
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center font-mono">
                  <div className="p-2 rounded-xl bg-stone-50">
                    <span className="text-[10px] text-stone-400 block">Kotor</span>
                    <span className="text-xs font-bold text-stone-700">
                      {p.totalGross.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50">
                    <span className="text-[10px] text-amber-600 block">Kosong</span>
                    <span className="text-xs font-bold text-amber-800">
                      {p.totalTare.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50">
                    <span className="text-[10px] text-emerald-700 block">Netto</span>
                    <span className="text-xs font-extrabold text-emerald-900">
                      {p.totalNet.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950 text-white rounded-2xl flex items-center justify-between">
                  <span className="text-xs text-emerald-300">Total Pasokan Bersih:</span>
                  <span className="text-sm font-extrabold font-mono text-white">
                    {(p.totalNet / 1000).toFixed(2)} Ton
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deletingEntry && (
        <ConfirmDeleteModal
          isOpen={!!deletingEntry}
          title="Hapus Catatan Penimbangan"
          message={`Apakah Anda yakin ingin menghapus data timbang armada ${deletingEntry.vehicle_plate} (Sopir: ${deletingEntry.driver_name || '-'}) pada ${deletingEntry.day}, ${deletingEntry.date} dengan berat netto ${deletingEntry.net_weight.toLocaleString('id-ID')} Kg?`}
          onConfirm={() => {
            deleteBiomassEntry(deletingEntry.id);
            setDeletingEntry(null);
          }}
          onCancel={() => setDeletingEntry(null)}
        />
      )}

      {/* Master Manager Modal */}
      {showMasterManager && (
        <BiomassMasterManagerModal
          initialTab={masterManagerTab}
          onClose={() => setShowMasterManager(false)}
        />
      )}

      {/* Detail Modal for Read-Only Staff and Admin */}
      {selectedDetailEntry && (
        <BiomassDetailModal
          entry={selectedDetailEntry}
          onClose={() => setSelectedDetailEntry(null)}
        />
      )}
    </div>
  );
};
