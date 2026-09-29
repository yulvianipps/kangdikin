import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppAccount } from '../../data/initialData';
import {
  ShieldCheck,
  RotateCcw,
  User,
  KeyRound,
  Database,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Shield,
  Layers,
} from 'lucide-react';
import { generateLiveSqlDump, downloadSqlFile } from '../../utils/sqlExport';

interface AdminSettingsViewProps {
  initialTab?: 'users' | 'mysql' | 'profile' | 'system';
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  initialTab = 'users',
}) => {
  const {
    user,
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    programs,
    rws,
    rts,
    deposits,
    sales,
    utilizations,
    resetToDemoData,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'mysql' | 'profile' | 'system'>(initialTab);

  // Profile state
  const [adminName, setAdminName] = useState(user?.name || 'Administrator KANG DIKIN');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@kangdikin.desa.id');
  const [copiedSql, setCopiedSql] = useState(false);

  // User Management state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'staff'>('staff');
  const [formProgramId, setFormProgramId] = useState(programs[0]?.id || 'prog-aren');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  const handleOpenAdd = () => {
    setEditingAccountId(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('staff');
    setFormProgramId(programs[0]?.id || 'prog-aren');
    setShowAddModal(true);
  };

  const handleOpenEdit = (acc: AppAccount) => {
    setEditingAccountId(acc.id);
    setFormName(acc.name);
    setFormEmail(acc.email);
    setFormPassword(acc.password || '');
    setFormRole(acc.role);
    setFormProgramId(acc.assignedProgramId || programs[0]?.id || 'prog-aren');
    setShowAddModal(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formPassword.trim()) {
      addToast('error', 'Validasi Gagal', 'Email dan kata sandi wajib diisi.');
      return;
    }

    const assignedProg = programs.find((p) => p.id === formProgramId);

    if (editingAccountId) {
      updateAccount(editingAccountId, {
        name: formName.trim() || formEmail.trim(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword.trim(),
        role: formRole,
        assignedProgramId: formRole === 'staff' ? formProgramId : undefined,
        assignedProgramName: formRole === 'staff' ? assignedProg?.name : undefined,
        badge: formRole === 'admin' ? 'Super Admin' : `Pengelola ${assignedProg?.name || 'Program'}`,
        description:
          formRole === 'admin'
            ? 'Akses penuh ke seluruh sistem KANG DIKIN.'
            : `Hanya mengelola & melihat data khusus program ${assignedProg?.name || ''}.`,
      });
    } else {
      addAccount({
        name: formName.trim() || formEmail.trim(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword.trim(),
        role: formRole,
        assignedProgramId: formRole === 'staff' ? formProgramId : undefined,
        assignedProgramName: formRole === 'staff' ? assignedProg?.name : undefined,
        badge: formRole === 'admin' ? 'Super Admin' : `Pengelola ${assignedProg?.name || 'Program'}`,
        description:
          formRole === 'admin'
            ? 'Akses penuh ke seluruh sistem KANG DIKIN.'
            : `Hanya mengelola & melihat data khusus program ${assignedProg?.name || ''}.`,
      });
    }

    setShowAddModal(false);
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Profil Diperbarui', 'Data profil pengelola berhasil disimpan.');
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mereset seluruh data aplikasi ke data demo percontohan awal? Data yang belum diekspor akan terhapus.'
      )
    ) {
      resetToDemoData();
      addToast('info', 'Data Direset', 'Data berhasil dikembalikan ke format demo percontohan.');
    }
  };

  const handleDownloadLiveSql = () => {
    const sql = generateLiveSqlDump({
      programs,
      rws,
      rts,
      deposits,
      sales,
      utilizations,
    });
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadSqlFile(`kang_dikin_backup_${dateStr}.sql`, sql);
    addToast('success', 'File SQL Diunduh', 'File database MySQL siap diimport ke XAMPP phpMyAdmin.');
  };

  const handleCopySql = () => {
    const sql = generateLiveSqlDump({
      programs,
      rws,
      rts,
      deposits,
      sales,
      utilizations,
    });
    navigator.clipboard.writeText(sql).then(() => {
      setCopiedSql(true);
      addToast('success', 'Tersalin', 'Kode SQL berhasil disalin ke clipboard.');
      setTimeout(() => setCopiedSql(false), 2500);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Pengaturan & Pengguna</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Kelola hak akses pengurus per bagian, database MySQL XAMPP, dan arsip data
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl flex-wrap">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Akun Pengurus & Hak Akses</span>
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 ${
              activeTab === 'mysql'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database MySQL (XAMPP)</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Profil Admin
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'system'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* TAB 1: USER MANAGEMENT / AKUN PENGURUS & HAK AKSES */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Information & Action bar */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-700" />
                Daftar Akun Pengurus & Bagian Program
              </h2>
              <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
                Setiap petugas/kader login dengan email dan kata sandi mereka sendiri. Petugas program hanya dapat melihat dan menginput data khusus program yang ditugaskan (misal: <strong>puteripuspitaaa@gmail.com</strong> ditugaskan ke bagian <strong>Aren</strong>).
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pengurus Baru</span>
            </button>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5">Nama & Email Petugas</th>
                    <th className="px-5 py-3.5">Bagian / Program Ditugaskan</th>
                    <th className="px-5 py-3.5">Hak Akses</th>
                    <th className="px-5 py-3.5">Kata Sandi</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {accounts.map((acc) => {
                    const isSuper = acc.role === 'admin';
                    const showPass = !!showPasswordMap[acc.id];
                    return (
                      <tr key={acc.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-stone-900">{acc.name}</div>
                          <div className="text-stone-500 font-mono text-[11px] mt-0.5">
                            {acc.email}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {isSuper ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold border border-stone-200 text-[11px]">
                              <Layers className="w-3 h-3 text-stone-500" />
                              Semua Program
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-bold border border-amber-200 text-[11px]">
                              🌴 Bagian: {acc.assignedProgramName || 'Program Terkait'}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                              isSuper
                                ? 'bg-emerald-700 text-white'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {acc.badge || (isSuper ? 'Super Admin' : 'Pengelola')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-800 text-xs">
                              {showPass ? acc.password : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleShowPassword(acc.id)}
                              className="text-stone-400 hover:text-stone-700 p-1"
                              title={showPass ? 'Sembunyikan sandi' : 'Lihat sandi'}
                            >
                              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(acc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          {accounts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Yakin ingin menghapus akun ${acc.name} (${acc.email})?`)) {
                                  deleteAccount(acc.id);
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Tambah / Edit Akun */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
                <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-5 h-5 text-emerald-300" />
                    <h3 className="font-bold text-sm">
                      {editingAccountId ? 'Edit Akun Pengurus' : 'Tambah Akun Pengurus Baru'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-stone-400 hover:text-white p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveAccount} className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Nama Petugas / Kader <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="misal: Puteri Puspita"
                      required
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Alamat Email (Username Login) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="misal: puteripuspitaaa@gmail.com"
                      required
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="misal: a atau kata sandi aman"
                      required
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Tingkat Hak Akses <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setFormRole('staff')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          formRole === 'staff'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <div className="font-bold">Khusus Bagian Program</div>
                        <div className="text-[10px] text-stone-500 font-normal">
                          Hanya akses 1 program tertentu
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormRole('admin')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          formRole === 'admin'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <div className="font-bold">Super Admin</div>
                        <div className="text-[10px] text-stone-500 font-normal">
                          Akses ke semua program & sistem
                        </div>
                      </button>
                    </div>
                  </div>

                  {formRole === 'staff' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                      <label className="block font-semibold text-amber-900">
                        Pilih Bagian Program yang Dikelola <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formProgramId}
                        onChange={(e) => setFormProgramId(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        {programs.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.category})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-amber-800">
                        Petugas ini hanya akan melihat dan mencatat data transaksi program yang dipilih saat mereka login.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                    >
                      {editingAccountId ? 'Simpan Perubahan' : 'Buat Akun'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DATABASE MYSQL (XAMPP) */}
      {activeTab === 'mysql' && (
        <div className="space-y-6">
          {/* Banner Status */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/80 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Siap Digunakan di XAMPP / phpMyAdmin</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  Skema Relasi Database MySQL "kang_dikin"
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                  Semua tabel (program, RW/RT, buku setoran, hasil penjualan, dan penyaluran dana) sudah dikonfigurasi dengan tipe data, relasi Foreign Key, dan data awal yang siap di-import ke MySQL di komputer/laptop Anda.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                <button
                  onClick={handleDownloadLiveSql}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File .sql (Data Realtime)</span>
                </button>
                <a
                  href="/kang_dikin.sql"
                  download="kang_dikin.sql"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-semibold text-xs rounded-xl border border-emerald-700 transition-colors text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh kang_dikin.sql Bawaan</span>
                </a>
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-xl border border-stone-700 transition-colors"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Query SQL'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Database Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-400 block uppercase">Nama Database</span>
              <strong className="text-base text-stone-900 font-mono">kang_dikin</strong>
              <span className="text-xs text-stone-500 block mt-0.5">Collation: utf8mb4_unicode_ci</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-400 block uppercase">Default Host & Port</span>
              <strong className="text-base text-stone-900 font-mono">localhost:3306</strong>
              <span className="text-xs text-stone-500 block mt-0.5">User: root (tanpa password)</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-400 block uppercase">Jumlah Tabel</span>
              <strong className="text-base text-emerald-900 font-bold">7 Tabel + 1 View Rekap</strong>
              <span className="text-xs text-stone-500 block mt-0.5">users, programs, rws, rts, dsb.</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-400 block uppercase">Kompatibilitas</span>
              <strong className="text-base text-stone-900 font-bold">XAMPP / MariaDB / MySQL 8</strong>
              <span className="text-xs text-stone-500 block mt-0.5">phpMyAdmin 5.x+</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROFIL ADMIN */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs max-w-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900 mb-1">Informasi Profil Administrator</h2>
            <p className="text-xs text-stone-500">
              Data identitas penanggung jawab aplikasi KANG DIKIN
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nama Lengkap / Instansi
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Alamat Email Petugas
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Peran Pengguna
              </label>
              <input
                type="text"
                value="Super Admin (Akses Penuh)"
                disabled
                className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-lg text-stone-500 font-semibold cursor-not-allowed"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Simpan Profil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: RESET DEMO */}
      {activeTab === 'system' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs max-w-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900 mb-1">Pemulihan & Data Percontohan</h2>
            <p className="text-xs text-stone-500">
              Pengaturan penyimpanan lokal browser dan inisialisasi ulang master data
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-amber-900">Reset ke Data Demo Awal</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Tindakan ini akan mengembalikan program, transaksi setoran, penjualan, pemanfaatan, dan master RW/RT ke konfigurasi percontohan awal KANG DIKIN.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Data Demo Percontohan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
