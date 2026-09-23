import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatWeight } from '../../utils/dateUtils';

export const StatCards: React.FC = () => {
  const {
    totalDepositsWeight,
    totalDepositsCount,
    totalSalesAmount,
    totalSalesWeight,
    totalUtilizationsAmount,
    filteredUtilizations,
    danaBersamaBalance,
    rws,
    programs,
    filters,
    getProgramName,
    getRWName,
  } = useApp();

  const activeRWsCount = rws.filter((r) => r.status === 'active').length;
  const activeProgramsCount = programs.filter((p) => p.is_active).length;

  return (
    <div className="space-y-3">
      {/* Current Filter Indicator Banner */}
      <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 px-1">
        <div>
          Menampilkan statistik untuk:{' '}
          <strong className="text-stone-800">
            {filters.programId === 'all' ? 'Seluruh Program KANG DIKIN' : getProgramName(filters.programId)}
          </strong>
          {filters.rwId !== 'all' && (
            <span>
              {' '}
              • <strong className="text-stone-800">{getRWName(filters.rwId)}</strong>
            </span>
          )}
        </div>
        <div className="text-stone-400">
          * Diperbarui secara otomatis berdasarkan filter aktif
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: TOTAL SETORAN */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs hover:border-emerald-300 transition-all">
          <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase block">
            Total Setoran
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {formatWeight(totalDepositsWeight)}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              <span className="font-semibold text-emerald-700">{totalDepositsCount}</span> transaksi warga
            </div>
          </div>
        </div>

        {/* Card 2: TOTAL PENJUALAN */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs hover:border-emerald-300 transition-all">
          <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase block">
            Total Penjualan
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
              {formatRupiah(totalSalesAmount)}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              <span className="font-semibold text-stone-700">{formatWeight(totalSalesWeight)}</span> material terjual
            </div>
          </div>
        </div>

        {/* Card 3: TOTAL PEMANFAATAN */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs hover:border-teal-300 transition-all">
          <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase block">
            Total Pemanfaatan
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-teal-900 tracking-tight">
              {formatRupiah(totalUtilizationsAmount)}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              <span className="font-semibold text-teal-700">{filteredUtilizations.length}</span> kegiatan masyarakat
            </div>
          </div>
        </div>

        {/* Card 4: SALDO DANA BERSAMA */}
        <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-sm border border-stone-800">
          <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase block">
            Dana Bersama
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {formatRupiah(danaBersamaBalance)}
            </div>
            <div className="text-xs text-stone-300 mt-0.5">
              Saldo kas tersimpan sirkular
            </div>
          </div>
        </div>

        {/* Card 5: JUMLAH RW */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs hover:border-stone-400 transition-all">
          <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase block">
            Jumlah RW
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {activeRWsCount} RW
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Wilayah binaan aktif
            </div>
          </div>
        </div>

        {/* Card 6: JUMLAH PROGRAM */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs hover:border-stone-400 transition-all">
          <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase block">
            Program KANG DIKIN
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {activeProgramsCount} Program
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Bank Sampah, Aren, Kayu, dll.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
