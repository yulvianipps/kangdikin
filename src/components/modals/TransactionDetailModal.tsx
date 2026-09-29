import React from 'react';
import { X, Calendar, MapPin, Tag, User, DollarSign, Weight, FileText, CheckCircle2, Printer, Truck, Clock } from 'lucide-react';
import { Deposit, Sale, Utilization, BiomassEntry } from '../../types';
import { formatRupiah } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';

type DetailData =
  | { type: 'deposit'; data: Deposit }
  | { type: 'sale'; data: Sale }
  | { type: 'utilization'; data: Utilization }
  | { type: 'biomass'; data: BiomassEntry };

interface TransactionDetailModalProps {
  item: DetailData;
  onClose: () => void;
  onPrint?: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  item,
  onClose,
  onPrint,
}) => {
  const { getProgramName, getRWName, getRTName } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              {item.type === 'deposit' && 'STR'}
              {item.type === 'sale' && 'PJL'}
              {item.type === 'utilization' && 'PMF'}
              {item.type === 'biomass' && 'BIO'}
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight font-serif">
                {item.type === 'deposit' && 'Rincian Data Setoran'}
                {item.type === 'sale' && 'Rincian Transaksi Penjualan'}
                {item.type === 'utilization' && 'Rincian Penyaluran Dana'}
                {item.type === 'biomass' && 'Rincian Manifest Timbangan'}
              </h3>
              <p className="text-[11px] text-stone-400 font-mono">
                {item.type === 'biomass'
                  ? `Plat: ${item.data.vehicle_plate || item.data.license_plate || '-'} • ${item.data.biomass_type || 'Aren'}`
                  : item.data.transaction_no}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* DEPOSIT DETAIL */}
          {item.type === 'deposit' && (
            <div className="space-y-3">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/80">
                  <span className="text-stone-500 font-medium">Nomor Transaksi:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {item.data.transaction_no}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Program:</span>
                  <span className="font-bold text-stone-900">
                    {getProgramName(item.data.program_id)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Tanggal Transaksi:</span>
                  <span className="font-medium text-stone-900">
                    {item.data.day}, {item.data.date}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Nama Penyetor:</span>
                  <span className="font-bold text-stone-900">
                    {item.data.citizen_name || 'Warga Setempat'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Wilayah:</span>
                  <span className="font-medium text-stone-900">
                    {getRWName(item.data.rw_id)} — {getRTName(item.data.rt_id)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-stone-200/80">
                  <span className="text-stone-500 font-medium text-sm">Berat Disetor:</span>
                  <span className="font-mono font-extrabold text-emerald-800 text-base">
                    {item.data.weight.toLocaleString('id-ID')} Kg
                  </span>
                </div>
              </div>

              {item.data.notes && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-stone-700">
                  <div className="text-[11px] font-bold text-amber-900 mb-1">Catatan Tambahan:</div>
                  <div className="italic">{item.data.notes}</div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                <span>Dicatat oleh: {item.data.created_by || 'Petugas'}</span>
                <span>ID: {item.data.id}</span>
              </div>
            </div>
          )}

          {/* SALE DETAIL */}
          {item.type === 'sale' && (
            <div className="space-y-3">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/80">
                  <span className="text-stone-500 font-medium">Nomor Nota Penjualan:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {item.data.transaction_no}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Program:</span>
                  <span className="font-bold text-stone-900">
                    {getProgramName(item.data.program_id)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Komoditas / Jenis Barang:</span>
                  <span className="font-bold text-emerald-800 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                    {item.data.item_type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Mitra Pembeli:</span>
                  <span className="font-bold text-stone-900">
                    {item.data.buyer || 'Mitra Pengepul / Offtaker'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Tanggal Penjualan:</span>
                  <span className="font-medium text-stone-900">
                    {item.data.day}, {item.data.date}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Volume Penjualan:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {item.data.weight.toLocaleString('id-ID')} Kg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Harga Satuan:</span>
                  <span className="font-mono font-medium text-stone-900">
                    {formatRupiah(item.data.price)} / Kg
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-stone-200/80">
                  <span className="text-stone-500 font-medium text-sm">Total Nilai Kas:</span>
                  <span className="font-mono font-extrabold text-emerald-800 text-base">
                    {formatRupiah(item.data.total || item.data.weight * item.data.price)}
                  </span>
                </div>
              </div>

              {item.data.notes && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-stone-700">
                  <div className="text-[11px] font-bold text-amber-900 mb-1">Catatan Transaksi:</div>
                  <div className="italic">{item.data.notes}</div>
                </div>
              )}
            </div>
          )}

          {/* UTILIZATION DETAIL */}
          {item.type === 'utilization' && (
            <div className="space-y-3">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/80">
                  <span className="text-stone-500 font-medium">Nomor Bukti Kas:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {item.data.transaction_no}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Program:</span>
                  <span className="font-bold text-stone-900">
                    {getProgramName(item.data.program_id)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Jenis Pemanfaatan:</span>
                  <span className="font-bold text-amber-900 px-2 py-0.5 bg-amber-50 rounded border border-amber-200">
                    {item.data.type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Penerima Manfaat:</span>
                  <span className="font-bold text-stone-900">
                    {item.data.recipient || 'Warga Penerima'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Wilayah RW:</span>
                  <span className="font-medium text-stone-900">
                    {getRWName(item.data.rw_id)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Tanggal Penyaluran:</span>
                  <span className="font-medium text-stone-900">
                    {item.data.day}, {item.data.date}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-stone-200/80">
                  <span className="text-stone-500 font-medium text-sm">Jumlah Dana Disalurkan:</span>
                  <span className="font-mono font-extrabold text-rose-700 text-base">
                    {formatRupiah(item.data.amount)}
                  </span>
                </div>
              </div>

              {item.data.description && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-700">
                  <div className="text-[11px] font-bold text-stone-900 mb-1">Keterangan / Rincian Kegiatan:</div>
                  <div className="leading-relaxed">{item.data.description}</div>
                </div>
              )}
            </div>
          )}

          {/* BIOMASS DETAIL */}
          {item.type === 'biomass' && (
            <div className="space-y-3">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200/80">
                  <span className="text-stone-500 font-medium">Plat Nomor Truk:</span>
                  <span className="font-mono font-bold text-stone-900 text-sm bg-stone-200/80 px-2 py-0.5 rounded">
                    {item.data.vehicle_plate || item.data.license_plate || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Nama Sopir:</span>
                  <span className="font-bold text-stone-900">
                    {item.data.driver_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Kelompok Mitra / Pabrik:</span>
                  <span className="font-bold text-emerald-800">
                    {item.data.group_category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Jenis Biomassa:</span>
                  <span className="font-bold text-stone-900 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-800">
                    {item.data.biomass_type || 'Aren'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Tanggal Operasional:</span>
                  <span className="font-medium text-stone-900">
                    {item.data.date}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Jam Tiba & Berangkat:</span>
                  <span className="font-mono font-medium text-stone-900">
                    {item.data.arrival_time || '--:--'} s/d {item.data.departure_time || '--:--'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-stone-200/80 text-center">
                  <div className="p-2 bg-stone-100 rounded-xl">
                    <div className="text-[10px] text-stone-500">Bruto (Isi)</div>
                    <div className="font-mono font-bold text-stone-900 mt-0.5">
                      {item.data.gross_weight.toLocaleString('id-ID')} Kg
                    </div>
                  </div>
                  <div className="p-2 bg-stone-100 rounded-xl">
                    <div className="text-[10px] text-stone-500">Tara (Kosong)</div>
                    <div className="font-mono font-bold text-stone-600 mt-0.5">
                      {item.data.tare_weight.toLocaleString('id-ID')} Kg
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-100 text-emerald-950 rounded-xl">
                    <div className="text-[10px] text-emerald-700 font-bold">Netto Bersih</div>
                    <div className="font-mono font-extrabold text-emerald-900 mt-0.5">
                      {item.data.net_weight.toLocaleString('id-ID')} Kg
                    </div>
                  </div>
                </div>
              </div>

              {item.data.notes && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-stone-700">
                  <div className="text-[11px] font-bold text-amber-900 mb-1">Catatan Kondisi Muatan:</div>
                  <div className="italic">{item.data.notes}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3.5 border-t border-stone-200 flex items-center justify-between text-xs">
          {onPrint ? (
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Bukti</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
