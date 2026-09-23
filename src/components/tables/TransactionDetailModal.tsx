import React from 'react';
import { useApp } from '../../context/AppContext';
import { Deposit, Sale, Utilization } from '../../types';
import { formatIndonesianDate, formatRupiah, formatWeight } from '../../utils/dateUtils';
import { printFormattedReport } from '../../utils/exportUtils';
import { X, Printer, Edit, Trash2, Shield, Calendar, Scale, MapPin, Tag, UserCheck, DollarSign, FileText } from 'lucide-react';

interface TransactionDetailModalProps {
  type: 'deposit' | 'sale' | 'utilization';
  data: Deposit | Sale | Utilization | null;
  onClose: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  type,
  data,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { isAdmin, getProgramName, getRWName, getRTName } = useApp();

  if (!data) return null;

  const handlePrint = () => {
    if (type === 'deposit') {
      const dep = data as Deposit;
      const headers = ['Informasi', 'Rincian'];
      const rows = [
        ['Nomor Transaksi', dep.transaction_no],
        ['Program', getProgramName(dep.program_id)],
        ['Hari & Tanggal', `${dep.day}, ${formatIndonesianDate(dep.date)}`],
        ['Wilayah RW / RT', `${getRWName(dep.rw_id)} / ${getRTName(dep.rt_id)}`],
        ['Berat Setoran', formatWeight(dep.weight)],
        ['Catatan / Deskripsi', dep.notes || '-'],
        ['Dicatat Oleh', dep.created_by],
        ['Status Transparansi', dep.is_public ? 'Publik Terbuka' : 'Internal'],
      ];
      printFormattedReport(`BUKTI RESMI SETORAN - ${dep.transaction_no}`, 'Program KANG DIKIN Terintegrasi', headers, rows);
    } else if (type === 'sale') {
      const sale = data as Sale;
      const headers = ['Informasi', 'Rincian'];
      const rows = [
        ['Nomor Transaksi', sale.transaction_no],
        ['Program', getProgramName(sale.program_id)],
        ['Hari & Tanggal', `${sale.day}, ${formatIndonesianDate(sale.date)}`],
        ['Jenis Barang', sale.item_type],
        ['Berat / Volume', formatWeight(sale.weight)],
        ['Harga Satuan', `${formatRupiah(sale.price)} / Kg`],
        ['Total Nilai Penjualan', formatRupiah(sale.total)],
        ['Pihak Pembeli / Mitra', sale.buyer || '-'],
        ['Dicatat Oleh', sale.created_by],
      ];
      printFormattedReport(`BUKTI PENJUALAN KOMODITAS - ${sale.transaction_no}`, 'Program KANG DIKIN Terintegrasi', headers, rows);
    } else {
      const util = data as Utilization;
      const headers = ['Informasi', 'Rincian'];
      const rows = [
        ['Nomor Transaksi', util.transaction_no],
        ['Program', getProgramName(util.program_id)],
        ['Hari & Tanggal', `${util.day}, ${formatIndonesianDate(util.date)}`],
        ['RW Penerima', getRWName(util.rw_id)],
        ['Jenis Pemanfaatan', util.type],
        ['Nilai Pemanfaatan', formatRupiah(util.amount)],
        ['Deskripsi Kegiatan', util.description],
        ['Penerima Manfaat', util.recipient || '-'],
        ['Dicatat Oleh', util.created_by],
      ];
      printFormattedReport(`BUKTI PENYALURAN PEMANFAATAN - ${util.transaction_no}`, 'Program KANG DIKIN Terintegrasi - DANA BERSAMA', headers, rows);
    }
  };

  const title =
    type === 'deposit'
      ? 'Detail Transaksi Setoran'
      : type === 'sale'
      ? 'Detail Transaksi Penjualan'
      : 'Detail Transaksi Pemanfaatan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">{title}</h3>
              <p className="text-xs text-stone-500 font-mono">{data.transaction_no}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Badge and Program */}
          <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200/80">
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block">Program KANG DIKIN</span>
              <span className="text-sm font-bold text-emerald-800">
                {getProgramName((data as any).program_id)}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md">
              DANA BERSAMA
            </span>
          </div>

          {/* Rincian Spesifik Sesuai Type */}
          {type === 'deposit' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" /> Hari & Tanggal
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {(data as Deposit).day}, {formatIndonesianDate((data as Deposit).date)}
                </span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 text-[11px] block flex items-center gap-1 font-semibold">
                  <Scale className="w-3 h-3 text-emerald-700" /> Berat Setoran
                </span>
                <span className="font-bold text-emerald-950 text-base mt-0.5 block">
                  {formatWeight((data as Deposit).weight)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" /> Rukun Warga (RW)
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {getRWName((data as Deposit).rw_id)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" /> Rukun Tetangga (RT)
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {getRTName((data as Deposit).rt_id)}
                </span>
              </div>
              {(data as Deposit).notes && (
                <div className="col-span-2 p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-500 text-[11px] block">Catatan Tambahan:</span>
                  <span className="text-stone-800 text-xs mt-0.5 block">{(data as Deposit).notes}</span>
                </div>
              )}
            </div>
          )}

          {type === 'sale' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" /> Hari & Tanggal
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {(data as Sale).day}, {formatIndonesianDate((data as Sale).date)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <Tag className="w-3 h-3 text-stone-400" /> Jenis Barang
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {(data as Sale).item_type}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <Scale className="w-3 h-3 text-stone-400" /> Berat / Volume
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {formatWeight((data as Sale).weight)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-stone-400" /> Harga Satuan
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {formatRupiah((data as Sale).price)} / satuan
                </span>
              </div>
              <div className="col-span-2 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-800 text-[11px] block font-semibold">
                  Total Nilai Penjualan (Jumlah = Berat × Harga)
                </span>
                <span className="font-black text-emerald-950 text-xl mt-1 block">
                  {formatRupiah((data as Sale).total)}
                </span>
              </div>
              {(data as Sale).buyer && (
                <div className="col-span-2 p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-stone-400" /> Pihak Pembeli / Mitra Industri:
                  </span>
                  <span className="font-semibold text-stone-800 text-xs mt-0.5 block">
                    {(data as Sale).buyer}
                  </span>
                </div>
              )}
            </div>
          )}

          {type === 'utilization' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" /> Hari & Tanggal
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {(data as Utilization).day}, {formatIndonesianDate((data as Utilization).date)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" /> RW Penerima Manfaat
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-1 block">
                  {getRWName((data as Utilization).rw_id)}
                </span>
              </div>
              <div className="col-span-2 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block flex items-center gap-1">
                  <Tag className="w-3 h-3 text-stone-400" /> Kategori Pemanfaatan
                </span>
                <span className="font-semibold text-stone-900 text-xs mt-0.5 block">
                  {(data as Utilization).type}
                </span>
              </div>
              <div className="col-span-2 p-3.5 bg-teal-50 rounded-xl border border-teal-200">
                <span className="text-teal-800 text-[11px] block font-semibold">
                  Nilai Penyaluran Dana Bersama
                </span>
                <span className="font-black text-teal-950 text-xl mt-1 block">
                  {formatRupiah((data as Utilization).amount)}
                </span>
              </div>
              <div className="col-span-2 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-500 text-[11px] block">Rincian Kegiatan / Pemanfaatan:</span>
                <p className="text-stone-800 text-xs mt-1 leading-relaxed">
                  {(data as Utilization).description}
                </p>
              </div>
              {(data as Utilization).recipient && (
                <div className="col-span-2 p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-500 text-[11px] block">Penerima Manfaat / Kelompok:</span>
                  <span className="font-semibold text-stone-800 text-xs mt-0.5 block">
                    {(data as Utilization).recipient}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Dicatat Oleh & Metadata */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Operator: {(data as any).created_by || 'Admin KANG DIKIN'}</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Shield className="w-3 h-3" /> Transparansi Terverifikasi
            </span>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
          {isAdmin ? (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Print
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {isAdmin && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(data);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
            )}

            {isAdmin && onDelete && (
              <button
                onClick={() => {
                  if (confirm(`Apakah Anda yakin ingin menghapus data ${data.transaction_no}?`)) {
                    onDelete(data.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
