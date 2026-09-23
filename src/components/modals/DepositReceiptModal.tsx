import React from 'react';
import { Deposit } from '../../types';
import { useApp } from '../../context/AppContext';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatIndonesianDate } from '../../utils/dateUtils';

interface DepositReceiptModalProps {
  deposit: Deposit;
  onClose: () => void;
}

export const DepositReceiptModal: React.FC<DepositReceiptModalProps> = ({ deposit, onClose }) => {
  const { getProgramName, getRWName, getRTName } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden">
        {/* Modal Top Bar (hidden during print) */}
        <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h3 className="font-bold text-stone-900 text-sm">Resi Bukti Timbang Digital</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Resi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div id="printable-receipt" className="p-8 bg-white space-y-6 text-stone-800">
          {/* Header Kop */}
          <div className="text-center border-b-2 border-dashed border-stone-300 pb-5 space-y-1">
            <div className="text-xl font-black tracking-wider text-emerald-900 font-serif">
              KANG DIKIN
            </div>
            <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
              Kelola Lingkungan, Sadar Iklim dan Kesejahteraan Terintegrasi
            </div>
            <div className="text-[10px] text-stone-400">
              Posko Timbang & Bank Sampah Digital Desa • Kas Dana Bersama Warga
            </div>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">No. Resi Transaksi</span>
              <span className="font-mono font-bold text-stone-900">
                #KD-{deposit.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Tanggal Timbang</span>
              <span className="font-bold text-stone-900">
                {formatIndonesianDate(deposit.date)}
              </span>
            </div>
          </div>

          {/* Main Details Table */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Wilayah Rukun Warga</span>
              <strong className="text-stone-900">{getRWName(deposit.rw_id)}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Rukun Tetangga (RT)</span>
              <strong className="text-stone-900">RT {getRTName(deposit.rt_id)}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Program Penyetoran</span>
              <strong className="text-stone-900">{getProgramName(deposit.program_id)}</strong>
            </div>
            {deposit.notes && (
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Keterangan / Bahan</span>
                <span className="text-stone-700 italic">{deposit.notes}</span>
              </div>
            )}
          </div>

          {/* Total Weight Highlight */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-900 block">Total Berat Diterima</span>
              <span className="text-[11px] text-emerald-700">Timbangan terverifikasi petugas</span>
            </div>
            <div className="text-3xl font-black text-emerald-950 font-mono">
              {deposit.weight} <span className="text-base font-semibold">Kg</span>
            </div>
          </div>

          {/* Verification Badge & Signatures */}
          <div className="pt-4 border-t-2 border-dashed border-stone-300 grid grid-cols-2 gap-4 text-center text-xs">
            <div>
              <span className="text-stone-400 block mb-10">Penyetor / Koordinator RT</span>
              <span className="font-semibold text-stone-800 border-t border-stone-400 pt-1 block mx-4">
                ( Warga / Pengantar )
              </span>
            </div>
            <div>
              <span className="text-stone-400 block mb-10">Petugas Timbang KANG DIKIN</span>
              <span className="font-semibold text-stone-800 border-t border-stone-400 pt-1 block mx-4">
                ( Petugas Lapangan )
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Data resmi tercatat permanen di Buku Kas Terbuka KANG DIKIN</span>
          </div>
        </div>

        {/* Modal Bottom Actions (hidden during print) */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
