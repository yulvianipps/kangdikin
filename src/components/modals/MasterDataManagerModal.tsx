import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgramCategory, ItemTypeMaster, UtilizationTypeMaster, RW, RT } from '../../types';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
  Layers,
  Package,
  HeartHandshake,
  MapPin,
  AlertCircle,
} from 'lucide-react';

interface MasterDataManagerModalProps {
  initialTab?: 'categories' | 'items' | 'utilizations' | 'regions';
  onClose: () => void;
}

export const MasterDataManagerModal: React.FC<MasterDataManagerModalProps> = ({
  initialTab = 'categories',
  onClose,
}) => {
  const {
    programCategories,
    addProgramCategory,
    updateProgramCategory,
    deleteProgramCategory,
    programs,
    itemTypes,
    addItemType,
    updateItemType,
    deleteItemType,
    utilizationTypes,
    addUtilizationType,
    updateUtilizationType,
    deleteUtilizationType,
    rws,
    rts,
    addRW,
    updateRW,
    deleteRW,
    addRT,
    updateRT,
    deleteRT,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'utilizations' | 'regions'>(
    initialTab
  );

  // ==========================================
  // TAB 1: KATEGORI PROGRAM STATE & HANDLERS
  // ==========================================
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('emerald');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const exists = programCategories.some(
      (c) => c.name.toLowerCase() === newCatName.trim().toLowerCase()
    );
    if (exists) {
      addToast('error', 'Kategori Sudah Ada', `Kategori "${newCatName.trim()}" sudah terdaftar.`);
      return;
    }

    addProgramCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || undefined,
      color: newCatColor,
    });
    setNewCatName('');
    setNewCatDesc('');
  };

  const startEditCategory = (cat: ProgramCategory) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || '');
  };

  const saveEditCategory = (id: string) => {
    if (!editCatName.trim()) return;
    updateProgramCategory(id, {
      name: editCatName.trim(),
      description: editCatDesc.trim() || undefined,
    });
    setEditingCatId(null);
  };

  // ==========================================
  // TAB 2: MASTER KOMODITAS STATE & HANDLERS
  // ==========================================
  const [filterItemProgram, setFilterItemProgram] = useState<string>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemProgramId, setNewItemProgramId] = useState(programs[0]?.id || '');
  const [newItemUnit, setNewItemUnit] = useState('Kg');
  const [newItemPrice, setNewItemPrice] = useState<number>(3000);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemProgramId, setEditItemProgramId] = useState('');
  const [editItemUnit, setEditItemUnit] = useState('');
  const [editItemPrice, setEditItemPrice] = useState<number>(0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemProgramId) return;

    addItemType({
      name: newItemName.trim(),
      program_id: newItemProgramId,
      unit: newItemUnit.trim() || 'Kg',
      defaultPrice: Number(newItemPrice) || 0,
    });
    setNewItemName('');
  };

  const startEditItem = (item: ItemTypeMaster) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemProgramId(item.program_id);
    setEditItemUnit(item.unit);
    setEditItemPrice(item.defaultPrice);
  };

  const saveEditItem = (id: string) => {
    if (!editItemName.trim()) return;
    updateItemType(id, {
      name: editItemName.trim(),
      program_id: editItemProgramId,
      unit: editItemUnit.trim() || 'Kg',
      defaultPrice: Number(editItemPrice) || 0,
    });
    setEditingItemId(null);
  };

  const filteredItems = itemTypes.filter((item) => {
    if (filterItemProgram === 'all') return true;
    return item.program_id === filterItemProgram;
  });

  // ==========================================
  // TAB 3: KATEGORI PEMANFAATAN
  // ==========================================
  const [newUtilName, setNewUtilName] = useState('');
  const [newUtilDesc, setNewUtilDesc] = useState('');
  const [editingUtilId, setEditingUtilId] = useState<string | null>(null);
  const [editUtilName, setEditUtilName] = useState('');
  const [editUtilDesc, setEditUtilDesc] = useState('');

  const handleAddUtilType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUtilName.trim()) return;
    addUtilizationType({
      name: newUtilName.trim(),
      description: newUtilDesc.trim() || '',
    });
    setNewUtilName('');
    setNewUtilDesc('');
  };

  const startEditUtilType = (u: UtilizationTypeMaster) => {
    setEditingUtilId(u.id);
    setEditUtilName(u.name);
    setEditUtilDesc(u.description || '');
  };

  const saveEditUtilType = (id: string) => {
    if (!editUtilName.trim()) return;
    updateUtilizationType(id, {
      name: editUtilName.trim(),
      description: editUtilDesc.trim() || '',
    });
    setEditingUtilId(null);
  };

  // ==========================================
  // TAB 4: WILAYAH RW & RT
  // ==========================================
  const [selectedRwId, setSelectedRwId] = useState<string>(rws[0]?.id || '');
  const [newRwNum, setNewRwNum] = useState('');
  const [newRwLeader, setNewRwLeader] = useState('');
  const [editingRwId, setEditingRwId] = useState<string | null>(null);
  const [editRwNum, setEditRwNum] = useState('');
  const [editRwLeader, setEditRwLeader] = useState('');

  const [newRtNum, setNewRtNum] = useState('');
  const [newRtLeader, setNewRtLeader] = useState('');
  const [editingRtId, setEditingRtId] = useState<string | null>(null);
  const [editRtNum, setEditRtNum] = useState('');
  const [editRtLeader, setEditRtLeader] = useState('');

  const handleAddRW = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRwNum.trim()) return;
    const formatted = newRwNum.trim().padStart(2, '0');
    addRW({
      number: formatted,
      name: `RW ${formatted}`,
      status: 'active',
      leader: newRwLeader.trim() || undefined,
    });
    setNewRwNum('');
    setNewRwLeader('');
  };

  const handleAddRT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRtNum.trim() || !selectedRwId) return;
    const formatted = newRtNum.trim().padStart(2, '0');
    addRT({
      rw_id: selectedRwId,
      number: formatted,
      name: `RT ${formatted}`,
      status: 'active',
      leader: newRtLeader.trim() || undefined,
    });
    setNewRtNum('');
    setNewRtLeader('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-300" />
              Pusat Manajemen Master Data KANG DIKIN
            </h3>
            <p className="text-xs text-emerald-300 mt-0.5">
              Kelola Kategori Program, Komoditas Barang, Jenis Pemanfaatan, dan Wilayah RW/RT
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50/80 px-6 pt-2 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-emerald-700 text-emerald-900 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Kategori Program ({programCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'items'
                ? 'border-emerald-700 text-emerald-900 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Jenis Barang & Komoditas ({itemTypes.length})
          </button>
          <button
            onClick={() => setActiveTab('utilizations')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'utilizations'
                ? 'border-emerald-700 text-emerald-900 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            Kategori Pemanfaatan ({utilizationTypes.length})
          </button>
          <button
            onClick={() => setActiveTab('regions')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'regions'
                ? 'border-emerald-700 text-emerald-900 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Wilayah RW & RT ({rws.length} RW)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-stone-700">
          {/* ========================================================= */}
          {/* TAB 1: KATEGORI PROGRAM */}
          {/* ========================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Form Tambah Kategori */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  Tambah Kategori Program Baru
                </h4>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">
                        Nama Kategori <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Energi Mandiri, Biokonversi, dll."
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        required
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Nuansa Warna</label>
                      <select
                        value={newCatColor}
                        onChange={(e) => setNewCatColor(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        <option value="emerald">Emerald (Hijau Alam)</option>
                        <option value="amber">Amber (Hasil Tani)</option>
                        <option value="stone">Stone (Kayu & Hutan)</option>
                        <option value="teal">Teal (Sirkular & Air)</option>
                        <option value="blue">Blue (Sosial & Warga)</option>
                        <option value="purple">Purple (Energi & Inovasi)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Deskripsi Kategori
                    </label>
                    <input
                      type="text"
                      placeholder="Penjelasan pilar atau fokus program dalam kategori ini..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Simpan Kategori Baru
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Kategori Program (Tabel / Card) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-stone-900 text-sm">
                    Daftar Kategori Terdaftar ({programCategories.length})
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Kategori digunakan saat membuat atau mengubah program
                  </span>
                </div>

                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200">
                  {programCategories.map((cat) => {
                    const isEditing = editingCatId === cat.id;
                    const linkedPrograms = programs.filter((p) => p.category === cat.name);

                    if (isEditing) {
                      return (
                        <div key={cat.id} className="p-3 bg-emerald-50/50 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editCatName}
                              onChange={(e) => setEditCatName(e.target.value)}
                              placeholder="Nama kategori"
                              className="bg-white border border-emerald-400 rounded-lg px-2.5 py-1.5 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                            />
                            <input
                              type="text"
                              value={editCatDesc}
                              onChange={(e) => setEditCatDesc(e.target.value)}
                              placeholder="Deskripsi kategori"
                              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingCatId(null)}
                              className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-lg"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEditCategory(cat.id)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Simpan
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={cat.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">{cat.name}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                              {linkedPrograms.length} Program
                            </span>
                          </div>
                          <p className="text-stone-500 text-xs">{cat.description || 'Tidak ada deskripsi'}</p>
                          {linkedPrograms.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              <span className="text-[10px] text-stone-400 font-semibold">Program:</span>
                              {linkedPrograms.map((p) => (
                                <span
                                  key={p.id}
                                  className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-medium"
                                >
                                  {p.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => startEditCategory(cat)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Ubah Kategori"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm(
                                  `Apakah Anda yakin ingin menghapus kategori "${cat.name}"?`
                                )
                              ) {
                                deleteProgramCategory(cat.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MASTER KOMODITAS / JENIS BARANG */}
          {/* ========================================================= */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              {/* Form Tambah Item */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  Tambah Komoditas / Jenis Barang Baru
                </h4>
                <form onSubmit={handleAddItem} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">
                        Nama Komoditas <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: Kardus Bersih, Gula Aren Cetak, dll."
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        required
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Program</label>
                      <select
                        value={newItemProgramId}
                        onChange={(e) => setNewItemProgramId(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        {programs.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Satuan</label>
                      <select
                        value={newItemUnit}
                        onChange={(e) => setNewItemUnit(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        <option value="Kg">Kilogram (Kg)</option>
                        <option value="Liter">Liter (L)</option>
                        <option value="Batang">Batang</option>
                        <option value="Ikat">Ikat</option>
                        <option value="m³">Meter Kubik (m³)</option>
                        <option value="Pcs">Pcs / Buah</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Estimasi Harga / Satuan (Rp)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Simpan Komoditas
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Tabel Komoditas */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="font-bold text-stone-900 text-sm">
                    Daftar Komoditas ({filteredItems.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">Filter Program:</span>
                    <select
                      value={filterItemProgram}
                      onChange={(e) => setFilterItemProgram(e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-stone-800 font-semibold outline-none"
                    >
                      <option value="all">Semua Program</option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200">
                  {filteredItems.map((item) => {
                    const isEditing = editingItemId === item.id;
                    const prog = programs.find((p) => p.id === item.program_id);

                    if (isEditing) {
                      return (
                        <div key={item.id} className="p-3 bg-emerald-50/50 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <input
                              type="text"
                              value={editItemName}
                              onChange={(e) => setEditItemName(e.target.value)}
                              placeholder="Nama komoditas"
                              className="bg-white border border-emerald-400 rounded-lg px-2.5 py-1.5 text-stone-900 font-bold outline-none"
                            />
                            <select
                              value={editItemProgramId}
                              onChange={(e) => setEditItemProgramId(e.target.value)}
                              className="bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-stone-900 outline-none"
                            >
                              {programs.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={editItemUnit}
                              onChange={(e) => setEditItemUnit(e.target.value)}
                              placeholder="Satuan"
                              className="bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-stone-900 outline-none"
                            />
                            <input
                              type="number"
                              value={editItemPrice}
                              onChange={(e) => setEditItemPrice(Number(e.target.value))}
                              placeholder="Harga"
                              className="bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-stone-900 outline-none"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingItemId(null)}
                              className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-lg"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEditItem(item.id)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Simpan
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                                {prog?.name || 'Program Umum'}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              Satuan: <span className="font-semibold text-stone-700">{item.unit}</span> |
                              Estimasi Harga:{' '}
                              <span className="font-semibold text-emerald-800">
                                Rp{item.defaultPrice.toLocaleString('id-ID')} / {item.unit}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditItem(item)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Ubah Komoditas"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus jenis barang "${item.name}"?`)) {
                                deleteItemType(item.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Komoditas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: KATEGORI PEMANFAATAN */}
          {/* ========================================================= */}
          {activeTab === 'utilizations' && (
            <div className="space-y-6">
              {/* Form Tambah */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  Tambah Kategori Pemanfaatan Dana Baru
                </h4>
                <form onSubmit={handleAddUtilType} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Nama Kategori Pemanfaatan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Bantuan Beasiswa Lingkungan, dll."
                        value={newUtilName}
                        onChange={(e) => setNewUtilName(e.target.value)}
                        required
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Deskripsi Alokasi
                      </label>
                      <input
                        type="text"
                        placeholder="Penjelasan peruntukan dana bersama..."
                        value={newUtilDesc}
                        onChange={(e) => setNewUtilDesc(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Simpan Kategori Pemanfaatan
                    </button>
                  </div>
                </form>
              </div>

              {/* List Pemanfaatan */}
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-3">
                  Daftar Kategori Pemanfaatan ({utilizationTypes.length})
                </h4>

                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200">
                  {utilizationTypes.map((u) => {
                    const isEditing = editingUtilId === u.id;

                    if (isEditing) {
                      return (
                        <div key={u.id} className="p-3 bg-emerald-50/50 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editUtilName}
                              onChange={(e) => setEditUtilName(e.target.value)}
                              className="bg-white border border-emerald-400 rounded-lg px-2.5 py-1.5 text-stone-900 font-bold outline-none"
                            />
                            <input
                              type="text"
                              value={editUtilDesc}
                              onChange={(e) => setEditUtilDesc(e.target.value)}
                              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 outline-none"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingUtilId(null)}
                              className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-lg"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEditUtilType(u.id)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Simpan
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={u.id}
                        className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-stone-900 text-sm block">{u.name}</span>
                          <span className="text-stone-500 text-xs mt-0.5 block">
                            {u.description || 'Tidak ada keterangan'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditUtilType(u)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Ubah"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus jenis pemanfaatan "${u.name}"?`)) {
                                deleteUtilizationType(u.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: WILAYAH RW & RT */}
          {/* ========================================================= */}
          {activeTab === 'regions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom RW */}
              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                  <h4 className="font-bold text-stone-900 text-xs mb-2 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    Tambah RW Baru
                  </h4>
                  <form onSubmit={handleAddRW} className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="No RW (07)"
                        value={newRwNum}
                        onChange={(e) => setNewRwNum(e.target.value)}
                        required
                        className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Ketua RW (Opsional)"
                        value={newRwLeader}
                        onChange={(e) => setNewRwLeader(e.target.value)}
                        className="col-span-2 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 text-xs outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors text-xs"
                    >
                      + Daftarkan RW
                    </button>
                  </form>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-xs">Pilih RW untuk Kelola RT:</h4>
                  <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                    {rws.map((rw) => {
                      const isSelected = selectedRwId === rw.id;
                      const rtCount = rts.filter((t) => t.rw_id === rw.id).length;

                      return (
                        <div
                          key={rw.id}
                          onClick={() => setSelectedRwId(rw.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                              : 'border-stone-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-stone-900 text-xs block">
                              RW {rw.number} {rw.leader ? `(${rw.leader})` : ''}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {rtCount} Rukun Tetangga (RT)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newLead = prompt(
                                  `Ubah nama Ketua RW ${rw.number}:`,
                                  rw.leader || ''
                                );
                                if (newLead !== null) {
                                  updateRW(rw.id, { leader: newLead.trim() || undefined });
                                }
                              }}
                              className="p-1 text-stone-400 hover:text-emerald-700 rounded"
                              title="Ubah Ketua RW"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    `Hapus RW ${rw.number}? Semua RT terkait juga akan terhapus.`
                                  )
                                ) {
                                  deleteRW(rw.id);
                                }
                              }}
                              className="p-1 text-stone-400 hover:text-rose-600 rounded"
                              title="Hapus RW"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Kolom RT */}
              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                  <h4 className="font-bold text-stone-900 text-xs mb-2 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    Tambah RT untuk {rws.find((r) => r.id === selectedRwId)?.name || 'RW Terpilih'}
                  </h4>
                  <form onSubmit={handleAddRT} className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="No RT (03)"
                        value={newRtNum}
                        onChange={(e) => setNewRtNum(e.target.value)}
                        required
                        className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Ketua RT (Opsional)"
                        value={newRtLeader}
                        onChange={(e) => setNewRtLeader(e.target.value)}
                        className="col-span-2 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 text-xs outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors text-xs"
                    >
                      + Daftarkan RT
                    </button>
                  </form>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-stone-900 text-xs">
                    Daftar RT di RW {rws.find((r) => r.id === selectedRwId)?.number || '-'}:
                  </h4>
                  <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                    {rts
                      .filter((t) => t.rw_id === selectedRwId)
                      .map((rt) => (
                        <div
                          key={rt.id}
                          className="p-2.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between hover:border-emerald-300"
                        >
                          <div>
                            <span className="font-bold text-stone-900 text-xs block">
                              RT {rt.number} {rt.leader ? `(${rt.leader})` : ''}
                            </span>
                            <span className="text-[10px] text-stone-500">Status Aktif</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const newLead = prompt(
                                  `Ubah nama Ketua RT ${rt.number}:`,
                                  rt.leader || ''
                                );
                                if (newLead !== null) {
                                  updateRT(rt.id, { leader: newLead.trim() || undefined });
                                }
                              }}
                              className="p-1 text-stone-400 hover:text-emerald-700 rounded"
                              title="Ubah RT"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Hapus RT ${rt.number}?`)) {
                                  deleteRT(rt.id);
                                }
                              }}
                              className="p-1 text-stone-400 hover:text-rose-600 rounded"
                              title="Hapus RT"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    {rts.filter((t) => t.rw_id === selectedRwId).length === 0 && (
                      <p className="text-center py-6 text-stone-400 text-xs italic">
                        Belum ada RT yang didaftarkan di RW ini.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-stone-500">
            <AlertCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Semua perubahan tersimpan otomatis ke sistem data KANG DIKIN.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
