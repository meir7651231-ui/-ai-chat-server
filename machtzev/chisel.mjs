#!/usr/bin/env node
/** ⛏️ מחצב · חציבה-בטוחה (fix+upgrade) — עוטף את מנוע-החציבה כך שרק אטומים ירוקים נוחתים.
 *  gen-wires (חילוץ) → ניקוי-טיוטות (שם-kebab נכון · הסרת הערת-גבול) → promote-auto (arity≤3,
 *  מגן-התנגשות) → מסנן-שערים (טוהר-דאטה/עומק/חיווט/חוזה: כל אטום-חדש שמפר — מוסר).
 *  אף אדום לא ננחת (L33/L34). שימוש: node chisel.mjs [maor|buildsmart] */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('../', import.meta.url).pathname;
const A = path.join(ROOT, 'new/atoms');
const Q = path.join(ROOT, 'quarry');
const REPO = process.argv[2] || 'maor';
const run = (c, a) => { try { return execFileSync(c, a, { encoding: 'utf8' }); } catch (e) { return (e.stdout || '') + (e.stderr || ''); } };
const kebabOf = (name) => name.includes('_')
  ? name.toLowerCase().replace(/_/g, '-')
  : name.replace(/([a-z0-9])([A-Z])/g, (m, a, b, i, s) => /[0-9]/.test(a) ? a + b : a + '-' + b).replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();

// ── 1 · חילוץ ──
fs.rmSync(Q, { recursive: true, force: true }); fs.mkdirSync(Q, { recursive: true });
console.log(run('node', ['/home/user/maor-system/machtzev/factory/gen-wires.mjs', ROOT.replace(/\/$/, ''), REPO]).trim().split('\n').pop());

// ── 2 · ניקוי-טיוטות: הסרת הערת-doc יתומה בסוף + שם-kebab נכון מהיצוא ──
let cleaned = 0, renamed = 0;
for (const file of fs.readdirSync(Q).filter(f => f.endsWith('.mjs'))) {
  const p = path.join(Q, file);
  let t = fs.readFileSync(p, 'utf8');
  const c2 = t.replace(/\n\/\*\*[\s\S]*?\*\/\s*$/, '\n');
  if (c2 !== t) { t = c2; cleaned++; fs.writeFileSync(p, t); }
  const names = [...t.matchAll(/export\s+(?:const|(?:async\s+)?function)\s+([a-zA-Z_$][\w$]*)/g)].map(m => m[1]);
  if (!names.length) continue;
  const want = kebabOf(names[0]) + '@gap.mjs';
  if (file !== want && !fs.existsSync(path.join(Q, want))) { fs.renameSync(p, path.join(Q, want)); renamed++; }
}
console.log(`ניקוי-טיוטות: ${cleaned} הערות-גבול הוסרו · ${renamed} שמות-kebab תוקנו`);

// ── 3 · קידום-אוטומטי (משודרג) ──
const before = new Set(fs.readdirSync(A));
console.log(run('node', [path.join(ROOT, 'machtzev/promote-auto.mjs')]).trim().split('\n').pop());
let newAtoms = fs.readdirSync(A).filter(f => !before.has(f) && /\.mjs$/.test(f) && !/\.test\./.test(f)).map(f => f.replace(/\.mjs$/, ''));
console.log(`אטומים-חדשים (גולמי): ${newAtoms.length}`);

// ── 4 · מסנן-שערים: הסרת כל אטום-חדש שמפר שער ──
const rm = (k) => { for (const e of ['.mjs', '.contract.md', '.test.mjs']) { const fp = path.join(A, k + e); if (fs.existsSync(fp)) fs.unlinkSync(fp); } };
const violators = () => {
  const bad = new Set();
  for (const [s, arg] of [['data-purity-check.mjs', '--gate'], ['deep-purity-scan.mjs', '--gate'], ['wiring-check.mjs', ''], ['contract-check.mjs', '']]) {
    const o = run('node', [path.join(ROOT, 'machtzev', s), ...(arg ? [arg] : [])]);
    for (const m of o.matchAll(/(?:new\/atoms\/|atoms\/|\+\s*)([a-z0-9][a-z0-9-]*)(?:\.mjs)?/g)) if (newAtoms.includes(m[1])) bad.add(m[1]);
  }
  return bad;
};
let removed = 0;
for (let r = 0; r < 8; r++) {
  const bad = [...violators()].filter(k => fs.existsSync(path.join(A, k + '.mjs')));
  if (!bad.length) break;
  for (const k of bad) { rm(k); removed++; }
}
const survivors = newAtoms.filter(k => fs.existsSync(path.join(A, k + '.mjs')));
fs.rmSync(Q, { recursive: true, force: true });
console.log(`מסנן-שערים: ${removed} מפרים הוסרו · ✅ ${survivors.length} אטומים נקיים שרדו`);
if (survivors.length) console.log('  ' + survivors.join(', '));
