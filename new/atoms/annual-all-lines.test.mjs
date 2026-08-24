import { annualAllLines } from './annual-all-lines.mjs';
// מימושי-שקע לבדיקה: סינון-שנה נאמן-למקור + מקטע מדומה שמוכיח את החיווט.
const donationsOfYear = (donations, year) => donations.filter((d) => (d.date || '').startsWith(year + '-'));
let seenPayerIds = [];
const sectionMock = (inp) => { seenPayerIds.push(inp.payerId); return ['[' + inp.supporterName + ']']; };
const supporters = [
  { name: 'א', idNum: '111', donations: [{ date: '2026-01-01', amount: 50 }] },
  { name: 'ב', donations: [{ date: '2025-01-01', amount: 70 }] },
  { name: 'ג', donations: [{ date: '2026-05-05', amount: 30 }] },
];
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const L = annualAllLines('מאור', '580123456', '2026', supporters, undefined, donationsOfYear, sectionMock);
ok(JSON.stringify(L) === JSON.stringify(['[א]', '', '\f', '', '[ג]']), 'שני מקטעים + מפריד-עמוד: ' + JSON.stringify(L));
ok(seenPayerIds[0] === '111', 'payerId למקטע = idNum: ' + seenPayerIds[0]);
const one = annualAllLines('מאור', undefined, '2026', [supporters[0]], undefined, donationsOfYear, sectionMock);
ok(JSON.stringify(one) === '["[א]"]', 'תורם יחיד בלי מפריד: ' + JSON.stringify(one));
const none = annualAllLines('מאור', undefined, '2024', supporters, undefined, donationsOfYear, sectionMock);
ok(JSON.stringify(none) === JSON.stringify(['אין תורמים עם תרומות בשנת 2024.']), 'אפס-מתאימים: ' + JSON.stringify(none));
if (f) process.exit(1);
console.log('✓ annual-all-lines: 4 דוגמאות-חוזה — ירוק');
