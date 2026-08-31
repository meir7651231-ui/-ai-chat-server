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
const ROOT = new URL('../new/', import.meta.url).pathname;
const OUT = new URL('./generator/atom-census.json', import.meta.url).pathname;
const DIRS = ['dart-ui-bs/auto', 'dart-ui-bs/ds'];
const NUM = new Set(['int', 'double', 'num']);

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
  const fields = [...src.matchAll(/^\s*final ([A-Za-z0-9<>?]+) ([a-z][A-Za-z0-9_]*);/gm)].map((m) => ({ ty: m[1], nm: m[2], k: fieldKind(m[1]) }));
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
  const atoms = [];
  for (const dir of DIRS) {
    let files; try { files = fs.readdirSync(path.join(ROOT, dir)).filter((x) => x.endsWith('.dart')); } catch { continue; }
    for (const f of files.sort()) {
      const s = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
      const cm = s.match(/class ([A-Za-z0-9]+) extends (StatelessWidget|StatefulWidget)/);
      if (!cm) continue;
      atoms.push(analyzeAtom(s, cm[1], dir + '/' + f));
    }
  }
  atoms.sort((a, b) => a.cls.localeCompare(b.cls));
  return atoms;
}

// ריצה-ישירה ⇒ כתיבת-artifact + סיכום. import ⇒ שקט.
if (import.meta.url === `file://${process.argv[1]}`) {
  const atoms = census();
  fs.writeFileSync(OUT, JSON.stringify(atoms, null, 1) + '\n');
  const bySeam = {}, byCap = {};
  for (const a of atoms) { bySeam[a.seam] = (bySeam[a.seam] || 0) + 1; for (const c of a.caps) byCap[c] = (byCap[c] || 0) + 1; }
  console.log(`מפקד-האטומים · ${atoms.length} אטומים · → ${path.relative(ROOT + '..', OUT)}`);
  console.log('\n== תפר-נתונים (seam) ==');
  for (const [k, v] of Object.entries(bySeam).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
  console.log('\n== ייעוד (capability) ==');
  for (const [k, v] of Object.entries(byCap).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
}
