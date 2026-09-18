#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  logic-census.mjs — מפקד אטומי-הלוגיקה (הכרעה 21: המחולל מחובר גם ללוגיקה).
//  סורק את מנועי-maor הטהורים (new/dart-maor) + הלוגיקה של buildsmart (new/dart)
//  ומחלץ לכל פונקציה עליונה את התפר שלה: טיפוסי-קלט → טיפוס-פלט. פונקציה עם קלט
//  פרימיטיבי-בלבד ופלט-פרימיטיבי = **wireable** (המחולל יכול לחווט אותה כשדה-מחושב).
//  דטרמיניסטי · אפס-רשת · קורא רק חתימות (חוק-4). פלט: generator/logic-census.json.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs'; import path from 'node:path';
import * as R from '../root.mjs';
import { rminhu, had, pliga, lo, printNotes } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const ROOT = R.NEW;
const OUT = (R.GEN_DIR + 'logic-census.json');
const SCAN = ['dart-maor', 'dart', 'dart-boxes'];   // G48 · קופסאות = הרכבות-חיווט על המדף (§21 רקורסיבי); שמות שכבר-באטומים מדולגים (הקופסה מייצאת-מחדש) — רק נקודות-כניסה ייחודיות נכנסות
const PRIM = new Set(['String', 'int', 'double', 'num', 'bool']);

// פיצול רשימת-פרמטרים ברמה-העליונה בלבד (מכבד <> ו-() של טיפוסי-פונקציה/גנריות).
function splitParams(s) {
  const out = []; let depth = 0, cur = '';
  s = s.replace(/[{}\[\]]/g, ' ');   // שטוח את סמני-named/optional ⇒ פסיקי-הפרמטרים ברמה-עליונה
  for (const ch of s) {
    if (ch === '<' || ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === '>' || ch === ')' || ch === ']' || ch === '}') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// טיפוס-הפרמטר = הטוקן-הראשון (מתעלם משם-הפרמטר, ברירות-מחדל, required/named).
const paramType = (p) => {
  const c = p.replace(/^\{|\}$/g, '').replace(/\brequired\b/g, '').trim();
  const m = c.match(/^([A-Za-z_][A-Za-z0-9_<>?,. ]*?)\s+[a-z_][A-Za-z0-9_]*(\s*=.*)?$/);
  return (m ? m[1] : c).trim();
};
const isPrim = (t) => PRIM.has(t.replace(/\?$/, ''));
const isDisplayable = (t) => { const x = t.replace(/\?$/, ''); return isPrim(x) || /^List<(String|int|double|num)>$/.test(x); };

export function logicCensus() {
  const atoms = []; const seen = new Map();
  // 🕯️ שלושה `continue` באותה לולאה, ושלושתם «אין» שונה: מילת-מפתח (‏if/for — לא פונקציה) ·
  //    צורת-ret לא-חוקית (הרגקס לא פירסר) · **שם שכבר נראה** (עותק במדף אחר — נשמט בשקט).
  //    והשלישי הוא הגדול: הוא מוריד מהקטלוג פונקציות שקיימות על הדיסק, ולכן כל מנוע שמחפש
  //    «בכל N מנועי-הלוגיקה» מחפש בקבוצה קטנה יותר ממה שהוא מצהיר (L113).
  const drop = { kw: 0, badRet: 0, dup: [] };
  const missingDirs = [];
  for (const dir of SCAN) {
    let files;
    try { files = fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.dart') && !f.endsWith('_test.dart') && !f.endsWith('-proof.dart')); } catch (e) { missingDirs.push([dir, String((e && e.code) || e)]); continue; }   // 🕯️ מדף שלם נעלם — L110 §1
    for (const f of files.sort()) {
      const src = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
      // פונקציה-עליונה (כולל רב-שורתית + named-params): <ret> <name>(<params>) { | => | async
      for (const m of src.matchAll(/^([A-Za-z_][A-Za-z0-9_<>?,. ]*?)\s+([a-z][A-Za-z0-9_]*)\(([\s\S]*?)\)\s*(?:\{|=>|async)/gm)) {
        const [, ret0, name, paramStr] = m;
        const ret = ret0.trim();
        if (['if', 'for', 'while', 'switch', 'return', 'else', 'final', 'const', 'var'].includes(ret)) { drop.kw++; continue; }
        if (seen.has(name)) { drop.dup.push([name, seen.get(name), dir + '/' + f]); continue; }
        if (!/^[A-Za-z_][A-Za-z0-9_<>?,. ]*$/.test(ret)) { drop.badRet++; continue; }
        seen.set(name, dir + '/' + f);
        const params = paramStr.trim() ? splitParams(paramStr).map(paramType) : [];
        const allPrim = params.length > 0 && params.every(isPrim);
        atoms.push({ file: dir + '/' + f, name, ret, params, argc: params.length,
          wireable: allPrim && isDisplayable(ret) });   // קלט-פרימיטיבי + פלט-מוצג ⇒ ניתן-לחיווט כשדה-מחושב
      }
    }
  }
  atoms.sort((a, b) => a.name.localeCompare(b.name));
  const cross = drop.dup.filter(([, a, b]) => a.split('/')[0] !== b.split('/')[0]);
  const nonWirable = atoms.filter((a) => !a.wireable).length;
  rminhu({ engine: 'logic-census', matter: `מדפי-הלוגיקה (${SCAN.join(' · ')}) ⇒ קטלוג אטומי-לוגיקה`,
    searched: [`${SCAN.length} מדפים · ${atoms.length} פונקציות נרשמו · ${drop.dup.length} נשמטו בשם-שכבר-נראה · ${drop.kw + drop.badRet} אינן פונקציות`],
    rulings: [
      ...missingDirs.map(([d, code]) => lo(d, `המדף אינו נקרא (${code}) — **כל** נקודות-הכניסה שבו נעלמו מהקטלוג בלי אזעקה; ∅ עם שם-המדף החסר, לא «אין לוגיקה» (L110 §3)`)),
      ...drop.dup.slice(0, 8).map(([n, first, dup]) => pliga(n, `נרשם מ-${first}; העותק ב-${dup} **נשמט** — מפתח-הקטלוג הוא השם בלבד, ולכן מדף שני באותו שם אינו נראה לאף מנוע-חיפוש`)),
      drop.dup.length ? lo('seen (שם-שכבר-נראה)', `סה"כ ${drop.dup.length} פונקציות נשמטו כך, מהן **${cross.length} חוצות-מדף** — כלומר כל מנוע שמצהיר «חיפשתי בכל ${atoms.length} מנועי-הלוגיקה» חיפש למעשה ב-${atoms.length} מתוך ${atoms.length + drop.dup.length} שקיימות על הדיסק`) : null,
      drop.kw + drop.badRet ? lo('לא-פונקציה (מילת-מפתח / ret לא-פרוסר)', `${drop.kw} מילות-מפתח (if/for/…) ו-${drop.badRet} שה-ret שלהן לא עבר את הרגקס — הראשון נכון, השני הוא **מגבלת-הפרסר** ולא «אין פונקציה»`) : null,
      nonWirable ? lo('wireable=false', `${nonWirable} מ-${atoms.length} אינם ברי-חיווט; זה **שני** דברים שונים באותו דגל — פרמטר לא-פרימיטיבי, או ret שאינו בר-הצגה`) : null,
    ].filter(Boolean),
    none: `לא מצינו: אף פונקציה עליונה ב-${SCAN.join('/')} — ${missingDirs.length === SCAN.length ? 'אף מדף לא נקרא' : 'המדפים נקראו וריקים'}` });
  return atoms;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const atoms = logicCensus();
  fs.writeFileSync(OUT, JSON.stringify(atoms, null, 1) + '\n');
  const wire = atoms.filter((a) => a.wireable);
  printNotes('logic-census');
  console.log(`מפקד-הלוגיקה · ${atoms.length} פונקציות · ${wire.length} ניתנות-לחיווט (קלט-פרימיטיבי⇒פלט-מוצג) · → generator/logic-census.json`);
  const byRet = {}; for (const a of wire) byRet[a.ret] = (byRet[a.ret] || 0) + 1;
  console.log('== פלט (wireable) =='); for (const [k, v] of Object.entries(byRet).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
  console.log('== דוגמאות =='); for (const a of wire.slice(0, 12)) console.log(`  ${a.ret} ${a.name}(${a.params.join(', ')})`);
}
