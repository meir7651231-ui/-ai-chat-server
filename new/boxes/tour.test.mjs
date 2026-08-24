/** בדיקת-קצה · קופסת-הסיור — דרך הקופסה בלבד (tour.contract.md).
 *  DoD: node new/boxes/tour.test.mjs ⇒ exit 0. */
import { TOUR_STOP_LABEL, TOUR_STEPS, steps, advance, spotlight } from './tour.mjs';
let f = 0;
const bad = (msg) => { console.error('✗ ' + msg); f = 1; };

// 1) קבועי-התסריט — מילה-במילה מהלגאסי
if (TOUR_STOP_LABEL !== '■ עצירת הדמיה (Esc)') bad('כפתור-העצירה סטה מהלגאסי');
if (TOUR_STEPS.length !== 14) bad(`תסריט: ציפינו 14 צעדים, קיבלנו ${TOUR_STEPS.length}`);
if (TOUR_STEPS[0].caption !== '👋 הדמיה מלאה — המערכת מדגימה את עצמה, על הנתונים האמיתיים')
  bad('הצעד הראשון סטה מהלגאסי');

// 2) הכול-דלוק, בלי config ⇒ 14, זהות-אובייקט נשמרת (אפס-העתקה)
const all = steps(() => true);
if (all.length !== 14) bad(`הכול-דלוק: ${all.length}≠14`);
if (!all.every((s, i) => s === TOUR_STEPS[i])) bad('בלי config: זהות-הצעדים לא נשמרה');

// 3) courses כבוי ⇒ שני צעדי-החוגים נושרים
const noCourses = steps((m) => m !== 'courses');
if (noCourses.length !== 12) bad(`courses-כבוי: ${noCourses.length}≠12`);
if (noCourses.some((s) => s.module === 'courses')) bad('צעד-חוגים שרד סינון');

// 4) הכול-כבוי ⇒ רק צעדים בלי module (home×5 + settings)
const none = steps(() => false);
if (none.length !== 6) bad(`הכול-כבוי: ${none.length}≠6`);
if (none.some((s) => s.module)) bad('צעד-ממודל שרד הכול-כבוי');

// 5) מיתוג-מחדש דרך termOf + נפילה-ל-fallback עם שימור-זהות
const cfg = { terms: { 'nav.courses': 'סדנאות', 'entity.course': 'סדנה' } };
const branded = steps(() => true, cfg);
if (branded[6].caption !== '🎡 מאתר הסדנאות') bad(`מיתוג מאתר: "${branded[6].caption}"`);
if (branded[6].anchorText !== 'מצא סדנה') bad(`מיתוג עוגן: "${branded[6].anchorText}"`);
if (branded[7].caption !== 'חיזוי סדנאות: רק תואמי גיל ומגדר') bad(`מיתוג חיזוי: "${branded[7].caption}"`);
if (branded[3].caption !== '🎡 מאתר המשפחות — גלגל בתוך הדף') bad('fallback משפחות נשבר');
if (branded[3] !== TOUR_STEPS[3]) bad('צעד לא-ממותג איבד זהות-אובייקט');

// 6) דריסה רווחים-בלבד = אין-דריסה (term-of) ⇒ זהות נשמרת
const blank = steps(() => true, { terms: { 'nav.courses': '   ' } });
if (blank[6] !== TOUR_STEPS[6]) bad('דריסת-רווחים שברה זהות/נוסח');
// config בלי terms בכלל ⇒ fallback שקט
if (steps(() => true, {})[6].caption !== '🎡 מאתר החוגים') bad('config ריק שבר fallback');

// 7) ניווט
if (advance(0, 1, 14) !== 1) bad('advance(0,+1,14)≠1');
if (advance(0, -1, 14) !== 0) bad('advance(0,-1,14)≠0 — לא נצמד להתחלה');
if (advance(13, 1, 14) !== null) bad('advance(13,+1,14)≠null — לא סיים');
if (advance(3, -1, 14) !== 2) bad('advance(3,-1,14)≠2');
if (advance(0, 1, 0) !== null) bad('advance על תסריט-ריק ≠ null');

// 8) גאומטריית ה-spotlight
if (spotlight(null, 100, 100) !== null) bad('rect=null ⇒ לא null');
if (spotlight({ left: 5, top: 5, width: 0, height: 20 }, 100, 100) !== null) bad('מידות-0 ⇒ לא null');
const box = spotlight({ left: 5, top: 5, width: 50, height: 20 }, 100, 100);
if (JSON.stringify(box) !== JSON.stringify({ left: 0, top: 0, width: 70, height: 40 }))
  bad(`spotlight בסיסי: ${JSON.stringify(box)}`);
const pad0 = spotlight({ left: 5, top: 5, width: 50, height: 20 }, 100, 100, 0);
if (JSON.stringify(pad0) !== JSON.stringify({ left: 5, top: 5, width: 50, height: 20 }))
  bad(`pad=0 ≠ המלבן עצמו: ${JSON.stringify(pad0)}`);
const clamped = spotlight({ left: 90, top: 90, width: 30, height: 30 }, 100, 100);
if (clamped.left + clamped.width > 100 || clamped.top + clamped.height > 100)
  bad('spotlight חרג מה-viewport');

/* 🛡 מגן-הכרעה: הכרעות-הקופסה verbatim במקור-הקופסה (דפוס theme.test). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./tour.mjs', import.meta.url), 'utf8');
for (const verbatim of [
  '👋 הדמיה מלאה — המערכת מדגימה את עצמה, על הנתונים האמיתיים',
  '🪙 קופות צדקה — רכזים, קופות בבתים, ריקונים ומבצעים',
  '🛍 החנות — חבילות שירות, מלאי משותף ומימושים עם אישור',
  'זו המערכת. חיה, מלאה, במקום אחד ✦',
  "anchorText: 'מצא חוג'",
]) if (!src.includes(verbatim)) bad(`מגן: כיתוב-לגאסי נעלם מהקופסה: "${verbatim}"`);
// סדר-הלגאסי: העמודות-המבודדות tzedaka ⇒ shop ⇒ settings
const order = ["view: 'tzedaka'", "view: 'shop'", "view: 'settings'"].map((k) => src.indexOf(k));
if (!(order[0] > 0 && order[0] < order[1] && order[1] < order[2])) bad('מגן: סדר-התסריט השתנה');
// חוק-2/3: הקופסה מייבאת אך-ורק מ-atoms/
const imports = [...src.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
if (!imports.length || !imports.every((p) => p.startsWith('../atoms/'))) bad('מגן: ייבוא שאינו אטום');

if (f) process.exit(1);
console.log('✓ קופסת-הסיור: תסריט 14 מילה-במילה · סינון-מודולים 14/12/6 · מיתוג termOf + זהות-fallback · ניווט · spotlight צמוד-viewport · מגן-הכרעה');
