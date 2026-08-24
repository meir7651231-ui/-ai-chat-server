/** בדיקת-קצה · קופסת כלי-התאריך — דרך הקופסה בלבד (DoD בחוזה, נכתב לפני הקוד). */
import { isoLocal, isoToday, isoDaysAgo, dateInRange } from './date-util.mjs';
let f = 0;

// דוגמה 1 — isoLocal: מקומי + ריפוד + בליעת-שעה
for (const [d, want] of [
  [new Date(2026, 7, 24), '2026-08-24'],
  [new Date(2026, 0, 5), '2026-01-05'],
  [new Date(1999, 11, 31), '1999-12-31'],
  [new Date(2026, 2, 1, 23, 59), '2026-03-01'],
]) if (isoLocal(d) !== want) { console.error(`✗ isoLocal ⇒ ${isoLocal(d)} ≠ ${want}`); f = 1; }

// דוגמה 2 — isoToday: הזרקת-שעון דטרמיניסטית + אחרי-חצות מקומי + ברירת-מחדל
if (isoToday(new Date(2026, 7, 24, 0, 30)) !== '2026-08-24') { console.error('✗ isoToday אחרי-חצות'); f = 1; }
if (isoToday(new Date(2026, 11, 31, 23, 59)) !== '2026-12-31') { console.error('✗ isoToday סוף-שנה'); f = 1; }
if (!/^\d{4}-\d{2}-\d{2}$/.test(isoToday())) { console.error('✗ isoToday() פורמט'); f = 1; }
{
  const a = isoLocal(new Date()); const got = isoToday(); const b = isoLocal(new Date());
  if (got !== a && got !== b) { console.error('✗ isoToday() ≠ isoLocal(עכשיו)'); f = 1; }
}

// דוגמה 3 — isoDaysAgo: יחסית-לשעון (סנדוויץ' לפני/אחרי — חסין חציית-חצות)
const shifted = (days) => { const d = new Date(); d.setDate(d.getDate() - days); return isoLocal(d); };
for (const days of [0, 7, 31, -1]) {
  const before = shifted(days); const got = isoDaysAgo(days); const after = shifted(days);
  if (got !== before && got !== after) { console.error(`✗ isoDaysAgo(${days}) ⇒ ${got} ∉ {${before},${after}}`); f = 1; }
}
{ // isoDaysAgo(0) ≡ isoToday() באותו רגע
  const a = isoToday(); const got = isoDaysAgo(0); const b = isoToday();
  if (got !== a && got !== b) { console.error('✗ isoDaysAgo(0) ≠ isoToday()'); f = 1; }
}

// דוגמה 4 — dateInRange: כוללני + קצה-ריק=פתוח
for (const [args, want] of [
  [['2026-08-24', '2026-08-01', '2026-08-31'], true],
  [['2026-08-01', '2026-08-01', '2026-08-31'], true],
  [['2026-08-31', '2026-08-01', '2026-08-31'], true],
  [['2026-07-31', '2026-08-01', '2026-08-31'], false],
  [['2026-09-01', '2026-08-01', '2026-08-31'], false],
  [['1999-01-01', '', '2026-08-31'], true],
  [['2999-01-01', '2026-08-01', ''], true],
  [['0000-00-00', '', ''], true],
]) if (dateInRange(...args) !== want) { console.error(`✗ dateInRange(${args}) ≠ ${want}`); f = 1; }

// דוגמה 5 — קצה-עוין, נאמנות-למקור (דיבר 2: לא "משפרים")
if (isoLocal(new Date('junk')) !== 'NaN-NaN-NaN') { console.error('✗ Date-זבל ≠ NaN-NaN-NaN (המקור לא מגן)'); f = 1; }
if (dateInRange('', '', '') !== true) { console.error('✗ dateInRange ריק-כולו'); f = 1; }

/* 🛡 מגן-הכרעה: תפרי-החיווט חתומים — הזרקת isoLocal לשני שקעי-הפירמוט,
 * וברירת-מחדל השעון now=new Date() ב-isoToday (נאמן-למקור). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./date-util.mjs', import.meta.url), 'utf8');
if (!src.includes('isoTodayWire(isoLocal, now)')) { console.error('✗ מגן: תפר isoToday⇒isoLocal שונה'); f = 1; }
if (!src.includes('isoDaysAgoWire(days, isoLocal)')) { console.error('✗ מגן: תפר isoDaysAgo⇒isoLocal שונה'); f = 1; }
if (!src.includes('now = new Date()')) { console.error('✗ מגן: ברירת-מחדל השעון שונתה'); f = 1; }
if (/from '\.\.\/(?!atoms\/)/.test(src)) { console.error('✗ מגן: ייבוא שאינו-אטום'); f = 1; }
if (f) process.exit(1);
console.log('✓ קופסת-כלי-התאריך: 4 חוטים · 20 תרחישי-חוזה ירוקים · תפרי-חיווט חתומים');
