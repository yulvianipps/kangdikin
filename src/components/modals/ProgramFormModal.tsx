import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Program } from '../../types';
import { X, Save, Layers, Plus } from 'lucide-react';

interface ProgramFormModalProps {
  initialData?: Program | null;
  onClose: () => void;
}

export const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  initialData,
  onClose,
}) => {
  const { addProgram, updateProgram, programCategories, addProgramCategory } = useApp();
  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(
    initialData?.category || (programCategories[0]?.name ?? 'Pengelolaan Sampah')
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true);
  const [icon, setIcon] = useState(initialData?.icon || 'Recycle');

  // Inline new category creation
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleCreateNewCategory = () => {
    if (!newCatName.trim()) return;
    const trimmed = newCatName.trim();
    // Check if category already exists
    const existing = programCategories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      setCategory(existing.name);
    } else {
      addProgramCategory({
        name: trimmed,
        description: `Kategori program ${trimmed}`,
      });
      setCategory(trimmed);
    }
    setNewCatName('');
    setShowNewCatInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama program harus diisi.');
      return;
    }

    if (isEdit && initialData) {
      updateProgram(initialData.id, {
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        category,
        description: description.trim(),
        is_active: isActive,
        is_public: isPublic,
        icon,
      });
    } else {
      addProgram({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        category,
        description: description.trim(),
        is_active: isActive,
        is_public: isPublic,
        icon,
        color: 'emerald',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isEdit ? 'Ubah Program KANG DIKIN' : 'Tambah Program Baru'}
              </h3>
              <p className="text-xs text-emerald-300">Pengelolaan Ekosistem Program Lingkungan</p>
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
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Nama Program <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Misal: Bank Sampah, Aren, Kayu, Maggot BSF..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-stone-700">Kategori Program</label>
              <button
                type="button"
                onClick={() => setShowNewCatInput(!showNewCatInput)}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
              >
                {showNewCatInput ? 'Pilih yang ada' : '+ Kategori Baru'}
              </button>
            </div>

            {showNewCatInput ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Ketik nama kategori baru..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 bg-stone-50 border border-emerald-400 rounded-xl px-3 py-1.5 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateNewCategory}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors"
                >
                  Tambah
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {programCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Ikon Representasi</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
            >
              <option value="Recycle">Daur Ulang (Recycle)</option>
              <option value="Leaf">Daun Hijau (Leaf)</option>
              <option value="Trees">Pohon / Kayu (Trees)</option>
              <option value="Layers">Lapisan Program (Layers)</option>
              <option value="Sprout">Tunas Organik (Sprout)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={3}
              placeholder="Penjelasan tujuan dan mekanisme operasional program untuk masyarakat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActiveProgram"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isActiveProgram" className="font-semibold text-stone-700 cursor-pointer">
                Program Berstatus Aktif (Dapat Menerima Setoran & Penjualan)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublicProgram"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isPublicProgram" className="font-semibold text-stone-700 cursor-pointer">
                Tampilkan di Dashboard Publik & Laporan Warga
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
              {isEdit ? 'Simpan Perubahan' : 'Simpan Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
