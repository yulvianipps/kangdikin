import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatWeight } from '../../utils/dateUtils';
import { ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { downloadCSV } from '../../utils/exportUtils';

export const RWSummarySection: React.FC = () => {
  const { rwSummaries, rts, filteredDeposits, isAdmin } = useApp();
  const [expandedRw, setExpandedRw] = useState<string | null>(rwSummaries[0]?.rwId || null);

  // Calculate detailed breakdown per RT for the expanded RW
  const getRTBreakdown = (rwId: string) => {
    const rwRTs = rts.filter((rt) => rt.rw_id === rwId);
    return rwRTs.map((rt) => {
      const deposits = filteredDeposits.filter((d) => d.rt_id === rt.id);
      const weight = deposits.reduce((sum, d) => sum + (Number(d.weight) || 0), 0);
      return {
        id: rt.id,
        name: rt.name,
        leader: rt.leader,
        count: deposits.length,
        weight,
      };
    }).sort((a, b) => b.weight - a.weight);
  };

  const handleExportRW = () => {
    const data = rwSummaries.map((rw, index) => ({
      'Peringkat': index + 1,
      'Wilayah': rw.rwName,
      'Ketua RW': rw.leader || '-',
      'Total Berat Setoran (Kg)': rw.totalWeightKg,
      'Jumlah Transaksi Setoran': rw.totalDepositsCount,
      'Total Pemanfaatan (Rp)': rw.totalUtilizationAmount,
      'Kegiatan Pemanfaatan': rw.totalUtilizationCount,
    }));
    downloadCSV(data, `Rekapitulasi_Kontribusi_RW_KANG_DIKIN_${Date.now()}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden space-y-6 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">
            Peringkat & Rekapitulasi Kontribusi per RW
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparansi keterlibatan warga antar-wilayah Rukun Warga dalam program KANG DIKIN
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleExportRW}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            Ekspor Rekap RW
          </button>
        )}
      </div>

      {/* Podium Top 3 RW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rwSummaries.slice(0, 3).map((rw, idx) => {
          const podiumColors = [
            { bg: 'bg-amber-50/80', border: 'border-amber-300', badge: 'bg-amber-400 text-amber-950', label: 'Peringkat 1' },
            { bg: 'bg-stone-50', border: 'border-stone-200', badge: 'bg-stone-300 text-stone-800', label: 'Peringkat 2' },
            { bg: 'bg-amber-50/30', border: 'border-amber-200', badge: 'bg-amber-700/20 text-amber-900', label: 'Peringkat 3' },
          ];
          const style = podiumColors[idx] || podiumColors[1];

          return (
            <div
              key={rw.rwId}
              className={`p-4 rounded-xl border ${style.border} ${style.bg} relative flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style.badge}`}>
                    {style.label}
                  </span>
                  <h4 className="text-lg font-bold text-stone-900 mt-2">{rw.rwName}</h4>
                  <p className="text-xs text-stone-500">Ketua RW: {rw.leader || 'Belum diisi'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-stone-500 block uppercase">Total Setoran</span>
                  <span className="text-xl font-black text-emerald-850 text-emerald-900">
                    {formatWeight(rw.totalWeightKg)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">
                  {rw.totalDepositsCount}x Setoran Terkumpul
                </span>
                <span className="font-semibold text-teal-800">
                  {formatRupiah(rw.totalUtilizationAmount)} Dimanfaatkan
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* List / Accordion per RW with RT Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Rincian Seluruh RW & Sub-Wilayah RT
        </h4>

        <div className="border border-stone-200 rounded-xl divide-y divide-stone-200/80 overflow-hidden">
          {rwSummaries.map((rw, index) => {
            const isExpanded = expandedRw === rw.rwId;
            const rtBreakdown = isExpanded ? getRTBreakdown(rw.rwId) : [];

            return (
              <div key={rw.rwId} className="bg-white">
                <div
                  onClick={() => setExpandedRw(isExpanded ? null : rw.rwId)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-stone-100 border border-stone-300 text-stone-700 font-bold text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <span className="font-bold text-stone-900 text-sm">{rw.rwName}</span>
                      <span className="text-xs text-stone-500 block">
                        Ketua: {rw.leader || '-'} • {rw.rtCount} Wilayah RT
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-right">
                      <span className="text-[11px] text-stone-500 block">Total Berat</span>
                      <span className="font-black text-emerald-800 text-sm">
                        {formatWeight(rw.totalWeightKg)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-stone-500 block">Pemanfaatan</span>
                      <span className="font-bold text-teal-800">
                        {formatRupiah(rw.totalUtilizationAmount)}
                      </span>
                    </div>

                    <div className="p-1 rounded-lg bg-stone-100 text-stone-600">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded RT Breakdown */}
                {isExpanded && (
                  <div className="bg-stone-50/80 p-4 border-t border-stone-200">
                    <h5 className="text-[11px] font-bold text-stone-700 uppercase mb-3">
                      Kontribusi per RT di {rw.rwName}
                    </h5>

                    {rtBreakdown.length === 0 ? (
                      <p className="text-xs text-stone-400">Belum ada RT terdaftar pada RW ini.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {rtBreakdown.map((rt) => (
                          <div
                            key={rt.id}
                            className="bg-white p-3 rounded-lg border border-stone-200/80 shadow-2xs flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-stone-900 text-xs">{rt.name}</span>
                              <span className="text-[11px] text-stone-500 block">
                                {rt.leader ? `Ketua: ${rt.leader}` : 'Pengurus RT'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold text-emerald-800 text-sm block">
                                {formatWeight(rt.weight)}
                              </span>
                              <span className="text-[10px] text-stone-500">
                                {rt.count}x setoran
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
