import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Deposit } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { DepositReceiptModal } from '../modals/DepositReceiptModal';
import { TransactionDetailModal } from '../modals/TransactionDetailModal';
import { Pagination } from '../common/Pagination';
import { Plus, Search, Filter, Printer, Eye } from 'lucide-react';

interface AdminDepositViewProps {
  programScope?: string;
  onAddDeposit: () => void;
  onEditDeposit: (deposit: Deposit) => void;
}

export const AdminDepositView: React.FC<AdminDepositViewProps> = ({
  programScope,
  onAddDeposit,
  onEditDeposit,
}) => {
  const {
    deposits,
    programs,
    rws,
    rts,
    deleteDeposit,
    getProgramName,
    getRWName,
    getRTName,
    isStaff,
    isSuperAdmin,
    userProgramId,
    userProgramName,
  } = useApp();

  const [filterProgram, setFilterProgram] = useState<string>(
    isStaff && userProgramId ? userProgramId : (programScope || 'all')
  );

  useEffect(() => {
    if (programScope && !isStaff) {
      setFilterProgram(programScope);
    }
  }, [programScope, isStaff]);
  const [filterRW, setFilterRW] = useState<string>('all');
  const [filterRT, setFilterRT] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [deletingDeposit, setDeletingDeposit] = useState<Deposit | null>(null);
  const [receiptDeposit, setReceiptDeposit] = useState<Deposit | null>(null);
  const [detailDeposit, setDetailDeposit] = useState<Deposit | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterProgram, filterRW, filterRT, filterDate, search]);

  // Filter RT options based on selected RW
  const availableRTs = filterRW === 'all' ? rts : rts.filter((rt) => rt.rw_id === filterRW);

  const effectiveProgramFilter = isStaff && userProgramId ? userProgramId : filterProgram;

  const filtered = deposits.filter((d) => {
    if (isStaff && userProgramId && d.program_id !== userProgramId) return false;
    if (effectiveProgramFilter !== 'all' && d.program_id !== effectiveProgramFilter) return false;
    if (filterRW !== 'all' && d.rw_id !== filterRW) return false;
    if (filterRT !== 'all' && d.rt_id !== filterRT) return false;
    if (filterDate && d.date !== filterDate) return false;
    if (search) {
      const q = search.toLowerCase();
      const progName = getProgramName(d.program_id).toLowerCase();
      const rwName = getRWName(d.rw_id).toLowerCase();
      const rtName = getRTName(d.rt_id).toLowerCase();
      const citizen = (d.citizen_name || '').toLowerCase();
      const notes = (d.notes || '').toLowerCase();
      const tx = (d.transaction_no || '').toLowerCase();
      if (
        !citizen.includes(q) &&
        !tx.includes(q) &&
        !progName.includes(q) &&
        !rwName.includes(q) &&
        !rtName.includes(q) &&
        !notes.includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleDeleteConfirm = () => {
    if (deletingDeposit) {
      deleteDeposit(deletingDeposit.id);
      setDeletingDeposit(null);
    }
  };

  const totalWeight = filtered.reduce((acc, curr) => acc + curr.weight, 0);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Data Setoran</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Pencatatan setoran material dari warga RT dan RW
          </p>
        </div>

        <button
          onClick={onAddDeposit}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Setoran</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Filter Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Program Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Program {isStaff && <span className="text-amber-700 font-bold">(Terkunci)</span>}
            </label>
            <select
              value={effectiveProgramFilter}
              onChange={(e) => setFilterProgram(e.target.value)}
              disabled={isStaff && !!userProgramId}
              className={`w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 ${
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

          {/* RW Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Wilayah RW
            </label>
            <select
              value={filterRW}
              onChange={(e) => {
                setFilterRW(e.target.value);
                setFilterRT('all');
              }}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua RW</option>
              {rws.map((r) => (
                <option key={r.id} value={r.id}>
                  RW {r.number} - {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* RT Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Wilayah RT
            </label>
            <select
              value={filterRT}
              onChange={(e) => setFilterRT(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua RT</option>
              {availableRTs.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  RT {rt.number}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Tanggal Spesifik
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1 flex items-center justify-between">
              <span>Cari Real-Time</span>
              {search && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  {filtered.length} ditemukan
                </span>
              )}
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nama warga, catatan, No. STR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Summary */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div>
            Menampilkan <strong>{filtered.length}</strong> setoran &bull; Total Berat:{' '}
            <strong className="text-emerald-800">{totalWeight.toLocaleString('id-ID')} Kg</strong>
          </div>
          {(filterProgram !== 'all' || filterRW !== 'all' || filterRT !== 'all' || filterDate || search) && (
            <button
              onClick={() => {
                setFilterProgram('all');
                setFilterRW('all');
                setFilterRT('all');
                setFilterDate('');
                setSearch('');
              }}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Setoran Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No Transaksi</th>
                <th className="py-3 px-4">Warga / Penyetor</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">RW / RT</th>
                <th className="py-3 px-4 text-right">Berat</th>
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
                    <span className="block text-[11px] text-stone-400 font-normal">{item.day}</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono font-semibold text-emerald-800 whitespace-nowrap">
                    {item.transaction_no}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <div className="font-semibold text-stone-900">
                      {item.citizen_name || <span className="text-stone-400 font-normal italic">Warga Setempat</span>}
                    </div>
                    {item.notes && (
                      <span className="block text-[11px] text-stone-500 line-clamp-1" title={item.notes}>
                        {item.notes}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {getProgramName(item.program_id)}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-stone-800 whitespace-nowrap">
                    <div>{getRWName(item.rw_id)}</div>
                    <div className="text-[11px] text-stone-500">{getRTName(item.rt_id)}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                    {item.weight.toLocaleString('id-ID')} Kg
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setReceiptDeposit(item)}
                        className="px-2 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100 border border-stone-300 rounded-md transition-colors inline-flex items-center gap-1"
                        title="Cetak Resi Timbang"
                      >
                        <Printer className="w-3 h-3 text-stone-600" />
                        <span>Resi</span>
                      </button>
                      <button
                        onClick={() => onEditDeposit(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingDeposit(item)}
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
                  <td colSpan={7} className="py-12 text-center text-xs text-stone-400">
                    Tidak ada data setoran yang cocok dengan filter.
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
        isOpen={!!deletingDeposit}
        title="Hapus data ini?"
        message="Data yang sudah dihapus tidak dapat dikembalikan."
        itemDescription={
          deletingDeposit
            ? `${deletingDeposit.date} - ${deletingDeposit.weight} Kg (${getProgramName(deletingDeposit.program_id)})`
            : undefined
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingDeposit(null)}
      />

      {/* Deposit Receipt Modal */}
      {receiptDeposit && (
        <DepositReceiptModal
          deposit={receiptDeposit}
          onClose={() => setReceiptDeposit(null)}
        />
      )}
    </div>
  );
};

