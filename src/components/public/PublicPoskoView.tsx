import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Calendar, Clock, Phone, UserCheck, Shield, AlertCircle } from 'lucide-react';

export const PublicPoskoView: React.FC = () => {
  const { rws, rts } = useApp();

  const activeRWs = rws.filter((r) => r.status === 'active');

  const defaultSchedule = [
    { day: 'Minggu', time: '08:00 - 11:30 WIB', notes: 'Penimbangan Massal Rutin Warga' },
    { day: 'Rabu', time: '15:30 - 17:30 WIB', notes: 'Penyortiran & Pengemasan' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Posko Pelayanan Komunitas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
          Jadwal & Lokasi Posko Timbang RW
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-2xl">
          Warga dapat menyetorkan sampah terpilah ke Posko Timbang di wilayah RW masing-masing sesuai
          jadwal operasional berikut.
        </p>
      </div>

      {/* Info Card Alur */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Jadwal Timbang Rutin Mingguan</h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Setiap hari <strong>Minggu pagi pukul 08:00 - 11:30 WIB</strong> di balai warga atau pos ronda masing-masing RW.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3.5 py-2 rounded-xl">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>Petugas Timbang Resmi Bersertifikat Desa</span>
        </div>
      </div>

      {/* Grid Posko RW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeRWs.map((rw) => {
          const rtCount = rts.filter((rt) => rt.rw_id === rw.id && rt.status === 'active').length || 4;
          return (
            <div
              key={rw.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    RW {rw.number}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {rtCount} RT Terdaftar
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900 mb-1">{rw.name}</h3>
                <p className="text-xs text-stone-500 flex items-center gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Balai RW & Posko Komunitas Terpadu</span>
                </p>

                <div className="p-3 bg-stone-50 rounded-xl space-y-2 text-xs mb-4">
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="text-stone-500">Koordinator:</span>
                    <span className="font-semibold text-stone-900">
                      {rw.leader || 'Ketua RW Terpilih'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="text-stone-500">Hari Layanan:</span>
                    <span className="font-semibold text-stone-900">Minggu Pagi</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="text-stone-500">Jam Layanan:</span>
                    <span className="font-semibold text-emerald-800 font-mono">08:00 - 11:30 WIB</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Layanan Warga RW</span>
                </span>
                <span className="text-[11px] text-stone-400">Gratis & Terbuka</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Catatan untuk Warga */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">Tips Membawa Setoran ke Posko:</p>
          <p className="text-stone-600">
            Pastikan sampah anorganik sudah dikelompokkan menurut jenisnya (misal: wadah khusus botol, wadah khusus kardus)
            dan dalam kondisi kering agar proses penimbangan di posko berjalan cepat dan tertib.
          </p>
        </div>
      </div>
    </div>
  );
};
