import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Utilization } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { Pagination } from '../common/Pagination';
import { formatRupiah } from '../../utils/dateUtils';
import { Plus, Search } from 'lucide-react';

interface AdminUtilizationViewProps {
  onAddUtilization: () => void;
  onEditUtilization: (utilization: Utilization) => void;
}

export const AdminUtilizationView: React.FC<AdminUtilizationViewProps> = ({
  onAddUtilization,
  onEditUtilization,
}) => {
  const {
    utilizations,
    programs,
    rws,
    deleteUtilization,
    getProgramName,
    getRWName,
    isStaff,
    userProgramId,
    userProgramName,
  } = useApp();

  const [filterProgram, setFilterProgram] = useState<string>(
    isStaff && userProgramId ? userProgramId : 'all'
  );
  const [filterRW, setFilterRW] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [deletingUtil, setDeletingUtil] = useState<Utilization | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterProgram, filterRW, search]);

  const effectiveProgramFilter = isStaff && userProgramId ? userProgramId : filterProgram;

  const filtered = utilizations.filter((u) => {
    if (isStaff && userProgramId && u.program_id !== userProgramId) return false;
    if (effectiveProgramFilter !== 'all' && u.program_id !== effectiveProgramFilter) return false;
    if (filterRW !== 'all' && u.rw_id !== filterRW) return false;
    if (search) {
      const q = search.toLowerCase();
      const progName = getProgramName(u.program_id).toLowerCase();
      const type = u.type.toLowerCase();
      const desc = (u.description || '').toLowerCase();
      const recipient = (u.recipient || '').toLowerCase();
      if (!progName.includes(q) && !type.includes(q) && !desc.includes(q) && !recipient.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleDeleteConfirm = () => {
    if (deletingUtil) {
      deleteUtilization(deletingUtil.id);
      setDeletingUtil(null);
    }
  };

  const totalAmount = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Data Pemanfaatan</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Penyaluran dana bersama untuk sosial, lingkungan, dan kemaslahatan warga
          </p>
        </div>

        <button
          onClick={onAddUtilization}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pemanfaatan</span>
        </button>
      </div>

      {/* Filter and Summary */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <select
              value={effectiveProgramFilter}
              onChange={(e) => setFilterProgram(e.target.value)}
              disabled={isStaff && !!userProgramId}
              className={`px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 ${
                isStaff && !!userProgramId ? 'bg-stone-100 text-stone-600 cursor-not-allowed' : ''
              }`}
            >
              {!isStaff && <option value="all">Semua Program</option>}
              {programs
                .filter((p) => (isStaff && userProgramId ? p.id === userProgramId : true))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <select
              value={filterRW}
              onChange={(e) => setFilterRW(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua RW</option>
              {rws.map((r) => (
                <option key={r.id} value={r.id}>
                  RW {r.number}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari keterangan penerima..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="text-xs text-stone-600">
          Total Penyaluran: <strong className="text-emerald-800">{formatRupiah(totalAmount)}</strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">RW</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4 text-right">Jumlah</th>
                <th className="py-3 px-4 max-w-xs">Keterangan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {paginated.map((item, index) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 text-center text-xs text-stone-400 font-medium">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-stone-700 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {getProgramName(item.program_id)}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-stone-800">
                    {getRWName(item.rw_id)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-stone-900">
                    {formatRupiah(item.amount)}
                  </td>
                  <td className="py-3 px-4 text-xs text-stone-600 max-w-xs line-clamp-2">
                    {item.description || '-'}
                    {item.recipient && (
                      <span className="block text-[11px] text-stone-400 font-normal">
                        Penerima: {item.recipient}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onEditUtilization(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingUtil(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-stone-400">
                    Tidak ada data pemanfaatan yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingUtil}
        title="Hapus data ini?"
        message="Data yang sudah dihapus tidak dapat dikembalikan."
        itemDescription={
          deletingUtil
            ? `${deletingUtil.date} - ${deletingUtil.type} (${formatRupiah(deletingUtil.amount)})`
            : undefined
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingUtil(null)}
      />
    </div>
  );
};
