import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../types';
import { getIndonesianDay, getTodayDateString, formatRupiah } from '../../utils/dateUtils';
import { X, Save, TrendingUp, Calculator } from 'lucide-react';

interface SaleFormModalProps {
  initialData?: Sale | null;
  onClose: () => void;
}

export const SaleFormModal: React.FC<SaleFormModalProps> = ({
  initialData,
  onClose,
}) => {
  const { programs, itemTypes, addSale, updateSale } = useApp();

  const isEdit = !!initialData;
  const today = getTodayDateString();

  const [programId, setProgramId] = useState(initialData?.program_id || (programs[0]?.id || ''));
  const [date, setDate] = useState(initialData?.date || today);
  const [day, setDay] = useState(initialData?.day || getIndonesianDay(today));
  const [itemType, setItemType] = useState(initialData?.item_type || '');
  const [weight, setWeight] = useState<string>(initialData ? String(initialData.weight) : '');
  const [price, setPrice] = useState<string>(initialData ? String(initialData.price) : '');
  const [buyer, setBuyer] = useState(initialData?.buyer || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [transactionNo, setTransactionNo] = useState(initialData?.transaction_no || '');
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true);

  // Auto-sync day when date changes
  useEffect(() => {
    setDay(getIndonesianDay(date));
  }, [date]);

  // Suggested items for program
  const suggestedItems = itemTypes.filter((i) => i.program_id === programId);

  // When picking a suggested item, auto-fill price
  const handleSelectSuggestedItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setItemType(val);
    const found = suggestedItems.find((i) => i.name === val);
    if (found && !price) {
      setPrice(String(found.defaultPrice));
    }
  };

  // Automatic calculation: Jumlah = Berat * Harga
  const parsedWeight = parseFloat(weight) || 0;
  const parsedPrice = parseFloat(price) || 0;
  const calculatedTotal = Math.round(parsedWeight * parsedPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!programId || !itemType.trim()) {
      alert('Mohon lengkapi program dan jenis barang.');
      return;
    }

    if (parsedWeight <= 0 || parsedPrice <= 0) {
      alert('Berat dan harga satuan harus lebih dari 0.');
      return;
    }

    if (isEdit && initialData) {
      updateSale(initialData.id, {
        program_id: programId,
        date,
        day,
        item_type: itemType.trim(),
        weight: parsedWeight,
        price: parsedPrice,
        total: calculatedTotal,
        buyer: buyer.trim(),
        notes: notes.trim(),
        transaction_no: transactionNo.trim() || initialData.transaction_no,
        is_public: isPublic,
      });
    } else {
      addSale({
        program_id: programId,
        date,
        day,
        item_type: itemType.trim(),
        weight: parsedWeight,
        price: parsedPrice,
        buyer: buyer.trim(),
        notes: notes.trim(),
        transaction_no: transactionNo.trim(),
        is_public: isPublic,
        created_by: 'Admin KANG DIKIN',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isEdit ? 'Ubah Data Penjualan' : 'Catat Penjualan Komoditas'}
              </h3>
              <p className="text-xs text-emerald-300">Pemasukan Kas DANA BERSAMA KANG DIKIN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            {/* Program */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Program Terkait <span className="text-rose-500">*</span>
              </label>
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {programs
                  .filter((p) => p.is_active)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
              </select>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Tanggal Penjualan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Hari (auto) */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Hari Transaksi</label>
              <input
                type="text"
                value={day}
                readOnly
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-stone-600 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Jenis Barang */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1 flex items-center justify-between">
                <span>
                  Jenis Barang / Material <span className="text-rose-500">*</span>
                </span>
                {suggestedItems.length > 0 && (
                  <span className="text-[11px] font-normal text-stone-500">Pilih dari katalog atau ketik</span>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Misal: Kardus Bekas, Botol PET, Gula Aren..."
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  required
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
                />
                {suggestedItems.length > 0 && (
                  <select
                    onChange={handleSelectSuggestedItem}
                    className="bg-stone-100 border border-stone-300 rounded-xl px-2.5 py-2 text-stone-700 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilihan Cepat
                    </option>
                    {suggestedItems.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Berat */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Berat Terjual (Kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Contoh: 50"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Harga Satuan */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Harga per Kg (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="100"
                min="100"
                placeholder="Contoh: 3000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Automatic Total Highlight Box */}
            <div className="col-span-2 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                    Jumlah Nilai Penjualan (Otomatis: Berat × Harga)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    {parsedWeight} Kg × Rp{parsedPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-950 font-mono">
                  {formatRupiah(calculatedTotal)}
                </span>
              </div>
            </div>

            {/* Pembeli / Mitra */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Pihak Pembeli / Mitra Industri
              </label>
              <input
                type="text"
                placeholder="Misal: CV Pengepul Barokah, Pabrik Daur Ulang..."
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Nomor Bukti */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Nomor Bukti (Opsional)</label>
              <input
                type="text"
                placeholder="Otomatis jika kosong"
                value={transactionNo}
                onChange={(e) => setTransactionNo(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Tampilkan ke Publik */}
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isPublicSale"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isPublicSale" className="font-semibold text-stone-700 cursor-pointer">
                Tampilkan di Laporan Publik
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Simpan Perubahan' : 'Simpan Penjualan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
