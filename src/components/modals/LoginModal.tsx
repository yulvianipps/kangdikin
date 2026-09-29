import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, ShieldCheck, UserCheck, Eye, EyeOff, Shield } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = login(email, password);
    setIsLoading(false);

    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError('Email atau kata sandi tidak cocok. Silakan periksa kembali akun Anda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="bg-emerald-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Masuk Pengurus & Kader</h3>
              <p className="text-xs text-emerald-300">Sistem Informasi KANG DIKIN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-800/60 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-emerald-50/80 px-6 py-3 border-b border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Masukkan email dan kata sandi akun Anda masing-masing untuk mengakses panel sesuai bagian yang ditugaskan.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Alamat Email Pengurus / Petugas
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                autoFocus
                autoComplete="username"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none transition-all placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  required
                  autoComplete="current-password"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-medium focus:ring-2 focus:ring-emerald-600 outline-none pr-10 transition-all placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  aria-label="Tampilkan sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-stone-50 px-6 py-3.5 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            Akses sesuai hak masing-masing
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};