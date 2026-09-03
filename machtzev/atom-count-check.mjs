#!/usr/bin/env node
/** מחצב · atom-count-check — שער `atom-count` (PROTOCOL §7.2 · שלב 5): מספר-האטומים לאזור (תיקיות new/*) לא יורד.
 *  "1.7 שהושמט" — אטום שנמחק בשקט = החלשה. baseline: atom-count-baseline.json {area: n} · grow-only.
 *  ספירה: .mjs (לא .test) + .dart. --write: קובע ספירה נוכחית (מחיקה מכוונת = אירוע-ראצ׳ט מוצהר ב-commit). */
import fs from 'node:fs';
import path from 'node:path';
import * as R from './root.mjs';
const count = (d) => { let n = 0; (function walk(x) { for (const e of fs.readdirSync(x, { withFileTypes: true })) { const f = path.join(x, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') walk(f); } else if ((e.name.endsWith('.mjs') && !e.name.endsWith('.test.mjs')) || (e.name.endsWith('.dart') && !e.name.endsWith('_test.dart'))) n++; } })(d); return n; };   // R3-3.11: בדיקות אינן אטומים
const cur = {};
for (const e of fs.readdirSync(R.NEW, { withFileTypes: true })) if (e.isDirectory()) cur[e.name] = count(path.join(R.NEW, e.name));
const BL = R.MACH + 'atom-count-baseline.json';
if (process.argv.includes('--write')) { fs.writeFileSync(BL, JSON.stringify(cur, null, 1) + '\n'); console.log(`✍️ atom-count baseline ⇒ ${Object.keys(cur).length} אזורים · ${Object.values(cur).reduce((a, b) => a + b, 0)} אטומים`); process.exit(0); }
if (!fs.existsSync(BL)) { console.log('🔴 atom-count: אין atom-count-baseline.json — fail-closed (R3-3.4); --write'); process.exit(1); }
let base; try { base = JSON.parse(fs.readFileSync(BL, 'utf8')); } catch { console.log('🔴 atom-count: baseline לא-JSON — fail-closed'); process.exit(1); }
const drops = Object.entries(base).filter(([k, v]) => (cur[k] ?? 0) < v).map(([k, v]) => `${k} ${v}→${cur[k] ?? 0}`);
if (drops.length) { console.log(`🔴 atom-count: אזור ירד: ${drops.join(' · ')} — מחיקה מכוונת? node machtzev/atom-count-check.mjs --write וציין ב-commit`); process.exit(1); }
const total = Object.values(cur).reduce((a, b) => a + b, 0);
console.log(`✓ atom-count: ${Object.keys(cur).length} אזורים · ${total} אטומים · אף אזור לא ירד (רצפה ${Object.values(base).reduce((a, b) => a + b, 0)})`);
