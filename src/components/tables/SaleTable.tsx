import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../types';
import { formatIndonesianDate, formatRupiah, formatWeight } from '../../utils/dateUtils';
import { downloadCSV, downloadExcel, printFormattedReport } from '../../utils/exportUtils';
import { TransactionDetailModal } from './TransactionDetailModal';
import { Pagination } from '../common/Pagination';
import {
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Plus,
  ArrowUpDown,
  Inbox,
  Search,
} from 'lucide-react';

interface SaleTableProps {
  onOpenAddModal?: () => void;
  onOpenEditModal?: (sale: Sale) => void;
}

export const SaleTable: React.FC<SaleTableProps> = ({
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const { filteredSales, deleteSale, isAdmin, getProgramName, filters } = useApp();

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sortField, setSortField] = useState<'date' | 'total' | 'weight' | 'no'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Real-time search by material category, buyer, transaction_no, notes, program
  const searchedSales = useMemo(() => {
    if (!searchQuery.trim()) return filteredSales;
    const q = searchQuery.toLowerCase().trim();
    return filteredSales.filter((s) => {
      const item = (s.item_type || '').toLowerCase();
      const buyer = (s.buyer || '').toLowerCase();
      const tx = (s.transaction_no || '').toLowerCase();
      const notes = (s.notes || '').toLowerCase();
      const prog = getProgramName(s.program_id).toLowerCase();
      return (
        item.includes(q) ||
        buyer.includes(q) ||
        tx.includes(q) ||
        notes.includes(q) ||
        prog.includes(q)
      );
    });
  }, [filteredSales, searchQuery, getProgramName]);

  // Sorting
  const sortedSales = useMemo(() => {
    return [...searchedSales].sort((a, b) => {
      if (sortField === 'date') {
        const diff = a.date.localeCompare(b.date);
        return sortAsc ? diff : -diff;
      }
      if (sortField === 'total') {
        return sortAsc ? a.total - b.total : b.total - a.total;
      }
      if (sortField === 'weight') {
        return sortAsc ? a.weight - b.weight : b.weight - a.weight;
      }
      if (sortField === 'no') {
        const diff = a.transaction_no.localeCompare(b.transaction_no);
        return sortAsc ? diff : -diff;
      }
      return 0;
    });
  }, [searchedSales, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedSales.length / pageSize) || 1;
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedSales.slice(start, start + pageSize);
  }, [sortedSales, currentPage, pageSize]);

  // Aggregate Metrics: Total berat terjual, Total penjualan, Rata-rata harga per kg
  const summaryMetrics = useMemo(() => {
    const totalWeight = searchedSales.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
    const totalAmount = searchedSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const avgPrice = totalWeight > 0 ? Math.round(totalAmount / totalWeight) : 0;
    return { totalWeight, totalAmount, avgPrice };
  }, [searchedSales]);

  const handleSort = (field: 'date' | 'total' | 'weight' | 'no') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    const data = filteredSales.map((s) => ({
      'No Transaksi': s.transaction_no,
      'Program': getProgramName(s.program_id),
      'Hari': s.day,
      'Tanggal': s.date,
      'Jenis Barang': s.item_type,
      'Berat (Kg)': s.weight,
      'Harga Satuan (Rp)': s.price,
      'Total Penjualan (Rp)': s.total,
      'Pembeli / Mitra': s.buyer || '',
    }));
    downloadCSV(data, `Laporan_Penjualan_KANG_DIKIN_${filters.period}_${Date.now()}`);
  };

  const handleExportExcel = () => {
    const data = filteredSales.map((s) => ({
      'No Transaksi': s.transaction_no,
      'Program': getProgramName(s.program_id),
      'Hari': s.day,
      'Tanggal': s.date,
      'Jenis Barang': s.item_type,
      'Berat (Kg)': s.weight,
      'Harga Satuan (Rp)': s.price,
      'Total Penjualan (Rp)': s.total,
      'Pembeli / Mitra': s.buyer || '',
    }));
    downloadExcel(data, `Laporan_Penjualan_KANG_DIKIN_${filters.period}`);
  };

  const handlePrint = () => {
    const headers = ['No', 'Tanggal', 'Jenis Barang', 'Berat', 'Harga/Kg', 'Jumlah (Total)'];
    const rows = filteredSales.map((s) => [
      s.transaction_no,
      `${s.day}, ${formatIndonesianDate(s.date)}`,
      s.item_type,
      formatWeight(s.weight),
      formatRupiah(s.price),
      formatRupiah(s.total),
    ]);
    printFormattedReport(
      'LAPORAN TRANSAKSI PENJUALAN KOMODITAS & MATERIAL',
      `Total Terjual: ${formatWeight(summaryMetrics.totalWeight)} • Total Penjualan: ${formatRupiah(summaryMetrics.totalAmount)}`,
      headers,
      rows
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden space-y-4">
      {/* Top Banner KPI Rangkuman Penjualan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 bg-stone-50/70 border-b border-stone-200">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Total Berat Terjual</span>
          <div className="text-lg font-black text-stone-900 mt-0.5">
            {formatWeight(summaryMetrics.totalWeight)}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Total Penjualan</span>
          <div className="text-lg font-black text-emerald-800 mt-0.5">
            {formatRupiah(summaryMetrics.totalAmount)}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Rata-Rata Harga</span>
          <div className="text-lg font-black text-stone-800 mt-0.5">
            {formatRupiah(summaryMetrics.avgPrice)} <span className="text-xs font-normal text-stone-500">/ Kg</span>
          </div>
        </div>
      </div>

      {/* Table Action Controls */}
      <div className="px-4 sm:px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">
              Modul Penjualan Komoditas & Material
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {filteredSales.length} Transaksi
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Perhitungan otomatis nilai pemasukan dana program: <strong>Jumlah = Berat × Harga</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Real-time search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kategori material, pembeli..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Export buttons - Khusus Admin */}
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
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                CSV
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

          {isAdmin && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Catat Penjualan
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto border-t border-stone-200">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-100 text-stone-800 font-semibold border-b border-stone-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-4 cursor-pointer hover:bg-stone-200/60 select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  Hari & Tanggal
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('no')}
                className="py-3 px-4 cursor-pointer hover:bg-stone-200/60 select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  No Transaksi
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Program</th>
              <th className="py-3 px-4 whitespace-nowrap">Jenis Barang</th>
              <th
                onClick={() => handleSort('weight')}
                className="py-3 px-4 cursor-pointer hover:bg-stone-200/60 select-none whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  Berat
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Harga/Kg</th>
              <th
                onClick={() => handleSort('total')}
                className="py-3 px-4 cursor-pointer hover:bg-stone-200/60 select-none whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  Jumlah (Total)
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Pembeli</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/80">
            {paginatedSales.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-stone-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-stone-300" />
                    <span className="font-semibold text-sm">Belum ada data penjualan</span>
                    <span className="text-xs text-stone-400 max-w-sm">
                      {searchQuery
                        ? `Tidak ada penjualan yang cocok dengan pencarian "${searchQuery}".`
                        : 'Belum ada laporan penjualan untuk periode atau filter yang Anda pilih.'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-stone-900 whitespace-nowrap">
                    <div>
                      <span className="font-semibold">{sale.day}</span>
                      <span className="block text-[11px] text-stone-500">
                        {formatIndonesianDate(sale.date)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-stone-600 whitespace-nowrap">
                    {sale.transaction_no}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {getProgramName(sale.program_id)}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-800 whitespace-nowrap">
                    {sale.item_type}
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-800 text-right whitespace-nowrap">
                    {formatWeight(sale.weight)}
                  </td>
                  <td className="py-3 px-4 text-stone-600 text-right whitespace-nowrap">
                    {formatRupiah(sale.price)}
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-850 text-right text-sm text-emerald-900 whitespace-nowrap">
                    {formatRupiah(sale.total)}
                  </td>
                  <td className="py-3 px-4 text-stone-500 max-w-xs truncate" title={sale.buyer}>
                    {sale.buyer || '-'}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Lihat Detail Transaksi"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onOpenEditModal && onOpenEditModal(sale)}
                            className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus transaksi penjualan ${sale.transaction_no}?`)) {
                                deleteSale(sale.id);
                              }
                            }}
                            className="p-1.5 text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {/* Footer Total */}
          {filteredSales.length > 0 && (
            <tfoot className="bg-stone-50 border-t-2 border-stone-300 font-bold text-stone-900 text-xs">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right">
                  TOTAL TERSARING:
                </td>
                <td className="py-3 px-4 text-right text-stone-900 font-bold">
                  {formatWeight(summaryMetrics.totalWeight)}
                </td>
                <td className="py-3 px-4 text-right text-stone-500 font-normal">
                  Rata-rata: {formatRupiah(summaryMetrics.avgPrice)}
                </td>
                <td className="py-3 px-4 text-right text-emerald-800 text-sm font-black">
                  {formatRupiah(summaryMetrics.totalAmount)}
                </td>
                <td colSpan={2} className="py-3 px-4 text-stone-500 font-normal">
                  {filteredSales.length} transaksi
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedSales.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 8, 15, 30, 50]}
      />

      {/* Detail Modal */}
      {selectedSale && (
        <TransactionDetailModal
          type="sale"
          data={selectedSale}
          onClose={() => setSelectedSale(null)}
          onEdit={(s) => {
            setSelectedSale(null);
            if (onOpenEditModal) onOpenEditModal(s);
          }}
          onDelete={(id) => {
            deleteSale(id);
            setSelectedSale(null);
          }}
        />
      )}
    </div>
  );
};
