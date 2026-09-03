#!/usr/bin/env node
/** מחצב · משוואה 5 — חוק-החוזה: לכל אטום/קופסה יש contract.md + test.mjs ירוק. (c3ב של PROTOCOL v4)
 *  c3ב: (א) --files a,b,c — בדיקה אינקרמנטלית (דיף+צרכנים; police --inc) · (ב) sandbox לכל הרצת-בדיקה:
 *  env מסונן (PATH בלבד), cwd = תיקיית-האטום, --permission --allow-fs-read=<new/>/* (קופסה מייבאת אטומים · חוק-2) , timeout 15s, SIGKILL
 *  (היום 1,239 בדיקות רצו עם GH_TOKEN/AWS_* של הסשן — RED-TEAM R2-3.5) · (ג) ראצ׳ט-איכות-חוזה (חוק-4):
 *  דוגמה-מספרית בחוזה · הבדיקה מייבאת את האטום שלה · הבדיקה מכילה assertion — נמדד מול
 *  contract-quality-baseline.json (רק-יורד): עבריין **חדש** = אדום; ריפוי מדווח, השער לא כותב (עיקרון 5).
 *  --baseline כותב את ה-baseline (bootstrap; אחר-כך רק דרך trailer Allow: baseline). */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as R from './root.mjs';
const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const opt = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const dirArg = argv.find(a => !a.startsWith('--') && a !== opt('--files'));
const NEW = dirArg || R.NEW;
if (!fs.existsSync(NEW)) { console.log('✓ חוק-החוזה: העץ החדש טרם קיים'); process.exit(0); }
const BASE = R.MACH + 'contract-quality-baseline.json';
const PII = /[a-zA-Z0-9._%+-]+@(gmail|walla|outlook|yahoo|hotmail)\.[a-z.]+|AIzaSy[A-Za-z0-9_-]{20,}|BEGIN [A-Z ]*PRIVATE KEY/;
const isAtom = (f) => /\.mjs$/.test(f) && !/\.test\.mjs$/.test(f);
let files = [];
if (opt('--files')) files = opt('--files').split(',').map(s => path.resolve(s)).filter(f => isAtom(f) && fs.existsSync(f));
else (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (isAtom(e.name)) files.push(f); } })(NEW);
files.sort();

// sandbox: הבדיקה רואה רק את תיקייתה, בלי סודות-סביבה, עם timeout — R2-3.5
const runTest = (test) => {
  const dir = path.dirname(test);
  const r = spawnSync('node', ['--permission', `--allow-fs-read=${NEW.replace(/\/$/, '')}/*`, test], { cwd: dir, env: { PATH: process.env.PATH || '' }, stdio: 'pipe', encoding: 'utf8', timeout: 15000, killSignal: 'SIGKILL' });
  return { code: r.error?.code === 'ETIMEDOUT' ? 'timeout' : r.status, out: (r.stdout || '') + (r.stderr || '') };
};

let fail = 0, tested = 0;
const debts = { noExample: [], noImport: [], noAssert: [] };
for (const f of files) {
  const rel = path.relative(NEW, f).replace(/\\/g, '/');
  const src = fs.readFileSync(f, 'utf8');
  if (PII.test(src)) { console.error('🚨 חוק-6: זהות/סוד בתוך אטום: ' + rel); fail = 1; continue; }
  const base = f.replace(/\.mjs$/, ''), name = path.basename(base);
  const contract = base + '.contract.md', test = base + '.test.mjs';
  if (!fs.existsSync(contract) || fs.readFileSync(contract, 'utf8').length < 100) { console.error(`🚨 חוט בלי חוזה: ${rel}`); fail = 1; continue; }
  if (!fs.existsSync(test)) { console.error(`🚨 חוט בלי בדיקה: ${rel}`); fail = 1; continue; }
  const c = fs.readFileSync(contract, 'utf8'), t = fs.readFileSync(test, 'utf8');
  if (!/[0-9].*(⇒|=>)|(⇒|=>).*[0-9]/.test(c)) debts.noExample.push(rel);
  if (!new RegExp(`from\\s+['"]\\./${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.mjs['"]`).test(t)) debts.noImport.push(rel);
  if (!/process\.exit\(1\)|throw |assert|!==|expect\(/.test(t)) debts.noAssert.push(rel);
  const r = runTest(test);
  if (r.code !== 0) { console.error(`🚨 בדיקה אדומה (${r.code}): ${rel}\n${r.out.trim().slice(0, 600)}`); fail = 1; } else tested++;
}

// ── ראצ׳ט-איכות: baseline רק-יורד ──
if (flag('--baseline')) {
  for (const k of Object.keys(debts)) debts[k].sort();
  fs.writeFileSync(BASE, JSON.stringify(debts, null, 0) + '\n');
  console.log(`✍️ contract-quality-baseline: noExample ${debts.noExample.length} · noImport ${debts.noImport.length} · noAssert ${debts.noAssert.length}`);
  process.exit(fail);
}
let baseline = { noExample: [], noImport: [], noAssert: [] };
try { baseline = JSON.parse(fs.readFileSync(BASE, 'utf8')); } catch {}
const inScope = new Set(files.map(f => path.relative(NEW, f).replace(/\\/g, '/')));
const labels = { noExample: 'חוזה בלי דוגמה-מספרית (חוק-4)', noImport: 'בדיקה שלא מייבאת את האטום שלה', noAssert: 'בדיקה בלי assertion (דיבר-12)' };
const shrink = [];
for (const k of Object.keys(debts)) {
  const b = new Set(baseline[k] || []);
  const fresh = debts[k].filter(x => !b.has(x));
  if (fresh.length) { console.error(`🚨 ${labels[k]} — עבריינים חדשים (${fresh.length}): ${fresh.slice(0, 8).join(', ')}${fresh.length > 8 ? ' …' : ''}`); fail = 1; }
  const healed = [...b].filter(x => inScope.has(x) && !debts[k].includes(x));
  if (healed.length) shrink.push(`${k} −${healed.length}`);
}
if (shrink.length) console.log(`ℹ️ baseline may shrink: ${shrink.join(' · ')} — מוחל בטבעת-push (השער לא כותב)`);
if (fail) process.exit(1);
console.log(`✓ חוק-החוזה: ${tested} אטומים — לכולם חוזה + בדיקה ירוקה (sandbox) · חוב-איכות: noExample ${debts.noExample.length} · noImport ${debts.noImport.length} · noAssert ${debts.noAssert.length} (רק-יורד)`);
