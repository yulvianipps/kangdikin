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
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface BiomassFormModalProps {
  initialData?: BiomassEntry | null;
  targetCategory?: 'aren' | 'kayu' | 'all';
  onClose: () => void;
  onOpenMasterManager?: () => void;
}

export const BiomassFormModal: React.FC<BiomassFormModalProps> = ({
  initialData,
  targetCategory = 'all',
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

  const isArenScoped =
    targetCategory === 'aren' || (isStaff && user?.assignedProgramId === 'prog-aren');
  const isKayuScoped =
    targetCategory === 'kayu' || (isStaff && user?.assignedProgramId === 'prog-kayu');

  const [date, setDate] = useState(
    initialData ? initialData.date : new Date().toISOString().slice(0, 10)
  );
  const [day, setDay] = useState(initialData ? initialData.day : 'Senin');
  const [shift, setShift] = useState(initialData ? initialData.shift : 'Shift 1 (Pagi)');
  
  // Jenis Aktifitas
  const defaultActivity = initialData
    ? initialData.activity_type
    : isArenScoped
    ? 'Bongkar Muatan Biomassa Aren'
    : isKayuScoped
    ? 'Pasok Kayu Sengon Rakyat'
    : 'Bongkar Muatan Biomassa';
  const [activityType, setActivityType] = useState(defaultActivity);

  // Truk & Sopir
  const defaultPlate = initialData
    ? initialData.vehicle_plate
    : isArenScoped
    ? 'Z 9415 TA'
    : isKayuScoped
    ? 'E 8234 AA'
    : '';
  const [vehiclePlate, setVehiclePlate] = useState(defaultPlate);

  const defaultDriver = initialData
    ? initialData.driver_name
    : isArenScoped
    ? 'Yulviani Puteri Puspita Sari'
    : isKayuScoped
    ? 'Bpk. Tarsono'
    : '';
  const [driverName, setDriverName] = useState(defaultDriver);

  const [arrivalTime, setArrivalTime] = useState(
    initialData ? initialData.arrival_time : '08:30'
  );
  const [departureTime, setDepartureTime] = useState(
    initialData ? initialData.departure_time : '09:45'
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
    (isArenScoped
      ? 'Fasprod Ciamis (Sentra Aren)'
      : isKayuScoped
      ? 'Stokpile Indramayu'
      : (biomassPartners[0]?.name || 'Fasprod Ciamis'));
  const [groupCategory, setGroupCategory] = useState(defaultPartner);
  const [customGroup, setCustomGroup] = useState('');
  const [isCustomGroup, setIsCustomGroup] = useState(false);

  // Jenis Biomassa (Aren, Kayu, dll)
  const defaultType =
    initialData?.biomass_type ||
    (isArenScoped ? 'Serbuk Aren' : isKayuScoped ? 'Kayu Sengon' : (biomassTypes[0]?.name || 'Aren'));
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
      const prefix = isArenScoped ? 'ARN' : isKayuScoped ? 'KYU' : 'BIO';
      const datePart = date.replace(/-/g, '');
      const randNum = Math.floor(100 + Math.random() * 900);
      const transaction_no = `${prefix}-${datePart}-${randNum}`;

      addBiomassEntry({
        transaction_no,
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
        created_by: user?.name || 'Petugas',
      });
    }

    onClose();
  };

  // Activity presets based on scope
  const activityPresets = isArenScoped
    ? [
        'Bongkar Muatan Biomassa Aren',
        'Pengiriman Pelepah & Ampas Aren',
        'Pasok Biomassa Pelepah Aren',
        'Pengangkutan Nira & Serbuk Aren',
        'Ampas Pengolahan Gula Aren',
      ]
    : isKayuScoped
    ? [
        'Pasok Kayu Sengon Rakyat',
        'Bongkar Kayu Mahoni & Sengon',
        'Pengangkutan Kayu Limbah & Ranting',
        'Pasokan Kayu Bakar Lestari',
        'Penerimaan Tebang Lestari',
      ]
    : [
        'Bongkar Muatan Biomassa',
        'Pasok Biomassa',
        'Bongkar Kayu',
        'Pengiriman Pelepah Aren',
      ];

  const driverQuickOptions = isArenScoped
    ? ['Yulviani Puteri Puspita Sari', 'Bpk. Sopian', 'Asep Saepudin']
    : isKayuScoped
    ? ['Bpk. Tarsono', 'Ujang Koswara', 'Dedi Mulyana']
    : ['Yulviani Puteri Puspita Sari', 'Bpk. Tarsono', 'Ujang Koswara'];

  const plateQuickOptions = isArenScoped
    ? ['Z 9415 TA', 'Z 9102 TB', 'Z 8812 TC']
    : isKayuScoped
    ? ['E 8234 AA', 'T 9012 BB', 'D 8910 AB']
    : ['Z 9415 TA', 'E 8234 AA', 'T 9012 BB'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className={`px-6 py-4 flex items-center justify-between shrink-0 text-white ${
          isArenScoped
            ? 'bg-emerald-950'
            : isKayuScoped
            ? 'bg-amber-950'
            : 'bg-stone-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
              isArenScoped
                ? 'bg-emerald-800 text-emerald-200'
                : isKayuScoped
                ? 'bg-amber-800 text-amber-200'
                : 'bg-stone-700 text-stone-200'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {initialData
                  ? isArenScoped
                    ? 'Edit Catatan Timbangan Biomassa Aren'
                    : isKayuScoped
                    ? 'Edit Catatan Timbangan Kayu Rakyat'
                    : 'Edit Data Penimbangan Biomassa'
                  : isArenScoped
                  ? 'Catat Timbangan Biomassa Aren'
                  : isKayuScoped
                  ? 'Catat Logistik & Timbangan Kayu Rakyat'
                  : 'Input Data Timbang Biomassa'}
              </h3>
              <p className="text-xs text-white/80">
                {isArenScoped
                  ? 'Pencatatan Armada Pengangkutan Nira, Pelepah & Serbuk Aren (DANA BERSAMA)'
                  : isKayuScoped
                  ? 'Pencatatan Armada Pasokan Kayu Sengon, Mahoni & Kehutanan Lestari'
                  : 'Pencatatan jembatan timbang ritase truk & bobot netto biomassa'}
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
          {/* Section 1: Tanggal, Shift & Jenis Aktifitas */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Tanggal Operasional, Shift & Jenis Aktifitas</span>
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

            {/* Input Jenis Aktifitas */}
            <div className="pt-1">
              <label className="block font-semibold text-stone-700 mb-1">
                Jenis Aktifitas <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  placeholder="Ketik jenis aktifitas..."
                  required
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="text-[10px] text-stone-400 self-center">Pilihan Cepat:</span>
                {activityPresets.map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setActivityType(act)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      activityType === act
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Kelompok Mitra & Pilihan Jenis Biomassa */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>
                  {isArenScoped
                    ? 'Sentra Pengolahan & Jenis Produk Aren'
                    : isKayuScoped
                    ? 'Kelompok Tani / Stokpile Kayu'
                    : 'Kelompok Mitra / Stokpile & Jenis Biomassa'}
                </span>
              </span>
              {onOpenMasterManager && (
                <button
                  type="button"
                  onClick={onOpenMasterManager}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline"
                >
                  Kelola Master
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Kelompok Mitra / Stokpile */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Sentra / Kelompok Mitra / Stokpile <span className="text-rose-500">*</span>
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
                      placeholder="Nama sentra/kelompok baru..."
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
              </div>

              {/* Pilihan Jenis Biomassa */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Jenis Material / Biomassa <span className="text-rose-500">*</span>
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
                    <option value="custom">+ Tulis Jenis Baru...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      placeholder="Ketik jenis baru..."
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
              </div>
            </div>
          </div>

          {/* Section 3: Truk & Penimbangan (Nopol, Sopir, Jam Tiba, Jam Berangkat, Berat Kotor, Berat Kosong, Netto) */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
            <div className="font-bold text-emerald-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-emerald-800" />
                <span>Armada Truk & Rumus Timbangan (Berat Kotor - Berat Kosong = Netto)</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                Otomatis Hitung
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-emerald-950 mb-1">
                  Nopol Truk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  placeholder="misal: Z 9415 TA"
                  required
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-stone-900 font-bold tracking-wider uppercase focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {plateQuickOptions.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setVehiclePlate(p)}
                      className="px-1.5 py-0.5 bg-white border border-emerald-200 rounded text-[9px] font-mono text-emerald-900 hover:bg-emerald-100"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-emerald-950 mb-1">
                  Nama Sopir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="misal: Yulviani Puteri Puspita Sari"
                  required
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {driverQuickOptions.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDriverName(d)}
                      className="px-1.5 py-0.5 bg-white border border-emerald-200 rounded text-[9px] font-medium text-emerald-900 hover:bg-emerald-100 truncate max-w-[130px]"
                      title={d}
                    >
                      {d}
                    </button>
                  ))}
                </div>
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
                  Berat Kotor (Gross) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    placeholder="misal: 8450"
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
                  Berat Kosong (Tara) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={tareWeight}
                    onChange={(e) => setTareWeight(e.target.value)}
                    placeholder="misal: 3200"
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
                  Berat Netto (Bersih)
                </span>
                <div className="text-xl font-extrabold font-mono text-emerald-300 mt-0.5">
                  {netNum.toLocaleString('id-ID')}{' '}
                  <span className="text-xs font-sans text-white">kg</span>
                </div>
                <span className="text-[10px] text-emerald-300/80 mt-0.5 font-mono">
                  {grossNum ? grossNum.toLocaleString('id-ID') : '0'} - {tareNum ? tareNum.toLocaleString('id-ID') : '0'} = {netNum.toLocaleString('id-ID')} Kg
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
                placeholder="misal: kering normal, kadar air standar < 15%, mutu baik..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none placeholder:text-stone-400"
              />
            </div>
            <div className="flex gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => setNotes('kering')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                  notes.toLowerCase() === 'kering'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
              >
                + Keterangan "kering"
              </button>
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
