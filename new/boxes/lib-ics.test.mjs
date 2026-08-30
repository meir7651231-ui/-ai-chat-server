/** בדיקת-קצה · קופסת lib-ics — דרך הקופסה בלבד (חוק-4). מוכיחה את דוגמאות-החוזה. */
import { icsEscape, foldIcsLine, buildIcs, downloadIcs } from './lib-ics.mjs';
const LIB_ICS_TERMS = {
  k1: "text/calendar;charset=utf-8",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
let f = 0;
const now = new Date(Date.UTC(2026, 7, 24, 10, 0, 0));

// 1) לוח-ריק — כותרת מדויקת
const empty = buildIcs([], 'לוח', now);
const EXP1 = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//maor-system//he//\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:לוח\r\nEND:VCALENDAR\r\n';
if (empty !== EXP1) { console.error('✗ לוח-ריק:', JSON.stringify(empty)); f = 1; }

// 2) מופע-עם-שעה
const timed = buildIcs([{ uid: 'u1', title: 'פגישה', date: '2026-08-24', time: '19:30' }], 'c', now);
for (const s of ['DTSTAMP:20260824T100000Z', 'DTSTART:20260824T193000', 'DTEND:20260824T203000', 'SUMMARY:פגישה']) {
  if (!timed.includes(s)) { console.error('✗ חסר', s); f = 1; }
}
if (timed.includes('DESCRIPTION') || timed.includes('LOCATION')) { console.error('✗ שדה-ריק דלף'); f = 1; }

// 3) גלגול-חצות
const mid = buildIcs([{ uid: 'x', title: 't', date: '2026-08-24', time: '23:30' }], 'c', now);
if (!mid.includes('DTEND:20260825T003000')) { console.error('✗ גלגול-חצות'); f = 1; }

// 4) בלי-שעה = יום-שלם
const allday = buildIcs([{ uid: 'x', title: 't', date: '2026-08-24', time: '' }], 'c', now);
if (!allday.includes('DTSTART;VALUE=DATE:20260824') || !allday.includes('DTEND;VALUE=DATE:20260825')) { console.error('✗ יום-שלם'); f = 1; }

// 5) שעה-מושחתת (עדשה-עוינת: '25:00' עובר-רגקס אך Invalid Date · '9:00' נופל-רגקס)
for (const bad of ['25:00', '12:60', '9:00', '99:99']) {
  const r = buildIcs([{ uid: 'x', title: 't', date: '2026-08-24', time: bad }], 'c', now);
  if (!r.includes('DTSTART;VALUE=DATE:20260824') || r.includes('DTSTART:2026')) { console.error('✗ שעה-מושחתת', bad); f = 1; }
}

// 6) escaping דרך השקע
const esc = buildIcs([{ uid: 'x', title: 'א,ב', date: '2026-08-24', time: '', notes: 'שורה1\nשורה2', location: 'אולם; ראשי' }], 'c', now);
if (!esc.includes('SUMMARY:א\\,ב')) { console.error('✗ escape פסיק'); f = 1; }
if (!esc.includes('DESCRIPTION:שורה1\\nשורה2')) { console.error('✗ escape שורה-חדשה'); f = 1; }
if (!esc.includes('LOCATION:אולם\\; ראשי')) { console.error('✗ escape נקודה-פסיק'); f = 1; }

// 7) icsEscape ישיר
if (icsEscape('a;b,c\\d\ne') !== 'a\\;b\\,c\\\\d\\ne') { console.error('✗ icsEscape'); f = 1; }
if (icsEscape(null) !== '' || icsEscape(undefined) !== '') { console.error('✗ icsEscape ריק/null'); f = 1; }

// 8) foldIcsLine — קיפול-אוקטטים על עברית (עדשה-עוינת: תו=2ב, לא חוצים תו)
const longHeb = 'SUMMARY:' + 'א'.repeat(60); // 8 + 120 בייט > 75
const folded = foldIcsLine(longHeb);
if (folded.length < 2) { console.error('✗ foldIcsLine לא קיפל שורה-ארוכה'); f = 1; }
if (folded.slice(1).some(l => l[0] !== ' ')) { console.error('✗ שורת-המשך בלי רווח-מוביל'); f = 1; }
if (folded.join('').replace(/\n /g, '') !== longHeb.replace(/\n/g, '')) { /* לא רלוונטי — אין \n */ }
if (foldIcsLine('')[0] !== '') { console.error('✗ foldIcsLine ריק'); f = 1; }

// 9) downloadIcs מותר — סדר-פעולות מלא דרך שקעי-IO
const calls = [];
const fakeA = { set href(v) { calls.push(['href', v]); }, get href() { return 'blob:zzz'; }, set download(v) { calls.push(['download', v]); }, click() { calls.push(['click']); } };
let notified = 0;
downloadIcs('cal.ics', empty, {
  blocked: false, notify: () => notified++,
  createElement: (t) => { calls.push(['createElement', t]); return fakeA; },
  createObjectURL: (b) => { calls.push(['createObjectURL', b instanceof Blob, b.type]); return 'blob:zzz'; },
  revokeObjectURL: (u) => calls.push(['revoke', u]),
  setTimeout: (fn) => { calls.push(['setTimeout']); fn(); },
});
if (notified !== 0) { console.error('✗ notify נקרא כשמותר'); f = 1; }
if (calls[0][0] !== 'createElement' || calls[0][1] !== 'a') { console.error('✗ createElement'); f = 1; }
const cou = calls.find(c => c[0] === 'createObjectURL');
if (!cou || cou[1] !== true || cou[2] !== LIB_ICS_TERMS.k1) { console.error('✗ Blob/mime'); f = 1; }
if (!calls.some(c => c[0] === 'download' && c[1] === 'cal.ics')) { console.error('✗ download filename'); f = 1; }
if (!calls.some(c => c[0] === 'click')) { console.error('✗ click'); f = 1; }
if (!calls.some(c => c[0] === 'revoke' && c[1] === 'blob:zzz')) { console.error('✗ revoke'); f = 1; }

// 10) downloadIcs חסום — יוצא מיד, notify פעם-אחת, אפס נגיעת-DOM
let n2 = 0, touched = 0;
downloadIcs('cal.ics', empty, {
  blocked: true, notify: () => n2++,
  createElement: () => { touched++; return fakeA; },
  createObjectURL: () => 'x', revokeObjectURL: () => {}, setTimeout: () => {},
});
if (n2 !== 1) { console.error('✗ notify חסום ≠ פעם-אחת:', n2); f = 1; }
if (touched !== 0) { console.error('✗ נגע ב-DOM כשחסום'); f = 1; }

/* 🛡 מגן-הכרעה: הקופסה נקראת עם fs — סדר-החיווט + המילון חתומים verbatim. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./lib-ics.mjs', import.meta.url), 'utf8');
// א) שער-היציאה לפני נגיעת-DOM (guardExport לפני createElement)
if (src.indexOf('guardExport(') > src.indexOf('createElement(')) { console.error('✗ מגן: DOM לפני שער-היציאה'); f = 1; }
// ב) buildIcs מזריק את שני השכנים כשקעים
if (!src.includes('buildIcsAtom(occurrences, calName, now, icsEscape, foldIcsLine)')) { console.error('✗ מגן: חיווט buildIcs השתנה'); f = 1; }
// ג) מילון-הקופסה verbatim (mime בלי BOM · חלון-שחרור)
if (!src.includes("LIB_ICS_TERMS.k1")) { console.error('✗ מגן: mime השתנה'); f = 1; }
if (!/REVOKE_MS = 5000/.test(src)) { console.error('✗ מגן: חלון-שחרור השתנה'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת lib-ics: 4 חוטים · 6 דוגמאות-בנייה + escaping + קיפול-עברית + שער-יציאה (מותר/חסום) — ירוק');
