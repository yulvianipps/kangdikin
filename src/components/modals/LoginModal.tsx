import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      onClose();
    } else {
      setError('Email atau password tidak sesuai.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Login Pengelola Admin</h3>
              <p className="text-xs text-emerald-300">Sistem Informasi KANG DIKIN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
            <span className="font-bold block mb-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Akses Khusus Pengurus
            </span>
            Publik/Warga dapat melihat seluruh laporan transparansi tanpa perlu login. Login hanya untuk pengurus penginput data (Admin).
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-semibold text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email / Username</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
            >
              Masuk sebagai Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
