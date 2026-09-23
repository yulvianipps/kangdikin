import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatRupiah, formatWeight } from '../../utils/dateUtils';

export const DashboardCharts: React.FC = () => {
  const { filteredDeposits, filteredSales, filteredUtilizations, rwSummaries, getProgramName } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'setoran' | 'penjualan' | 'rw'>('overview');

  // Group deposits by date for trend chart
  const depositsTrend = React.useMemo(() => {
    const map: Record<string, number> = {};
    // Sort chronological
    const sorted = [...filteredDeposits].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((d) => {
      const label = d.date.split('-').slice(1).join('/'); // MM/DD
      map[label] = (map[label] || 0) + (Number(d.weight) || 0);
    });

    const entries = Object.entries(map).map(([date, berat]) => ({
      date,
      berat: Math.round(berat * 10) / 10,
    }));

    // If empty or few, provide meaningful baseline
    return entries.length > 0 ? entries : [{ date: 'Awal', berat: 0 }];
  }, [filteredDeposits]);

  // Group sales vs utilizations for financial bar chart
  const financeComparison = React.useMemo(() => {
    // Map dates or months
    const dateKeys = Array.from(
      new Set([
        ...filteredSales.map((s) => s.date.slice(0, 7)),
        ...filteredUtilizations.map((u) => u.date.slice(0, 7)),
      ])
    ).sort();

    if (dateKeys.length === 0) {
      return [{ periode: '2026-09', penjualan: 0, pemanfaatan: 0 }];
    }

    return dateKeys.map((key) => {
      const salesSum = filteredSales
        .filter((s) => s.date.startsWith(key))
        .reduce((sum, item) => sum + (Number(item.total) || 0), 0);
      const utilSum = filteredUtilizations
        .filter((u) => u.date.startsWith(key))
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      // Month name
      const [, m] = key.split('-');
      const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const monthLabel = monthNames[parseInt(m, 10)] || key;

      return {
        periode: monthLabel,
        penjualan: salesSum,
        pemanfaatan: utilSum,
      };
    });
  }, [filteredSales, filteredUtilizations]);

  // RW Contributions (Weight and Utilization)
  const rwChartData = React.useMemo(() => {
    return rwSummaries.map((rw) => ({
      name: `RW ${rw.rwNumber}`,
      berat: rw.totalWeightKg,
      setoran: rw.totalDepositsCount,
      pemanfaatan: rw.totalUtilizationAmount,
    }));
  }, [rwSummaries]);

  // Composition by Program
  const programComposition = React.useMemo(() => {
    const map: Record<string, number> = {};
    filteredDeposits.forEach((d) => {
      const name = getProgramName(d.program_id);
      map[name] = (map[name] || 0) + (Number(d.weight) || 0);
    });

    const colors = ['#059669', '#d97706', '#78716c', '#0d9488', '#3b82f6'];
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value: Math.round(value),
      color: colors[i % colors.length],
    }));
  }, [filteredDeposits, getProgramName]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-6">
      {/* Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">
            Grafik Perkembangan & Transparansi Program
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Visualisasi perkembangan setoran material, keuangan penjualan, dan pemanfaatan RW
          </p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Ikhtisar Utama
          </button>
          <button
            onClick={() => setActiveTab('setoran')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'setoran'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tren Setoran
          </button>
          <button
            onClick={() => setActiveTab('penjualan')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'penjualan'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Penjualan vs Pemanfaatan
          </button>
          <button
            onClick={() => setActiveTab('rw')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'rw'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Perbandingan RW
          </button>
        </div>
      </div>

      {/* Overview Mode: 2 Balanced Graphs */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Perkembangan Setoran Warga */}
          <div className="border border-stone-100 rounded-xl p-4 bg-stone-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Perkembangan Berat Setoran (Kg)
              </span>
              <span className="text-[11px] font-medium text-stone-500">Waktu ke waktu</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={depositsTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBerat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                  <XAxis dataKey="date" stroke="#78716c" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78716c" fontSize={11} tickLine={false} unit="kg" />
                  <Tooltip
                    formatter={(val: any) => [`${val || 0} Kg`, 'Berat Setoran']}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="berat"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorBerat)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Kontribusi Antar-RW */}
          <div className="border border-stone-100 rounded-xl p-4 bg-stone-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Kontribusi Berat Setoran per RW
              </span>
              <span className="text-[11px] font-medium text-stone-500">Perbandingan RW</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rwChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                  <XAxis dataKey="name" stroke="#78716c" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78716c" fontSize={11} tickLine={false} unit="kg" />
                  <Tooltip
                    formatter={(val: any) => [`${val || 0} Kg`, 'Total Berat']}
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Bar dataKey="berat" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Setoran Specific View */}
      {activeTab === 'setoran' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-stone-100 rounded-xl p-4 bg-stone-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Tren Akumulasi Berat Setoran (Kg)
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={depositsTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBeratLarge" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                  <XAxis dataKey="date" stroke="#78716c" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78716c" fontSize={11} tickLine={false} unit="kg" />
                  <Tooltip
                    formatter={(val: any) => [`${val || 0} Kg`, 'Setoran']}
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="berat"
                    stroke="#059669"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBeratLarge)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Program Distribution Pie */}
          <div className="border border-stone-100 rounded-xl p-4 bg-stone-50/50 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Komposisi Program
              </span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={programComposition}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {programComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val || 0} Kg`, 'Berat']}
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full flex flex-col gap-1 text-xs mt-2">
              {programComposition.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-stone-900">{formatWeight(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Penjualan vs Pemanfaatan View */}
      {activeTab === 'penjualan' && (
        <div className="border border-stone-100 rounded-xl p-4 bg-stone-50/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Nilai Penjualan Material vs Alokasi Pemanfaatan Masyarakat (Rp)
              </span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Transparansi pemasukan dana program dan penyaluran kembali ke RW
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeComparison} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="periode" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `Rp${v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'K'}`}
                />
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val) || 0)]}
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar name="Total Penjualan" dataKey="penjualan" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar name="Total Pemanfaatan" dataKey="pemanfaatan" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Per RW View */}
      {activeTab === 'rw' && (
        <div className="border border-stone-100 rounded-xl p-4 bg-stone-50/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Perbandingan Kontribusi Antar-RW
              </span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Total kilogram material terkumpul dari tiap-tiap Rukun Warga
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rwChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="name" stroke="#78716c" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716c" fontSize={11} tickLine={false} unit="kg" />
                <Tooltip
                  formatter={(val: any) => [`${val || 0} Kg`, 'Berat Setoran']}
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="berat" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
