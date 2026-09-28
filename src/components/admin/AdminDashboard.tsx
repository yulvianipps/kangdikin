import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/dateUtils';

interface AdminDashboardProps {
  onNavigate: (menuId: string) => void;
  onOpenAddDeposit: () => void;
  onOpenAddSale: () => void;
  onOpenAddUtilization: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenAddDeposit,
  onOpenAddSale,
  onOpenAddUtilization,
}) => {
  const {
    user,
    isSuperAdmin,
    isStaff,
    userProgramId,
    userProgramName,
    deposits,
    sales,
    utilizations,
    programs,
    rws,
    totalDepositsWeight,
    totalDepositsCount,
    totalSalesAmount,
    totalUtilizationsAmount,
    getProgramName,
    getRWName,
    getRTName,
  } = useApp();

  // Filter lists if user is staff for a specific program
  const displayDeposits = isStaff && userProgramId
    ? deposits.filter((d) => d.program_id === userProgramId)
    : deposits;

  const displaySales = isStaff && userProgramId
    ? sales.filter((s) => s.program_id === userProgramId)
    : sales;

  const displayUtilizations = isStaff && userProgramId
    ? utilizations.filter((u) => u.program_id === userProgramId)
    : utilizations;

  // Combine recent activities
  const recentActivities = [
    ...displayDeposits.slice(0, 4).map((d) => ({
      id: d.id,
      date: d.date,
      type: 'Setoran',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      description: `${d.weight} Kg (${getProgramName(d.program_id)}) - ${getRWName(d.rw_id)} ${getRTName(d.rt_id)}`,
      amountOrWeight: `${d.weight} Kg`,
    })),
    ...displaySales.slice(0, 3).map((s) => ({
      id: s.id,
      date: s.date,
      type: 'Penjualan',
      badgeClass: 'bg-blue-100 text-blue-800',
      description: `${s.item_type} (${s.weight} Kg) - ${getProgramName(s.program_id)}`,
      amountOrWeight: formatRupiah(s.total),
    })),
    ...displayUtilizations.slice(0, 3).map((u) => ({
      id: u.id,
      date: u.date,
      type: 'Pemanfaatan',
      badgeClass: 'bg-amber-100 text-amber-800',
      description: `${u.type}: ${u.description || '-'}`,
      amountOrWeight: formatRupiah(u.amount),
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // Filter programs list to only their program if staff
  const relevantPrograms = isStaff && userProgramId
    ? programs.filter((p) => p.id === userProgramId)
    : programs;

  // Program summary calculation
  const programSummaries = relevantPrograms.map((prog) => {
    const progDeposits = deposits.filter((d) => d.program_id === prog.id);
    const progSales = sales.filter((s) => s.program_id === prog.id);
    const progUtils = utilizations.filter((u) => u.program_id === prog.id);

    const totalWeight = progDeposits.reduce((sum, d) => sum + d.weight, 0);
    const totalSaleWeight = progSales.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
    const remainingStock = Math.max(0, totalWeight - totalSaleWeight);
    const totalSale = progSales.reduce((sum, s) => sum + s.total, 0);
    const totalUtil = progUtils.reduce((sum, u) => sum + u.amount, 0);

    return {
      id: prog.id,
      name: prog.name,
      totalWeight,
      totalSaleWeight,
      remainingStock,
      totalSale,
      totalUtil,
      depositCount: progDeposits.length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Scope banner for staff */}
      {isStaff && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div>
            <div className="font-bold flex items-center gap-1.5 text-sm text-amber-950">
              <span>🌾 Mode Pengelola: {userProgramName || 'Program Terpilih'}</span>
            </div>
            <p className="mt-0.5 text-amber-800">
              Anda masuk sebagai <strong>{user?.name}</strong>. Anda hanya dapat melihat, menambah, dan mengunduh data khusus program <strong>{userProgramName}</strong>.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-200/70 border border-amber-300 rounded-lg font-bold shrink-0 self-start sm:self-auto text-[11px]">
            Data Terfilter Otomatis
          </span>
        </div>
      )}

      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Dashboard</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {isStaff
              ? `Ringkasan pencatatan & perputaran program ${userProgramName}`
              : 'Selamat datang di Dashboard KANG DIKIN (Akses Administrator)'}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('biomassa')}
            className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>🚚 Daftar Biomassa</span>
          </button>
          <button
            onClick={onOpenAddDeposit}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            + Tambah Setoran
          </button>
          <button
            onClick={onOpenAddSale}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            + Tambah Penjualan
          </button>
          <button
            onClick={onOpenAddUtilization}
            className="px-3.5 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            + Tambah Pemanfaatan
          </button>
        </div>
      </div>

      {/* Main Statistics (Clean, strictly NO decorative icons as per user instructions) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500 mb-1">Total Setoran</div>
          <div className="text-xl font-bold text-stone-900">
            {totalDepositsCount.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Transaksi tercatat</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500 mb-1">Total Berat</div>
          <div className="text-xl font-bold text-stone-900">
            {totalDepositsWeight.toLocaleString('id-ID')} Kg
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Material terpilah</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500 mb-1">Total Penjualan</div>
          <div className="text-xl font-bold text-stone-900">
            {formatRupiah(totalSalesAmount)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Hasil komoditas</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500 mb-1">Total Pemanfaatan</div>
          <div className="text-xl font-bold text-stone-900">
            {formatRupiah(totalUtilizationsAmount)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Bantuan & kegiatan</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500 mb-1">Jumlah RW</div>
          <div className="text-xl font-bold text-stone-900">
            {rws.filter((r) => r.status === 'active').length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Rukun Warga aktif</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-medium text-stone-500 mb-1">Jumlah Program</div>
          <div className="text-xl font-bold text-stone-900">
            {programs.filter((p) => p.is_active).length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Program berjalan</div>
        </div>
      </div>

      {/* Ringkasan Program Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Ringkasan Program</h2>
            <p className="text-xs text-stone-500">Performa akumulatif tiap program lingkungan</p>
          </div>
          <button
            onClick={() => onNavigate('program')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950"
          >
            Kelola Program &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4 text-right">Total Setoran</th>
                <th className="py-3 px-4 text-right">Total Penjualan</th>
                <th className="py-3 px-4 text-right">Total Pemanfaatan</th>
                <th className="py-3 px-4 text-right">Saldo Dana Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {programSummaries.map((prog) => {
                const balance = prog.totalSale - prog.totalUtil;
                return (
                  <tr key={prog.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">{prog.name}</td>
                    <td className="py-3.5 px-4 text-right text-stone-700">
                      {prog.totalWeight.toLocaleString('id-ID')} Kg
                      <span className="text-xs text-stone-400 block font-normal">
                        ({prog.depositCount} setoran)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-stone-900">
                      {formatRupiah(prog.totalSale)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-stone-900">
                      {formatRupiah(prog.totalUtil)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-800">
                      {formatRupiah(balance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kartu Stok Material Gudang */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Kartu Stok Material Gudang Desa</h2>
            <p className="text-xs text-stone-500">
              Pantau sisa tonase sampah terpilah yang siap dijual ke pengepul
            </p>
          </div>
          <button
            onClick={onOpenAddSale}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950"
          >
            Catat Penjualan Gudang &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <th className="py-3 px-4">Program / Material</th>
                <th className="py-3 px-4 text-right">Total Disetor Warga</th>
                <th className="py-3 px-4 text-right">Sudah Terjual</th>
                <th className="py-3 px-4 text-right">Sisa Stok di Gudang</th>
                <th className="py-3 px-4 text-center">Status Gudang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {programSummaries.map((prog) => (
                <tr key={prog.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-stone-900">{prog.name}</td>
                  <td className="py-3.5 px-4 text-right text-stone-700">
                    {prog.totalWeight.toLocaleString('id-ID')} Kg
                  </td>
                  <td className="py-3.5 px-4 text-right text-stone-700">
                    {prog.totalSaleWeight.toLocaleString('id-ID')} Kg
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-900">
                    {prog.remainingStock.toLocaleString('id-ID')} Kg
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {prog.remainingStock > 100 ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Siap Dijual ({prog.remainingStock} Kg)
                      </span>
                    ) : prog.remainingStock > 0 ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Tersedia ({prog.remainingStock} Kg)
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-600">
                        Nol / Bersih
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aktivitas Terbaru Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Aktivitas Terbaru</h2>
            <p className="text-xs text-stone-500">Daftar transaksi mutakhir di semua modul</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Jenis Transaksi</th>
                <th className="py-3 px-4">Rincian Kegiatan</th>
                <th className="py-3 px-4 text-right">Nilai / Berat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {recentActivities.map((act) => (
                <tr key={act.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 text-xs text-stone-600 whitespace-nowrap">{act.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${act.badgeClass}`}>
                      {act.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-stone-800">{act.description}</td>
                  <td className="py-3 px-4 text-right font-bold text-stone-900 text-xs">{act.amountOrWeight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
