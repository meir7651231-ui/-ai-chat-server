/** בדיקת-קצה: דוח-שנתי-לתורם — דרך הקופסה בלבד. DoD: annual-report.contract.md */
import { years, ofYear, reportLines, allLines, reportText, downloadAnnualReport } from './annual-report.mjs';
let f = 0;
const fail = (m) => { console.error('✗ ' + m); f = 1; };

const donations = [
  { date: '2026-03-01', amount: 180, rid: 'D-7' },
  { date: '2026-01-15', amount: 100, cur: '$' },
  { date: '2025-12-31', amount: 999 },
];
const inp = { orgName: 'מאור', orgTaxId: '580123456', supporterName: 'דוד לוי', payerId: '012345678', year: '2026', site: 'maor.org', donations };

// ── years: יורד, רק YYYY תקין ──
if (years(donations).join(',') !== '2026,2025') fail('years יורד');
if (years([{ date: '' }, { date: 'שבור' }, { date: '2024-01-01' }]).join(',') !== '2024') fail('years מסנן תאריך-שבור/ריק/עברי');

// ── ofYear: מיון-עולה, הדולרית ראשונה, 2025 מסוננת ──
const rows = ofYear(donations, '2026');
if (rows.length !== 2 || rows[0].date !== '2026-01-15' || rows[1].date !== '2026-03-01') fail('ofYear מיון/סינון');

// ── reportLines: החוזה (money+ofYear מחווטים) ──
const L = reportLines(inp);
if (L.length !== 20) fail('reportLines אורך ' + L.length);
if (L[9] !== '2026-01-15          $100') fail('reportLines [9] דולר-padStart: ' + JSON.stringify(L[9]));
if (L[10] !== '2026-03-01          ₪180  קבלה D-7') fail('reportLines [10] שקל+קבלה: ' + JSON.stringify(L[10]));
if (L[13] !== 'סה"כ בשקלים: ₪180') fail('reportLines סה"כ ₪');
if (L[14] !== 'סה"כ בדולרים: $100') fail('reportLines סה"כ $');
if (!L.includes('לארגון אישור מוסד ציבורי לעניין תרומות לפי סעיף 46 לפקודת מס הכנסה.')) fail('reportLines §46 חסר');

// ── קצה: אפס-תרומות + בלי taxId ⇒ בלי §46 ──
const empty = reportLines({ orgName: 'מאור', supporterName: 'ריק', year: '2027', donations });
if (!empty.includes('אין תרומות רשומות בשנת 2027.')) fail('reportLines אפס-תרומות');
if (empty.some((x) => x.includes('סעיף 46'))) fail('reportLines §46 דלף בלי taxId');

// ── allLines: מקטע-יחיד בלי מפריד; דילוג-תורם-בלי-תרומות; אפס-מתאימים ──
const one = allLines('מאור', undefined, '2026', [{ name: 'א', donations: [{ date: '2026-05-01', amount: 50 }] }]);
if (one.includes('\f')) fail('allLines מפריד-עמוד על תורם-יחיד');
const none = allLines('מאור', undefined, '2024', [{ name: 'א', donations }]);
if (none.join('') !== 'אין תורמים עם תרומות בשנת 2024.') fail('allLines אפס-מתאימים');

// ── reportText: BOM + '\n' ──
if (reportText(['a', 'b']) !== '﻿a\nb') fail('reportText BOM/newline');

// ── downloadAnnualReport: שער-חסום ⇒ false בלי DOM ──
let created = 0;
const blockedIo = { blocked: true, notify: null, createAnchor: () => { created++; return {}; }, makeBlobUrl: () => '', revokeUrl: () => {}, schedule: () => {} };
if (downloadAnnualReport({ filename: 'r.txt', lines: ['x'] }, blockedIo) !== false) fail('download חסום לא-החזיר false');
if (created !== 0) fail('download חסום נגע ב-DOM');

// ── download מותר ⇒ true, download=filename, click פעם-אחת, schedule(fn,5000) ──
let clicks = 0, schedMs = 0, sched = 0;
const a = { click: () => { clicks++; } };
const okIo = { blocked: false, notify: null, createAnchor: () => a, makeBlobUrl: (t) => 'blob:' + t.length, revokeUrl: () => {}, schedule: (fn, ms) => { sched++; schedMs = ms; if (typeof fn !== 'function') fail('schedule לא-קיבל פונקציה'); } };
if (downloadAnnualReport({ filename: 'r.txt', lines: ['שלום', 'עולם'] }, okIo) !== true) fail('download מותר לא-החזיר true');
if (a.download !== 'r.txt') fail('download filename');
if (!String(a.href).startsWith('blob:')) fail('download href מ-makeBlobUrl');
if (clicks !== 1) fail('download click פעם-אחת');
if (sched !== 1 || schedMs !== 5000) fail('download schedule(fn,5000)');

/* 🛡 מגן-הכרעה: money verbatim + BOM + שער-לפני-DOM (סדר-החיווט חתום). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./annual-report.mjs', import.meta.url), 'utf8');
if (!src.includes("(cur === '$' ? '$' : '₪') + amount.toLocaleString('he-IL')")) fail('מגן: money שונה מהמקור');
if (!/const BOM = '﻿'/.test(src)) fail('מגן: BOM שונה');
if (src.indexOf('guardExport(') > src.indexOf('io.createAnchor()')) fail('מגן: DOM נבנה לפני שער-הייצוא');

if (f) process.exit(1);
console.log('✓ קופסת-דוח-שנתי: years/ofYear/reportLines/allLines/reportText/download — קצוות ירוקים');
