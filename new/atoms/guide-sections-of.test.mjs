import { guideSections } from './guide-sections-of.mjs';
// השקעים החוזיים
const swap = (s, from, to) => s.split(from).join(to);
const termOf = (cfg, k, fb) => (cfg.terms && cfg.terms[k]) || fb;
// סעיפי-הדוגמה מהחוזה
const S1 = { title: 'בית', text: 'תקציר הבוקר, חדרים חיים וגרפים.' };
const S2 = { module: 'families', title: 'כרטיס משפחה', text: 'ניקוב ✓, 📜 היסטוריה.' };
const S3 = { module: 'courses', term: 'nav.courses', title: 'קורסים', text: 'בתוך חוג: שיבוץ, ⬇ תדפיס למורה.' };
const SECTIONS = [S1, S2, S3];
const allOn = () => true;
let f = 0;
const check = (msg, cond) => {
  if (!cond) {
    console.error(`✗ ${msg}`);
    f = 1;
  }
};
// 1. בלי config — מילה-במילה + זהות-אובייקט (ratchet הלגאסי)
const r1 = guideSections(allOn, undefined, SECTIONS, termOf, swap);
check('בלי config ⇒ 3 שורות מילה-במילה', JSON.stringify(r1) === JSON.stringify(SECTIONS));
check('שורה שלא השתנתה ⇒ אותה זהות (===)', r1[0] === S1 && r1[1] === S2 && r1[2] === S3);
// 2. מודול כבוי מסונן; שורה בלי module נשארת
const r2 = guideSections((m) => m !== 'courses', undefined, SECTIONS, termOf, swap);
check('courses כבוי ⇒ [S1,S2]', r2.length === 2 && r2[0] === S1 && r2[1] === S2);
// 3. כותרת 'כרטיס משפחה' עוברת מונח
const r3 = guideSections(allOn, { terms: { 'entity.family': 'לקוח' } }, SECTIONS, termOf, swap);
check("entity.family='לקוח' ⇒ 'כרטיס לקוח'", r3[1].title === 'כרטיס לקוח');
// 4. החלפות-גוף: 'בתוך חוג' + 'תדפיס למורה'
const r4 = guideSections(allOn, { terms: { 'entity.course': 'סדנה', 'entity.teacher': 'מדריכה' } }, SECTIONS, termOf, swap);
check("קורס='סדנה', מורה='מדריכה' ⇒ גוף S3 מתורגם", r4[2].text === 'בתוך סדנה: שיבוץ, ⬇ תדפיס למדריכה.');
// 5. 'חדרים חיים' עובר entity.rooms
const r5 = guideSections(allOn, { terms: { 'entity.rooms': 'אולמות' } }, SECTIONS, termOf, swap);
check("rooms='אולמות' ⇒ 'אולמות חיים'", r5[0].text === 'תקציר הבוקר, אולמות חיים וגרפים.');
if (f) process.exit(1);
console.log('✓ guide-sections-of: 5 דוגמאות-חוזה — ירוק (סינון-מודולים + מונחים פר-עסק)');
