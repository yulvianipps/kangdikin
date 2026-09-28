import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BiomassEntry } from '../../types';
import {
  X,
  Truck,
  Calendar,
  Clock,
  Weight,
  Layers,
  User,
  FileText,
  Tag,
  Building2,
} from 'lucide-react';

interface BiomassFormModalProps {
  initialData?: BiomassEntry | null;
  onClose: () => void;
  onOpenMasterManager?: () => void;
}

export const BiomassFormModal: React.FC<BiomassFormModalProps> = ({
  initialData,
  onClose,
  onOpenMasterManager,
}) => {
  const {
    addBiomassEntry,
    updateBiomassEntry,
    biomassPartners,
    biomassTypes,
    addBiomassPartner,
    addBiomassType,
    isStaff,
    user,
  } = useApp();

  const isArenStaff = isStaff && user?.assignedProgramId === 'prog-aren';

  const [date, setDate] = useState(
    initialData ? initialData.date : new Date().toISOString().slice(0, 10)
  );
  const [day, setDay] = useState(initialData ? initialData.day : 'Senin');
  const [shift, setShift] = useState(initialData ? initialData.shift : 'Shift 1 (Pagi)');
  const [activityType, setActivityType] = useState(
    initialData ? initialData.activity_type : 'Bongkar Muatan Biomassa'
  );
  const [vehiclePlate, setVehiclePlate] = useState(
    initialData ? initialData.vehicle_plate : ''
  );
  const [driverName, setDriverName] = useState(
    initialData ? initialData.driver_name : ''
  );
  const [arrivalTime, setArrivalTime] = useState(
    initialData ? initialData.arrival_time : '08:00'
  );
  const [departureTime, setDepartureTime] = useState(
    initialData ? initialData.departure_time : '09:00'
  );
  const [grossWeight, setGrossWeight] = useState<number | string>(
    initialData ? initialData.gross_weight : ''
  );
  const [tareWeight, setTareWeight] = useState<number | string>(
    initialData ? initialData.tare_weight : ''
  );

  // Kelompok Mitra / Stokpile
  const defaultPartner =
    initialData?.group_category ||
    (isArenStaff ? 'Fasprod Ciamis' : (biomassPartners[0]?.name || 'Stokpile Indramayu'));
  const [groupCategory, setGroupCategory] = useState(defaultPartner);
  const [customGroup, setCustomGroup] = useState('');
  const [isCustomGroup, setIsCustomGroup] = useState(false);

  // Jenis Biomassa (Aren, Kayu, dll)
  const defaultType =
    initialData?.biomass_type ||
    (isArenStaff ? 'Serbuk Aren' : (biomassTypes[0]?.name || 'Aren'));
  const [biomassType, setBiomassType] = useState(defaultType);
  const [customType, setCustomType] = useState('');
  const [isCustomType, setIsCustomType] = useState(false);

  // Notes & condition (e.g. basah)
  const [notes, setNotes] = useState(
    initialData ? initialData.notes || initialData.condition || '' : ''
  );

  // Calculate day name automatically when date changes
  useEffect(() => {
    if (!date) return;
    const dateObj = new Date(date);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const calculatedDay = dayNames[dateObj.getDay()];
    setDay(calculatedDay);
  }, [date]);

  const grossNum = Number(grossWeight) || 0;
  const tareNum = Number(tareWeight) || 0;
  const netNum = Math.max(0, grossNum - tareNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehiclePlate.trim()) {
      alert('Nomor Polisi Truk wajib diisi.');
      return;
    }
    if (grossNum <= 0) {
      alert('Berat Kotor harus lebih besar dari 0 Kg.');
      return;
    }
    if (tareNum < 0) {
      alert('Berat Kosong tidak boleh negatif.');
      return;
    }
    if (grossNum < tareNum) {
      alert('Berat Kotor tidak boleh lebih kecil daripada Berat Kosong (Tara).');
      return;
    }

    let finalGroup = isCustomGroup && customGroup.trim() ? customGroup.trim() : groupCategory;
    if (isCustomGroup && customGroup.trim()) {
      // automatically add to master list if not exists
      const exists = biomassPartners.some(
        (p) => p.name.toLowerCase() === customGroup.trim().toLowerCase()
      );
      if (!exists) {
        addBiomassPartner({
          name: customGroup.trim(),
          type: 'mitra_lain',
          location: 'Jawa Barat',
        });
      }
    }

    let finalType = isCustomType && customType.trim() ? customType.trim() : biomassType;
    if (isCustomType && customType.trim()) {
      const exists = biomassTypes.some(
        (t) => t.name.toLowerCase() === customType.trim().toLowerCase()
      );
      if (!exists) {
        addBiomassType({
          name: customType.trim(),
        });
      }
    }

    const matchedPartner = biomassPartners.find(
      (p) => p.name.toLowerCase() === finalGroup.toLowerCase()
    );

    const isWet = notes.toLowerCase().includes('basah');

    if (initialData) {
      updateBiomassEntry(initialData.id, {
        date,
        day,
        shift,
        activity_type: activityType,
        partner_id: matchedPartner?.id,
        group_category: finalGroup,
        biomass_type: finalType,
        vehicle_plate: vehiclePlate.toUpperCase().trim(),
        driver_name: driverName.trim() || `Sopir ${vehiclePlate.toUpperCase().trim()}`,
        arrival_time: arrivalTime,
        departure_time: departureTime,
        gross_weight: grossNum,
        tare_weight: tareNum,
        condition: isWet ? 'basah' : 'standar',
        notes: notes.trim(),
      });
    } else {
      addBiomassEntry({
        date,
        day,
        shift,
        activity_type: activityType,
        partner_id: matchedPartner?.id,
        group_category: finalGroup,
        biomass_type: finalType,
        vehicle_plate: vehiclePlate.toUpperCase().trim(),
        driver_name: driverName.trim() || `Sopir ${vehiclePlate.toUpperCase().trim()}`,
        arrival_time: arrivalTime,
        departure_time: departureTime,
        gross_weight: grossNum,
        tare_weight: tareNum,
        condition: isWet ? 'basah' : 'standar',
        notes: notes.trim(),
        transaction_no: '',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {initialData ? 'Edit Data Penimbangan Biomassa' : 'Input Data Timbang Biomassa'}
              </h3>
              <p className="text-xs text-emerald-300">
                Pencatatan jembatan timbang ritase truk & bobot netto biomassa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
          {/* Section 1: Tanggal & Shift */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Tanggal Operasional & Shift</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tanggal <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hari</label>
                <input
                  type="text"
                  value={day}
                  readOnly
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-stone-600 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Shift Kerja
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  <option value="Shift 1 (Pagi)">Shift 1 (Pagi)</option>
                  <option value="Shift 2 (Siang)">Shift 2 (Siang)</option>
                  <option value="Shift 3 (Malam)">Shift 3 (Malam)</option>
                  <option value="Reguler">Reguler</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Kelompok Mitra & Pilihan Jenis Biomassa */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Kelompok Mitra / Stokpile & Jenis Biomassa</span>
              </span>
              {onOpenMasterManager && (
                <button
                  type="button"
                  onClick={onOpenMasterManager}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline"
                >
                  Kelola Master Mitra & Jenis
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Kelompok Mitra / Stokpile */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Kelompok Mitra / Stokpile / Fasprod <span className="text-rose-500">*</span>
                </label>
                {!isCustomGroup ? (
                  <select
                    value={groupCategory}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomGroup(true);
                      } else {
                        setGroupCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    {biomassPartners.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} {p.code ? `(${p.code})` : ''}
                      </option>
                    ))}
                    <option value="custom">+ Tulis Kelompok/Lokasi Baru...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customGroup}
                      onChange={(e) => setCustomGroup(e.target.value)}
                      placeholder="Nama kelompok/stokpile baru..."
                      required
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomGroup(false)}
                      className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-xl text-[11px] font-semibold"
                    >
                      Batal
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Misal: Stokpile Indramayu, Fasprod Ciamis, dll.
                </span>
              </div>

              {/* Pilihan Jenis Biomassa (Aren, dll) */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pilihan Jenis Biomassa <span className="text-rose-500">*</span>
                </label>
                {!isCustomType ? (
                  <select
                    value={biomassType}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomType(true);
                      } else {
                        setBiomassType(e.target.value);
                      }
                    }}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    {biomassTypes.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                    <option value="custom">+ Tulis Jenis Biomassa Baru...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      placeholder="Ketik jenis biomassa baru..."
                      required
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomType(false)}
                      className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-xl text-[11px] font-semibold"
                    >
                      Batal
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Misal: Aren, Kayu Limbah, Sekam Padi, Sawit, Briket, dll.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Truk & Penimbangan */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
            <div className="font-bold text-emerald-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-emerald-800" />
                <span>Armada Truk & Rumus Timbangan (Gross - Tara = Netto)</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                Otomatis Hitung
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-emerald-950 mb-1">
                  No Polisi Truk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  placeholder="misal: Z 9415 TA, E 8631 AW, D 8315 TC"
                  required
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-stone-900 font-bold tracking-wider uppercase focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-950 mb-1">
                  Nama Sopir / Operator
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="misal: Sopir 1 / Bpk. Suhanda"
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-950 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Jam Tiba</span>
                </label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-950 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Jam Berangkat</span>
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Input Berat Kotor & Berat Kosong */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-200/60">
              <div>
                <label className="block font-semibold text-emerald-950 mb-1">
                  1. Berat Kotor (Gross) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    placeholder="misal: 10950"
                    required
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2.5 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                    Kg
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 block mt-0.5">
                  Truk + muatan
                </span>
              </div>

              <div>
                <label className="block font-semibold text-emerald-950 mb-1">
                  2. Berat Kosong (Tara) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={tareWeight}
                    onChange={(e) => setTareWeight(e.target.value)}
                    placeholder="misal: 4130"
                    required
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2.5 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                    Kg
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 block mt-0.5">
                  Truk kosong
                </span>
              </div>

              {/* Netto preview */}
              <div className="bg-emerald-900 text-white p-3 rounded-xl flex flex-col justify-center shadow-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                  3. Netto (Hasil Bersih)
                </span>
                <div className="text-xl font-extrabold font-mono text-emerald-300 mt-0.5">
                  {netNum.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-sans text-white">kg</span>
                </div>
                <span className="text-[10px] text-emerald-300/80 mt-0.5 font-mono">
                  {grossNum ? grossNum.toLocaleString('id-ID') : '0'} - {tareNum ? tareNum.toLocaleString('id-ID') : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Catatan / Kondisi (misal: "basah") */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Catatan Khusus / Kondisi (misal: basah / kering / kadar air)
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="misal: basah, kering normal, kadar air tinggi..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none placeholder:text-stone-400"
              />
            </div>
            <div className="flex gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => setNotes('basah')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                  notes.toLowerCase() === 'basah'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
              >
                + Keterangan "basah"
              </button>
              <button
                type="button"
                onClick={() => setNotes('')}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200"
              >
                Hapus catatan
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{initialData ? 'Simpan Perubahan' : 'Simpan Data Timbang'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
