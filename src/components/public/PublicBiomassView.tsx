import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BiomassEntry } from '../../types';
import {
  Truck,
  Scale,
  Calendar,
  Layers,
  Search,
  Building2,
  Tag,
  Download,
  Copy,
  Check,
  FileText,
  Clock,
} from 'lucide-react';

export const PublicBiomassView: React.FC = () => {
  const { biomassEntries, biomassPartners, biomassTypes, addToast } = useApp();

  const [filterPartner, setFilterPartner] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'daily' | 'table'>('daily');
  const [copied, setCopied] = useState(false);

  // Filtered entries
  const filtered = useMemo(() => {
    return biomassEntries.filter((b) => {
      if (filterPartner !== 'all' && b.group_category !== filterPartner) return false;
      if (filterType !== 'all' && b.biomass_type !== filterType) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          b.vehicle_plate.toLowerCase().includes(query) ||
          (b.biomass_type && b.biomass_type.toLowerCase().includes(query)) ||
          b.group_category.toLowerCase().includes(query) ||
          (b.notes && b.notes.toLowerCase().includes(query)) ||
          b.day.toLowerCase().includes(query);
        if (!match) return false;
      }

      return true;
    });
  }, [biomassEntries, filterPartner, filterType, search]);

  // Aggregations
  const totalGrossKg = useMemo(
    () => filtered.reduce((acc, curr) => acc + (Number(curr.gross_weight) || 0), 0),
    [filtered]
  );
  const totalTareKg = useMemo(
    () => filtered.reduce((acc, curr) => acc + (Number(curr.tare_weight) || 0), 0),
    [filtered]
  );
  const totalNetKg = useMemo(
    () => filtered.reduce((acc, curr) => acc + (Number(curr.net_weight) || 0), 0),
    [filtered]
  );

  // Daily grouping
  const dailyStructuredData = useMemo(() => {
    const dateMap: Record<string, BiomassEntry[]> = {};
    filtered.forEach((entry) => {
      const d = entry.date;
      if (!dateMap[d]) dateMap[d] = [];
      dateMap[d].push(entry);
    });

    const sortedDates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a));

    return sortedDates.map((dateStr) => {
      const entriesForDate = dateMap[dateStr];
      const firstEntry = entriesForDate[0];
      const dayName = firstEntry?.day || 'Hari';

      let formattedDate = dateStr;
      try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const year = parts[0];
          const monthIndex = parseInt(parts[1], 10) - 1;
          const dayNum = parseInt(parts[2], 10);
          const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          formattedDate = `${dayNum} ${monthNames[monthIndex] || parts[1]} ${year}`;
        }
      } catch (e) {
        formattedDate = dateStr;
      }

      const dayHeader = `${dayName}, ${formattedDate}`;

      const groupMap: Record<string, BiomassEntry[]> = {};
      entriesForDate.forEach((e) => {
        const gName = e.group_category || 'Stokpile Utama';
        if (!groupMap[gName]) groupMap[gName] = [];
        groupMap[gName].push(e);
      });

      const groups = Object.keys(groupMap).map((gName, gIdx) => {
        const items = groupMap[gName];
        const groupNet = items.reduce((acc, curr) => acc + (Number(curr.net_weight) || 0), 0);
        const letterPrefix = Object.keys(groupMap).length > 1 ? `${String.fromCharCode(65 + gIdx)}. ` : '';

        return {
          groupName: `${letterPrefix}${gName}`,
          items,
          groupNet,
        };
      });

      const dayTotalNet = entriesForDate.reduce((acc, curr) => acc + (Number(curr.net_weight) || 0), 0);

      return {
        dateStr,
        dayHeader,
        dayTotalNet,
        groups,
      };
    });
  }, [filtered]);

  const handleCopyText = () => {
    let text = 'DAFTAR BIOMASSA\n\n';
    dailyStructuredData.forEach((dayData) => {
      text += `${dayData.dayHeader}\n`;
      dayData.groups.forEach((g) => {
        text += `${g.groupName}\n`;
        g.items.forEach((item, idx) => {
          const gFormatted = Number(item.gross_weight).toLocaleString('id-ID');
          const tFormatted = Number(item.tare_weight).toLocaleString('id-ID');
          const nFormatted = Number(item.net_weight).toLocaleString('id-ID');
          const notesText = item.notes ? ` ( ${item.notes} )` : '';
          const typeText = item.biomass_type ? ` [${item.biomass_type}]` : '';
          const timeText = item.arrival_time && item.departure_time ? ` (Jam ${item.arrival_time} - ${item.departure_time})` : '';
          text += `${idx + 1}. ${item.vehicle_plate} : ${gFormatted} - ${tFormatted} = ${nFormatted} kg${typeText}${timeText}${notesText}\n`;
        });
        text += `Subtotal: ${g.groupNet.toLocaleString('id-ID')} kg\n\n`;
      });
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('success', 'Teks Disalin', 'Catatan daftar biomassa siap dibagikan.');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Transparansi Jembatan Timbang</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            DAFTAR BIOMASSA
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Data operasional timbangan pasokan biomassa aren, kayu, dan bahan bakar nabati per kelompok / lokasi stokpile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Catatan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Total Ritase Armada</span>
          <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">
            {filtered.length} <span className="text-xs font-normal text-stone-500">Truk</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Total Kotor (Gross)</span>
          <div className="text-2xl font-bold text-stone-800 mt-1 font-mono">
            {totalGrossKg.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-stone-500">Kg</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Total Kosong (Tara)</span>
          <div className="text-2xl font-bold text-amber-800 mt-1 font-mono">
            {totalTareKg.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-stone-500">Kg</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950 text-white shadow-md border border-emerald-900">
          <span className="text-xs font-semibold text-emerald-300">Total Pasokan Bersih (Netto)</span>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1 font-mono">
            {totalNetKg.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-white">Kg</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'daily'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Format Catatan Harian</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Tabel Log Timbang</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterPartner}
            onChange={(e) => setFilterPartner(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-medium"
          >
            <option value="all">Semua Kelompok / Lokasi</option>
            {biomassPartners.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-medium"
          >
            <option value="all">Semua Jenis Biomassa</option>
            {biomassTypes.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari plat nomor, dll..."
              className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: DAILY FORMAT */}
      {viewMode === 'daily' && (
        <div className="space-y-6">
          {dailyStructuredData.map((dayData) => (
            <div
              key={dayData.dateStr}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-emerald-950 text-white px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <h3 className="font-bold text-base tracking-wide">
                    {dayData.dayHeader}
                  </h3>
                </div>
                <div className="text-xs">
                  Total Netto: <strong className="font-mono text-emerald-300">{dayData.dayTotalNet.toLocaleString('id-ID')} Kg</strong>
                </div>
              </div>

              {/* Groups */}
              <div className="divide-y divide-stone-200 p-6 space-y-4">
                {dayData.groups.map((group) => (
                  <div key={group.groupName} className="space-y-3 pt-3 first:pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-stone-900 text-sm sm:text-base">
                        <Building2 className="w-4 h-4 text-emerald-800" />
                        <span>{group.groupName}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        Subtotal: {group.groupNet.toLocaleString('id-ID')} Kg
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.items.map((item, idx) => {
                        const isWet =
                          item.condition === 'basah' ||
                          item.notes?.toLowerCase().includes('basah');

                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                                {idx + 1}
                              </span>
                              <span className="font-mono font-extrabold text-sm text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                                {item.vehicle_plate}
                              </span>
                              <div className="font-mono text-stone-700 flex items-center gap-1.5 font-semibold">
                                <span>{Number(item.gross_weight).toLocaleString('id-ID')}</span>
                                <span className="text-stone-400">-</span>
                                <span>{Number(item.tare_weight).toLocaleString('id-ID')}</span>
                                <span className="text-stone-400">=</span>
                                <span className="text-emerald-900 font-extrabold text-sm bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                                  {Number(item.net_weight).toLocaleString('id-ID')} kg
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Jam Tiba & Jam Berangkat */}
                              {(item.arrival_time || item.departure_time) && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono text-[11px] border border-stone-200">
                                  <Clock className="w-3 h-3 text-emerald-800" />
                                  <span>{item.arrival_time || '--:--'} - {item.departure_time || '--:--'}</span>
                                </span>
                              )}

                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                                <Tag className="w-3 h-3" />
                                <span>{item.biomass_type || 'Aren'}</span>
                              </span>

                              {isWet && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
                                  ( basah )
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3.5">Tanggal</th>
                  <th className="px-4 py-3.5">Kelompok / Stokpile</th>
                  <th className="px-4 py-3.5">Jenis Biomassa</th>
                  <th className="px-4 py-3.5">No Polisi Truk</th>
                  <th className="px-4 py-3.5">Jam Tiba</th>
                  <th className="px-4 py-3.5">Jam Berangkat</th>
                  <th className="px-4 py-3.5 text-right">Berat Kotor</th>
                  <th className="px-4 py-3.5 text-right">Berat Kosong</th>
                  <th className="px-4 py-3.5 text-right">Netto</th>
                  <th className="px-4 py-3.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-stone-800">
                      {item.day}, {item.date}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-stone-900">
                      {item.group_category}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                        {item.biomass_type || 'Aren'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {item.vehicle_plate}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-stone-700">
                      <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-stone-200">
                        <Clock className="w-3 h-3 text-emerald-800" />
                        {item.arrival_time || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-stone-700">
                      <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-stone-200">
                        <Clock className="w-3 h-3 text-stone-500" />
                        {item.departure_time || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-stone-600">
                      {item.gross_weight.toLocaleString('id-ID')} Kg
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-stone-600">
                      {item.tare_weight.toLocaleString('id-ID')} Kg
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-900 bg-emerald-50/40">
                      {item.net_weight.toLocaleString('id-ID')} Kg
                    </td>
                    <td className="px-4 py-3.5">
                      {item.condition === 'basah' || item.notes?.toLowerCase().includes('basah') ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          basah
                        </span>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
