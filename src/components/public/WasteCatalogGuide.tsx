import React, { useState } from 'react';
import { 
  Recycle, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info
} from 'lucide-react';

export const WasteCatalogGuide: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    {
      title: 'Plastik PET & Botol Minuman',
      desc: 'Botol air mineral, botol kecap/sirup bening, gelas cup minuman, tutup botol plastik.',
      criteria: 'Kering, kosong dari sisa cairan, tidak tercampur kotoran/tanah.',
      tag: 'Bernilai Tinggi',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Kardus & Kertas Arsip',
      desc: 'Kardus cokelat bergelombang, karton kemasan, buku tulis bekas, koran, kertas HVS.',
      criteria: 'Dipipihkan, diikat rapi, tidak basah atau terkena minyak.',
      tag: 'Paling Sering Disetor',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Logam, Kaleng & Besi',
      desc: 'Kaleng susu kental manis, kaleng biskuit, kaleng minuman, wajan/panci bekas, paku/besi tua.',
      criteria: 'Dicuci bilas dari sisa makanan/gula, dipadatkan bila memungkinkan.',
      tag: 'Bobot Mantap',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: 'Minyak Jelantah (UCO)',
      desc: 'Minyak goreng sisa pakai dari dapur warga, ditampung untuk program biodiesel & sabun desa.',
      criteria: 'Disaring dari remah sisa penggorengan, ditampung dalam botol/jeriken tertutup rapat.',
      tag: 'Cegah Pencemaran',
      color: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    {
      title: 'Bahan Organik & Kompos',
      desc: 'Daun gugur pekarangan, ranting kecil, sisa pemangkasan tanaman agroforestri desa.',
      criteria: 'Bebas dari kantong kresek, kawat, dan staples.',
      tag: 'Pupuk Alami',
      color: 'bg-lime-50 text-lime-800 border-lime-200',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Pilah dari Dapur & Rumah',
      desc: 'Sediakan wadah khusus di rumah untuk memisahkan anorganik bersih dari sampah basah.',
    },
    {
      step: '02',
      title: 'Bersihkan & Keringkan',
      desc: 'Bilas botol/kaleng dari sisa cairan manis agar tidak memicu semut atau bau sebelum disetor.',
    },
    {
      step: '03',
      title: 'Bawa ke Posko Penimbangan RW',
      desc: 'Kader lingkungan tiap RT/RW akan menimbang dan mencatat berat material di aplikasi KANG DIKIN.',
    },
    {
      step: '04',
      title: 'Tercatat di Buku Kas Terbuka',
      desc: 'Hasil penjualan material menjadi kas Dana Bersama yang disalurkan kembali untuk kemaslahatan warga.',
    },
  ];

  const faqs = [
    {
      q: 'Apakah uang hasil penjualan sampah langsung diterima tunai oleh masing-masing warga?',
      a: 'Dalam semangat gotong royong KANG DIKIN, seluruh hasil penjualan material masuk ke dalam kas "Dana Bersama". Dana ini dikelola secara transparan dan dimanfaatkan kembali untuk kemaslahatan seluruh warga RT/RW, seperti santunan warga sakit, kegiatan sosial, pengadaan sarana umum, dan bibit agroforestri.',
    },
    {
      q: 'Kapan jadwal penimbangan rutin sampah di tingkat RT atau RW?',
      a: 'Penimbangan rutin biasanya diselenggarakan 2 kali dalam sebulan (umumnya di hari Minggu pagi minggu ke-1 dan minggu ke-3) di balai RW atau pos ronda masing-masing RT. Jadwal spesifik diumumkan oleh Ketua RT setempat.',
    },
    {
      q: 'Bagaimana cara warga mengusulkan bantuan atau pemanfaatan Dana Bersama?',
      a: 'Warga dapat menyampaikan usulan melalui Ketua RT masing-masing dalam musyawarah warga, atau menghubungi kader pengurus KANG DIKIN. Usulan yang disetujui akan dicatat di modul Pemanfaatan dengan rincian dana terbuka.',
    },
    {
      q: 'Apakah semua warga bisa melihat laporan keuangan KANG DIKIN?',
      a: 'Ya, 100% terbuka. Website KANG DIKIN ini dapat diakses oleh siapa saja tanpa perlu login. Seluruh data transaksi setoran, penjualan ke pengepul, dan penyaluran dana dapat dipantau secara realtime dan diunduh laporannya.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Panduan Jenis Sampah & Tata Cara Setor */}
      <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Recycle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Panduan Partisipasi Warga</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            Katalog Sampah Bernilai Ekonomis
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Berikut adalah jenis material yang diterima di posko penimbangan KANG DIKIN beserta kriteria penyetorannya agar memiliki nilai jual optimal.
          </p>
        </div>

        {/* Categories Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone-900 text-sm">{cat.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cat.color}`}>
                    {cat.tag}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">{cat.desc}</p>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong className="text-stone-700">Syarat:</strong> {cat.criteria}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Steps */}
        <div className="pt-4 border-t border-stone-200">
          <h3 className="text-base font-bold text-stone-900 mb-4">
            Alur Penyetoran Sampah Desa
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2">
                <span className="text-lg font-black text-emerald-800">{st.step}</span>
                <h4 className="text-xs font-bold text-stone-900">{st.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Jadwal & Posko Pengumpulan */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Operasional Lapangan</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              Jadwal & Lokasi Penimbangan Terbuka
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Pukul 08.00 - 11.00 WIB</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <strong className="block font-bold text-stone-900 mb-1">Minggu I & III Tiap Bulan</strong>
            <span className="text-stone-500">Penimbangan gabungan tingkat RW di Balai Pertemuan RW. Dipandu kader lingkungan RT.</span>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <strong className="block font-bold text-stone-900 mb-1">Setiap Hari Kerja (Senin - Jumat)</strong>
            <span className="text-stone-500">Penerimaan setoran di Gudang Sentral Komunitas KANG DIKIN untuk skala besar / instansi.</span>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <strong className="block font-bold text-stone-900 mb-1">Pencatatan Digital Seketika</strong>
            <span className="text-stone-500">Kader menimbang dengan timbangan digital terkalibrasi dan memasukkan data langsung ke sistem.</span>
          </div>
        </div>
      </div>

      {/* 3. FAQ Tanya Jawab Warga */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tanya Jawab Warga</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-serif">
            Pertanyaan yang Sering Diajukan
          </h3>
        </div>

        <div className="divide-y divide-stone-100">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left flex items-center justify-between gap-4 font-semibold text-stone-800 hover:text-emerald-800 text-sm transition-colors py-1"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-800 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed pr-6 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
