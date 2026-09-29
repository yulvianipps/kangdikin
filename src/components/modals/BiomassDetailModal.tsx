import React from 'react';
import { BiomassEntry } from '../../types';
import {
  X,
  Truck,
  Calendar,
  Clock,
  User,
  Scale,
  Building2,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface BiomassDetailModalProps {
  entry: BiomassEntry;
  onClose: () => void;
}

export const BiomassDetailModal: React.FC<BiomassDetailModalProps> = ({ entry, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const isAren =
    (entry.biomass_type && entry.biomass_type.toLowerCase().includes('aren')) ||
    (entry.group_category && entry.group_category.toLowerCase().includes('ciamis')) ||
    entry.transaction_no.startsWith('ARN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between shrink-0 text-white ${
            isAren ? 'bg-emerald-950' : 'bg-amber-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isAren ? 'bg-emerald-800 text-emerald-200' : 'bg-amber-800 text-amber-200'
              }`}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Detail Slip Timbangan Biomassa</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider">
                  {isAren ? 'Sentra Aren' : 'Kehutanan Kayu'}
                </span>
              </div>
              <p className="text-xs text-white/80 font-mono mt-0.5">
                No. Transaksi: {entry.transaction_no}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Slip Badge */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="font-bold text-stone-900 block">Status: Terverifikasi Sistem</span>
                <span className="text-[11px] text-stone-500 block">
                  Dicatat oleh: {entry.created_by || 'Petugas Timbang'} pada {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('id-ID') : entry.date}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-lg text-[10px] uppercase">
              Slip Resmi
            </span>
          </div>

          {/* Armada & Pengemudi Info Card */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <span className="font-bold text-emerald-950 block text-xs flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-800" />
              Identitas Armada Truk & Pengemudi
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-[10px] text-stone-500 block font-semibold">Nomor Polisi Truk:</span>
                <span className="text-base font-extrabold font-mono text-emerald-950 tracking-wider">
                  {entry.vehicle_plate}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-[10px] text-stone-500 block font-semibold">Nama Sopir:</span>
                <span className="text-sm font-bold text-stone-900 flex items-center gap-1 mt-0.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  {entry.driver_name || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Operasional Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-400 block font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-500" />
                Tanggal & Hari
              </span>
              <span className="text-xs font-bold text-stone-900 block mt-0.5">
                {entry.day}, {entry.date}
              </span>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-400 block font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-500" />
                Shift Kerja
              </span>
              <span className="text-xs font-bold text-stone-900 block mt-0.5">
                {entry.shift}
              </span>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-400 block font-semibold flex items-center gap-1">
                <Building2 className="w-3 h-3 text-stone-500" />
                Sentra / Lokasi
              </span>
              <span className="text-xs font-bold text-stone-900 block mt-0.5 truncate" title={entry.group_category}>
                {entry.group_category}
              </span>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-400 block font-semibold flex items-center gap-1">
                <FileText className="w-3 h-3 text-stone-500" />
                Jenis Aktifitas
              </span>
              <span className="text-xs font-bold text-stone-900 block mt-0.5">
                {entry.activity_type || 'Bongkar Muatan Biomassa'}
              </span>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-400 block font-semibold">Jam Tiba</span>
              <span className="text-xs font-mono font-bold text-stone-900 block mt-0.5">
                {entry.arrival_time || '-'} WIB
              </span>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-400 block font-semibold">Jam Berangkat</span>
              <span className="text-xs font-mono font-bold text-stone-900 block mt-0.5">
                {entry.departure_time || '-'} WIB
              </span>
            </div>
          </div>

          {/* Rincian Berat Timbangan */}
          <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-400" />
              Kalkulasi Hasil Jembatan Timbang
            </span>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 bg-stone-800 rounded-xl">
                <span className="text-[10px] text-stone-400 block">Berat Kotor (Gross)</span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {entry.gross_weight.toLocaleString('id-ID')} Kg
                </span>
              </div>

              <div className="p-2.5 bg-stone-800 rounded-xl">
                <span className="text-[10px] text-stone-400 block">Berat Kosong (Tara)</span>
                <span className="text-sm font-bold text-amber-300 block mt-0.5">
                  {entry.tare_weight.toLocaleString('id-ID')} Kg
                </span>
              </div>

              <div className="p-2.5 bg-emerald-900/80 border border-emerald-500/50 rounded-xl">
                <span className="text-[10px] text-emerald-300 block font-bold">Berat Bersih (Netto)</span>
                <span className="text-base font-extrabold text-emerald-300 block mt-0.5">
                  {entry.net_weight.toLocaleString('id-ID')} Kg
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-300/80 text-center font-mono pt-1 border-t border-stone-800">
              Rumus: {entry.gross_weight.toLocaleString('id-ID')} Kg (Kotor) - {entry.tare_weight.toLocaleString('id-ID')} Kg (Kosong) = <strong>{entry.net_weight.toLocaleString('id-ID')} Kg (Netto / {(entry.net_weight / 1000).toFixed(2)} Ton)</strong>
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-[10px] text-stone-400 font-semibold block">Catatan & Kondisi Muatan:</span>
            <p className="text-xs text-stone-800 mt-0.5 italic">
              {entry.notes || (entry.condition === 'basah' ? 'Muatan basah' : 'Kering normal tanpa kendala')}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 px-6 py-3.5 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Slip Timbangan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
