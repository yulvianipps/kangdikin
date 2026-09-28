import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Utilization } from '../../types';
import { getIndonesianDay, getTodayDateString, formatRupiah } from '../../utils/dateUtils';
import { X, Save, HeartHandshake, Plus } from 'lucide-react';

interface UtilizationFormModalProps {
  initialData?: Utilization | null;
  onClose: () => void;
}

export const UtilizationFormModal: React.FC<UtilizationFormModalProps> = ({
  initialData,
  onClose,
}) => {
  const {
    programs,
    rws,
    utilizationTypes,
    addUtilizationType,
    addUtilization,
    updateUtilization,
    isStaff,
    userProgramId,
    userProgramName,
  } = useApp();

  const isEdit = !!initialData;
  const today = getTodayDateString();

  const defaultProgramId = initialData?.program_id || (isStaff && userProgramId ? userProgramId : (programs[0]?.id || ''));
  const [programId, setProgramId] = useState(defaultProgramId);
  const [date, setDate] = useState(initialData?.date || today);
  const [day, setDay] = useState(initialData?.day || getIndonesianDay(today));
  const [rwId, setRwId] = useState(initialData?.rw_id || (rws[0]?.id || ''));
  const [type, setType] = useState(initialData?.type || (utilizationTypes[0]?.name || 'Kegiatan Lingkungan'));
  const [amount, setAmount] = useState<string>(initialData ? String(initialData.amount) : '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [recipient, setRecipient] = useState(initialData?.recipient || '');
  const [transactionNo, setTransactionNo] = useState(initialData?.transaction_no || '');
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true);

  // New type inline adder
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  // Auto-sync day when date changes
  useEffect(() => {
    setDay(getIndonesianDay(date));
  }, [date]);

  const handleAddNewType = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newTypeName.trim()) {
      addUtilizationType({
        name: newTypeName.trim(),
        description: 'Kategori kustom oleh Admin',
      });
      setType(newTypeName.trim());
      setNewTypeName('');
      setShowNewTypeInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Mohon masukkan jumlah nilai pemanfaatan yang valid (lebih dari 0).');
      return;
    }

    if (!programId || !rwId || !type.trim() || !description.trim()) {
      alert('Mohon lengkapi seluruh kolom yang wajib diisi.');
      return;
    }

    if (isEdit && initialData) {
      updateUtilization(initialData.id, {
        program_id: programId,
        date,
        day,
        rw_id: rwId,
        type: type.trim(),
        amount: parsedAmount,
        description: description.trim(),
        recipient: recipient.trim(),
        transaction_no: transactionNo.trim() || initialData.transaction_no,
        is_public: isPublic,
      });
    } else {
      addUtilization({
        program_id: programId,
        date,
        day,
        rw_id: rwId,
        type: type.trim(),
        amount: parsedAmount,
        description: description.trim(),
        recipient: recipient.trim(),
        transaction_no: transactionNo.trim(),
        is_public: isPublic,
        created_by: 'Admin KANG DIKIN',
      });
    }
    onClose();
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center text-teal-200">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isEdit ? 'Ubah Data Pemanfaatan' : 'Catat Penyaluran Pemanfaatan'}
              </h3>
              <p className="text-xs text-teal-200">Alokasi Kas DANA BERSAMA untuk Masyarakat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-teal-200 hover:text-white rounded-lg hover:bg-teal-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            {/* Program */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Program Sumber Dana <span className="text-rose-500">*</span>
                {isStaff && (
                  <span className="block text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 w-fit mt-0.5">
                    Terkunci: {userProgramName}
                  </span>
                )}
              </label>
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                disabled={isStaff && !!userProgramId}
                required
                className={`w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-teal-600 outline-none ${
                  isStaff && !!userProgramId ? 'bg-stone-100 cursor-not-allowed text-stone-600' : ''
                }`}
              >
                {programs
                  .filter((p) => (isStaff && userProgramId ? p.id === userProgramId : p.is_active))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* RW Penerima */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                RW Penerima Manfaat <span className="text-rose-500">*</span>
              </label>
              <select
                value={rwId}
                onChange={(e) => setRwId(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-teal-600 outline-none"
              >
                {rws.map((rw) => (
                  <option key={rw.id} value={rw.id}>
                    {rw.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Tanggal Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            {/* Hari */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Hari Transaksi</label>
              <input
                type="text"
                value={day}
                readOnly
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-stone-600 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Jenis Pemanfaatan */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-stone-700">
                  Jenis Pemanfaatan <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewTypeInput(!showNewTypeInput)}
                  className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3 h-3" /> Tambah Kategori Baru
                </button>
              </div>

              {showNewTypeInput ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ketik kategori pemanfaatan baru..."
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="flex-1 bg-stone-50 border border-teal-300 rounded-xl px-3 py-2 text-stone-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewType}
                    className="px-3 py-2 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-teal-600 outline-none"
                >
                  {utilizationTypes.map((ut) => (
                    <option key={ut.id} value={ut.name}>
                      {ut.name}
                    </option>
                  ))}
                  <option value="Program Lainnya">Program Lainnya</option>
                </select>
              )}
            </div>

            {/* Nilai Jumlah Pemanfaatan */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Jumlah Nilai Pemanfaatan (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-stone-500 font-bold">Rp</span>
                <input
                  type="number"
                  step="5000"
                  min="1000"
                  placeholder="Contoh: 500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-stone-900 text-base font-bold focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>
              {parsedAmount > 0 && (
                <p className="text-[11px] text-teal-700 mt-1 font-semibold">
                  Terbaca: {formatRupiah(parsedAmount)}
                </p>
              )}
            </div>

            {/* Deskripsi Kegiatan */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Deskripsi Kegiatan / Pemanfaatan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Rincian peruntukan bantuan atau pengadaan fasilitas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            {/* Penerima Manfaat */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Penerima Manfaat / Kelompok Sasaran
              </label>
              <input
                type="text"
                placeholder="Misal: Warga Lansia RT 01, Satgas Kebersihan RW 02..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            {/* Nomor Bukti Transaksi */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Nomor Bukti (Opsional)</label>
              <input
                type="text"
                placeholder="Otomatis jika kosong"
                value={transactionNo}
                onChange={(e) => setTransactionNo(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono text-xs focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            {/* Tampilkan ke Publik */}
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isPublicUtil"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="isPublicUtil" className="font-semibold text-stone-700 cursor-pointer">
                Tampilkan di Laporan Transparansi Publik
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
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Simpan Perubahan' : 'Simpan Pemanfaatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
