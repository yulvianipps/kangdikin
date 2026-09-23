import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MapPin, Plus, Trash2, Home } from 'lucide-react';

interface RWManagerModalProps {
  onClose: () => void;
}

export const RWManagerModal: React.FC<RWManagerModalProps> = ({ onClose }) => {
  const { rws, rts, addRW, addRT, deleteRW, deleteRT } = useApp();

  const [selectedRwId, setSelectedRwId] = useState<string>(rws[0]?.id || '');
  const [newRwNumber, setNewRwNumber] = useState('');
  const [newRwLeader, setNewRwLeader] = useState('');

  const [newRtNumber, setNewRtNumber] = useState('');
  const [newRtLeader, setNewRtLeader] = useState('');

  const handleAddRW = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRwNumber.trim()) return;
    const formattedNum = newRwNumber.trim().padStart(2, '0');
    addRW({
      number: formattedNum,
      name: `RW ${formattedNum}`,
      status: 'active',
      leader: newRwLeader.trim() || undefined,
    });
    setNewRwNumber('');
    setNewRwLeader('');
  };

  const handleAddRT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRtNumber.trim() || !selectedRwId) return;
    const formattedNum = newRtNumber.trim().padStart(2, '0');
    addRT({
      rw_id: selectedRwId,
      number: formattedNum,
      name: `RT ${formattedNum}`,
      status: 'active',
      leader: newRtLeader.trim() || undefined,
    });
    setNewRtNumber('');
    setNewRtLeader('');
  };

  const activeRW = rws.find((r) => r.id === selectedRwId);
  const activeRTs = rts.filter((t) => t.rw_id === selectedRwId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Kelola Master Wilayah RW & RT</h3>
              <p className="text-xs text-stone-400">Hierarki Rukun Warga & Rukun Tetangga Program</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Kolom Kiri: Daftar & Tambah RW */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                Daftar Rukun Warga (RW)
              </span>
              <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-semibold">
                {rws.length} RW Terdaftar
              </span>
            </div>

            {/* List RW */}
            <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 max-h-52 overflow-y-auto bg-stone-50/50">
              {rws.map((rw) => {
                const rtCount = rts.filter((t) => t.rw_id === rw.id).length;
                const isSelected = rw.id === selectedRwId;
                return (
                  <div
                    key={rw.id}
                    onClick={() => setSelectedRwId(rw.id)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-l-emerald-600' : 'hover:bg-stone-100/70'
                    }`}
                  >
                    <div>
                      <span className="text-sm block">{rw.name}</span>
                      <span className="text-[11px] text-stone-500 font-normal">
                        {rtCount} RT • Ketua: {rw.leader || '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {rws.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Hapus ${rw.name} beserta seluruh RT terkait?`)) {
                              deleteRW(rw.id);
                              if (selectedRwId === rw.id) {
                                setSelectedRwId(rws.find((r) => r.id !== rw.id)?.id || '');
                              }
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form Tambah RW */}
            <form onSubmit={handleAddRW} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <span className="font-semibold text-stone-800 text-[11px] block">Tambah RW Baru</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nomor (misal 05)"
                  value={newRwNumber}
                  onChange={(e) => setNewRwNumber(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-emerald-600"
                  required
                />
                <input
                  type="text"
                  placeholder="Nama Ketua RW"
                  value={newRwLeader}
                  onChange={(e) => setNewRwLeader(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah RW
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Daftar & Tambah RT untuk RW Terpilih */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                RT dalam {activeRW ? activeRW.name : 'RW Terpilih'}
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                {activeRTs.length} RT
              </span>
            </div>

            {/* List RT */}
            <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 max-h-52 overflow-y-auto bg-stone-50/50">
              {activeRTs.length === 0 ? (
                <div className="p-6 text-center text-stone-400">
                  <Home className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  Belum ada data RT dalam {activeRW?.name}. Silakan tambahkan di bawah.
                </div>
              ) : (
                activeRTs.map((rt) => (
                  <div key={rt.id} className="p-3 flex items-center justify-between hover:bg-stone-100/70">
                    <div>
                      <span className="font-semibold text-stone-900 text-xs block">{rt.name}</span>
                      <span className="text-[11px] text-stone-500">Ketua RT: {rt.leader || '-'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus ${rt.name}?`)) {
                          deleteRT(rt.id);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Form Tambah RT */}
            {activeRW && (
              <form onSubmit={handleAddRT} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <span className="font-semibold text-stone-800 text-[11px] block">
                  Tambah RT di {activeRW.name}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nomor (misal 04)"
                    value={newRtNumber}
                    onChange={(e) => setNewRtNumber(e.target.value)}
                    className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Nama Ketua RT"
                    value={newRtLeader}
                    onChange={(e) => setNewRtLeader(e.target.value)}
                    className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah RT ke {activeRW.name}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
