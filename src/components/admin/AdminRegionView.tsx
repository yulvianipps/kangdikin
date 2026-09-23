import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RW, RT } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { Pagination } from '../common/Pagination';
import { Plus, Edit2, Trash2, X, Save, Filter } from 'lucide-react';

interface AdminRegionViewProps {
  initialTab?: 'rw' | 'rt';
}

export const AdminRegionView: React.FC<AdminRegionViewProps> = ({ initialTab = 'rw' }) => {
  const { rws, rts, addRW, updateRW, deleteRW, addRT, updateRT, deleteRT, getRWName } = useApp();
  const [activeTab, setActiveTab] = useState<'rw' | 'rt'>(initialTab);

  // Pagination RW
  const [rwPage, setRwPage] = useState(1);
  const [rwPageSize, setRwPageSize] = useState(10);

  // Pagination & Filter RT
  const [selectedRwFilter, setSelectedRwFilter] = useState<string>('all');
  const [rtPage, setRtPage] = useState(1);
  const [rtPageSize, setRtPageSize] = useState(10);

  useEffect(() => {
    setRtPage(1);
  }, [selectedRwFilter]);

  // Modal State RW
  const [showRWModal, setShowRWModal] = useState(false);
  const [editingRW, setEditingRW] = useState<RW | null>(null);
  const [rwNumber, setRwNumber] = useState('');
  const [rwName, setRwName] = useState('');
  const [rwLeader, setRwLeader] = useState('');
  const [rwStatus, setRwStatus] = useState<'active' | 'inactive'>('active');

  // Modal State RT
  const [showRTModal, setShowRTModal] = useState(false);
  const [editingRT, setEditingRT] = useState<RT | null>(null);
  const [rtNumber, setRtNumber] = useState('');
  const [rtRwId, setRtRwId] = useState('');
  const [rtName, setRtName] = useState('');
  const [rtLeader, setRtLeader] = useState('');
  const [rtStatus, setRtStatus] = useState<'active' | 'inactive'>('active');

  // Delete confirmations
  const [deletingRW, setDeletingRW] = useState<RW | null>(null);
  const [deletingRT, setDeletingRT] = useState<RT | null>(null);

  // Handlers RW
  const totalRWPages = Math.ceil(rws.length / rwPageSize) || 1;
  const paginatedRWs = rws.slice((rwPage - 1) * rwPageSize, rwPage * rwPageSize);

  // Handlers RT
  const filteredRTs = selectedRwFilter === 'all' ? rts : rts.filter((rt) => rt.rw_id === selectedRwFilter);
  const totalRTPages = Math.ceil(filteredRTs.length / rtPageSize) || 1;
  const paginatedRTs = filteredRTs.slice((rtPage - 1) * rtPageSize, rtPage * rtPageSize);

  const handleOpenAddRW = () => {
    setEditingRW(null);
    setRwNumber('');
    setRwName('');
    setRwLeader('');
    setRwStatus('active');
    setShowRWModal(true);
  };

  const handleOpenEditRW = (rw: RW) => {
    setEditingRW(rw);
    setRwNumber(rw.number);
    setRwName(rw.name);
    setRwLeader(rw.leader || '');
    setRwStatus(rw.status);
    setShowRWModal(true);
  };

  const handleSaveRW = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rwNumber.trim()) {
      alert('Nomor RW harus diisi.');
      return;
    }
    if (editingRW) {
      updateRW(editingRW.id, {
        number: rwNumber.trim(),
        name: rwName.trim() || `RW ${rwNumber.trim()}`,
        leader: rwLeader.trim(),
        status: rwStatus,
      });
    } else {
      addRW({
        number: rwNumber.trim(),
        name: rwName.trim() || `RW ${rwNumber.trim()}`,
        leader: rwLeader.trim(),
        status: rwStatus,
      });
    }
    setShowRWModal(false);
  };

  // Handlers RT
  const handleOpenAddRT = () => {
    setEditingRT(null);
    setRtNumber('');
    setRtRwId(rws[0]?.id || '');
    setRtName('');
    setRtLeader('');
    setRtStatus('active');
    setShowRTModal(true);
  };

  const handleOpenEditRT = (rt: RT) => {
    setEditingRT(rt);
    setRtNumber(rt.number);
    setRtRwId(rt.rw_id);
    setRtName(rt.name);
    setRtLeader(rt.leader || '');
    setRtStatus(rt.status);
    setShowRTModal(true);
  };

  const handleSaveRT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtNumber.trim() || !rtRwId) {
      alert('Nomor RT dan pilihan RW harus diisi.');
      return;
    }
    if (editingRT) {
      updateRT(editingRT.id, {
        number: rtNumber.trim(),
        rw_id: rtRwId,
        name: rtName.trim() || `RT ${rtNumber.trim()}`,
        leader: rtLeader.trim(),
        status: rtStatus,
      });
    } else {
      addRT({
        number: rtNumber.trim(),
        rw_id: rtRwId,
        name: rtName.trim() || `RT ${rtNumber.trim()}`,
        leader: rtLeader.trim(),
        status: rtStatus,
      });
    }
    setShowRTModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Data Wilayah</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Pengelolaan struktur rukun warga (RW) dan rukun tetangga (RT)
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('rw')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'rw'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Data RW ({rws.length})
          </button>
          <button
            onClick={() => setActiveTab('rt')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'rt'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Data RT ({rts.length})
          </button>
        </div>
      </div>

      {/* RW Section */}
      {activeTab === 'rw' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Daftar Rukun Warga (RW)</h2>
            <button
              onClick={handleOpenAddRW}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah RW</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                  <th className="py-3 px-4 w-16 text-center">Nomor</th>
                  <th className="py-3 px-4">Nama Wilayah / Dusun</th>
                  <th className="py-3 px-4">Ketua RW</th>
                  <th className="py-3 px-4 text-center">Jumlah RT</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {paginatedRWs.map((r) => {
                  const rtCount = rts.filter((rt) => rt.rw_id === r.id).length;
                  return (
                    <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-stone-900">
                        RW {r.number}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800">{r.name}</td>
                      <td className="py-3 px-4 text-xs text-stone-600">{r.leader || '-'}</td>
                      <td className="py-3 px-4 text-center text-xs font-semibold text-stone-700">
                        {rtCount} RT
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            r.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {r.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditRW(r)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 rounded-md transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingRW(r)}
                            className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {rws.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-stone-400">
                      Belum ada data RW.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* RW Pagination */}
            <Pagination
              currentPage={rwPage}
              totalPages={totalRWPages}
              totalItems={rws.length}
              pageSize={rwPageSize}
              onPageChange={setRwPage}
              onPageSizeChange={setRwPageSize}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      )}

      {/* RT Section */}
      {activeTab === 'rt' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-stone-900">Daftar Rukun Tetangga (RT)</h2>
              <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
                <Filter className="w-3.5 h-3.5 text-stone-500" />
                <span>Filter RW:</span>
                <select
                  value={selectedRwFilter}
                  onChange={(e) => setSelectedRwFilter(e.target.value)}
                  className="bg-white border border-stone-200 rounded px-2 py-0.5 text-xs font-medium text-stone-800"
                >
                  <option value="all">Semua RW ({rts.length})</option>
                  {rws.map((rw) => (
                    <option key={rw.id} value={rw.id}>
                      RW {rw.number} - {rw.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleOpenAddRT}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah RT</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                  <th className="py-3 px-4 w-16 text-center">Nomor</th>
                  <th className="py-3 px-4">Wilayah RW</th>
                  <th className="py-3 px-4">Keterangan / Nama</th>
                  <th className="py-3 px-4">Ketua RT</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {paginatedRTs.map((rt) => (
                  <tr key={rt.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-stone-900">
                      RT {rt.number}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800">
                      {getRWName(rt.rw_id)}
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600">{rt.name}</td>
                    <td className="py-3 px-4 text-xs text-stone-600">{rt.leader || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          rt.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {rt.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditRT(rt)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingRT(rt)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRTs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-stone-400">
                      Tidak ada data RT yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* RT Pagination */}
            <Pagination
              currentPage={rtPage}
              totalPages={totalRTPages}
              totalItems={filteredRTs.length}
              pageSize={rtPageSize}
              onPageChange={setRtPage}
              onPageSizeChange={setRtPageSize}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      )}

      {/* Modal RW */}
      {showRWModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900">
                {editingRW ? 'Edit Data RW' : 'Tambah Data RW'}
              </h3>
              <button
                onClick={() => setShowRWModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRW} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor RW *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 01, 02"
                  value={rwNumber}
                  onChange={(e) => setRwNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Wilayah / Dusun
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dusun Karang Asri"
                  value={rwName}
                  onChange={(e) => setRwName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Ketua RW
                </label>
                <input
                  type="text"
                  placeholder="Nama ketua RW"
                  value={rwLeader}
                  onChange={(e) => setRwLeader(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status
                </label>
                <select
                  value={rwStatus}
                  onChange={(e) => setRwStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRWModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal RT */}
      {showRTModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900">
                {editingRT ? 'Edit Data RT' : 'Tambah Data RT'}
              </h3>
              <button
                onClick={() => setShowRTModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRT} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pilih RW Induk *
                </label>
                <select
                  value={rtRwId}
                  onChange={(e) => setRtRwId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  required
                >
                  {rws.map((r) => (
                    <option key={r.id} value={r.id}>
                      RW {r.number} - {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor RT *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 01, 02"
                  value={rtNumber}
                  onChange={(e) => setRtNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Keterangan / Nama RT
                </label>
                <input
                  type="text"
                  placeholder="Contoh: RT 01 Gang Mawar"
                  value={rtName}
                  onChange={(e) => setRtName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Ketua RT
                </label>
                <input
                  type="text"
                  placeholder="Nama ketua RT"
                  value={rtLeader}
                  onChange={(e) => setRtLeader(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status
                </label>
                <select
                  value={rtStatus}
                  onChange={(e) => setRtStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRTModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation RW */}
      <ConfirmDeleteModal
        isOpen={!!deletingRW}
        title="Hapus data RW ini?"
        message="Data yang sudah dihapus tidak dapat dikembalikan."
        itemDescription={deletingRW ? `RW ${deletingRW.number} - ${deletingRW.name}` : undefined}
        onConfirm={() => {
          if (deletingRW) {
            deleteRW(deletingRW.id);
            setDeletingRW(null);
          }
        }}
        onCancel={() => setDeletingRW(null)}
      />

      {/* Delete Confirmation RT */}
      <ConfirmDeleteModal
        isOpen={!!deletingRT}
        title="Hapus data RT ini?"
        message="Data yang sudah dihapus tidak dapat dikembalikan."
        itemDescription={deletingRT ? `RT ${deletingRT.number} (${getRWName(deletingRT.rw_id)})` : undefined}
        onConfirm={() => {
          if (deletingRT) {
            deleteRT(deletingRT.id);
            setDeletingRT(null);
          }
        }}
        onCancel={() => setDeletingRT(null)}
      />
    </div>
  );
};
