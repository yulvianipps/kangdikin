import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, CheckCircle2 } from 'lucide-react';

interface PublicProgramsViewProps {
  onSelectProgram?: (programId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const PublicProgramsView: React.FC<PublicProgramsViewProps> = ({
  onNavigateTab,
}) => {
  const { programs, programCategories, deposits, sales } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const publicPrograms = programs.filter((p) => p.is_active && p.is_public);

  const filteredPrograms = publicPrograms.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
          Daftar Program Lingkungan
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-2xl">
          Program sirkularitas, agroforestri, dan konservasi alam yang digerakkan bersama warga untuk kemandirian desa.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Semua Kategori
          </button>
          {programCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((prog) => {
          const progDeposits = deposits.filter((d) => d.program_id === prog.id);
          const totalWeight = progDeposits.reduce((sum, d) => sum + d.weight, 0);
          const progSales = sales.filter((s) => s.program_id === prog.id);
          const totalRevenue = progSales.reduce((sum, s) => sum + s.total, 0);

          return (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-xs"
            >
              {prog.image && (
                <div className="h-44 w-full bg-stone-100 overflow-hidden relative">
                  <img
                    src={prog.image}
                    alt={prog.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    {prog.category}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-stone-900">{prog.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Aktif
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                {/* Impact quick metrics */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 bg-stone-50/50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Total Setoran</span>
                    <span className="font-bold text-stone-800">{totalWeight.toLocaleString('id-ID')} Kg</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Hasil Penjualan</span>
                    <span className="font-bold text-stone-800">Rp{totalRevenue.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {onNavigateTab && (
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => onNavigateTab('setoran')}
                      className="text-xs font-semibold text-emerald-800 hover:underline"
                    >
                      Lihat Buku Setoran &rarr;
                    </button>
                    <button
                      onClick={() => onNavigateTab('penjualan')}
                      className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                    >
                      Lihat Penjualan
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <p className="text-sm font-medium text-stone-500">Tidak ada program yang sesuai kriteria pencarian.</p>
        </div>
      )}
    </div>
  );
};
