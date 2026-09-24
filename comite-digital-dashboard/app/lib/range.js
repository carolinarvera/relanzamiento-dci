const ISO = /^\d{4}-\d{2}-\d{2}$/;
const iso = (d) => d.toISOString().slice(0, 10);
const utc = (s) => new Date(`${s}T00:00:00Z`);
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function resolveRange(searchParams, now = new Date()) {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  let start = searchParams.get('start');
  let end = searchParams.get('end');
  const today = iso(now);
  const valid = start && end && ISO.test(start) && ISO.test(end) && !Number.isNaN(utc(start)) && start <= end;
  if (!valid) {
    start = iso(new Date(Date.UTC(y, m - 1, 1)));
    end = iso(new Date(Date.UTC(y, m, 0)));
  }
  if (end > today) end = today;
  if (start > end) start = end;

  const s = utc(start);
  const e = utc(end);
  const isFullMonth = s.getUTCDate() === 1 && iso(new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth() + 1, 0))) === end && s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  let prevStart;
  let prevEnd;
  if (isFullMonth) {
    prevStart = iso(new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth() - 1, 1)));
    prevEnd = iso(new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), 0)));
  } else {
    const days = Math.round((e - s) / 86400000) + 1;
    prevEnd = iso(new Date(s.getTime() - 86400000));
    prevStart = iso(new Date(s.getTime() - days * 86400000));
  }
  const label = isFullMonth
    ? `${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()}`
    : `${s.getUTCDate()} ${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()} - ${e.getUTCDate()} ${MONTHS[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
  return { start, end, prevStart, prevEnd, label, isFullMonth };
}
