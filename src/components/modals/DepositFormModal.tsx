import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Deposit } from '../../types';
import { getIndonesianDay, getTodayDateString } from '../../utils/dateUtils';
import { X, Save, Scale } from 'lucide-react';

interface DepositFormModalProps {
  initialData?: Deposit | null;
  onClose: () => void;
}

export const DepositFormModal: React.FC<DepositFormModalProps> = ({
  initialData,
  onClose,
}) => {
  const { programs, rws, rts, addDeposit, updateDeposit, isStaff, userProgramId, userProgramName } = useApp();

  const isEdit = !!initialData;
  const today = getTodayDateString();

  const defaultProgramId = initialData?.program_id || (isStaff && userProgramId ? userProgramId : (programs[0]?.id || ''));
  const [programId, setProgramId] = useState(defaultProgramId);
  const [date, setDate] = useState(initialData?.date || today);
  const [day, setDay] = useState(initialData?.day || getIndonesianDay(today));
  const [rwId, setRwId] = useState(initialData?.rw_id || (rws[0]?.id || ''));
  const [rtId, setRtId] = useState(initialData?.rt_id || '');
  const [citizenName, setCitizenName] = useState(initialData?.citizen_name || '');
  const [weight, setWeight] = useState<string>(initialData ? String(initialData.weight) : '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [transactionNo, setTransactionNo] = useState(initialData?.transaction_no || '');
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true);

  // Auto-sync day when date changes
  useEffect(() => {
    setDay(getIndonesianDay(date));
  }, [date]);

  // Available RTs for selected RW
  const availableRTs = rts.filter((rt) => rt.rw_id === rwId);

  // Auto select first RT if current not valid
  useEffect(() => {
    if (availableRTs.length > 0) {
      if (!rtId || !availableRTs.some((rt) => rt.id === rtId)) {
        setRtId(availableRTs[0].id);
      }
    } else {
      setRtId('');
    }
  }, [rwId, availableRTs, rtId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      alert('Mohon masukkan berat setoran yang valid (lebih dari 0).');
      return;
    }

    if (!programId || !rwId) {
      alert('Mohon pilih Program dan Wilayah RW.');
      return;
    }

    if (isEdit && initialData) {
      updateDeposit(initialData.id, {
        program_id: programId,
        date,
        day,
        rw_id: rwId,
        rt_id: rtId,
        citizen_name: citizenName.trim() || undefined,
        weight: parsedWeight,
        notes: notes.trim(),
        transaction_no: transactionNo.trim() || initialData.transaction_no,
        is_public: isPublic,
      });
    } else {
      addDeposit({
        program_id: programId,
        date,
        day,
        rw_id: rwId,
        rt_id: rtId,
        citizen_name: citizenName.trim() || undefined,
        weight: parsedWeight,
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
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isEdit ? 'Ubah Data Setoran' : 'Catat Setoran Baru'}
              </h3>
              <p className="text-xs text-emerald-300">Formulir Pencatatan Bahan & Material Warga</p>
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
                {isStaff && (
                  <span className="ml-2 text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Terkunci Khusus {userProgramName}
                  </span>
                )}
              </label>
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                disabled={isStaff && !!userProgramId}
                required
                className={`w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none ${
                  isStaff && !!userProgramId ? 'bg-stone-100 cursor-not-allowed text-stone-600' : ''
                }`}
              >
                {programs
                  .filter((p) => (isStaff && userProgramId ? p.id === userProgramId : p.is_active))
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
                Tanggal Setoran <span className="text-rose-500">*</span>
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

            {/* RW */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Wilayah RW <span className="text-rose-500">*</span>
              </label>
              <select
                value={rwId}
                onChange={(e) => setRwId(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {rws.map((rw) => (
                  <option key={rw.id} value={rw.id}>
                    {rw.name}
                  </option>
                ))}
              </select>
            </div>

            {/* RT */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Wilayah RT <span className="text-rose-500">*</span>
              </label>
              <select
                value={rtId}
                onChange={(e) => setRtId(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {availableRTs.length === 0 ? (
                  <option value="">Belum ada RT</option>
                ) : (
                  availableRTs.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Nama Warga / Penyetor */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Nama Warga / Penyetor <span className="text-stone-400 font-normal text-xs">(Opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Bpk. Bambang / Ibu Rohimah"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none placeholder:text-stone-400"
              />
            </div>

            {/* Berat */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Berat Setoran (Kg) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Contoh: 25.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 text-base font-bold focus:ring-2 focus:ring-emerald-600 outline-none pr-12"
                />
                <span className="absolute right-3 top-2.5 text-stone-500 font-bold">Kg</span>
              </div>
            </div>

            {/* Catatan */}
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Catatan / Keterangan Material
              </label>
              <input
                type="text"
                placeholder="Misal: Kardus bersih & botol plastik PET RT 02"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Nomor Transaksi Manual (Opsional) */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nomor Bukti (Opsional)
              </label>
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
                id="isPublicDeposit"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isPublicDeposit" className="font-semibold text-stone-700 cursor-pointer">
                Tampilkan di Dashboard Publik
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
              {isEdit ? 'Simpan Perubahan' : 'Simpan Setoran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
