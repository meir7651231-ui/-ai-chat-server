#!/usr/bin/env node
// 🔌 wire-sockets — חלקיק עם שקעי-דאטה ⇒ חלקיק חד-פרמטרי מחווט (הכרעת-בעלים 23.9 «תסיים את הכל» · סעיף 9).
//   אטום-לוגיקה שהפרמטר הראשון שלו בר-הזנה והזנב שלו = קבועים מקובץ-שקעים (dart-data-maor/<x>-sockets.dart, לפי שם-הפרמטר:
//   U ⇒ <x>_U; קובץ-השקעים של האטום או של משפחתו: gematria ⇒ gematria-value) מקבל תאום `<fn>Wired(<p0>) => <fn>(<p0>, <שקעים>)` ב-new/dart-maor/<base>-wired.dart. כך מנוע-ההוכחה (behavior-plan)
//   מוצא אותו בעומק 1 בלי לנחש קבועים (gemValue: 4 שקעים ⇒ gemValueWired(String) ⇒ int?). נגזר מהאינדקס ומקובצי-השקעים — אפס יד.
//   פלט ביט-זהה בכל ריצה; קובץ שלא נגזר עוד — נמחק. שימוש: node machtzev/generator/wire-sockets.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const DRY = process.argv.includes('--dry');
const FEED = /^(String|dynamic|Object|num|int|double)\??$/;
const SOCK = path.join(ROOT, 'new/dart-data-maor'), OUT = path.join(ROOT, 'new/dart-maor');
// המקור = קובצי-האטומים עצמם (לא האינדקס): כך הצנרת רצה פעם אחת — wire-sockets לפני מפקד-הלוגיקה, והמפקד כבר רואה את התאומים
const splitTop = (s) => { const out = []; let d = 0, cur = ''; for (const ch of s) { if ('<([{'.includes(ch)) d++; else if ('>)]}'.includes(ch)) d--; if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };
const rows = [];
for (const f of fs.readdirSync(OUT).filter((x) => /\.dart$/.test(x) && !/_test\.dart$/.test(x) && !/-wired\.dart$/.test(x))) {
  const src = fs.readFileSync(path.join(OUT, f), 'utf8');
  const m = src.match(/^([A-Za-z_][\w<>?, ]*?)\s+([a-z]\w*)\(([^)]*)\)\s*(?:\{|=>)/m);   // הפונקציה הראשונה ברמת-הקובץ: <ret> <name>(<params>)
  if (!m) continue;
  rows.push({ id: m[2], ret: m[1].trim(), params: splitTop(m[3]), file: 'dart-maor/' + f });
}
const sockets = fs.readdirSync(SOCK).filter((f) => /-sockets\.dart$/.test(f)).map((f) => ({ file: f, base: f.replace(/-sockets\.dart$/, ''), consts: [...fs.readFileSync(path.join(SOCK, f), 'utf8').matchAll(/^const\s+[^=]*?\b(\w+)\s*=/gm)].map((m) => m[1]) }));
const made = new Set(); let n = 0;
for (const r of rows) {
  if (r.params.length < 2 || !FEED.test(r.params[0].replace(/\s+\w+$/, ''))) continue;
  const tail = r.params.slice(1).map((p) => { const m = String(p).match(/^(.+?)\s+(\w+)\s*$/); return m ? { type: m[1], name: m[2] } : null; });
  if (tail.some((t) => !t)) continue;
  // קובץ-שקעים אחד שמכסה את כל הזנב (שם-הקובץ = בסיס-האטום, או כל קובץ-שקעים שהוא היחיד המכסה)
  const base = path.basename(r.file, '.dart'); const pre = (b) => b.replace(/-/g, '_');
  const covering = sockets.filter((s) => tail.every((t) => s.consts.includes(`${pre(s.base)}_${t.name}`)));
  const s = covering.find((x) => x.base === base) || covering.find((x) => base.startsWith(x.base + '-')) || null;   // רק קובץ-השקעים של האטום עצמו או של משפחתו (gematria ⇒ gematria-value); לא «היחיד שמכסה» (T/U הם שמות נפוצים)
  if (!s) continue;
  const p0 = String(r.params[0]).match(/^(.+?)(?:\s+(\w+))?\s*$/); const t0 = p0[1].trim(), n0 = p0[2] || 'x';
  const doc = fs.readFileSync(path.join(ROOT, 'new', r.file), 'utf8').split('\n').filter((l) => /^\s*\/\/\/?/.test(l)).slice(0, 2).map((l) => l.replace(/^\s*\/\/\/?\s?/, '')).join(' · ');
  const out = path.join(OUT, `${base}-wired.dart`);
  const code = `// 🔌 חלקיק-מחווט (machtzev/generator/wire-sockets.mjs) · ${r.id}Wired — ${r.id} עם שקעי-הדאטה מ-${s.file}. אל תערוך ידנית — regen.\n// ${doc}\nimport './${base}.dart';\nimport '../dart-data-maor/${s.file}';\n\n${r.ret} ${r.id}Wired(${t0} ${n0}) => ${r.id}(${n0}, ${tail.map((t) => `${pre(s.base)}_${t.name}`).join(', ')});\n`;
  made.add(out); n++;
  if (!DRY && (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== code)) fs.writeFileSync(out, code);
  console.log(`  ${r.id}Wired(${t0}) ⇒ ${r.ret} · שקעים ${tail.length} מ-${s.file}`);
}
for (const f of fs.readdirSync(OUT).filter((x) => /-wired\.dart$/.test(x))) if (!made.has(path.join(OUT, f)) && !DRY) { fs.unlinkSync(path.join(OUT, f)); console.log(`  נמחק (לא נגזר עוד): ${f}`); }
console.log(`🔌 wire-sockets: ${n} חלקיקים מחווטים${DRY ? ' (dry)' : ''}`);
