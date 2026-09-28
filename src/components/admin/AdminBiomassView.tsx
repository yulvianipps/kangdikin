import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BiomassEntry, BiomassPartner, BiomassTypeMaster } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { BiomassMasterManagerModal } from '../modals/BiomassMasterManagerModal';
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
} from 'lucide-react';

interface AdminBiomassViewProps {
  onAddBiomass: () => void;
  onEditBiomass: (entry: BiomassEntry) => void;
}

export const AdminBiomassView: React.FC<AdminBiomassViewProps> = ({
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
  } = useApp();

  const isArenStaff = isStaff && user?.assignedProgramId === 'prog-aren';
  const isBankSampahStaff = isStaff && user?.assignedProgramId === 'prog-bank-sampah';

  // Filters state
  const [filterPartner, setFilterPartner] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // View Mode: 'daily_format' (sesuai format user: Tanggal -> Kelompok -> 1. Plat: Gross - Tara = Netto)
  // | 'partners_summary' (Rekap per Stokpile)
  // | 'table' (Log tabel lengkap)
  const [viewMode, setViewMode] = useState<'daily_format' | 'partners_summary' | 'table'>('daily_format');

  // Deletion modal state
  const [deletingEntry, setDeletingEntry] = useState<BiomassEntry | null>(null);

  // Master manager modal state (Kelola Kelompok Mitra & Jenis Biomassa)
  const [showMasterManager, setShowMasterManager] = useState(false);
  const [masterManagerTab, setMasterManagerTab] = useState<'partners' | 'types'>('partners');

  // Copy status
  const [copiedText, setCopiedText] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Filtered dataset
  const filtered = useMemo(() => {
    return biomassEntries.filter((b) => {
      // Role scope: If user is assigned to Aren, strictly limit to Aren biomass
      if (isArenStaff) {
        const isAren =
          (b.biomass_type && b.biomass_type.toLowerCase().includes('aren')) ||
          (b.group_category && b.group_category.toLowerCase().includes('ciamis')) ||
          (b.notes && b.notes.toLowerCase().includes('aren')) ||
          b.partner_id === 'prt-cms';
        if (!isAren) return false;
      }

      if (filterPartner !== 'all' && b.group_category !== filterPartner) return false;
      if (filterType !== 'all' && b.biomass_type !== filterType) return false;
      if (filterDate && b.date !== filterDate) return false;
      if (filterCondition === 'basah' && !(b.condition === 'basah' || b.notes?.toLowerCase().includes('basah'))) {
        return false;
      }
      if (filterCondition === 'kering' && (b.condition === 'basah' || b.notes?.toLowerCase().includes('basah'))) {
        return false;
      }

      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          b.transaction_no.toLowerCase().includes(query) ||
          b.vehicle_plate.toLowerCase().includes(query) ||
          (b.biomass_type && b.biomass_type.toLowerCase().includes(query)) ||
          b.group_category.toLowerCase().includes(query) ||
          (b.driver_name && b.driver_name.toLowerCase().includes(query)) ||
          (b.notes && b.notes.toLowerCase().includes(query)) ||
          b.day.toLowerCase().includes(query);
        if (!match) return false;
      }

      return true;
    });
  }, [biomassEntries, filterPartner, filterType, filterDate, filterCondition, search, isArenStaff]);

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

  // Format Tanggal Terstruktur (Per Tanggal -> Per Kelompok / Stokpile -> List Armada)
  // Menghasilkan struktur:
  // [
  //   {
  //     dateStr: "2026-09-19",
  //     dayLabel: "Sabtu, 19 September 2026",
  //     totalDayNet: 36060,
  //     groups: [
  //       {
  //         groupName: "Stokpile Indramayu",
  //         totalGroupNet: 36060,
  //         items: [...]
  //       }
  //     ]
  //   }
  // ]
  const dailyStructuredData = useMemo(() => {
    // 1. Group entries by date
    const dateMap: Record<string, BiomassEntry[]> = {};
    filtered.forEach((entry) => {
      const d = entry.date;
      if (!dateMap[d]) dateMap[d] = [];
      dateMap[d].push(entry);
    });

    // 2. Sort dates descending (or chronological)
    const sortedDates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a));

    return sortedDates.map((dateStr) => {
      const entriesForDate = dateMap[dateStr];
      const firstEntry = entriesForDate[0];
      const dayName = firstEntry?.day || 'Hari';

      // Parse date for nice Indonesian display
      let formattedDate = dateStr;
      try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const year = parts[0];
          const monthIndex = parseInt(parts[1], 10) - 1;
          const dayNum = parseInt(parts[2], 10);
          const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          formattedDate = `${dayNum} ${monthNames[monthIndex] || parts[1]} ${year}`;
        }
      } catch (e) {
        formattedDate = dateStr;
      }

      const dayHeader = `${dayName}, ${formattedDate}`;

      // Group by group_category (e.g. Stokpile Indramayu, Fasprod Ciamis)
      const groupMap: Record<string, BiomassEntry[]> = {};
      entriesForDate.forEach((e) => {
        const gName = e.group_category || 'Stokpile Utama';
        if (!groupMap[gName]) groupMap[gName] = [];
        groupMap[gName].push(e);
      });

      const groups = Object.keys(groupMap).map((gName, gIdx) => {
        const items = groupMap[gName];
        const groupNet = items.reduce((acc, curr) => acc + (Number(curr.net_weight) || 0), 0);
        const groupGross = items.reduce((acc, curr) => acc + (Number(curr.gross_weight) || 0), 0);
        const groupTare = items.reduce((acc, curr) => acc + (Number(curr.tare_weight) || 0), 0);
        // Prefix letter if multiple groups e.g. A. Fasprod Ciamis, B. Stokpile Indramayu
        const letterPrefix = Object.keys(groupMap).length > 1 ? `${String.fromCharCode(65 + gIdx)}. ` : '';

        return {
          groupName: `${letterPrefix}${gName}`,
          rawGroupName: gName,
          items,
          groupNet,
          groupGross,
          groupTare,
        };
      });

      const dayTotalNet = entriesForDate.reduce((acc, curr) => acc + (Number(curr.net_weight) || 0), 0);

      return {
        dateStr,
        dayHeader,
        dayTotalNet,
        groups,
      };
    });
  }, [filtered]);

  // Grouped by partner summary
  const partnerSummaries = useMemo(() => {
    const map: Record<
      string,
      {
        partnerName: string;
        count: number;
        totalGross: number;
        totalTare: number;
        totalNet: number;
        entries: BiomassEntry[];
      }
    > = {};

    filtered.forEach((entry) => {
      const gName = entry.group_category || 'Tanpa Kelompok';
      if (!map[gName]) {
        map[gName] = {
          partnerName: gName,
          count: 0,
          totalGross: 0,
          totalTare: 0,
          totalNet: 0,
          entries: [],
        };
      }
      map[gName].count += 1;
      map[gName].totalGross += Number(entry.gross_weight) || 0;
      map[gName].totalTare += Number(entry.tare_weight) || 0;
      map[gName].totalNet += Number(entry.net_weight) || 0;
      map[gName].entries.push(entry);
    });

    return Object.values(map);
  }, [filtered]);

  // Paginated data for table view
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Copy text in the exact user brief format:
  // DAFTAR BIOMASSA
  // Sabtu, 19 September 2026
  // Stokpile Indramayu
  // 1. Z 9415 TA : 10.950 - 4.130 = 6.820 kg
  const handleCopyReportText = () => {
    let text = 'DAFTAR BIOMASSA\n\n';

    dailyStructuredData.forEach((dayData) => {
      text += `${dayData.dayHeader}\n`;
      dayData.groups.forEach((g) => {
        text += `${g.groupName}\n`;
        g.items.forEach((item, idx) => {
          const gFormatted = Number(item.gross_weight).toLocaleString('id-ID');
          const tFormatted = Number(item.tare_weight).toLocaleString('id-ID');
          const nFormatted = Number(item.net_weight).toLocaleString('id-ID');
          const notesText = item.notes ? ` ( ${item.notes} )` : '';
          const typeText = item.biomass_type ? ` [${item.biomass_type}]` : '';
          const timeText = item.arrival_time && item.departure_time ? ` (Jam ${item.arrival_time} - ${item.departure_time})` : '';
          text += `${idx + 1}. ${item.vehicle_plate} : ${gFormatted} - ${tFormatted} = ${nFormatted} kg${typeText}${timeText}${notesText}\n`;
        });
        text += `Subtotal ${g.groupName}: ${g.groupNet.toLocaleString('id-ID')} kg\n\n`;
      });
    });

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    addToast('success', 'Teks Berhasil Disalin', 'Format teks daftar biomassa siap dibagikan ke WhatsApp / laporan.');
    setTimeout(() => setCopiedText(false), 3000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'No Transaksi',
      'Tanggal',
      'Hari',
      'Shift',
      'Kelompok / Stokpile',
      'Jenis Biomassa',
      'No Polisi Truk',
      'Nama Sopir',
      'Jam Tiba',
      'Jam Berangkat',
      'Berat Kotor (Gross Kg)',
      'Berat Kosong (Tara Kg)',
      'Netto (Kg)',
      'Catatan / Kondisi',
    ];

    const rows = filtered.map((e) => [
      `"${e.transaction_no}"`,
      `"${e.date}"`,
      `"${e.day}"`,
      `"${e.shift}"`,
      `"${e.group_category || '-'}"`,
      `"${e.biomass_type || 'Aren'}"`,
      `"${e.vehicle_plate}"`,
      `"${e.driver_name}"`,
      `"${e.arrival_time || '-'}"`,
      `"${e.departure_time || '-'}"`,
      e.gross_weight,
      e.tare_weight,
      e.net_weight,
      `"${(e.notes || e.condition || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `daftar_biomassa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isBankSampahStaff) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-4 max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto text-xl font-bold">
          ♻️
        </div>
        <h3 className="font-bold text-stone-900 text-lg">Modul Jembatan Timbang Biomassa</h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Anda sedang masuk sebagai <strong>Pengelola Bank Sampah</strong>. Modul timbangan truk biomassa ini dikhususkan untuk rantai pasok nira/serbuk Aren dan kayu. Data dan transaksi Bank Sampah Anda dapat dikelola melalui menu <strong>Setoran</strong>, <strong>Penjualan Daur Ulang</strong>, dan <strong>Pemanfaatan</strong> di sebelah kiri.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scope banner for Aren Staff */}
      {isArenStaff && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌴</span>
            <div>
              <div className="font-bold text-sm">Mode Khusus: Rantai Pasok & Biomassa Sentra Aren</div>
              <div className="text-amber-800 mt-0.5">
                Data disaring otomatis untuk muatan Serbuk Aren & Fasilitas Produksi Ciamis. Anda memiliki akses penuh untuk menambah, mengedit, dan menghapus (CRUD) logistik Aren.
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-amber-200/80 font-bold border border-amber-300 text-[11px] shrink-0 self-start sm:self-auto">
            CRUD Aren Aktif
          </span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Pencatatan Logistik & Penimbangan Truk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            DAFTAR BIOMASSA
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Pencatatan jembatan timbang armada (Gross - Tara = Netto Kg), kelompok mitra (Stokpile Indramayu, Fasprod Ciamis, dll), dan pilihan jenis komoditas (Aren, Kayu, Sekam, dll).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Kelola Kelompok Mitra & Jenis */}
          <button
            onClick={() => {
              setMasterManagerTab('partners');
              setShowMasterManager(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors"
            title="Kelola Master Kelompok Mitra & Stokpile"
          >
            <Building2 className="w-4 h-4 text-emerald-800" />
            <span>Kelola Kelompok Mitra</span>
          </button>

          <button
            onClick={() => {
              setMasterManagerTab('types');
              setShowMasterManager(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors"
            title="Kelola Pilihan Jenis Biomassa"
          >
            <Tag className="w-4 h-4 text-emerald-800" />
            <span>Pilihan Jenis Biomassa</span>
          </button>

          <button
            onClick={handleCopyReportText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl transition-colors"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Teks Format</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onAddBiomass}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Timbang</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Ritase Armada</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
            {filtered.length}{' '}
            <span className="text-xs font-normal text-stone-500">Truk Masuk</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {dailyStructuredData.length} Hari Pencatatan Operasional
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

        <div className="p-4 rounded-2xl bg-emerald-950 text-white shadow-md border border-emerald-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Total Bersih (Netto)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-2 font-mono">
            {totalNetKg.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-white">Kg</span>
          </div>
          <span className="text-[11px] text-emerald-200/80 mt-1 block">
            {(totalNetKg / 1000).toFixed(2)} Ton pasokan bersih biomassa
          </span>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl flex-wrap">
            <button
              onClick={() => setViewMode('daily_format')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'daily_format'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-800" />
              <span>Format Catatan Harian (Sesuai Laporan)</span>
            </button>

            <button
              onClick={() => setViewMode('partners_summary')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'partners_summary'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>Rekap per Kelompok ({partnerSummaries.length})</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Log Tabel Lengkap ({filtered.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari plat nomor (Z 9415 TA), jenis (Aren), dll..."
              className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-stone-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">
              Filter Kelompok Mitra / Stokpile
            </label>
            <select
              value={filterPartner}
              onChange={(e) => setFilterPartner(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua Kelompok & Stokpile</option>
              {biomassPartners.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">
              Pilihan Jenis Biomassa
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua Jenis Biomassa</option>
              {biomassTypes.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
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
              <option value="basah">Hanya yang Basah</option>
              <option value="kering">Hanya Kering Normal</option>
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

      {/* VIEW 1: FORMAT CATATAN HARIAN (PERSIS SESUAI SPESIFIKASI PENGGUNA) */}
      {viewMode === 'daily_format' && (
        <div className="space-y-6">
          {dailyStructuredData.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
              <Truck className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800">Tidak ada data penimbangan biomassa</p>
              <p className="text-xs text-stone-400 mt-1">
                Silakan tambah data timbang baru atau ubah kriteria filter pencarian.
              </p>
            </div>
          ) : (
            dailyStructuredData.map((dayData) => (
              <div
                key={dayData.dateStr}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden"
              >
                {/* Header Hari & Tanggal */}
                <div className="bg-emerald-950 text-white px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-emerald-300" />
                    <h2 className="text-base sm:text-lg font-bold tracking-wide">
                      {dayData.dayHeader}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-300">Total Netto Hari Ini:</span>
                    <strong className="font-mono text-white text-sm bg-emerald-800/80 px-2.5 py-0.5 rounded-lg border border-emerald-700">
                      {dayData.dayTotalNet.toLocaleString('id-ID')} Kg
                    </strong>
                  </div>
                </div>

                {/* Groups / Fasilitas per Hari */}
                <div className="divide-y divide-stone-200">
                  {dayData.groups.map((group) => (
                    <div key={group.groupName} className="p-6 space-y-4">
                      {/* Sub-header Kelompok / Stokpile */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-stone-100 gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-800" />
                          <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                            {group.groupName}
                          </h3>
                          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                            {group.items.length} Truk
                          </span>
                        </div>

                        <div className="text-xs text-stone-600 font-mono flex items-center gap-3">
                          <span>
                            Gross: <strong>{group.groupGross.toLocaleString('id-ID')}</strong> Kg
                          </span>
                          <span>
                            Tara: <strong>{group.groupTare.toLocaleString('id-ID')}</strong> Kg
                          </span>
                          <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-200">
                            Netto: {group.groupNet.toLocaleString('id-ID')} Kg
                          </span>
                        </div>
                      </div>

                      {/* List Truk (Nomor urut, Plat, Rumus Timbang Gross - Tara = Netto, Jenis & Kondisi) */}
                      <div className="space-y-2">
                        {group.items.map((item, idx) => {
                          const isWet =
                            item.condition === 'basah' ||
                            item.notes?.toLowerCase().includes('basah');

                          return (
                            <div
                              key={item.id}
                              className="group p-3 sm:px-4 rounded-xl bg-stone-50/70 hover:bg-emerald-50/50 border border-stone-200/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                            >
                              {/* Kolom Kiri: Nomor urut & Rumus Timbang */}
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="w-6 h-6 rounded-full bg-stone-200 group-hover:bg-emerald-200 text-stone-800 group-hover:text-emerald-900 flex items-center justify-center font-bold text-xs">
                                  {idx + 1}
                                </span>

                                <span className="font-mono font-extrabold text-sm text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 tracking-wider">
                                  {item.vehicle_plate}
                                </span>

                                <div className="font-mono text-stone-700 flex items-center gap-1.5 font-semibold">
                                  <span className="text-stone-600">
                                    {Number(item.gross_weight).toLocaleString('id-ID')}
                                  </span>
                                  <span className="text-stone-400">-</span>
                                  <span className="text-stone-600">
                                    {Number(item.tare_weight).toLocaleString('id-ID')}
                                  </span>
                                  <span className="text-stone-400">=</span>
                                  <span className="text-emerald-900 font-extrabold text-sm bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                                    {Number(item.net_weight).toLocaleString('id-ID')} kg
                                  </span>
                                </div>
                              </div>

                              {/* Kolom Kanan: Jam Tiba/Berangkat, Jenis Biomassa, Catatan (basah), dan Aksi */}
                              <div className="flex items-center gap-2.5 flex-wrap self-end md:self-center">
                                {/* Jam Tiba & Jam Berangkat */}
                                {(item.arrival_time || item.departure_time) && (
                                  <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono text-[11px] border border-stone-200"
                                    title="Jam Tiba & Jam Berangkat"
                                  >
                                    <Clock className="w-3 h-3 text-emerald-800" />
                                    <span>{item.arrival_time || '--:--'} - {item.departure_time || '--:--'}</span>
                                  </span>
                                )}

                                {/* Pilihan Jenis Biomassa (Aren, dll) */}
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                                  <Tag className="w-3 h-3" />
                                  <span>{item.biomass_type || 'Aren'}</span>
                                </span>

                                {/* Kondisi basah atau catatan */}
                                {isWet && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
                                    ( basah )
                                  </span>
                                )}

                                {item.notes && !isWet && (
                                  <span className="text-stone-500 italic text-[11px]">
                                    {item.notes}
                                  </span>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 ml-2 border-l border-stone-200 pl-2">
                                  <button
                                    onClick={() => onEditBiomass(item)}
                                    className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors"
                                    title="Edit data timbang ini"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingEntry(item)}
                                    className="p-1 text-rose-600 hover:bg-rose-100 rounded-md transition-colors"
                                    title="Hapus data timbang ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW 2: REKAPITULASI PER KELOMPOK / STOKPILE */}
      {viewMode === 'partners_summary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">
              Rekapitulasi Total Pasokan per Kelompok / Lokasi Stokpile
            </h3>
            <button
              onClick={() => {
                setMasterManagerTab('partners');
                setShowMasterManager(true);
              }}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Ubah / Tambah Kelompok Mitra</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partnerSummaries.map((p) => (
              <div
                key={p.partnerName}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                      Kelompok / Fasilitas
                    </span>
                    <h4 className="text-lg font-bold text-stone-900">
                      {p.partnerName}
                    </h4>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
                      {p.count} Ritase Truk Terdata
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-xs text-center">
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-400 block text-[10px] font-bold">Kotor (Gross)</span>
                    <span className="font-mono font-bold text-stone-800">
                      {p.totalGross.toLocaleString('id-ID')} Kg
                    </span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-400 block text-[10px] font-bold">Kosong (Tara)</span>
                    <span className="font-mono font-bold text-stone-800">
                      {p.totalTare.toLocaleString('id-ID')} Kg
                    </span>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-emerald-800 block text-[10px] font-bold">Netto Bersih</span>
                    <span className="font-mono font-extrabold text-emerald-900">
                      {p.totalNet.toLocaleString('id-ID')} Kg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: TABEL LOG DETAIL LENGKAP */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3.5">No Transaksi</th>
                  <th className="px-4 py-3.5">Tanggal</th>
                  <th className="px-4 py-3.5">Kelompok / Stokpile</th>
                  <th className="px-4 py-3.5">Jenis Biomassa</th>
                  <th className="px-4 py-3.5">No Polisi Truk</th>
                  <th className="px-4 py-3.5">Jam Tiba</th>
                  <th className="px-4 py-3.5">Jam Berangkat</th>
                  <th className="px-4 py-3.5 text-right">Berat Kotor</th>
                  <th className="px-4 py-3.5 text-right">Berat Kosong</th>
                  <th className="px-4 py-3.5 text-right">Netto</th>
                  <th className="px-4 py-3.5">Kondisi / Catatan</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-5 py-10 text-center text-stone-400">
                      Tidak ada data log biomassa yang cocok dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  paginatedEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-stone-900">
                        {entry.transaction_no}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-stone-800">
                          {entry.day}, {entry.date}
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {entry.shift}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-stone-800">
                        {entry.group_category || '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                          {entry.biomass_type || 'Aren'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {entry.vehicle_plate}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-stone-700">
                        <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-stone-200">
                          <Clock className="w-3 h-3 text-emerald-800" />
                          {entry.arrival_time || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-stone-700">
                        <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-stone-200">
                          <Clock className="w-3 h-3 text-stone-500" />
                          {entry.departure_time || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-stone-600">
                        {entry.gross_weight.toLocaleString('id-ID')} Kg
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-stone-600">
                        {entry.tare_weight.toLocaleString('id-ID')} Kg
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-900 bg-emerald-50/40">
                        {entry.net_weight.toLocaleString('id-ID')} Kg
                      </td>
                      <td className="px-4 py-3.5">
                        {entry.condition === 'basah' || entry.notes?.toLowerCase().includes('basah') ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                            basah
                          </span>
                        ) : (
                          <span className="text-stone-500 text-[11px]">{entry.notes || '-'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => onEditBiomass(entry)}
                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Edit data"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingEntry(entry)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Hapus data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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

      {/* Confirm Delete Modal */}
      {deletingEntry && (
        <ConfirmDeleteModal
          isOpen={!!deletingEntry}
          title="Hapus Data Penimbangan Biomassa"
          message={`Apakah Anda yakin ingin menghapus data timbang ${deletingEntry.vehicle_plate} pada ${deletingEntry.day}, ${deletingEntry.date} (${deletingEntry.group_category} - Netto: ${deletingEntry.net_weight.toLocaleString('id-ID')} Kg)?`}
          onConfirm={() => {
            deleteBiomassEntry(deletingEntry.id);
            setDeletingEntry(null);
          }}
          onCancel={() => setDeletingEntry(null)}
        />
      )}

      {/* Master Manager Modal for Kelompok Mitra & Pilihan Jenis Biomassa */}
      {showMasterManager && (
        <BiomassMasterManagerModal
          initialTab={masterManagerTab}
          onClose={() => setShowMasterManager(false)}
        />
      )}
    </div>
  );
};
