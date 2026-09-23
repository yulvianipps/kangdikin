import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Program } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { Pagination } from '../common/Pagination';
import { Plus, Search } from 'lucide-react';

interface AdminProgramViewProps {
  onAddProgram: () => void;
  onEditProgram: (program: Program) => void;
}

export const AdminProgramView: React.FC<AdminProgramViewProps> = ({
  onAddProgram,
  onEditProgram,
}) => {
  const { programs, deleteProgram, updateProgram } = useApp();
  const [search, setSearch] = useState('');
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredPrograms = programs.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredPrograms.length / pageSize) || 1;
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteConfirm = () => {
    if (deletingProgram) {
      deleteProgram(deletingProgram.id);
      setDeletingProgram(null);
    }
  };

  const togglePublic = (program: Program) => {
    updateProgram(program.id, { is_public: !program.is_public });
  };

  const toggleActive = (program: Program) => {
    updateProgram(program.id, { is_active: !program.is_active });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Data Program</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Kelola inisiatif lingkungan, agroforestri, dan visibilitas di halaman publik
          </p>
        </div>

        <button
          onClick={onAddProgram}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
          />
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Total: <strong className="text-stone-800">{filteredPrograms.length}</strong> Program
        </div>
      </div>

      {/* Program Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Program</th>
                <th className="py-3 px-4 max-w-xs">Deskripsi</th>
                <th className="py-3 px-4 text-center">Status Public</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {paginatedPrograms.map((prog, index) => (
                <tr key={prog.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 text-center text-xs text-stone-400 font-medium">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{prog.name}</div>
                    <div className="text-[11px] text-stone-400">{prog.category}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-stone-600 line-clamp-2 max-w-sm">
                    {prog.description}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => togglePublic(prog)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                        prog.is_public
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                      }`}
                      title="Klik untuk ubah status tampil di publik"
                    >
                      {prog.is_public ? 'Tampil' : 'Sembunyi'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleActive(prog)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                        prog.is_active
                          ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                          : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                      }`}
                      title="Klik untuk ubah status keaktifan"
                    >
                      {prog.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onEditProgram(prog)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingProgram(prog)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPrograms.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-stone-400">
                    Tidak ada program yang cocok dengan pencarian.
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
          totalItems={filteredPrograms.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingProgram}
        title="Hapus data ini?"
        message="Data yang sudah dihapus tidak dapat dikembalikan."
        itemDescription={deletingProgram?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProgram(null)}
      />
    </div>
  );
};
