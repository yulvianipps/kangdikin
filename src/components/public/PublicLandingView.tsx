import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/dateUtils';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { EcoImpactCalculator } from './EcoImpactCalculator';
import { WasteCatalogGuide } from './WasteCatalogGuide';

interface PublicLandingViewProps {
  onNavigate: (tab: string) => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ onNavigate }) => {
  const {
    frontPageContent,
    programs,
    totalDepositsWeight,
    totalDepositsCount,
    totalSalesAmount,
    totalUtilizationsAmount,
    rws,
  } = useApp();

  const { hero, stats, about, cta } = frontPageContent;

  // Active & public programs from state
  const publicPrograms = programs.filter((p) => p.is_active && p.is_public);

  // Computed stat mapping
  const getStatValue = (id: string): string => {
    switch (id) {
      case 'weight':
        return `${totalDepositsWeight.toLocaleString('id-ID')} Kg`;
      case 'deposits':
        return `${totalDepositsCount.toLocaleString('id-ID')} Transaksi`;
      case 'sales':
        return formatRupiah(totalSalesAmount);
      case 'utilization':
        return formatRupiah(totalUtilizationsAmount);
      case 'rws':
        return `${rws.filter((r) => r.status === 'active').length} RW`;
      case 'programs':
        return `${publicPrograms.length} Program`;
      default:
        return '0';
    }
  };

  // Sort visible stats
  const visibleStats = [...stats]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 text-white min-h-[440px] flex items-center shadow-lg">
          {/* Background Image with Dark Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
            style={{ backgroundImage: `url(${hero.backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-semibold border border-emerald-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Transparansi Publik & Aksi Iklim Komunitas</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight font-serif">
              {hero.title}
            </h1>

            <p className="text-lg font-medium text-emerald-300">
              {hero.subtitle}
            </p>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
              {hero.description}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate(hero.buttonLink || 'program')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <span>{hero.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('laporan')}
                className="px-5 py-3 rounded-xl text-sm font-semibold bg-stone-800/90 text-stone-200 hover:bg-stone-700 border border-stone-700 transition-colors"
              >
                Lihat Laporan Keuangan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK UTAMA (Clean, No Decorative Icons as requested) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900">Statistik Capaian Terbuka</h2>
          <p className="text-sm text-stone-500">
            Data terakumulasi secara otomatis dan real-time dari pencatatan setoran tiap RW.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {visibleStats.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div className="text-xs text-stone-500 font-medium mb-2 leading-snug">
                {item.label}
              </div>
              <div className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                {getStatValue(item.id)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.5 ECO IMPACT CALCULATOR & QUICK RW SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EcoImpactCalculator onNavigateTab={onNavigate} />
      </section>

      {/* 3. PROGRAM KAMI (From dynamic database/state) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Program Kami</h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Inisiatif kelola lingkungan dan agroforestri yang aktif berjalan bersama warga desa.
            </p>
          </div>
          <button
            onClick={() => onNavigate('program')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            Lihat Semua Program &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-xs hover:border-emerald-600 transition-colors"
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
                  <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('setoran')}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Lihat Setoran &rarr;
                  </button>
                  <button
                    onClick={() => onNavigate('penjualan')}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Data Penjualan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.5 PANDUAN PEMILAHAN SAMPAH & FAQ WARGA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WasteCatalogGuide />
      </section>

      {/* 4. TENTANG KANG DIKIN (Dynamic from state) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl border border-stone-200 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded">
              Latar Belakang & Nilai
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
              {about.title}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {about.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-stone-700">
              <span className="bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                🌱 Sirkularitas Nol Sampah
              </span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                📊 Akuntabilitas Buku Kas Terbuka
              </span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                🤝 Dana Bersama Kesejahteraan
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-stone-300 shadow-md">
              <img
                src={about.image}
                alt="Tentang KANG DIKIN"
                className="w-full h-72 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA / AJAKAN (Dynamic from state) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-emerald-900 text-white p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {cta.title}
          </h2>
          <p className="text-emerald-200 text-sm sm:text-base max-w-xl mx-auto">
            {cta.description}
          </p>
          <div className="pt-3">
            <button
              onClick={() => onNavigate(cta.buttonLink || 'setoran')}
              className="px-6 py-3 bg-white text-emerald-950 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors shadow-sm"
            >
              {cta.buttonText}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
