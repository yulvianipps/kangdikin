import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Utilization } from '../../types';
import { formatIndonesianDate, formatRupiah } from '../../utils/dateUtils';
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
} from 'lucide-react';

interface UtilizationTableProps {
  onOpenAddModal?: () => void;
  onOpenEditModal?: (utilization: Utilization) => void;
}

export const UtilizationTable: React.FC<UtilizationTableProps> = ({
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const {
    filteredUtilizations,
    deleteUtilization,
    isAdmin,
    getProgramName,
    getRWName,
    filters,
  } = useApp();

  const [selectedUtil, setSelectedUtil] = useState<Utilization | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sortField, setSortField] = useState<'date' | 'amount' | 'no'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Sorting
  const sortedUtilizations = useMemo(() => {
    return [...filteredUtilizations].sort((a, b) => {
      if (sortField === 'date') {
        const diff = a.date.localeCompare(b.date);
        return sortAsc ? diff : -diff;
      }
      if (sortField === 'amount') {
        return sortAsc ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'no') {
        const diff = a.transaction_no.localeCompare(b.transaction_no);
        return sortAsc ? diff : -diff;
      }
      return 0;
    });
  }, [filteredUtilizations, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedUtilizations.length / pageSize) || 1;
  const paginatedUtilizations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUtilizations.slice(start, start + pageSize);
  }, [sortedUtilizations, currentPage, pageSize]);

  // Total summary
  const totalAmountFiltered = useMemo(() => {
    return filteredUtilizations.reduce((sum, u) => sum + (Number(u.amount) || 0), 0);
  }, [filteredUtilizations]);

  const handleSort = (field: 'date' | 'amount' | 'no') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    const data = filteredUtilizations.map((u) => ({
      'No Transaksi': u.transaction_no,
      'Program': getProgramName(u.program_id),
      'Hari': u.day,
      'Tanggal': u.date,
      'RW Penerima': getRWName(u.rw_id),
      'Jenis Pemanfaatan': u.type,
      'Jumlah (Rp)': u.amount,
      'Deskripsi / Kegiatan': u.description,
      'Penerima Manfaat': u.recipient || '',
    }));
    downloadCSV(data, `Laporan_Pemanfaatan_KANG_DIKIN_${filters.period}_${Date.now()}`);
  };

  const handleExportExcel = () => {
    const data = filteredUtilizations.map((u) => ({
      'No Transaksi': u.transaction_no,
      'Program': getProgramName(u.program_id),
      'Hari': u.day,
      'Tanggal': u.date,
      'RW Penerima': getRWName(u.rw_id),
      'Jenis Pemanfaatan': u.type,
      'Jumlah (Rp)': u.amount,
      'Deskripsi / Kegiatan': u.description,
      'Penerima Manfaat': u.recipient || '',
    }));
    downloadExcel(data, `Laporan_Pemanfaatan_KANG_DIKIN_${filters.period}`);
  };

  const handlePrint = () => {
    const headers = ['No', 'Tanggal', 'RW Penerima', 'Jenis', 'Jumlah (Nilai)', 'Keterangan'];
    const rows = filteredUtilizations.map((u) => [
      u.transaction_no,
      `${u.day}, ${formatIndonesianDate(u.date)}`,
      getRWName(u.rw_id),
      u.type,
      formatRupiah(u.amount),
      u.description,
    ]);
    printFormattedReport(
      'LAPORAN PENYALURAN PEMANFAATAN DANA BERSAMA',
      `Total Tersalurkan: ${formatRupiah(totalAmountFiltered)} untuk ${filteredUtilizations.length} kegiatan masyarakat`,
      headers,
      rows
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">
              Modul Pemanfaatan Dana Bersama
            </h3>
            <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
              {filteredUtilizations.length} Kegiatan
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Penyaluran kembali hasil ekonomi sirkular untuk pembangunan lingkungan & bantuan warga
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Catat Pemanfaatan
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
              <th className="py-3 px-4 whitespace-nowrap">Program</th>
              <th className="py-3 px-4 whitespace-nowrap">RW Penerima</th>
              <th className="py-3 px-4 whitespace-nowrap">Jenis Pemanfaatan</th>
              <th
                onClick={() => handleSort('amount')}
                className="py-3 px-4 cursor-pointer hover:bg-stone-200/60 select-none whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  Jumlah (Nilai)
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Deskripsi Kegiatan</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/80">
            {paginatedUtilizations.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-stone-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-stone-300" />
                    <span className="font-semibold text-sm">Belum ada data pemanfaatan</span>
                    <span className="text-xs text-stone-400 max-w-sm">
                      Belum ada laporan penyaluran pemanfaatan untuk filter yang Anda pilih.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUtilizations.map((item) => (
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
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {getProgramName(item.program_id)}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-800 whitespace-nowrap">
                    {getRWName(item.rw_id)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-teal-900 text-right text-sm whitespace-nowrap">
                    {formatRupiah(item.amount)}
                  </td>
                  <td className="py-3 px-4 text-stone-600 max-w-xs truncate" title={item.description}>
                    {item.description}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedUtil(item)}
                        className="p-1.5 text-stone-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
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
                              if (confirm(`Hapus data pemanfaatan ${item.transaction_no}?`)) {
                                deleteUtilization(item.id);
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
          {filteredUtilizations.length > 0 && (
            <tfoot className="bg-stone-50 border-t-2 border-stone-300 font-bold text-stone-900 text-xs">
              <tr>
                <td colSpan={5} className="py-3 px-4 text-right">
                  TOTAL NILAI PEMANFAATAN TERSARING:
                </td>
                <td className="py-3 px-4 text-right text-teal-900 text-sm font-black">
                  {formatRupiah(totalAmountFiltered)}
                </td>
                <td colSpan={2} className="py-3 px-4 text-stone-500 font-normal">
                  {filteredUtilizations.length} kegiatan tersalurkan
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
        totalItems={sortedUtilizations.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 8, 15, 30, 50]}
      />

      {/* Detail Modal */}
      {selectedUtil && (
        <TransactionDetailModal
          type="utilization"
          data={selectedUtil}
          onClose={() => setSelectedUtil(null)}
          onEdit={(u) => {
            setSelectedUtil(null);
            if (onOpenEditModal) onOpenEditModal(u);
          }}
          onDelete={(id) => {
            deleteUtilization(id);
            setSelectedUtil(null);
          }}
        />
      )}
    </div>
  );
};
