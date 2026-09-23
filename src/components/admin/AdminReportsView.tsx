import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/dateUtils';
import { Pagination } from '../common/Pagination';
import { Download, FileSpreadsheet, Calendar, MapPin, TrendingUp, DollarSign } from 'lucide-react';

interface AdminReportsViewProps {
  initialSubTab?: 'finance' | 'rw' | 'period' | 'export';
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({
  initialSubTab = 'finance',
}) => {
  const {
    deposits,
    sales,
    utilizations,
    programs,
    rws,
    rts,
    totalSalesAmount,
    totalUtilizationsAmount,
    danaBersamaBalance,
    rwSummaries,
    getProgramName,
    getRWName,
    getRTName,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'finance' | 'rw' | 'period' | 'export'>(initialSubTab);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [rwSummaryPage, setRwSummaryPage] = useState(1);
  const [rwSummaryPageSize, setRwSummaryPageSize] = useState(10);

  const totalRwSummaryPages = Math.ceil(rwSummaries.length / rwSummaryPageSize) || 1;
  const paginatedRwSummaries = rwSummaries.slice(
    (rwSummaryPage - 1) * rwSummaryPageSize,
    rwSummaryPage * rwSummaryPageSize
  );

  // Export functions to CSV
  const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportDeposits = () => {
    const headers = ['No', 'Tanggal', 'Program', 'RW', 'RT', 'Berat (Kg)', 'Catatan'];
    const rows = deposits.map((d, i) => [
      i + 1,
      d.date,
      getProgramName(d.program_id),
      getRWName(d.rw_id),
      getRTName(d.rt_id),
      d.weight,
      d.notes || '',
    ]);
    exportToCSV('Laporan_Setoran_KANG_DIKIN', headers, rows);
  };

  const handleExportSales = () => {
    const headers = ['No', 'Tanggal', 'Program', 'Jenis Barang', 'Berat (Kg)', 'Harga Satuan (Rp)', 'Total (Rp)', 'Pembeli'];
    const rows = sales.map((s, i) => [
      i + 1,
      s.date,
      getProgramName(s.program_id),
      s.item_type,
      s.weight,
      s.price,
      s.total,
      s.buyer || '',
    ]);
    exportToCSV('Laporan_Penjualan_KANG_DIKIN', headers, rows);
  };

  const handleExportUtilizations = () => {
    const headers = ['No', 'Tanggal', 'Program', 'RW', 'Jenis Pemanfaatan', 'Jumlah (Rp)', 'Penerima', 'Keterangan'];
    const rows = utilizations.map((u, i) => [
      i + 1,
      u.date,
      getProgramName(u.program_id),
      getRWName(u.rw_id),
      u.type,
      u.amount,
      u.recipient || '',
      u.description || '',
    ]);
    exportToCSV('Laporan_Pemanfaatan_KANG_DIKIN', headers, rows);
  };

  const handleExportRWSummary = () => {
    const headers = ['No', 'RW', 'Nama Wilayah', 'Total Setoran (Kg)', 'Frekuensi Setoran', 'Pemanfaatan Diterima (Rp)'];
    const rows = rwSummaries.map((r, i) => [
      i + 1,
      `RW ${r.rwNumber}`,
      r.rwName,
      r.totalWeightKg,
      r.totalDepositsCount,
      r.totalUtilizationAmount,
    ]);
    exportToCSV('Rekap_RW_KANG_DIKIN', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Laporan & Rekapitulasi</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Laporan transparansi keuangan, neraca saldo, rekap kewilayahan, dan pusat unduh data
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'finance'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Buku Kas & Saldo
          </button>
          <button
            onClick={() => setActiveTab('rw')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'rw'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rekap RW & RT
          </button>
          <button
            onClick={() => setActiveTab('period')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'period'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rekap Periode
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'export'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Unduh (Export)
          </button>
        </div>
      </div>

      {/* 1. FINANCIAL / KAS SUMMARY */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs font-semibold text-stone-500 mb-1">Total Pemasukan (Penjualan)</div>
              <div className="text-2xl font-bold text-emerald-800">
                {formatRupiah(totalSalesAmount)}
              </div>
              <div className="text-xs text-stone-400 mt-1">Dari {sales.length} transaksi komoditas</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs font-semibold text-stone-500 mb-1">Total Pengeluaran (Pemanfaatan)</div>
              <div className="text-2xl font-bold text-amber-800">
                {formatRupiah(totalUtilizationsAmount)}
              </div>
              <div className="text-xs text-stone-400 mt-1">Disalurkan untuk warga & kegiatan</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-xs bg-emerald-50/20">
              <div className="text-xs font-semibold text-emerald-900 mb-1">Saldo Kas Dana Bersama</div>
              <div className="text-2xl font-black text-emerald-900">
                {formatRupiah(danaBersamaBalance)}
              </div>
              <div className="text-xs text-emerald-700 mt-1">Status: Siap dialokasikan</div>
            </div>
          </div>

          {/* Program-based balance table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">Buku Kas Berdasarkan Program</h3>
              <p className="text-xs text-stone-500">Rincian pemasukan dan penyaluran tiap inisiatif</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                    <th className="py-3 px-4">Program</th>
                    <th className="py-3 px-4 text-right">Pemasukan (Penjualan)</th>
                    <th className="py-3 px-4 text-right">Penyaluran (Pemanfaatan)</th>
                    <th className="py-3 px-4 text-right">Sisa Kas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {programs.map((p) => {
                    const inc = sales
                      .filter((s) => s.program_id === p.id)
                      .reduce((acc, curr) => acc + curr.total, 0);
                    const exp = utilizations
                      .filter((u) => u.program_id === p.id)
                      .reduce((acc, curr) => acc + curr.amount, 0);
                    const bal = inc - exp;

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900">{p.name}</td>
                        <td className="py-3.5 px-4 text-right font-medium text-stone-900">
                          {formatRupiah(inc)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-stone-900">
                          {formatRupiah(exp)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-800">
                          {formatRupiah(bal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. RW SUMMARY */}
      {activeTab === 'rw' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Rekapitulasi Capaian Per RW</h3>
              <p className="text-xs text-stone-500">
                Peringkat dan kontribusi setoran serta pemanfaatan dana tiap RW
              </p>
            </div>
            <button
              onClick={handleExportRWSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Rekap RW (CSV)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Wilayah RW</th>
                  <th className="py-3 px-4">Nama Wilayah</th>
                  <th className="py-3 px-4 text-right">Total Setoran</th>
                  <th className="py-3 px-4 text-center">Frekuensi Setoran</th>
                  <th className="py-3 px-4 text-right">Pemanfaatan Diterima</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {paginatedRwSummaries.map((rw, index) => (
                  <tr key={rw.rwId} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-center text-xs text-stone-400 font-medium">
                      {(rwSummaryPage - 1) * rwSummaryPageSize + index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      RW {rw.rwNumber}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-stone-700">
                      {rw.rwName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                      {rw.totalWeightKg.toLocaleString('id-ID')} Kg
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-stone-700">
                      {rw.totalDepositsCount} Kali
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-emerald-800">
                      {formatRupiah(rw.totalUtilizationAmount)}
                    </td>
                  </tr>
                ))}
                {rwSummaries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-stone-400">
                      Belum ada data rekap RW.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* RW Summary Pagination */}
          <Pagination
            currentPage={rwSummaryPage}
            totalPages={totalRwSummaryPages}
            totalItems={rwSummaries.length}
            pageSize={rwSummaryPageSize}
            onPageChange={setRwSummaryPage}
            onPageSizeChange={setRwSummaryPageSize}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* 3. PERIODIC RECAP */}
      {activeTab === 'period' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900">Rekapitulasi Berdasarkan Periode</h3>
            <p className="text-xs text-stone-500">
              Analisis tren bulanan setoran dan aktivitas penjualan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                Capaian Bulan Berjalan (Maret 2026)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-200">
                  <span className="text-stone-500">Volume Setoran</span>
                  <strong className="text-stone-900">1.450 Kg</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-200">
                  <span className="text-stone-500">Hasil Penjualan Komoditas</span>
                  <strong className="text-emerald-800">Rp4.600.000</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500">Pemanfaatan Disalurkan</span>
                  <strong className="text-amber-800">Rp1.850.000</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                Capaian Bulan Sebelumnya (Februari 2026)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-200">
                  <span className="text-stone-500">Volume Setoran</span>
                  <strong className="text-stone-900">1.280 Kg</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-200">
                  <span className="text-stone-500">Hasil Penjualan Komoditas</span>
                  <strong className="text-emerald-800">Rp3.950.000</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500">Pemanfaatan Disalurkan</span>
                  <strong className="text-amber-800">Rp1.500.000</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. EXPORT CENTER */}
      {activeTab === 'export' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900">Pusat Ekspor & Unduh Data</h3>
            <p className="text-xs text-stone-500">
              Unduh data mentah transaksi ke format spreadsheet CSV yang kompatibel dengan Microsoft Excel dan Google Sheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-stone-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Buku Setoran Material</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {deposits.length} catatan setoran per RT/RW
                </p>
              </div>
              <button
                onClick={handleExportDeposits}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>

            <div className="p-5 border border-stone-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Buku Penjualan Komoditas</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {sales.length} transaksi penjualan hasil pilah & panen
                </p>
              </div>
              <button
                onClick={handleExportSales}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>

            <div className="p-5 border border-stone-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Buku Penyaluran Pemanfaatan</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {utilizations.length} data penyaluran sosial, santunan & lingkungan
                </p>
              </div>
              <button
                onClick={handleExportUtilizations}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>

            <div className="p-5 border border-stone-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Rekapitulasi RW & Dusun</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {rws.length} RW dengan akumulasi kontribusi
                </p>
              </div>
              <button
                onClick={handleExportRWSummary}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
