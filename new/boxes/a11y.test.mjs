/** בדיקת-קצה · קופסת-הנגישות — דרך הקופסה בלבד (a11y.contract.md, הדוגמאות המחייבות). */
import {
  SCALE_MIN, SCALE_MAX, SCALE_STEP, A11Y_FAB_TOGGLES,
  clampScale, stepScale, parseAcc,
} from './a11y.mjs';
let f = 0;
const eq = (got, want, msg) => {
  if (!Object.is(got, want)) { console.error(`✗ ${msg}: ציפינו ${JSON.stringify(want)}, קיבלנו ${JSON.stringify(got)}`); f = 1; }
};

// ── קבועי-הסולם (a11y.ts:13-15) ──
eq(SCALE_MIN, 0.8, 'SCALE_MIN');
eq(SCALE_MAX, 1.6, 'SCALE_MAX');
eq(SCALE_STEP, 0.1, 'SCALE_STEP');

// ── 4 המתגים בסדר ובנוסח הלגאסי (a11y.ts:27-32 · legacy script:3185) ──
const wantToggles = [
  ['contrast', 'ניגודיות גבוהה'],
  ['links', 'הדגשת כפתורים וקישורים'],
  ['noanim', 'עצירת אנימציות ותנועה'],
  ['spacing', 'ריווח טקסט מוגדל'],
];
eq(JSON.stringify(A11Y_FAB_TOGGLES), JSON.stringify(wantToggles), 'A11Y_FAB_TOGGLES verbatim');

// ── clampScale — הכרעה 1 (a11y.ts:35-38) ──
eq(clampScale(2), 1.6, 'clampScale(2) תקרה');
eq(clampScale(0.5), 0.8, 'clampScale(0.5) רצפה');
eq(clampScale(1.2), 1.2, 'clampScale(1.2) בתחום');
eq(clampScale(NaN), 1, 'clampScale(NaN) ⇒ ברירת-מחדל');
eq(clampScale(Infinity), 1, 'clampScale(Infinity) ⇒ ברירת-מחדל');
eq(clampScale(-Infinity), 1, 'clampScale(-Infinity) ⇒ ברירת-מחדל');
eq(clampScale('1.2'), 1, "clampScale('1.2') מחרוזת ⇒ ברירת-מחדל");
eq(clampScale(undefined), 1, 'clampScale(undefined) ⇒ ברירת-מחדל');

// ── stepScale — הכרעה 2 (a11y.ts:44-46; העיגול נגד שאריות float) ──
eq(stepScale(1, 1), 1.1, 'stepScale(1,+1)');
eq(stepScale(1.1, 1), 1.2, 'stepScale(1.1,+1) === 1.2 בדיוק (לא 1.2000000000000002)');
eq(stepScale(1.6, 1), 1.6, 'רוויה בתקרה');
eq(stepScale(0.8, -1), 0.8, 'רוויה ברצפה');
eq(stepScale(1.2, -1), 1.1, 'stepScale(1.2,-1)');
eq(stepScale(NaN, 1), 1.1, 'לא-מספרי ⇒ 1 ⇒ צעד אחד');
eq(stepScale(99, 1), 1.6, 'מעל-התקרה נצמד ואז רווי');
// שרשרת-צעדים מלאה: 0.8 → … → 1.6 ב-8 צעדים בדיוק, כל תחנה בעשירית נקייה
{
  let v = 0.8; const stops = [v];
  for (let i = 0; i < 8; i++) { v = stepScale(v, 1); stops.push(v); }
  eq(stops.join(','), '0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6', 'שרשרת-הזום המלאה בלי שאריות float');
  eq(stepScale(v, 1), 1.6, 'צעד-נוסף בתקרה נשאר 1.6');
}

// ── parseAcc (a11y.ts:49-58) ──
const off = { contrast: false, noanim: false, links: false, spacing: false };
const j = (x) => JSON.stringify(x);
eq(j(parseAcc(null)), j(off), 'parseAcc(null)');
eq(j(parseAcc('')), j(off), "parseAcc('')");
eq(j(parseAcc('{"contrast":true}')), j({ ...off, contrast: true }), 'חלקי ⇒ השאר false');
eq(j(parseAcc('לא-JSON{')), j(off), 'JSON שבור ⇒ הכול-כבוי בשקט');
eq(j(parseAcc('"עברית"')), j(off), 'JSON שאינו אובייקט ⇒ הכול-כבוי');
eq(j(parseAcc('null')), j(off), "parseAcc('null')");
eq(j(parseAcc('[1,2]')), j(off), 'מערך ⇒ הכול-כבוי');
eq(j(parseAcc('{"contrast":1,"links":"כן"}')), j({ ...off, contrast: true, links: true }), 'כפיית-!! על ערכים לא-בוליאניים');
eq(j(parseAcc('{"contrast":true,"noanim":true,"links":true,"spacing":true}')),
  j({ contrast: true, noanim: true, links: true, spacing: true }), 'הכול-דלוק');

/* 🛡 מגן-הכרעה (דפוס theme.test): ההכרעות verbatim במקור-הקופסה. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./a11y.mjs', import.meta.url), 'utf8');
if (!src.includes('clampScaleAtom(v, SCALE_MIN, SCALE_MAX)')) { console.error('✗ מגן: הכרעה 1 (הזרקת-הגבולות) שונתה'); f = 1; }
if (!src.includes('stepScaleAtom(v, dir, clampScale, SCALE_STEP)')) { console.error('✗ מגן: הכרעה 2 (הזרקת-הצעד וההצמדה-המחווטת) שונתה'); f = 1; }
if (/from '\.\.\/(?!atoms\/)/.test(src) || /from '\.\//.test(src)) { console.error('✗ מגן: הקופסה מייבאת שלא-מ-atoms'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-הנגישות: 3 קבועים + 4 מתגים verbatim · clampScale (8 קצוות) · stepScale (שרשרת 0.8→1.6 בלי float) · parseAcc (9 קלטים) · 🛡 מגני-הכרעה');
