import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, RotateCcw, User, KeyRound, Database, Download, Copy, Check, Terminal, ExternalLink, HelpCircle } from 'lucide-react';
import { generateLiveSqlDump, downloadSqlFile } from '../../utils/sqlExport';

export const AdminSettingsView: React.FC = () => {
  const { user, resetToDemoData, addToast, programs, rws, rts, deposits, sales, utilizations } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'mysql' | 'system'>('mysql');

  const [adminName, setAdminName] = useState(user?.name || 'Administrator KANG DIKIN');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@kangdikin.desa.id');
  const [copiedSql, setCopiedSql] = useState(false);

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
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Pengaturan & Database</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Integrasi database MySQL XAMPP, profil administrator, dan arsip data
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
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

      {/* TAB 1: DATABASE MYSQL (XAMPP) */}
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

          {/* Panduan Langkah demi Langkah */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-bold text-stone-900">
                Cara Memasang Database di XAMPP & phpMyAdmin
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ikuti 5 langkah mudah berikut pada komputer/laptop Anda:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="text-xs space-y-1">
                  <strong className="text-stone-900 block">Nyalakan XAMPP Control Panel</strong>
                  <p className="text-stone-600">
                    Buka aplikasi <strong>XAMPP</strong> di laptop Anda, lalu klik tombol <strong>"Start"</strong> pada modul <strong>Apache</strong> dan <strong>MySQL</strong> hingga indikator berwarna hijau.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="text-xs space-y-1">
                  <strong className="text-stone-900 block">Buka phpMyAdmin di Browser</strong>
                  <p className="text-stone-600">
                    Ketik alamat <code className="bg-stone-200 px-1.5 py-0.5 rounded text-emerald-900 font-mono">http://localhost/phpmyadmin</code> di Google Chrome atau browser Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="text-xs space-y-1">
                  <strong className="text-stone-900 block">Buat Database Baru</strong>
                  <p className="text-stone-600">
                    Di bilah kiri phpMyAdmin, klik <strong>"Baru" / "New"</strong>. Masukkan nama database: <code className="bg-stone-200 px-1.5 py-0.5 rounded text-emerald-900 font-bold font-mono">kang_dikin</code>, lalu klik tombol <strong>"Buat" / "Create"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div className="text-xs space-y-1">
                  <strong className="text-stone-900 block">Impor File .sql</strong>
                  <p className="text-stone-600">
                    Pilih database <code className="font-mono">kang_dikin</code> yang baru dibuat, klik tab menu <strong>"Import"</strong> di bagian atas. Klik tombol <strong>"Choose File"</strong> dan pilih file <code className="font-mono font-bold">kang_dikin.sql</code> yang Anda unduh dari tombol di atas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  5
                </span>
                <div className="text-xs space-y-1">
                  <strong className="text-stone-900 block">Selesai & Siap Digunakan!</strong>
                  <p className="text-stone-600">
                    Klik tombol <strong>"Kirim" / "Go"</strong> di bawah halaman. Dalam 2 detik seluruh tabel beserta seluruh data setoran, penjualan, dan master program langsung terisi dan siap digunakan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFIL PENGELOLA */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs max-w-xl">
          <h2 className="text-base font-bold text-stone-900 mb-1">Informasi Akun Pengelola</h2>
          <p className="text-xs text-stone-500 mb-6">
            Identitas petugas administrator sistem KANG DIKIN
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nama Lengkap Petugas
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
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

      {/* TAB 3: RESET DEMO */}
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

