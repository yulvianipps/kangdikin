import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Deposit } from '../../types';
import { formatIndonesianDate, formatWeight } from '../../utils/dateUtils';
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

interface DepositTableProps {
  onOpenAddModal?: () => void;
  onOpenEditModal?: (deposit: Deposit) => void;
}

export const DepositTable: React.FC<DepositTableProps> = ({
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const {
    filteredDeposits,
    deleteDeposit,
    isAdmin,
    getProgramName,
    getRWName,
    getRTName,
    filters,
  } = useApp();

  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sortField, setSortField] = useState<'date' | 'weight' | 'no'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Real-time search across deposits
  const searchedDeposits = useMemo(() => {
    if (!searchQuery.trim()) return filteredDeposits;
    const q = searchQuery.toLowerCase().trim();
    return filteredDeposits.filter((d) => {
      const citizen = (d.citizen_name || '').toLowerCase();
      const tx = (d.transaction_no || '').toLowerCase();
      const notes = (d.notes || '').toLowerCase();
      const prog = getProgramName(d.program_id).toLowerCase();
      const rw = getRWName(d.rw_id).toLowerCase();
      const rt = getRTName(d.rt_id).toLowerCase();
      return (
        citizen.includes(q) ||
        tx.includes(q) ||
        notes.includes(q) ||
        prog.includes(q) ||
        rw.includes(q) ||
        rt.includes(q)
      );
    });
  }, [filteredDeposits, searchQuery, getProgramName, getRWName, getRTName]);

  // Sorting
  const sortedDeposits = useMemo(() => {
    return [...searchedDeposits].sort((a, b) => {
      if (sortField === 'date') {
        const diff = a.date.localeCompare(b.date);
        return sortAsc ? diff : -diff;
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
  }, [searchedDeposits, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedDeposits.length / pageSize) || 1;
  const paginatedDeposits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDeposits.slice(start, start + pageSize);
  }, [sortedDeposits, currentPage, pageSize]);

  // Summary row
  const totalWeightFiltered = useMemo(() => {
    return searchedDeposits.reduce((sum, d) => sum + (Number(d.weight) || 0), 0);
  }, [searchedDeposits]);

  const handleSort = (field: 'date' | 'weight' | 'no') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    const data = searchedDeposits.map((d) => ({
      'No Transaksi': d.transaction_no,
      'Warga / Penyetor': d.citizen_name || '-',
      'Program': getProgramName(d.program_id),
      'Hari': d.day,
      'Tanggal': d.date,
      'RW': getRWName(d.rw_id),
      'RT': getRTName(d.rt_id),
      'Berat (Kg)': d.weight,
      'Catatan': d.notes || '',
    }));
    downloadCSV(data, `Laporan_Setoran_KANG_DIKIN_${filters.period}_${Date.now()}`);
  };

  const handleExportExcel = () => {
    const data = searchedDeposits.map((d) => ({
      'No Transaksi': d.transaction_no,
      'Warga / Penyetor': d.citizen_name || '-',
      'Program': getProgramName(d.program_id),
      'Hari': d.day,
      'Tanggal': d.date,
      'RW': getRWName(d.rw_id),
      'RT': getRTName(d.rt_id),
      'Berat (Kg)': d.weight,
      'Catatan': d.notes || '',
    }));
    downloadExcel(data, `Laporan_Setoran_KANG_DIKIN_${filters.period}`);
  };

  const handlePrint = () => {
    const headers = ['No', 'Hari/Tanggal', 'Warga / Penyetor', 'Program', 'RW/RT', 'Berat (Kg)', 'Keterangan'];
    const rows = searchedDeposits.map((d) => [
      d.transaction_no,
      `${d.day}, ${formatIndonesianDate(d.date)}`,
      d.citizen_name || '-',
      getProgramName(d.program_id),
      `${getRWName(d.rw_id)} / ${getRTName(d.rt_id)}`,
      formatWeight(d.weight),
      d.notes || '-',
    ]);
    printFormattedReport(
      'LAPORAN TRANSAKSI SETORAN MASYARAKAT',
      `Rekapitulasi ${searchedDeposits.length} setoran terkumpul, total: ${formatWeight(totalWeightFiltered)}`,
      headers,
      rows
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-stone-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">
              Modul Setoran Masyarakat
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {searchedDeposits.length} Data
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Pencatatan setoran material pilah dari warga per RW dan RT
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Real-time search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama warga, No. STR..."
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
                title="Download format Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                Excel
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                title="Download format CSV"
              >
                CSV
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                title="Cetak Laporan"
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
              Catat Setoran Baru
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
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
              <th className="py-3 px-4 whitespace-nowrap">Warga / Penyetor</th>
              <th className="py-3 px-4 whitespace-nowrap">Program</th>
              <th className="py-3 px-4 whitespace-nowrap">RW</th>
              <th className="py-3 px-4 whitespace-nowrap">RT</th>
              <th
                onClick={() => handleSort('weight')}
                className="py-3 px-4 cursor-pointer hover:bg-stone-200/60 select-none whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  Berat
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Catatan</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/80">
            {paginatedDeposits.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-stone-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-stone-300" />
                    <span className="font-semibold text-sm">Belum ada data setoran</span>
                    <span className="text-xs text-stone-400 max-w-sm">
                      {searchQuery
                        ? `Tidak ada setoran yang cocok dengan pencarian "${searchQuery}".`
                        : 'Belum ada laporan setoran untuk periode atau filter yang Anda pilih.'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedDeposits.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-stone-900 whitespace-nowrap">
                    <div>
                      <span className="font-semibold">{item.day}</span>
                      <span className="block text-[11px] text-stone-500">
                        {formatIndonesianDate(item.date)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-stone-600 whitespace-nowrap">
                    {item.transaction_no}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900 whitespace-nowrap">
                    {item.citizen_name || <span className="text-stone-400 font-normal italic">Warga Setempat</span>}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {getProgramName(item.program_id)}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-800 whitespace-nowrap">
                    {getRWName(item.rw_id)}
                  </td>
                  <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                    {getRTName(item.rt_id)}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-900 text-right whitespace-nowrap">
                    {formatWeight(item.weight)}
                  </td>
                  <td className="py-3 px-4 text-stone-500 max-w-xs truncate" title={item.notes}>
                    {item.notes || '-'}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedDeposit(item)}
                        className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Lihat Detail Transaksi"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onOpenEditModal && onOpenEditModal(item)}
                            className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus setoran ${item.transaction_no}?`)) {
                                deleteDeposit(item.id);
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
          {/* Summary Row */}
          {filteredDeposits.length > 0 && (
            <tfoot className="bg-stone-50 border-t-2 border-stone-300 font-bold text-stone-900 text-xs">
              <tr>
                <td colSpan={5} className="py-3 px-4 text-right">
                  TOTAL BERAT SETORAN TERSARING:
                </td>
                <td className="py-3 px-4 text-right text-emerald-800 text-sm font-black">
                  {formatWeight(totalWeightFiltered)}
                </td>
                <td colSpan={2} className="py-3 px-4 text-stone-500 font-normal">
                  {filteredDeposits.length} transaksi
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
        totalItems={sortedDeposits.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 8, 15, 30, 50]}
      />

      {/* Detail Modal */}
      {selectedDeposit && (
        <TransactionDetailModal
          type="deposit"
          data={selectedDeposit}
          onClose={() => setSelectedDeposit(null)}
          onEdit={(dep) => {
            setSelectedDeposit(null);
            if (onOpenEditModal) onOpenEditModal(dep);
          }}
          onDelete={(id) => {
            deleteDeposit(id);
            setSelectedDeposit(null);
          }}
        />
      )}
    </div>
  );
};
