// 🔬 pixel-forge-audit · heal — תיקון-עצמי מוגן. מאמת שינוי-מנוע (בעץ-העבודה) מול baseline:
// מרנדר את אטומי-המטרה + מדגם-קנרים, מודד, ומכריע — קידום (השארה) אם המטרות השתפרו ואף קנרי לא-נסוג,
// אחרת ביטול-אוטומטי (git checkout ל-ds-forge). כך כל תיקון-מנוע בטוח ואוטו-מתבטל ברגרסיה.
//   node machtzev/audit/heal.mjs <fam__slug> [fam__slug…]      # אמת מטרות ספציפיות
//   node machtzev/audit/heal.mjs --suspects                    # אמת את כל החשודים (raw≥8%)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { SHOTS } from './lib.mjs';

const AUDIT = path.dirname(SHOTS), GEN = '/home/user/-ai-chat-server', BS = '/home/user/buildsmart/app_flutter';
const FORGE = '/home/user/flutter/bin/flutter';
const idx = JSON.parse(fs.readFileSync(path.join(SHOTS, 'index.json'), 'utf8'));
const base = fs.existsSync(path.join(AUDIT, 'baseline.json')) ? JSON.parse(fs.readFileSync(path.join(AUDIT, 'baseline.json'), 'utf8')) : {};
const report = fs.existsSync(path.join(SHOTS, 'report.json')) ? JSON.parse(fs.readFileSync(path.join(SHOTS, 'report.json'), 'utf8')) : [];

const args = process.argv.slice(2);
let targets;
if (args.includes('--suspects')) targets = report.filter(r => !r.note && r.diffPct >= 8).map(r => r.k);
else targets = args.filter(a => !a.startsWith('-'));
if (!targets.length) { console.error('אין מטרות. שימוש: heal.mjs <fam__slug…> | --suspects'); process.exit(1); }

// קנרים = 12 האטומים הכי-נקיים ב-baseline (מגוון-משפחות) — מגן-רגרסיה רחב.
const canaries = Object.entries(base).filter(([k, v]) => v >= 0 && v < 3 && !targets.includes(k))
  .sort((a, b) => a[1] - b[1]).slice(0, 12).map(([k]) => k);
const watch = [...new Set([...targets, ...canaries])];
console.log(`🎯 מטרות: ${targets.length} · קנרים: ${canaries.length}`);

const run = (cmd, a, opts = {}) => execFileSync(cmd, a, { stdio: 'pipe', ...opts });
function renderForge(keys) {
  run('node', [path.join(AUDIT, 'gen-forge-dart.mjs')], { env: { ...process.env, ONLY: keys.join(',') } });
  run(FORGE, ['test', 'test/zz_pixel_audit_test.dart'], { cwd: BS, env: { ...process.env, PATH: `/home/user/flutter/bin:${process.env.PATH}` } });
}

// דיף-אפור בדפדפן (כמו diff.mjs) עבור קבוצת-מפתחות ⇒ {k: diffPct}.
async function diffKeys(keys) {
  const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage(); await page.setContent('<canvas id="c"></canvas>');
  const uri = p => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
  const out = {};
  for (const k of keys) {
    const op = path.join(SHOTS, 'orig', `${k}.png`), fp = path.join(SHOTS, 'forge', `${k}.png`);
    if (!fs.existsSync(op) || !fs.existsSync(fp)) { out[k] = -1; continue; }
    out[k] = await page.evaluate(async ({ a, c }) => {
      const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
      const [ia, ib] = await Promise.all([load(a), load(c)]);
      const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
      const cv = document.getElementById('c'); cv.width = w; cv.height = h; const cx = cv.getContext('2d', { willReadFrequently: true });
      cx.clearRect(0, 0, w, h); cx.drawImage(ia, 0, 0); const A = cx.getImageData(0, 0, w, h).data;
      cx.clearRect(0, 0, w, h); cx.drawImage(ib, 0, 0); const B = cx.getImageData(0, 0, w, h).data;
      let m = 0; const n = w * h;
      for (let i = 0; i < A.length; i += 4) { const g = Math.abs((A[i] * .299 + A[i + 1] * .587 + A[i + 2] * .114) - (B[i] * .299 + B[i + 1] * .587 + B[i + 2] * .114)); if (g > 32) m++; }
      return +(m / n * 100).toFixed(3);
    }, { a: uri(op), c: uri(fp) });
  }
  await b.close(); return out;
}

// ── אמת את השינוי הנוכחי (עץ-העבודה) ──────────────────────────────────────
console.log('🔨 regen + mirror + render (מטרות+קנרים)…');
run('node', [path.join(GEN, 'machtzev/ds-forge.mjs')]);
run('bash', ['-c', `rm -rf ${BS}/lib/genesis/dart-forge-bs && cp -r ${GEN}/new/dart-forge-bs ${BS}/lib/genesis/dart-forge-bs`]);
renderForge(watch);
const after = await diffKeys(watch);

const EPS = 1.5;
const tRows = targets.map(k => ({ k, base: base[k] ?? null, now: after[k] }));
const cRows = canaries.map(k => ({ k, base: base[k], now: after[k] }));
const tImproved = tRows.filter(r => r.base != null && r.base - r.now > EPS);
const tWorse = tRows.filter(r => r.base != null && r.now - r.base > EPS && r.now > 2);
const cRegressed = cRows.filter(r => r.now - r.base > EPS && r.now > 2);
const netBefore = tRows.reduce((s, r) => s + (r.base > 0 ? r.base : 0), 0);
const netAfter = tRows.reduce((s, r) => s + (r.now > 0 ? r.now : 0), 0);

console.log('\n── מטרות ──'); tRows.forEach(r => console.log(`  ${r.k}: ${r.base ?? '—'}% → ${r.now}%  ${r.base != null && r.base - r.now > EPS ? '🟢' : r.base != null && r.now - r.base > EPS ? '🔴' : ''}`));
console.log('── קנרים (רגרסיה?) ──'); console.log(cRegressed.length ? cRegressed.map(r => `  🔴 ${r.k}: ${r.base}%→${r.now}%`).join('\n') : '  ✅ כולם יציבים');

const promote = netAfter < netBefore - EPS && !cRegressed.length && !tWorse.length;
if (promote) {
  console.log(`\n✅ קידום: מטרות ${netBefore.toFixed(1)}%→${netAfter.toFixed(1)}% · אפס-רגרסיה. השינוי נשמר בעץ-העבודה.`);
  // עדכון baseline למטרות שקודמו (וגם קנרים שנמדדו) ⇒ המעקב תופס רגרסיה עתידית מהמצב-החדש.
  for (const r of [...tRows, ...cRows]) if (r.now >= 0) base[r.k] = r.now;
  fs.writeFileSync(path.join(AUDIT, 'baseline.json'), JSON.stringify(base, null, 0));
  console.log('   baseline עודכן למטרות שקודמו.');
} else {
  console.log(`\n↩ ביטול-אוטומטי: ${cRegressed.length ? 'רגרסיית-קנרי' : tWorse.length ? 'מטרה-החמירה' : 'אין-שיפור-נטו'}. משחזר ds-forge.mjs.`);
  run('bash', ['-c', `cd ${GEN} && git checkout -- machtzev/ds-forge.mjs && node machtzev/ds-forge.mjs >/dev/null && rm -rf ${BS}/lib/genesis/dart-forge-bs && cp -r new/dart-forge-bs ${BS}/lib/genesis/dart-forge-bs`]);
}
fs.writeFileSync(path.join(SHOTS, 'heal-report.json'), JSON.stringify({ targets: tRows, canaries: cRows, promoted: promote, netBefore, netAfter }, null, 2));
process.exit(promote ? 0 : 2);
