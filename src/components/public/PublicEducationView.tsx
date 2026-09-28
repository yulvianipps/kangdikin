import React from 'react';
import { WasteCatalogGuide } from './WasteCatalogGuide';
import { EcoImpactCalculator } from './EcoImpactCalculator';
import { BookOpen, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const PublicEducationView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold border border-emerald-500/40">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pusat Informasi & Edukasi Warga</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-serif">
            Edukasi Pemilahan Sampah & Ekonomi Sirkular Desa
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            Mewujudkan desa bersih, mandiri, dan tangguh iklim dimulai dari kebiasaan memilah sampah
            di rumah tangga. Setiap kilogram bahan daur ulang yang disetor akan bernilai ekonomi dan
            dialirkan kembali untuk kemaslahatan bersama seluruh warga.
          </p>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Pilar Pemilahan Sampah Mandiri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
            01
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Pilah dari Sumber</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Pisahkan sampah kering bernilai daur ulang (kardus, botol plastik, logam) dari sampah basah dapur sejak di rumah.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm mb-3">
            02
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Bersih & Kering</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Bilas botol dari sisa minuman dan pipihkan kardus agar tidak berbau, hemat tempat, dan menjaga nilai komoditas.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
            03
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Setor ke Posko RW</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Bawa setoran terpilah ke Posko Timbang RW saat jadwal penimbangan rutin untuk ditimbang oleh petugas.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
            04
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Dana Bersama Warga</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Seluruh hasil penjualan komoditas dikumpulkan dalam Dana Bersama untuk bantuan sosial, dhuafa, dan fasilitas lingkungan.
            </p>
          </div>
        </div>
      </div>

      {/* Katalog Sampah & FAQ Interaktif */}
      <WasteCatalogGuide />

      {/* Kalkulator Simulasi Dampak Lingkungan */}
      <EcoImpactCalculator />
    </div>
  );
};
