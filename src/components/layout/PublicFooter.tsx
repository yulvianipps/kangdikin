import React from 'react';

interface PublicFooterProps {
  onSelectTab?: (tab: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onSelectTab }) => {
  const handleNav = (tab: string) => {
    if (onSelectTab) {
      onSelectTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-serif">KANG DIKIN</span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                  DANA BERSAMA
                </span>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-lg">
              <strong>KANG DIKIN</strong> (Kelola Lingkungan, Sadar Iklim dan Kesejahteraan Terintegrasi) adalah platform transparansi publik dana bersama berbasis komoditas dan sirkularitas lingkungan: Bank Sampah, Aren, Kayu, dan Pupuk Organik.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-stone-400">
              <span className="bg-stone-800 px-2.5 py-1 rounded-md border border-stone-700/50">
                Bank Sampah
              </span>
              <span className="bg-stone-800 px-2.5 py-1 rounded-md border border-stone-700/50">
                Aren Lestari
              </span>
              <span className="bg-stone-800 px-2.5 py-1 rounded-md border border-stone-700/50">
                Kayu Rakyat
              </span>
              <span className="bg-stone-800 px-2.5 py-1 rounded-md border border-stone-700/50">
                Dana Bersama
              </span>
            </div>
          </div>

          {/* Navigasi Cepat Halaman */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => handleNav('beranda')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('program')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Program KANG DIKIN
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('setoran')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Buku Setoran Warga
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('penjualan')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Penjualan Komoditas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('pemanfaatan')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Penyaluran Dana Bersama
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('rw')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Rekap Kontribusi RW
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('laporan')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Laporan Keuangan
                </button>
              </li>
            </ul>
          </div>

          {/* Transparansi & Akses Admin */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">
              Prinsip Tata Kelola
            </h4>
            <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/60 space-y-2">
              <div className="text-xs font-semibold text-emerald-300">
                Transparansi Terbuka
              </div>
              <p className="text-xs text-stone-400 leading-normal">
                Setiap kilogram setoran dan rupiah pemanfaatan dicatat secara realtime dan dapat dipantau oleh seluruh lapisan masyarakat.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            &copy; 2026 <strong>KANG DIKIN</strong> — Inisiatif Kelola Lingkungan & Kesejahteraan Terintegrasi.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Sadar Iklim</span>
            <span>•</span>
            <span>Ekonomi Sirkular</span>
            <span>•</span>
            <span>Keadilan Sosial Komunitas</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
