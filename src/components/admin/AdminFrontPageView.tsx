import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatItemConfig } from '../../types';
import { Save, RotateCcw, ArrowUp, ArrowDown, Eye, EyeOff, Check } from 'lucide-react';

interface AdminFrontPageViewProps {
  initialSubTab?: 'hero' | 'stats' | 'programs' | 'about' | 'cta';
}

export const AdminFrontPageView: React.FC<AdminFrontPageViewProps> = ({
  initialSubTab = 'hero',
}) => {
  const {
    frontPageContent,
    updateHeroContent,
    updateStatsConfig,
    updateAboutContent,
    updateCtaContent,
    resetFrontPageContent,
    programs,
    updateProgram,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'programs' | 'about' | 'cta'>(
    initialSubTab
  );

  // Local state for Hero
  const [heroForm, setHeroForm] = useState(frontPageContent.hero);

  // Local state for Stats
  const [statsConfig, setStatsConfig] = useState<StatItemConfig[]>(frontPageContent.stats);

  // Local state for About
  const [aboutForm, setAboutForm] = useState(frontPageContent.about);

  // Local state for CTA
  const [ctaForm, setCtaForm] = useState(frontPageContent.cta);

  // Save Hero
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroContent(heroForm);
  };

  // Save Stats
  const handleSaveStats = () => {
    updateStatsConfig(statsConfig);
  };

  // Move stat item up/down
  const moveStat = (index: number, direction: 'up' | 'down') => {
    const newStats = [...statsConfig];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStats.length) return;

    const temp = newStats[index];
    newStats[index] = newStats[targetIndex];
    newStats[targetIndex] = temp;

    // update orders
    newStats.forEach((item, idx) => {
      item.order = idx + 1;
    });

    setStatsConfig(newStats);
  };

  const toggleStatVisibility = (id: string) => {
    setStatsConfig((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    );
  };

  const updateStatLabel = (id: string, label: string) => {
    setStatsConfig((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label } : item))
    );
  };

  // Save About
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutContent(aboutForm);
  };

  // Save CTA
  const handleSaveCta = (e: React.FormEvent) => {
    e.preventDefault();
    updateCtaContent(ctaForm);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Pengaturan Halaman Depan</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Kelola teks hero, penataan statistik, program unggulan, dan ajakan warga
          </p>
        </div>

        <button
          type="button"
          onClick={resetFrontPageContent}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Bawaan</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-xl border border-stone-200 shadow-xs">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'hero'
              ? 'bg-emerald-800 text-white'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          1. Hero Banner
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-emerald-800 text-white'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          2. Statistik Capaian
        </button>
        <button
          onClick={() => setActiveTab('programs')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'programs'
              ? 'bg-emerald-800 text-white'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          3. Program Kami
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'about'
              ? 'bg-emerald-800 text-white'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          4. Tentang KANG DIKIN
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'cta'
              ? 'bg-emerald-800 text-white'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          5. Ajakan (CTA)
        </button>
      </div>

      {/* TAB 1: HERO */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">Pengaturan Banner Hero</h2>
          <p className="text-xs text-stone-500 mb-6">
            Bagian paling atas yang pertama kali dilihat oleh warga dan publik.
          </p>

          <form onSubmit={handleSaveHero} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Judul Utama (Title)
              </label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Sub Judul (Subtitle)
              </label>
              <input
                type="text"
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Deskripsi
              </label>
              <textarea
                rows={3}
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Teks Tombol Aksi
                </label>
                <input
                  type="text"
                  value={heroForm.buttonText}
                  onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tujuan Tombol (Menu Tab / Link)
                </label>
                <select
                  value={heroForm.buttonLink}
                  onChange={(e) => setHeroForm({ ...heroForm, buttonLink: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="program">Program</option>
                  <option value="setoran">Setoran</option>
                  <option value="penjualan">Penjualan</option>
                  <option value="pemanfaatan">Pemanfaatan</option>
                  <option value="rw">Rekap RW</option>
                  <option value="laporan">Laporan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                URL Gambar Background
              </label>
              <input
                type="text"
                value={heroForm.backgroundImage}
                onChange={(e) => setHeroForm({ ...heroForm, backgroundImage: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Masukkan tautan gambar beresolusi tinggi (misal dari Unsplash).
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Hero</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: STATISTIK */}
      {activeTab === 'stats' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Pengaturan Statistik Capaian</h2>
              <p className="text-xs text-stone-500">
                Atur label, visibilitas tampil/sembunyi, dan urutan kartu statistik.
              </p>
            </div>

            <button
              onClick={handleSaveStats}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Statistik</span>
            </button>
          </div>

          <div className="space-y-3">
            {statsConfig.map((stat, index) => (
              <div
                key={stat.id}
                className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <div className="flex items-center gap-3 flex-1 mr-4">
                  <span className="w-6 text-center text-xs font-bold text-stone-400">
                    #{index + 1}
                  </span>

                  <div className="flex-1 max-w-sm">
                    <label className="block text-[10px] uppercase font-bold text-stone-400">
                      Label Tampilan
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStatLabel(stat.id, e.target.value)}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div className="text-xs text-stone-500">
                    ID Data: <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">{stat.id}</code>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatVisibility(stat.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                      stat.visible
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-stone-200 text-stone-500 border-stone-300'
                    }`}
                  >
                    {stat.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{stat.visible ? 'Tampil' : 'Sembunyi'}</span>
                  </button>

                  <div className="flex items-center gap-1 border-l border-stone-300 pl-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveStat(index, 'up')}
                      className="p-1 rounded text-stone-500 hover:bg-stone-200 disabled:opacity-30"
                      title="Naikkan urutan"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === statsConfig.length - 1}
                      onClick={() => moveStat(index, 'down')}
                      className="p-1 rounded text-stone-500 hover:bg-stone-200 disabled:opacity-30"
                      title="Turunkan urutan"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROGRAM KAMI */}
      {activeTab === 'programs' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="mb-6">
            <h2 className="text-base font-bold text-stone-900">Program di Halaman Depan</h2>
            <p className="text-xs text-stone-500">
              Setiap program yang berstatus "Tampil Publik" akan otomatis tampil di halaman depan website.
            </p>
          </div>

          <div className="space-y-3">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-900">{prog.name}</h3>
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                      {prog.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-1 max-w-lg">
                    {prog.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateProgram(prog.id, { is_public: !prog.is_public })}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      prog.is_public
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-stone-200 text-stone-600 border-stone-300 hover:bg-stone-300'
                    }`}
                  >
                    {prog.is_public ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{prog.is_public ? 'Tampil di Publik' : 'Disembunyikan'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TENTANG KANG DIKIN */}
      {activeTab === 'about' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">Tentang KANG DIKIN</h2>
          <p className="text-xs text-stone-500 mb-6">
            Ceritakan profil, nilai gotong royong, dan visi misi gerakan ini kepada masyarakat.
          </p>

          <form onSubmit={handleSaveAbout} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Judul Bagian
              </label>
              <input
                type="text"
                value={aboutForm.title}
                onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Deskripsi Lengkap
              </label>
              <textarea
                rows={5}
                value={aboutForm.description}
                onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                URL Gambar Representatif
              </label>
              <input
                type="text"
                value={aboutForm.image}
                onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Tentang</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: CTA / AJAKAN */}
      {activeTab === 'cta' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">Bagian Ajakan Warga (CTA)</h2>
          <p className="text-xs text-stone-500 mb-6">
            Kotak ajakan di bagian bawah halaman untuk mendorong partisipasi aktif warga.
          </p>

          <form onSubmit={handleSaveCta} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Judul Ajakan
              </label>
              <input
                type="text"
                value={ctaForm.title}
                onChange={(e) => setCtaForm({ ...ctaForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Keterangan Ajakan
              </label>
              <textarea
                rows={3}
                value={ctaForm.description}
                onChange={(e) => setCtaForm({ ...ctaForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Teks Tombol
                </label>
                <input
                  type="text"
                  value={ctaForm.buttonText}
                  onChange={(e) => setCtaForm({ ...ctaForm, buttonText: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tautan Aksi
                </label>
                <select
                  value={ctaForm.buttonLink}
                  onChange={(e) => setCtaForm({ ...ctaForm, buttonLink: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="setoran">Setoran Warga</option>
                  <option value="program">Daftar Program</option>
                  <option value="rw">Rekap RW</option>
                  <option value="laporan">Laporan Keuangan</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan CTA</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
