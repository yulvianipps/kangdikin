import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, KeyRound, Shield, Download, Upload, RefreshCw } from 'lucide-react';
import { INITIAL_DEPOSITS, INITIAL_SALES, INITIAL_UTILIZATIONS, INITIAL_PROGRAMS } from '../../data/initialData';

interface AccountModalProps {
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ onClose }) => {
  const { currentUser, updateProfile, deposits, sales, utilizations, programs, rws, rts } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        alert('Konfirmasi password baru tidak cocok.');
        return;
      }
      if (newPassword.length < 6) {
        alert('Password baru minimal 6 karakter.');
        return;
      }
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Backup data as JSON
  const handleBackup = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      deposits,
      sales,
      utilizations,
      programs,
      rws,
      rts,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_KANG_DIKIN_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mereset data ke data contoh bawaan? Seluruh data yang baru ditambahkan akan diganti.')) {
      localStorage.setItem('kang_dikin_deposits', JSON.stringify(INITIAL_DEPOSITS));
      localStorage.setItem('kang_dikin_sales', JSON.stringify(INITIAL_SALES));
      localStorage.setItem('kang_dikin_utilizations', JSON.stringify(INITIAL_UTILIZATIONS));
      localStorage.setItem('kang_dikin_programs', JSON.stringify(INITIAL_PROGRAMS));
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-emerald-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Manajemen Akun Admin & Sistem</h3>
              <p className="text-xs text-stone-400">Profil Administrator KANG DIKIN & Keamanan</p>
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
        <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-semibold">
              ✓ Data profil administrator berhasil diperbarui.
            </div>
          )}

          {/* Form Profil */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <Shield className="w-4 h-4 text-emerald-700" /> Informasi Akun
            </h4>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Nama Lengkap / Jabatan</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email / Username Login</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-3">
              <h5 className="font-semibold text-stone-800 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-stone-500" /> Ganti Password (Opsional)
              </h5>

              <div>
                <label className="block text-stone-600 mb-1">Password Baru</label>
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              {newPassword && (
                <div>
                  <label className="block text-stone-600 mb-1">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    placeholder="Ketik ulang password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Simpan Profil
              </button>
            </div>
          </form>

          {/* Backup & Pemulihan Data */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-4 h-4 text-stone-600" /> Backup & Pemeliharaan Database
            </h4>
            <p className="text-[11px] text-stone-500">
              Unduh cadangan data transaksi ke file JSON untuk keperluan arsip laporan desa.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleBackup}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-stone-700" />
                Unduh Cadangan JSON
              </button>
              <button
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Data Bawaan
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
