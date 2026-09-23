import React from 'react';
import { useApp } from '../../context/AppContext';
import { PeriodFilter } from '../../types';
import { Filter, Search, RotateCcw, Calendar, Layers, MapPin } from 'lucide-react';

interface FilterBarProps {
  showItemFilter?: boolean;
  showUtilizationFilter?: boolean;
  compact?: boolean;
  onReset?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  showItemFilter = false,
  showUtilizationFilter = false,
  compact = false,
  onReset,
}) => {
  const {
    programs,
    rws,
    rts,
    filters,
    setFilters,
    resetFilters,
    itemTypes,
    utilizationTypes,
    isAdmin,
  } = useApp();

  // Filter RW selection affects available RTs
  const availableRTs = rts.filter((rt) => {
    if (filters.rwId === 'all') return true;
    return rt.rw_id === filters.rwId;
  });

  const availableItems = itemTypes.filter((item) => {
    if (filters.programId === 'all') return true;
    return item.program_id === filters.programId;
  });

  const activePrograms = programs.filter((p) => p.is_active && (isAdmin || p.is_public));

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      programId: e.target.value,
      itemType: 'all',
    }));
  };

  const handleRWChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      rwId: e.target.value,
      rtId: 'all', // Reset RT on RW change
    }));
  };

  const handlePeriodChange = (period: PeriodFilter) => {
    setFilters((prev) => ({
      ...prev,
      period,
      // If switching away from custom, keep dates or clear
      startDate: period === 'custom' ? prev.startDate : '',
      endDate: period === 'custom' ? prev.endDate : '',
    }));
  };

  const isFiltered =
    filters.programId !== 'all' ||
    filters.rwId !== 'all' ||
    filters.rtId !== 'all' ||
    filters.period !== 'all' ||
    filters.searchQuery.trim() !== '' ||
    (filters.itemType && filters.itemType !== 'all') ||
    (filters.utilizationType && filters.utilizationType !== 'all');

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top row: Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filter Laporan Terintegrasi</span>
          {isFiltered && (
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Aktif
            </span>
          )}
        </div>

        {/* Quick Period Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Semua Waktu' },
            { id: 'today', label: 'Hari Ini' },
            { id: 'this_week', label: 'Minggu Ini' },
            { id: 'this_month', label: 'Bulan Ini' },
            { id: 'this_year', label: 'Tahun Ini' },
            { id: 'custom', label: 'Pilih Tanggal' },
          ].map((tab) => {
            const isActive = filters.period === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handlePeriodChange(tab.id as PeriodFilter)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 text-xs font-semibold ml-1 transition-colors"
              title="Reset seluruh filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Dropdown Program */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Program
          </label>
          <select
            value={filters.programId}
            onChange={handleProgramChange}
            className="w-full bg-stone-50 border border-stone-300/80 rounded-xl px-3 py-2 text-sm text-stone-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
          >
            <option value="all">Semua Program</option>
            {activePrograms.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown RW */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Wilayah RW
          </label>
          <select
            value={filters.rwId}
            onChange={handleRWChange}
            className="w-full bg-stone-50 border border-stone-300/80 rounded-xl px-3 py-2 text-sm text-stone-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
          >
            <option value="all">Semua RW</option>
            {rws.map((rw) => (
              <option key={rw.id} value={rw.id}>
                {rw.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown RT */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Wilayah RT
          </label>
          <select
            value={filters.rtId}
            onChange={(e) => setFilters((prev) => ({ ...prev, rtId: e.target.value }))}
            disabled={filters.rwId === 'all'}
            className="w-full bg-stone-50 border border-stone-300/80 rounded-xl px-3 py-2 text-sm text-stone-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">{filters.rwId === 'all' ? 'Pilih RW Dahulu' : 'Semua RT di RW Terpilih'}</option>
            {availableRTs.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Cari Data
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="No. Transaksi, catatan, jenis..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-stone-50 border border-stone-300/80 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all placeholder:text-stone-400"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Optional Custom Date Range Row */}
      {filters.period === 'custom' && (
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rentang Tanggal Khusus:</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="text-stone-400 font-medium">sampai</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Optional Specific Modul Filters */}
      {(showItemFilter || showUtilizationFilter) && !compact && (
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-4 text-xs">
          {showItemFilter && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-600">Jenis Barang:</span>
              <select
                value={filters.itemType || 'all'}
                onChange={(e) => setFilters((prev) => ({ ...prev, itemType: e.target.value }))}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-stone-800"
              >
                <option value="all">Semua Jenis Barang</option>
                {availableItems.map((it) => (
                  <option key={it.id} value={it.name}>
                    {it.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showUtilizationFilter && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-600">Kategori Pemanfaatan:</span>
              <select
                value={filters.utilizationType || 'all'}
                onChange={(e) => setFilters((prev) => ({ ...prev, utilizationType: e.target.value }))}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-stone-800"
              >
                <option value="all">Semua Kategori</option>
                {utilizationTypes.map((ut) => (
                  <option key={ut.id} value={ut.name}>
                    {ut.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
