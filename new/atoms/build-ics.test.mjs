import { buildIcs as __pure_buildIcs } from './build-ics.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_buildIcs_BUILD_ICS_T = {
  k1: "BEGIN:VCALENDAR",
  k2: "VERSION:2.0",
  k3: "CALSCALE:GREGORIAN",
  k4: "METHOD:PUBLISH",
  k5: "X-WR-CALNAME:",
  k6: "BEGIN:VEVENT",
  k7: "UID:",
  k8: "DTSTAMP:",
  k9: "DTSTART:",
  k10: "DTEND:",
  k11: "DTSTART;VALUE=DATE:",
  k12: "DTEND;VALUE=DATE:",
  k13: "SUMMARY:",
  k14: "DESCRIPTION:",
  k15: "LOCATION:",
  k16: "END:VEVENT",
  k17: "END:VCALENDAR",
  k18: "PRODID:-//maor-system//he//",
  k19: 3600000,
};
const buildIcs = (...a) => __pure_buildIcs(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_buildIcs_BUILD_ICS_T);

// שקעים מקומיים לבדיקה — icsEscape אמיתי-מינימלי; foldIcsLine=זהות (הקיפול נבדק באטום שלו)
const icsEscape = (s) => (s || '')
  .replace(/\\/g, '\\\\')
  .replace(/;/g, '\\;')
  .replace(/,/g, '\\,')
  .replace(/\r?\n/g, '\\n');
const foldIcsLine = (line) => [line];
const now = new Date(Date.UTC(2026, 7, 24, 10, 0, 0));
const B = (occ, name = 'לוח') => buildIcs(occ, name, now, icsEscape, foldIcsLine);
const linesOf = (s) => s.split('\r\n');

let f = 0;
const ok = (name, cond, extra = '') => { if (!cond) { console.error(`✗ ${name} ${extra}`); f = 1; } };
const eq = (name, got, want) => ok(name, JSON.stringify(got) === JSON.stringify(want), `\n  ${JSON.stringify(got)}\n≠ ${JSON.stringify(want)}`);

// 1 — אפס מופעים
eq('1 · קובץ-ריק', B([]),
  'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//maor-system//he//\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:לוח\r\nEND:VCALENDAR\r\n');

// 2 — מופע עם שעה
const l2 = linesOf(B([{ uid: 'u1', title: 'פגישה', date: '2026-08-24', time: '19:30' }]));
for (const w of ['UID:u1', 'DTSTAMP:20260824T100000Z', 'DTSTART:20260824T193000', 'DTEND:20260824T203000', 'SUMMARY:פגישה'])
  ok(`2 · ${w}`, l2.includes(w));
ok('2 · בלי DESCRIPTION/LOCATION', !l2.some((x) => x.startsWith('DESCRIPTION') || x.startsWith('LOCATION')));

// 3 — גלגול-חצות
const l3 = linesOf(B([{ uid: 'u1', title: 'ליל', date: '2026-08-24', time: '23:30' }]));
ok('3 · DTEND למחרת', l3.includes('DTEND:20260825T003000'), JSON.stringify(l3));

// 4 — בלי שעה ⇒ יום-שלם
const l4 = linesOf(B([{ uid: 'u1', title: 'יום', date: '2026-08-24', time: '' }]));
ok('4 · DTSTART יום-שלם', l4.includes('DTSTART;VALUE=DATE:20260824'));
ok('4 · DTEND יום-המחרת', l4.includes('DTEND;VALUE=DATE:20260825'));

// 5 — שעות מושחתות ⇒ נפילה בטוחה ליום-שלם
for (const t of ['25:00', '9:00']) {
  const l5 = linesOf(B([{ uid: 'u1', title: 'יום', date: '2026-08-24', time: t }]));
  ok(`5 · '${t}' ⇒ יום-שלם`, l5.includes('DTSTART;VALUE=DATE:20260824') && l5.includes('DTEND;VALUE=DATE:20260825'));
  ok(`5 · '${t}' בלי DTSTART שעתי`, !l5.some((x) => /^DTSTART:\d/.test(x)));
}

// 6 — escaping דרך השקע
const l6 = linesOf(B([{ uid: 'u1', title: 'א,ב', date: '2026-08-24', time: '', notes: 'שורה1\nשורה2', location: 'אולם; ראשי' }]));
ok('6 · SUMMARY מנוקה', l6.includes('SUMMARY:א\\,ב'));
ok('6 · DESCRIPTION מנוקה', l6.includes('DESCRIPTION:שורה1\\nשורה2'));
ok('6 · LOCATION מנוקה', l6.includes('LOCATION:אולם\\; ראשי'));

if (f) process.exit(1);
console.log('✓ build-ics: 6 דוגמאות-חוזה — ירוק');
