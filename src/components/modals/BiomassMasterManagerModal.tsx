import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BiomassPartner, BiomassTypeMaster } from '../../types';
import {
  X,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
  Building2,
  Tag,
  MapPin,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface BiomassMasterManagerModalProps {
  initialTab?: 'partners' | 'types';
  onClose: () => void;
}

export const BiomassMasterManagerModal: React.FC<BiomassMasterManagerModalProps> = ({
  initialTab = 'partners',
  onClose,
}) => {
  const {
    biomassPartners,
    addBiomassPartner,
    updateBiomassPartner,
    deleteBiomassPartner,
    biomassTypes,
    addBiomassType,
    updateBiomassType,
    deleteBiomassType,
    biomassEntries,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'partners' | 'types'>(initialTab);

  // Partner Form State (Tambah / Edit)
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [partnerLocation, setPartnerLocation] = useState('');
  const [partnerType, setPartnerType] = useState<
    'stokpile' | 'fasprod' | 'kelompok_tani' | 'mitra_lain'
  >('stokpile');
  const [partnerDesc, setPartnerDesc] = useState('');

  // Biomass Type Form State (Tambah / Edit)
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [typeName, setTypeName] = useState('');
  const [typeDesc, setTypeDesc] = useState('');
  const [typePrice, setTypePrice] = useState<string>('');

  // Start edit partner
  const startEditPartner = (p: BiomassPartner) => {
    setEditingPartnerId(p.id);
    setPartnerName(p.name);
    setPartnerCode(p.code || '');
    setPartnerLocation(p.location || '');
    setPartnerType(p.type || 'stokpile');
    setPartnerDesc(p.description || '');
  };

  const cancelEditPartner = () => {
    setEditingPartnerId(null);
    setPartnerName('');
    setPartnerCode('');
    setPartnerLocation('');
    setPartnerType('stokpile');
    setPartnerDesc('');
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) return;

    if (editingPartnerId) {
      updateBiomassPartner(editingPartnerId, {
        name: partnerName.trim(),
        code: partnerCode.trim(),
        location: partnerLocation.trim(),
        type: partnerType,
        description: partnerDesc.trim(),
      });
      cancelEditPartner();
    } else {
      addBiomassPartner({
        name: partnerName.trim(),
        code: partnerCode.trim() || undefined,
        location: partnerLocation.trim() || undefined,
        type: partnerType,
        description: partnerDesc.trim() || undefined,
      });
      setPartnerName('');
      setPartnerCode('');
      setPartnerLocation('');
      setPartnerDesc('');
    }
  };

  // Start edit type
  const startEditType = (t: BiomassTypeMaster) => {
    setEditingTypeId(t.id);
    setTypeName(t.name);
    setTypeDesc(t.description || '');
    setTypePrice(t.defaultPrice ? String(t.defaultPrice) : '');
  };

  const cancelEditType = () => {
    setEditingTypeId(null);
    setTypeName('');
    setTypeDesc('');
    setTypePrice('');
  };

  const handleSaveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;

    const numPrice = typePrice ? Number(typePrice) : undefined;

    if (editingTypeId) {
      updateBiomassType(editingTypeId, {
        name: typeName.trim(),
        description: typeDesc.trim(),
        defaultPrice: numPrice,
      });
      cancelEditType();
    } else {
      addBiomassType({
        name: typeName.trim(),
        description: typeDesc.trim() || undefined,
        defaultPrice: numPrice,
      });
      setTypeName('');
      setTypeDesc('');
      setTypePrice('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-emerald-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Kelola Kelompok Mitra & Pilihan Jenis Biomassa
              </h3>
              <p className="text-xs text-emerald-300">
                Ubah, tambah, edit, atau hapus mitra pemasok/lokasi dan jenis komoditas
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

        {/* Tab navigation */}
        <div className="flex border-b border-stone-200 px-6 pt-3 bg-stone-50 gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab('partners');
              cancelEditPartner();
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'partners'
                ? 'border-emerald-800 bg-white text-emerald-900 shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Kelompok Mitra / Stokpile ({biomassPartners.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('types');
              cancelEditType();
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'types'
                ? 'border-emerald-800 bg-white text-emerald-900 shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tag className="w-4 h-4 text-emerald-700" />
            <span>Pilihan Jenis Biomassa ({biomassTypes.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6 text-xs">
          {/* TAB 1: KELOMPOK MITRA & STOKPILE */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              {/* Form Input / Edit */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2 text-sm">
                  {editingPartnerId ? (
                    <>
                      <Edit2 className="w-4 h-4 text-emerald-700" />
                      <span>Edit Data Kelompok Mitra: {partnerName}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-emerald-700" />
                      <span>Tambah Kelompok Mitra / Stokpile Baru</span>
                    </>
                  )}
                </h4>

                <form onSubmit={handleSavePartner} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">
                        Nama Kelompok / Lokasi Fasilitas <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="misal: Stokpile Indramayu, Fasprod Ciamis, dll."
                        required
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Kode Singkatan
                      </label>
                      <input
                        type="text"
                        value={partnerCode}
                        onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                        placeholder="misal: STK-IDM"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold uppercase focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Kategori Fasilitas
                      </label>
                      <select
                        value={partnerType}
                        onChange={(e) => setPartnerType(e.target.value as any)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        <option value="stokpile">Stokpile Penampungan</option>
                        <option value="fasprod">Fasilitas Produksi (Fasprod)</option>
                        <option value="kelompok_tani">Kelompok Tani / KTH</option>
                        <option value="mitra_lain">Mitra Pengolah / Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Wilayah / Lokasi
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          value={partnerLocation}
                          onChange={(e) => setPartnerLocation(e.target.value)}
                          placeholder="misal: Indramayu, Ciamis, Dusun Karang Asri"
                          className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Keterangan Tambahan
                    </label>
                    <input
                      type="text"
                      value={partnerDesc}
                      onChange={(e) => setPartnerDesc(e.target.value)}
                      placeholder="misal: Pusat penerimaan jembatan timbang armada truk utama"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    {editingPartnerId && (
                      <button
                        type="button"
                        onClick={cancelEditPartner}
                        className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingPartnerId ? 'Simpan Perubahan' : 'Tambah Mitra'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* List of Partners */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-stone-700 font-bold">
                  <span>Daftar Kelompok Mitra & Stokpile Terdaftar ({biomassPartners.length})</span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    Dapat dipilih langsung pada form timbangan
                  </span>
                </div>

                <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                  {biomassPartners.map((partner) => {
                    const usageCount = biomassEntries.filter(
                      (b) => b.group_category === partner.name || b.partner_id === partner.id
                    ).length;

                    return (
                      <div
                        key={partner.id}
                        className="p-4 hover:bg-stone-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">
                              {partner.name}
                            </span>
                            {partner.code && (
                              <span className="font-mono text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold border border-stone-200">
                                {partner.code}
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                              {usageCount} data timbang
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-stone-500 text-[11px]">
                            {partner.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                {partner.location}
                              </span>
                            )}
                            <span className="capitalize text-stone-400">
                              Tipe: {partner.type ? partner.type.replace('_', ' ') : 'Stokpile'}
                            </span>
                          </div>

                          {partner.description && (
                            <p className="text-stone-500 text-[11px] italic">
                              {partner.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => startEditPartner(partner)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                            title="Edit kelompok"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Hapus kelompok mitra "${partner.name}"? (${usageCount} data transaksi timbang tercatat)`
                                )
                              ) {
                                deleteBiomassPartner(partner.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                            title="Hapus kelompok"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PILIHAN JENIS BIOMASSA */}
          {activeTab === 'types' && (
            <div className="space-y-6">
              {/* Form Input / Edit */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2 text-sm">
                  {editingTypeId ? (
                    <>
                      <Edit2 className="w-4 h-4 text-emerald-700" />
                      <span>Edit Jenis Biomassa: {typeName}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-emerald-700" />
                      <span>Tambah Pilihan Jenis Biomassa Baru</span>
                    </>
                  )}
                </h4>

                <form onSubmit={handleSaveType} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">
                        Nama Jenis Biomassa <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                        placeholder="misal: Aren, Serbuk Aren, Kayu Limbah, Sekam Padi, dll."
                        required
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Standar Harga (Rp / Kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={typePrice}
                        onChange={(e) => setTypePrice(e.target.value)}
                        placeholder="misal: 650"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Deskripsi / Kriteria Komoditas
                    </label>
                    <input
                      type="text"
                      value={typeDesc}
                      onChange={(e) => setTypeDesc(e.target.value)}
                      placeholder="misal: Biomassa serat serbuk aren perhutanan sosial atau limbah tebangan"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    {editingTypeId && (
                      <button
                        type="button"
                        onClick={cancelEditType}
                        className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingTypeId ? 'Simpan Perubahan' : 'Tambah Jenis'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* List of Types */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-stone-700 font-bold">
                  <span>Daftar Pilihan Jenis Biomassa ({biomassTypes.length})</span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    Bisa dipilih pada setiap input timbangan
                  </span>
                </div>

                <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                  {biomassTypes.map((bType) => {
                    const usageCount = biomassEntries.filter(
                      (b) => b.biomass_type === bType.name
                    ).length;

                    return (
                      <div
                        key={bType.id}
                        className="p-4 hover:bg-stone-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">
                              {bType.name}
                            </span>
                            {bType.defaultPrice && (
                              <span className="font-mono text-[11px] bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-200">
                                Rp{bType.defaultPrice.toLocaleString('id-ID')} / Kg
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                              {usageCount} transaksi
                            </span>
                          </div>

                          {bType.description && (
                            <p className="text-stone-500 text-[11px]">
                              {bType.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => startEditType(bType)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                            title="Edit jenis"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Hapus jenis biomassa "${bType.name}"? (${usageCount} data terkait)`
                                )
                              ) {
                                deleteBiomassType(bType.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                            title="Hapus jenis"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <AlertCircle className="w-4 h-4 text-emerald-700" />
            <span>Perubahan tersimpan otomatis di sistem dan localStorage.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
