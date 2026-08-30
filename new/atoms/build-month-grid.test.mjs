import { buildMonthGrid as __pure_buildMonthGrid } from './build-month-grid.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_buildMonthGrid_BUILD_MONTH_GRID_T = {
  k1: "long",
  k2: "numeric",
  k3: "he-u-ca-hebrew",
  k4: 42,
  k5: 15,
  k6: 31,
};
const buildMonthGrid = (...a) => __pure_buildMonthGrid(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_buildMonthGrid_BUILD_MONTH_GRID_T);

// שקעים מקומיים לבדיקה
const isoOf = (d) => {
  const p2 = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};
const cellOf = (d, inMonth, hebMode, byDate) => {
  const iso = isoOf(d);
  return { iso, inMonth, events: byDate.get(iso) ?? [] };
};
const fEn = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
const hpOf = (iso, d) => {
  const p = Object.fromEntries(fEn.formatToParts(d).map((x) => [x.type, x.value]));
  return { day: +p.day, month: p.month, year: +p.year };
};
const gemYear = (y) => 'ג[' + y + ']';
const S = [cellOf, isoOf, hpOf, gemYear];

let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}:\n  ${JSON.stringify(got)}\n≠ ${JSON.stringify(want)}`); f = 1; }
};

// 1 — לועזי
const g1 = buildMonthGrid([], '2026-08-24', false, ...S);
eq('1 · 42 תאים', g1.cells.length, 42);
eq('1 · תא ראשון', g1.cells[0].iso, '2026-07-26');
eq('1 · תא אחרון', g1.cells[41].iso, '2026-09-05');
eq('1 · 31 בתוך-החודש', g1.cells.filter((c) => c.inMonth).length, 31);
eq('1 · label', g1.label, 'אוגוסט 2026');
eq('1 · subLabel', g1.subLabel, 'אב–אלול');
eq('1 · prev/next', { p: g1.prevIso, n: g1.nextIso }, { p: '2026-07-15', n: '2026-09-15' });

// 2 — קיבוץ אירועים; בלי-date מדולג
const g2 = buildMonthGrid([{ date: '2026-08-24', t: 'x' }, { date: '2026-08-24', t: 'y' }, { t: 'בלי-תאריך' }], '2026-08-24', false, ...S);
eq('2 · שני אירועים בתא', g2.cells.find((c) => c.iso === '2026-08-24').events.map((e) => e.t), ['x', 'y']);
eq('2 · חסר-date לא בגריד', g2.cells.reduce((n, c) => n + c.events.length, 0), 2);

// 3 — עברי: אלול תשפ"ו
const g3 = buildMonthGrid([], '2026-08-24', true, ...S);
eq('3 · 35 תאים', g3.cells.length, 35);
eq('3 · ריפוד-פתיחה', g3.cells.slice(0, 5).map((c) => [c.iso, c.inMonth]),
  [['2026-08-09', false], ['2026-08-10', false], ['2026-08-11', false], ['2026-08-12', false], ['2026-08-13', false]]);
eq('3 · א׳ אלול', [g3.cells[5].iso, g3.cells[5].inMonth], ['2026-08-14', true]);
eq('3 · כ"ט אלול', [g3.cells[33].iso, g3.cells[33].inMonth], ['2026-09-11', true]);
eq('3 · ריפוד-סוף', [g3.cells[34].iso, g3.cells[34].inMonth], ['2026-09-12', false]);
eq('3 · 29 ימי-חודש', g3.cells.filter((c) => c.inMonth).length, 29);
eq('3 · prev/next', { p: g3.prevIso, n: g3.nextIso }, { p: '2026-08-13', n: '2026-09-12' });

// 4 — תוויות עבריות
eq('4 · label', g3.label, 'Elul ג[5786]');
eq('4 · subLabel', g3.subLabel, 'אוגוסט 2026 – ספטמבר 2026');

// 5 — אירוע בכ"ט אלול מגיע לתא-האחרון-בחודש
const g5 = buildMonthGrid([{ date: '2026-09-11', t: 'ערב-ר"ה' }], '2026-08-24', true, ...S);
eq('5 · אירוע בתא האחרון-בחודש', g5.cells[33].events.map((e) => e.t), ['ערב-ר"ה']);

if (f) process.exit(1);
console.log('✓ build-month-grid: 5 דוגמאות-חוזה — ירוק');
