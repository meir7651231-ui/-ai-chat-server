#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  atom-census.mjs — מפקד-האטומים · המצע להרכבה-חופשית.
//  לכל אטום-חזות (dart-ui-bs) נגזרים טהורית מהחתימה שלו-עצמו:
//    • תפר-נתונים (seam) — איזו צורת-דאטה הוא אוכל: series / collection / fields / zero
//    • ייעוד (capability) — נגזר מצורה + מבנה-שדות גנרי (לא מילון-דומייני)
//    • פרופיל-שקעים — כמה str/num/bool/list (לבחירה-לפי-התאמה במנוע-ההרכבה)
//  הכל דטרמיניסטי · אפס-רשת · אפס-LLM · קורא רק את חוזה-האטום (חוק-4).
//  פלט: machtzev/generator/atom-census.json (נצרך ע"י מנוע-ההרכבה) + סיכום-מסך.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs'; import path from 'node:path';
import * as R from '../root.mjs';
import { rminhu, had, pliga, lo, printNotes } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const ROOT = R.NEW;
const OUT = (R.GEN_DIR + 'atom-census.json');
const SCAN = 'dart-ui-bs';   // כל מדף-החזות — רקורסיבי (root + auto + ds + screens__*)
const NUM = new Set(['int', 'double', 'num']);

// הליכה רקורסיבית ⇒ כל קבצי ה-.dart תחת SCAN, נתיב יחסי ל-new/.
function walk(rel) {
  const abs = path.join(ROOT, rel); const out = [];
  // 🕯️ `catch { return out }` מחזיר רשימה ריקה גם כשהתיקייה חסרה, גם כששגיאת-הרשאה,
  //    וגם כששגיאת-תכנות — שלוש «אין» כאחת, בשורש-הסריקה (L26/L110). הזרימה לא זזה.
  let ents; try { ents = fs.readdirSync(abs, { withFileTypes: true }); } catch (e) {
    rminhu({ engine: 'atom-census.walk', matter: `תיקיית-סריקה «${rel}» ⇒ קובצי-dart`,
      searched: [`new/${rel}`],
      none: `לא מצינו: ${rel} אינה נקראת (${String((e && e.code) || e)}) — 0 אטומים מהענף הזה, בלי אזעקה. ∅ עם שם-המדף, לא «אין אטומים»` });
    return out;
  }
  for (const e of ents.sort((a, b) => a.name.localeCompare(b.name))) {
    const r = rel + '/' + e.name;
    if (e.isDirectory()) out.push(...walk(r));
    else if (e.name.endsWith('.dart')) out.push(r);
  }
  return out;
}

// סיווג-שדה טהור — לפי הטיפוס בלבד (חוזה-האטום, לא ידע-דומייני):
export function fieldKind(ty) {
  const t = ty.replace(/\?$/, '');
  if (t === 'VoidCallback' || /^(ValueChanged|ValueSetter)</.test(t) || /Function/.test(t)) return 'cb';
  if (t === 'Color' || /Tokens$/.test(t) || t === 'IconData') return 'style';
  if (t === 'Widget' || t === 'List<Widget>') return 'widget';
  const lm = t.match(/^List<([A-Za-z0-9<>]+)>$/);
  if (lm) return NUM.has(lm[1]) ? 'series' : 'list';
  if (t === 'String') return 'str';
  if (NUM.has(t)) return 'num';
  if (t === 'bool') return 'bool';
  return 'other';
}

export function analyzeAtom(src, cls, file) {
  // תופס גם הכרזה-מרובה בשורה `final Type a, b, c;` (תיקון-תפר: value+label נראו כ-zero) — שם אחד לכל פסיק, אותו טיפוס.
  const fields = [];
  for (const m of src.matchAll(/^\s*final ([A-Za-z0-9<>?]+) ([a-z][A-Za-z0-9_]*(?:\s*,\s*[a-z][A-Za-z0-9_]*)*);/gm)) {
    const k = fieldKind(m[1]);
    for (const nm of m[2].split(',').map((s) => s.trim())) fields.push({ ty: m[1], nm, k });
  }
  const by = (k) => fields.filter((f) => f.k === k);
  const data = fields.filter((f) => ['str', 'num', 'bool', 'list', 'series', 'widget'].includes(f.k));
  const names = new Set(fields.map((f) => f.nm.toLowerCase()));
  const has = (...ns) => ns.some((n) => names.has(n));

  let seam;
  if (by('series').length) seam = 'series';        // סדרת-מספרים ⇒ תרשים/השוואה
  else if (by('list').length) seam = 'collection'; // רשימת-פריטים ⇒ N רשומות
  else if (data.length) seam = 'fields';           // ערכים בודדים ⇒ רשומה-אחת
  else seam = 'zero';                              // רק callbacks/style ⇒ כרום/סטטי

  const caps = [];
  if (seam === 'series') caps.push('trend');
  if (seam === 'collection') caps.push('list');
  if (has('value', 'val', 'amount', 'total', 'count', 'pct', 'percent') && has('label', 'title', 'caption')) caps.push('kpi');
  if (has('status', 'stage', 'state', 'phase')) caps.push('status');
  if ((has('title') || has('name') || has('label')) && has('sub', 'subtitle', 'desc', 'body', 'caption')) caps.push('card');
  if (has('done', 'pct', 'percent', 'progress')) caps.push('progress');
  if (!caps.length && seam === 'fields') caps.push('detail');
  if (!caps.length) caps.push('chrome');

  return {
    cls, file, seam, caps: [...new Set(caps)],
    fields: fields.length, dataFields: data.length,
    str: by('str').length, num: by('num').length, bool: by('bool').length,
    list: by('list').length, series: by('series').length, widget: by('widget').length,
    cb: by('cb').length, style: by('style').length,
  };
}

export function census() {
  const atoms = []; const seen = new Map(); const shadowed = [];
  for (const rel of walk(SCAN)) {
    const s = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    // כל מחלקות-ה-widget בקובץ (יכולות להיות כמה) — לא רק הראשונה.
    for (const m of s.matchAll(/class ([A-Za-z0-9]+) extends (?:StatelessWidget|StatefulWidget)/g)) {
      const cls = m[1];
      if (seen.has(cls)) { shadowed.push([cls, seen.get(cls), rel]); continue; }   // שם-מחלקה ייחודי (דדופ חוצה-קבצים) — והמפסיד נאמר עכשיו בשמו
      seen.set(cls, rel);
      atoms.push(analyzeAtom(s, cls, rel));
    }
  }
  atoms.sort((a, b) => a.cls.localeCompare(b.cls));
  // 🕯️ `if (!caps.length) caps.push('chrome')` הוא **נפילה-אחורה**, לא ייעוד: «chrome» אומר
  //    «אף כלל-ייעוד לא תפס», והוא נספר בדוח בדיוק כמו ייעוד שנמדד. וכך גם ה-dedup לפי שם.
  const chrome = atoms.filter((a) => (a.caps || []).length === 1 && a.caps[0] === 'chrome');
  const zeroSeam = atoms.filter((a) => a.seam === 'zero');
  rminhu({ engine: 'atom-census', matter: `מדף «${SCAN}» ⇒ מפקד-אטומים (${atoms.length})`,
    searched: [`${atoms.length} אטומים · ${shadowed.length} הוסתרו בשם-מחלקה כפול · ${chrome.length} נפלו ל-'chrome'`],
    rulings: [
      ...shadowed.slice(0, 6).map(([c, first, dup]) => pliga(c, `נרשם מ-${first}; המחלקה באותו שם ב-${dup} **הוסתרה** — dedup לפי שם בלבד, והמפסיד אינו במפקד`)),
      shadowed.length ? lo('seen (שם-מחלקה כפול)', `סה"כ ${shadowed.length} מחלקות הוסתרו — הראשון-בסריקה מנצח, וההפסד אינו מדווח בשום מקום`) : null,
      chrome.length ? lo(`caps ⇒ 'chrome' (נפילה-אחורה)`, `${chrome.length} מ-${atoms.length} אטומים לא תפסו אף כלל-ייעוד (kpi/status/card/progress/detail) ונרשמו «chrome» — זו **הודאה שאין ייעוד**, והדוח מציג אותה כייעוד ככל ייעוד אחר`) : null,
      zeroSeam.length ? lo(`seam='zero'`, `${zeroSeam.length} אטומים בלי שקע-דאטה כלל — §20-ג פוסל אותם מבחירה; זה מדווח כאן, ולא רק נספר`) : null,
    ].filter(Boolean),
    none: `לא מצינו: אף מחלקת-widget תחת new/${SCAN}` });
  return atoms;
}

// ריצה-ישירה ⇒ כתיבת-artifact + סיכום. import ⇒ שקט.
if (import.meta.url === `file://${process.argv[1]}`) {
  const atoms = census();
  // c4ב · הכרעה C: atom-census.json בוטל (תת-קבוצה של atom-index.json בלי צרכן ייחודי). census() נשאר כספרייה ל-analyzeAtom.
  printNotes('atom-census');
  console.log('ℹ️ atom-census.json בוטל (c4ב) — האינדקס: node machtzev/census/atom-index.mjs');
  const bySeam = {}, byCap = {};
  for (const a of atoms) { bySeam[a.seam] = (bySeam[a.seam] || 0) + 1; for (const c of a.caps) byCap[c] = (byCap[c] || 0) + 1; }
  console.log(`מפקד-האטומים · ${atoms.length} אטומים · → ${path.relative(ROOT + '..', OUT)}`);
  console.log('\n== תפר-נתונים (seam) ==');
  for (const [k, v] of Object.entries(bySeam).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
  console.log('\n== ייעוד (capability) ==');
  for (const [k, v] of Object.entries(byCap).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
}
