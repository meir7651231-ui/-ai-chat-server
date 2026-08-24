/** בדיקת-קצה · קופסת שער-יציאת-המידע — מוכיחה את דוגמאות-החוזה (export-gate.contract.md).
 *  מייבאת את הקופסה-שלה בלבד. DoD: node new/boxes/export-gate.test.mjs ⇒ exit 0. */
import { createExportGate, gate, setExportBlocked, exportAllowed, guardExport } from './export-gate.mjs';
let f = 0;
const bad = (m) => { console.error('✗ ' + m); f = 1; };
const spyMake = () => { const s = () => { s.calls++; }; s.calls = 0; return s; };

// 1) לידה-מותרת (הכרעת-הקופסה: blocked=false, notify=null)
const g = createExportGate();
if (g.exportAllowed() !== true) bad('שער-טרי: exportAllowed צריך true');
if (g.guardExport() !== true) bad('שער-טרי: guardExport צריך true');

// 2) חסימה עם התרעה — guard מריץ בדיוק-פעם-אחת-לקריאה; allowed שקט
const spy = spyMake();
g.setExportBlocked(true, spy);
if (g.exportAllowed() !== false) bad('חסום: exportAllowed צריך false');
if (spy.calls !== 0) bad('exportAllowed הריץ toast (צריך להיות שקט)');
if (g.guardExport() !== false) bad('חסום: guardExport צריך false');
if (spy.calls !== 1) bad(`guard ראשון: spy=${spy.calls} (ציפינו 1)`);
g.guardExport();
if (spy.calls !== 2) bad(`guard שני: spy=${spy.calls} (ציפינו 2)`);

// 3) שחרור — שניהם true, ה-spy קפוא
g.setExportBlocked(false);
if (g.exportAllowed() !== true || g.guardExport() !== true) bad('שוחרר: צריך true/true');
if (spy.calls !== 2) bad('שוחרר: spy נקרא אחרי שחרור');

// 4) חסימה בלי התרעה — לא קורס
g.setExportBlocked(true);
let r;
try { r = g.guardExport(); } catch { bad('חסום-בלי-toast: קרס'); }
if (r !== false) bad('חסום-בלי-toast: צריך false');

// 5) החלפת-התרעה + מחיקת-התרעה (set מחליף את שני חלקי-המצב יחד, ?? null)
const spy1 = spyMake(), spy2 = spyMake();
g.setExportBlocked(true, spy1);
g.setExportBlocked(true, spy2);
g.guardExport();
if (spy1.calls !== 0 || spy2.calls !== 1) bad(`החלפה: spy1=${spy1.calls},spy2=${spy2.calls} (ציפינו 0,1)`);
g.setExportBlocked(true, undefined);
g.guardExport();
if (spy2.calls !== 1) bad('מחיקה: set בלי onBlocked לא מחק את ההתרעה הקודמת');

// 6) שני מופעים בלתי-תלויים — המצב לא דולף
const a = createExportGate(), b = createExportGate();
a.setExportBlocked(true);
if (a.exportAllowed() !== false) bad('מופע-a: צריך חסום');
if (b.exportAllowed() !== true) bad('מופע-b: נחסם מדליפת-מצב של a');

// 7) המופע-היחיד + פונקציות-המודול בחתימות-המקור
if (exportAllowed() !== true) bad('מודול-טרי: exportAllowed צריך true');
const spyM = spyMake();
setExportBlocked(true, spyM);
if (guardExport() !== false || spyM.calls !== 1) bad('מודול: חסימה דרך פונקציות-המודול לא עבדה');
if (gate.exportAllowed() !== false) bad('gate אינו אותו מופע של פונקציות-המודול');
setExportBlocked(false);
if (guardExport() !== true) bad('מודול: שחרור לא עבד');

/* 🛡 מגן-הכרעה: הקוד מכיל verbatim את הכרעות-הקופסה (דפוס theme.test). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./export-gate.mjs', import.meta.url), 'utf8');
if (!src.includes('computeGateState(false, null)')) bad('מגן: לידה-מותרת (false, null) שונתה');
if (!src.includes('export const gate = createExportGate()')) bad('מגן: מופע-המודול-היחיד נעלם');
if (!src.includes("from '../atoms/set-export-blocked.mjs'") ||
    !src.includes("from '../atoms/export-allowed.mjs'") ||
    !src.includes("from '../atoms/guard-export.mjs'")) bad('מגן: חיווט-האטומים השתנה');
if (/from '\.\.\/boxes\//.test(src) || /from '\.\/(?!export-gate)/.test(src)) bad('מגן: ייבוא שאינו-אטום');

if (f) process.exit(1);
console.log('✓ קופסת שער-יציאת-המידע: לידה-מותרת · חסימה+toast פעם-לקריאה · שחרור · החלפת/מחיקת-התרעה · בידוד-מופעים · חתימות-המקור · מגן-הכרעה');
