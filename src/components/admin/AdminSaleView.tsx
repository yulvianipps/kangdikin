import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { Pagination } from '../common/Pagination';
import { formatRupiah } from '../../utils/dateUtils';
import { Plus, Search, Filter } from 'lucide-react';

interface AdminSaleViewProps {
  programScope?: string;
  onAddSale: () => void;
  onEditSale: (sale: Sale) => void;
}

export const AdminSaleView: React.FC<AdminSaleViewProps> = ({
  programScope,
  onAddSale,
  onEditSale,
}) => {
  const { sales, programs, itemTypes, deleteSale, getProgramName, isStaff, userProgramId, userProgramName } = useApp();
  const [filterProgram, setFilterProgram] = useState<string>(
    isStaff && userProgramId ? userProgramId : (programScope || 'all')
  );

  useEffect(() => {
    if (programScope && !isStaff) {
      setFilterProgram(programScope);
    }
  }, [programScope, isStaff]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [deletingSale, setDeletingSale] = useState<Sale | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterProgram, filterCategory, search]);

  const effectiveProgramFilter = isStaff && userProgramId ? userProgramId : filterProgram;

  // Extract unique material categories
  const availableCategories = Array.from(
    new Set([
      ...itemTypes.map((it) => it.name),
      ...sales.map((s) => s.item_type),
    ])
  ).filter(Boolean);

  const filtered = sales.filter((s) => {
    if (isStaff && userProgramId && s.program_id !== userProgramId) return false;
    if (effectiveProgramFilter !== 'all' && s.program_id !== effectiveProgramFilter) return false;
    if (filterCategory !== 'all' && s.item_type !== filterCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const progName = getProgramName(s.program_id).toLowerCase();
      const item = s.item_type.toLowerCase();
      const buyer = (s.buyer || '').toLowerCase();
      const notes = (s.notes || '').toLowerCase();
      const tx = (s.transaction_no || '').toLowerCase();
      if (
        !item.includes(q) &&
        !buyer.includes(q) &&
        !tx.includes(q) &&
        !notes.includes(q) &&
        !progName.includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleDeleteConfirm = () => {
    if (deletingSale) {
      deleteSale(deletingSale.id);
      setDeletingSale(null);
    }
  };

  const totalSalesRevenue = filtered.reduce((acc, curr) => acc + curr.total, 0);
  const totalSalesWeight = filtered.reduce((acc, curr) => acc + curr.weight, 0);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Data Penjualan</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Pencatatan penjualan komoditas daur ulang dan hasil panen agroforestri
          </p>
        </div>

        <button
          onClick={onAddSale}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Penjualan</span>
        </button>
      </div>

      {/* Filter and Summary */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Program Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Program {isStaff && <span className="text-amber-700 font-bold">(Terkunci)</span>}
              </label>
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

            {/* Kategori Material Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Kategori Material
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option value="all">Semua Kategori ({availableCategories.length})</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Real-Time Search */}
            <div className="w-full sm:w-72">
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
                  placeholder="Kategori material, pembeli, No. PJL..."
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

            {(filterProgram !== 'all' || filterCategory !== 'all' || search) && (
              <div className="self-end pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setFilterProgram('all');
                    setFilterCategory('all');
                    setSearch('');
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

          <div className="text-xs text-stone-600 flex flex-wrap items-center gap-4 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            <div>
              Total Berat: <strong>{totalSalesWeight.toLocaleString('id-ID')} Kg</strong>
            </div>
            <div>
              Total Penjualan: <strong className="text-emerald-800 font-bold">{formatRupiah(totalSalesRevenue)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Penjualan Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No Transaksi</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Kategori Material</th>
                <th className="py-3 px-4">Pembeli / Mitra</th>
                <th className="py-3 px-4 text-right">Berat</th>
                <th className="py-3 px-4 text-right">Harga</th>
                <th className="py-3 px-4 text-right">Jumlah</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {paginated.map((item, index) => {
                // Auto calculated: Berat x Harga
                const autoAmount = Math.round(item.weight * item.price);
                return (
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
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      {getProgramName(item.program_id)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-800 text-xs font-medium rounded-md">
                        {item.item_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-stone-700">
                      {item.buyer || <span className="text-stone-400 font-normal italic">-</span>}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-stone-800 whitespace-nowrap">
                      {item.weight.toLocaleString('id-ID')} Kg
                    </td>
                    <td className="py-3 px-4 text-right text-stone-700 whitespace-nowrap">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                      {formatRupiah(item.total || autoAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onEditSale(item)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingSale(item)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-stone-400">
                    Tidak ada transaksi penjualan yang tercatat.
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
        isOpen={!!deletingSale}
        title="Hapus data ini?"
        message="Data yang sudah dihapus tidak dapat dikembalikan."
        itemDescription={
          deletingSale
            ? `${deletingSale.date} - ${deletingSale.item_type} (${formatRupiah(deletingSale.total)})`
            : undefined
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSale(null)}
      />
    </div>
  );
};
