import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TreePine, Zap, Droplets, CloudFog, Search, MapPin, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../../utils/dateUtils';

interface EcoImpactCalculatorProps {
  onNavigateTab: (tab: string) => void;
}

export const EcoImpactCalculator: React.FC<EcoImpactCalculatorProps> = ({ onNavigateTab }) => {
  const { totalDepositsWeight, rws, rts, deposits, rwSummaries, getRWName, getRTName } = useApp();

  // Selected RW & RT for quick check
  const [selectedRwId, setSelectedRwId] = useState<string>(rws[0]?.id || '');
  const [selectedRtId, setSelectedRtId] = useState<string>('all');

  // Eco impact metrics calculation (empirical environmental conversion factors)
  // 1 kg waste diverted = ~1.85 kg CO2e emissions avoided
  const co2AvoidedKg = Math.round(totalDepositsWeight * 1.85);
  // ~25 kg recycled material preserves the equivalent of 1 tree absorption capacity
  const treesEquivalent = Math.max(1, Math.round(totalDepositsWeight / 25));
  // ~3.2 kWh electric energy saved per kg diverted
  const energySavedKwh = Math.round(totalDepositsWeight * 3.2);
  // ~12.5 Liters water conserved
  const waterSavedLiters = Math.round(totalDepositsWeight * 12.5);

  // Filter available RTs based on selected RW
  const availableRTs = rts.filter((rt) => rt.rw_id === selectedRwId);

  // Quick statistics for the selected RW & RT
  const rwSummary = rwSummaries.find((rw) => rw.rwId === selectedRwId);
  const targetDeposits = deposits.filter((d) => {
    if (d.rw_id !== selectedRwId) return false;
    if (selectedRtId !== 'all' && d.rt_id !== selectedRtId) return false;
    return true;
  });

  const targetWeight = targetDeposits.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);
  const targetTransactions = targetDeposits.length;

  return (
    <div className="space-y-10">
      {/* 1. Eco Impact Metrics Card */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-800/80 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/90 text-emerald-200 text-xs font-semibold border border-emerald-700/60">
            <TreePine className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kalkulator Aksi Sadar Iklim</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
            Dampak Nyata Pemilahan Sampah Terhadap Bumi
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Setiap kilogram material yang Anda pilah dan setorkan ke KANG DIKIN memberikan kontribusi terukur dalam menekan emisi karbon dan melestarikan sumber daya alam desa.
          </p>
        </div>

        {/* 4 Impact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <div className="bg-emerald-800/50 backdrop-blur-xs p-5 rounded-2xl border border-emerald-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-200">Emisi Karbon Tercegah</span>
              <div className="p-2 rounded-xl bg-emerald-700/50 text-emerald-300">
                <CloudFog className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {co2AvoidedKg.toLocaleString('id-ID')} <span className="text-sm font-semibold text-emerald-300">Kg CO₂e</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Mengurangi gas rumah kaca dari pembakaran sampah terbuka
              </p>
            </div>
          </div>

          <div className="bg-emerald-800/50 backdrop-blur-xs p-5 rounded-2xl border border-emerald-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-200">Setara Perlindungan Pohon</span>
              <div className="p-2 rounded-xl bg-emerald-700/50 text-emerald-300">
                <TreePine className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {treesEquivalent.toLocaleString('id-ID')} <span className="text-sm font-semibold text-emerald-300">Pohon</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Kapasitas serapan setara pohon dewasa & bibit agroforestri
              </p>
            </div>
          </div>

          <div className="bg-emerald-800/50 backdrop-blur-xs p-5 rounded-2xl border border-emerald-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-200">Energi Listrik Terhemat</span>
              <div className="p-2 rounded-xl bg-emerald-700/50 text-emerald-300">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {energySavedKwh.toLocaleString('id-ID')} <span className="text-sm font-semibold text-emerald-300">kWh</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Penghematan daya proses pengolahan bahan baku daur ulang
              </p>
            </div>
          </div>

          <div className="bg-emerald-800/50 backdrop-blur-xs p-5 rounded-2xl border border-emerald-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-200">Air Bersih Terlindungi</span>
              <div className="p-2 rounded-xl bg-emerald-700/50 text-emerald-300">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {waterSavedLiters.toLocaleString('id-ID')} <span className="text-sm font-semibold text-emerald-300">Liter</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Mencegah pencemaran air tanah akibat lindi sampah liar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Widget Cek Capaian RW/RT Warga */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              <Search className="w-3.5 h-3.5" />
              <span>Pencarian Cepat Warga</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              Cek Kontribusi Wilayah Saya
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Pilih wilayah RW dan RT tempat tinggal Anda untuk memantau rekam jejak penyetoran dan manfaat bersama.
            </p>
          </div>

          {/* Selection Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">Pilih RW</label>
              <select
                value={selectedRwId}
                onChange={(e) => {
                  setSelectedRwId(e.target.value);
                  setSelectedRtId('all');
                }}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
              >
                {rws.map((rw) => (
                  <option key={rw.id} value={rw.id}>
                    RW {rw.number} - {rw.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">Pilih RT</label>
              <select
                value={selectedRtId}
                onChange={(e) => setSelectedRtId(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
              >
                <option value="all">Semua RT di RW ini</option>
                {availableRTs.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    RT {rt.number} {rt.name ? `(${rt.name})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result Summary Bar */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="text-xs text-stone-500 font-medium">Wilayah Terpilih</div>
            <div className="text-base font-bold text-stone-900 mt-1">
              {getRWName(selectedRwId)}
              {selectedRtId !== 'all' && ` - RT ${getRTName(selectedRtId)}`}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Ketua RW: {rwSummary?.leader || '-'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
            <div className="text-xs text-emerald-800 font-semibold">Total Setoran Warga</div>
            <div className="text-2xl font-black text-emerald-900 mt-1">
              {targetWeight.toLocaleString('id-ID')} <span className="text-sm font-bold">Kg</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Tercatat dari {targetTransactions} kali transaksi setoran
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200">
            <div className="text-xs text-teal-800 font-semibold">Pemanfaatan Diterima</div>
            <div className="text-xl font-bold text-teal-900 mt-1">
              {formatRupiah(rwSummary?.totalUtilizationAmount || 0)}
            </div>
            <div className="text-[11px] text-teal-700 mt-0.5">
              Dari {rwSummary?.totalUtilizationCount || 0} program kegiatan bersama
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200 flex flex-col justify-between">
            <div className="text-xs text-stone-600 font-medium">Lihat Riwayat Lengkap</div>
            <button
              onClick={() => onNavigateTab('setoran')}
              className="inline-flex items-center justify-between w-full px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs mt-2"
            >
              <span>Buka Buku Setoran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
