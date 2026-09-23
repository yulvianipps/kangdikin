export const INDONESIAN_DAYS = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function getIndonesianDay(dateString: string): string {
  if (!dateString) return 'Senin';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Senin';
  return INDONESIAN_DAYS[d.getDay()];
}

export function formatIndonesianDate(dateString: string): string {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    const monthName = INDONESIAN_MONTHS[monthIndex] || parts[1];
    return `${day} ${monthName} ${year}`;
  }
  return dateString;
}

export function formatRupiah(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return 'Rp0';
  return 'Rp' + Math.round(value).toLocaleString('id-ID');
}

export function formatWeight(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return '0 Kg';
  return value.toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' Kg';
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDateInRange(
  dateStr: string,
  period: string,
  startDate?: string,
  endDate?: string
): boolean {
  if (!dateStr) return false;
  if (period === 'all') return true;

  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (period === 'today') {
    return target.getTime() === now.getTime();
  }

  if (period === 'this_week') {
    // Current week (Monday to Sunday)
    const currentDay = now.getDay(); // 0 is Sunday
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return target >= monday && target <= sunday;
  }

  if (period === 'this_month') {
    return (
      target.getFullYear() === now.getFullYear() &&
      target.getMonth() === now.getMonth()
    );
  }

  if (period === 'this_year') {
    return target.getFullYear() === now.getFullYear();
  }

  if (period === 'custom' && (startDate || endDate)) {
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (target < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (target > end) return false;
    }
    return true;
  }

  return true;
}
