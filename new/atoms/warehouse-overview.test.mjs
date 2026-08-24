import { warehouseOverview } from './warehouse-overview.mjs';
// שקע-אמת מקומי כהתנהגות maor (הבדיקה מייבאת רק את האטום שלה):
// norm — warehouse.ts:23-25
const norm = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();
let f = 0;
const chk = (label, ok, detail = '') => {
  if (!ok) { console.error(`✗ ${label} ${detail}`); f = 1; }
};
const paint = { name: 'צבע לבן', qty: 10 };

// 1) נרמול-רווחים מאחד שתי רשומות לשורת-פרויקט אחת
let [r] = warehouseOverview([paint], [
  { id: 'p1', name: 'פרויקט א', ayin: { mat: [{ name: 'צבע לבן', qty: 3 }, { name: ' צבע  לבן ', qty: 2 }] } },
], norm);
chk('נרמול-איחוד', r.allocated === 5 && r.remaining === 5 && r.short === false &&
  r.byProject.length === 1 && r.byProject[0].id === 'p1' && r.byProject[0].qty === 5, JSON.stringify(r));

// 2) שני פרויקטים — byProject יורד לפי qty
[r] = warehouseOverview([paint], [
  { id: 'p1', name: 'א', ayin: { mat: [{ name: 'צבע לבן', qty: 2 }] } },
  { id: 'p2', name: 'ב', ayin: { mat: [{ name: 'צבע לבן', qty: 7 }] } },
], norm);
chk('מיון-יורד', r.allocated === 9 && r.remaining === 1 &&
  r.byProject.map((x) => x.id).join(',') === 'p2,p1', JSON.stringify(r.byProject));

// 3) מחסור: הוקצה מעבר-למלאי
[r] = warehouseOverview([{ name: 'צבע לבן', qty: 4 }], [
  { id: 'p1', name: 'א', ayin: { mat: [{ name: 'צבע לבן', qty: 6 }] } },
], norm);
chk('מחסור', r.allocated === 6 && r.remaining === -2 && r.short === true, JSON.stringify(r));

// 4) שם-ריק מדולג; סכום 0 לא נצבר
[r] = warehouseOverview([paint], [
  { id: 'p1', name: 'א', ayin: { mat: [{ name: '', qty: 9 }, { name: 'צבע לבן', qty: 0 }] } },
], norm);
chk('דילוגים', r.allocated === 0 && r.remaining === 10 && r.byProject.length === 0, JSON.stringify(r));

// 5) בלי פרויקטים — הכול פנוי
[r] = warehouseOverview([paint], [], norm);
chk('ריק', r.allocated === 0 && r.remaining === 10 && r.short === false && r.byProject.length === 0);

// 6) qty לא-מספרי בפריט ⇒ 0
[r] = warehouseOverview([{ name: 'ברגים', qty: 'x' }], [], norm);
chk('qty-שבור', r.remaining === 0 && r.short === false, JSON.stringify(r));

if (f) process.exit(1);
console.log('✓ warehouse-overview: 6 דוגמאות-חוזה — ירוק');
