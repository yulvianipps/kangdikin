import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndonesianDate, formatRupiah, formatWeight } from '../../utils/dateUtils';
import { downloadExcel, printFormattedReport } from '../../utils/exportUtils';
import { Printer, FileSpreadsheet } from 'lucide-react';

export const PeriodReportSection: React.FC = () => {
  const { deposits, sales, utilizations, isAdmin } = useApp();
  const [reportType, setReportType] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  // Group by Month (YYYY-MM)
  const monthlyData = useMemo(() => {
    const months = Array.from(
      new Set([
        ...deposits.map((d) => d.date.slice(0, 7)),
        ...sales.map((s) => s.date.slice(0, 7)),
        ...utilizations.map((u) => u.date.slice(0, 7)),
      ])
    ).sort().reverse();

    return months.map((monthKey) => {
      const mDeposits = deposits.filter((d) => d.date.startsWith(monthKey));
      const mSales = sales.filter((s) => s.date.startsWith(monthKey));
      const mUtils = utilizations.filter((u) => u.date.startsWith(monthKey));

      const totalWeight = mDeposits.reduce((sum, d) => sum + (Number(d.weight) || 0), 0);
      const totalSales = mSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
      const totalUtil = mUtils.reduce((sum, u) => sum + (Number(u.amount) || 0), 0);
      const balance = totalSales - totalUtil;

      const [y, m] = monthKey.split('-');
      const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const label = `${monthNames[parseInt(m, 10)]} ${y}`;

      return {
        key: monthKey,
        label,
        weight: totalWeight,
        sales: totalSales,
        util: totalUtil,
        balance,
        depositsCount: mDeposits.length,
        salesCount: mSales.length,
        utilsCount: mUtils.length,
      };
    });
  }, [deposits, sales, utilizations]);

  // Group by Year
  const yearlyData = useMemo(() => {
    const years = Array.from(
      new Set([
        ...deposits.map((d) => d.date.slice(0, 4)),
        ...sales.map((s) => s.date.slice(0, 4)),
        ...utilizations.map((u) => u.date.slice(0, 4)),
      ])
    ).sort().reverse();

    return years.map((yearKey) => {
      const yDeposits = deposits.filter((d) => d.date.startsWith(yearKey));
      const ySales = sales.filter((s) => s.date.startsWith(yearKey));
      const yUtils = utilizations.filter((u) => u.date.startsWith(yearKey));

      const totalWeight = yDeposits.reduce((sum, d) => sum + (Number(d.weight) || 0), 0);
      const totalSales = ySales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
      const totalUtil = yUtils.reduce((sum, u) => sum + (Number(u.amount) || 0), 0);
      const balance = totalSales - totalUtil;

      return {
        key: yearKey,
        label: `Tahun ${yearKey}`,
        weight: totalWeight,
        sales: totalSales,
        util: totalUtil,
        balance,
        depositsCount: yDeposits.length,
        salesCount: ySales.length,
        utilsCount: yUtils.length,
      };
    });
  }, [deposits, sales, utilizations]);

  // Active data based on switcher
  const activeReportRows = reportType === 'yearly' ? yearlyData : monthlyData;

  const handleExportExcel = () => {
    const data = activeReportRows.map((row) => ({
      Periode: row.label,
      'Total Setoran (Kg)': row.weight,
      'Transaksi Setoran': row.depositsCount,
      'Total Penjualan (Rp)': row.sales,
      'Transaksi Penjualan': row.salesCount,
      'Total Pemanfaatan (Rp)': row.util,
      'Kegiatan Pemanfaatan': row.utilsCount,
      'Sisa Dana / Saldo Kas (Rp)': row.balance,
    }));
    downloadExcel(data, `Rekap_Keuangan_KANG_DIKIN_${reportType}`);
  };

  const handlePrint = () => {
    const headers = ['Periode', 'Setoran (Kg)', 'Penjualan (Rp)', 'Pemanfaatan (Rp)', 'Sisa Saldo Kas (Rp)'];
    const rows = activeReportRows.map((r) => [
      r.label,
      formatWeight(r.weight),
      formatRupiah(r.sales),
      formatRupiah(r.util),
      formatRupiah(r.balance),
    ]);
    printFormattedReport(
      `REKAPITULASI DANA BERSAMA KANG DIKIN (${reportType.toUpperCase()})`,
      `Laporan Keuangan & Akumulasi Material Program Terintegrasi`,
      headers,
      rows
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">
            Rekapitulasi Berkala & Neraca Dana Bersama
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Laporan agregasi setoran, penjualan, pemanfaatan, serta sisa saldo kas program
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setReportType('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reportType === 'monthly'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setReportType('yearly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reportType === 'yearly'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tahunan
            </button>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                Excel
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                Print
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards Table Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeReportRows.map((item) => (
          <div
            key={item.key}
            className="p-5 rounded-2xl border border-stone-200/90 bg-stone-50/40 hover:bg-white hover:border-emerald-300 transition-all shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">{item.label}</h4>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">
                {item.depositsCount} Setoran • {item.salesCount} Penjualan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Total Setoran */}
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 font-semibold block">
                  Total Setoran
                </span>
                <span className="text-base font-extrabold text-stone-900 mt-1 block">
                  {formatWeight(item.weight)}
                </span>
              </div>

              {/* Total Penjualan */}
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-[11px] text-emerald-800 font-semibold block">
                  Total Penjualan
                </span>
                <span className="text-base font-extrabold text-emerald-900 mt-1 block">
                  {formatRupiah(item.sales)}
                </span>
              </div>

              {/* Total Pemanfaatan */}
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-[11px] text-teal-800 font-semibold block">
                  Total Pemanfaatan
                </span>
                <span className="text-base font-extrabold text-teal-900 mt-1 block">
                  {formatRupiah(item.util)}
                </span>
              </div>

              {/* Sisa Dana / Saldo */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[11px] text-emerald-900 font-bold block">
                  Sisa Saldo Kas
                </span>
                <span className="text-base font-black text-emerald-950 mt-1 block">
                  {formatRupiah(item.balance)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 text-right">
              {item.utilsCount} kegiatan pemanfaatan disalurkan ke warga
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
