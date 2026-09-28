import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatWeight } from '../../utils/dateUtils';
import { Program } from '../../types';
import { Edit2, Trash2 } from 'lucide-react';

interface ProgramsSectionProps {
  onSelectProgram?: (programId: string) => void;
  onOpenAddProgram?: () => void;
  onEditProgram?: (program: Program) => void;
  onOpenCategoriesModal?: () => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({
  onSelectProgram,
  onOpenAddProgram,
  onEditProgram,
  onOpenCategoriesModal,
}) => {
  const {
    programs,
    programCategories,
    deposits,
    sales,
    utilizations,
    filters,
    setFilter,
    isAdmin,
    deleteProgram,
    updateProgram,
  } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-900">
            Pilar Program KANG DIKIN
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola Lingkungan, Sadar Iklim dan Kesejahteraan Terintegrasi
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenCategoriesModal && (
              <button
                type="button"
                onClick={onOpenCategoriesModal}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-colors"
                title="Kelola Kategori Program (CRUD)"
              >
                Kelola Kategori ({programCategories.length})
              </button>
            )}

            {onOpenAddProgram && (
              <button
                type="button"
                onClick={onOpenAddProgram}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                + Tambah Program Baru
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {programs.map((program) => {
          const isSelected = filters.programId === program.id;
          const programDeposits = deposits.filter((d) => d.program_id === program.id);
          const programSales = sales.filter((s) => s.program_id === program.id);
          const programUtils = utilizations.filter((u) => u.program_id === program.id);

          const totalWeight = programDeposits.reduce((sum, d) => sum + (Number(d.weight) || 0), 0);
          const totalSales = programSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
          const totalUtil = programUtils.reduce((sum, u) => sum + (Number(u.amount) || 0), 0);

          return (
            <div
              key={program.id}
              onClick={() => {
                if (isSelected) {
                  setFilter('programId', 'ALL');
                } else {
                  setFilter('programId', program.id);
                  if (onSelectProgram) onSelectProgram(program.id);
                }
              }}
              className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-stone-200/90 bg-white hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-stone-900 text-base truncate">{program.name}</h4>
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block mt-0.5 truncate">
                      {program.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateProgram(program.id, { is_active: !program.is_active });
                        }}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-opacity hover:opacity-80 ${
                          program.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                        title="Klik untuk ubah status aktif/nonaktif"
                      >
                        {program.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          program.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {program.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed">
                  {program.description}
                </p>

                {/* Metrics */}
                <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-stone-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Setoran</span>
                    <span className="font-extrabold text-stone-900 text-xs mt-0.5 block truncate">
                      {formatWeight(totalWeight)}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Penjualan</span>
                    <span className="font-extrabold text-emerald-900 text-xs mt-0.5 block truncate">
                      {formatRupiah(totalSales)}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pemanfaatan</span>
                    <span className="font-extrabold text-teal-800 text-xs mt-0.5 block truncate">
                      {formatRupiah(totalUtil)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Controls */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700">
                  {isSelected ? '✓ Filter Aktif' : 'Pilih untuk filter'}
                </span>

                {isAdmin ? (
                  <div className="flex items-center gap-1">
                    {onEditProgram && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProgram(program);
                        }}
                        className="p-1 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                        title="Ubah Program"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const count = programDeposits.length + programSales.length;
                        const msg =
                          count > 0
                            ? `Program "${program.name}" memiliki ${count} riwayat transaksi. Yakin tetap ingin menghapus program ini?`
                            : `Hapus program "${program.name}"?`;
                        if (confirm(msg)) {
                          deleteProgram(program.id);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Hapus Program"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-stone-400 font-medium text-[11px]">
                    {isSelected ? 'Klik untuk batal' : 'Klik kartu'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
