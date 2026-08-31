#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  atom-index.mjs — אינדקס-האמת האחד לכל אטום (מונע פספוס-חוצה-סוכנים).
//  לכל אטום-חזות: מחלקה · קובץ · מקור-מסך · **מטרה-אמיתית** (מונחי-מסך-המקור אם
//  הורם, אחרת התיאור-העצמי מנוקה-בוילרפלייט) · **טוהר** (עברית-בקוד=חוב) · תפר · ייעוד.
//  כל האמת במקום אחד ⇒ סוכן לא צריך להצליב 5 קבצים ולנחש מדוגמה. דטרמיניסטי.
//  פלט: machtzev/generator/atom-index.json + סיכום-אמת. ריצה: node machtzev/atom-index.mjs
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs'; import path from 'node:path';
import { analyzeAtom } from './atom-census.mjs';
const ROOT = new URL('../new/', import.meta.url).pathname;
const SEED = new URL('../screens-seed/machine/', import.meta.url).pathname;
const OUT = new URL('./generator/atom-index.json', import.meta.url).pathname;
const BOILER = new Set(['מהמקור', 'אל', 'תערוך', 'ידנית', 'מוצא', 'בנייה', 'חכמה', 'הורם', 'ע"י', 'מנוע', 'המדף', 'verbatim', 'Stateless', 'Stateful', 'main', 'v2', 'shelf', 'lift']);
const heToks = (s) => [...String(s || '').matchAll(/[֐-׿]{2,}/g)].map((m) => m[0]);

// מפת מסך→מונחים-עבריים (המטרה-האמיתית מהפירוק).
const screenTerms = {};
try { for (const f of fs.readdirSync(SEED).filter((f) => f.endsWith('.json'))) { try { const d = JSON.parse(fs.readFileSync(path.join(SEED, f), 'utf8')); screenTerms[f.replace('.json', '')] = [...new Set((d.terms || []).flatMap((t) => heToks(t)))].slice(0, 24); } catch {} } } catch {}

const walk = (d) => { let o = []; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) o = o.concat(walk(p)); else if (e.name.endsWith('.dart')) o.push(p); } return o; };

export function atomIndex() {
  const out = []; const seen = new Set();
  for (const abs of walk(path.join(ROOT, 'dart-ui-bs')).sort()) {
    const src = fs.readFileSync(abs, 'utf8');
    const rel = path.relative(ROOT, abs);
    const origin = (src.match(/מוצא:\s*(screens__[a-z0-9_]+)/) || [])[1] || null;
    const ownHe = [...new Set(heToks(src.split('\n').filter((l) => /^\s*\/\//.test(l)).join(' ')))].filter((w) => !BOILER.has(w));
    const purityHe = (src.split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n').match(/[֐-׿]{2,}/g) || []).filter((w) => !/^[֐׿׳״]+$/.test(w)).length;
    for (const m of src.matchAll(/class ([A-Za-z0-9]+) extends (?:StatelessWidget|StatefulWidget)/g)) {
      const cls = m[1]; if (seen.has(cls)) continue; seen.add(cls);
      const a = analyzeAtom(src, cls, rel);
      // מטרה: מונחי-מסך-המקור (אמיתי) אם הורם, אחרת התיאור-העצמי מנוקה.
      const purpose = origin && screenTerms[origin] && screenTerms[origin].length ? screenTerms[origin] : ownHe;
      out.push({ cls, file: rel, origin, purpose, purposeFrom: (origin && screenTerms[origin]?.length) ? 'source-screen' : (ownHe.length >= 2 ? 'own-he' : 'none'), purityHe, seam: a.seam, caps: a.caps, str: a.str, num: a.num, list: a.list, cb: a.cb });
    }
  }
  return out.sort((x, y) => x.cls.localeCompare(y.cls));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const idx = atomIndex();
  fs.writeFileSync(OUT, JSON.stringify(idx, null, 1) + '\n');
  const withPurpose = idx.filter((a) => a.purposeFrom !== 'none').length;
  const dirty = idx.filter((a) => a.purityHe > 0).length;
  const bySrc = {}; for (const a of idx) bySrc[a.purposeFrom] = (bySrc[a.purposeFrom] || 0) + 1;
  console.log(`אינדקס-האמת · ${idx.length} אטומים · → generator/atom-index.json`);
  console.log(`  מטרה-אמיתית: ${withPurpose}/${idx.length}  (${JSON.stringify(bySrc)})`);
  console.log(`  טוהר: ${idx.length - dirty} נקיים · ${dirty} עם-עברית-בקוד (חוב)`);
  console.log('  דוגמה:', JSON.stringify({ cls: idx.find((a) => a.origin)?.cls, purpose: idx.find((a) => a.origin)?.purpose?.slice(0, 6) }));
}
