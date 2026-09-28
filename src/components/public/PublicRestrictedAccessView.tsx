import React from 'react';
import { Lock, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

interface PublicRestrictedAccessViewProps {
  onOpenLogin: () => void;
  onBackToHome: () => void;
  title?: string;
  description?: string;
}

export const PublicRestrictedAccessView: React.FC<PublicRestrictedAccessViewProps> = ({
  onOpenLogin,
  onBackToHome,
  title = 'Akses Buku Transaksi Dibatasi',
  description = 'Untuk melindungi privasi data warga (nama penyetor, rincian per RT/RW) serta kerahasiaan operasional internal (nota penjualan, harga kontrak, penerima bantuan, dan manifest timbangan logistik), halaman ini hanya dapat diakses oleh Pengurus & Petugas KANG DIKIN.',
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Area Khusus Pengurus & Petugas</span>
        </span>

        <h2 className="text-2xl font-bold text-stone-900 font-serif">{title}</h2>

        <p className="text-sm text-stone-600 leading-relaxed max-w-lg mx-auto">
          {description}
        </p>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 text-left space-y-2 max-w-lg mx-auto">
        <p className="font-semibold text-stone-900">Perlindungan Data Publik:</p>
        <ul className="list-disc pl-4 space-y-1 text-stone-500">
          <li>Warga umum dapat mengakses informasi program, edukasi, dan lokasi posko timbang.</li>
          <li>Rincian transaksi perorangan hanya dibuka untuk petugas pencatat berwenang.</li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <button
          onClick={onOpenLogin}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 shadow-sm transition-colors"
        >
          <KeyRound className="w-4 h-4" />
          <span>Masuk Sebagai Pengurus</span>
        </button>
      </div>
    </div>
  );
};
