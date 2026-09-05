// 🔬 pixel-forge-audit · diff — משווה כל זוג ORIG↔FORGE (דיף-פיקסל אפור בדפדפן), מדרג מהגרוע-לטוב,
// כותב report.json + report.md, ומייצר גיליון-הפרשים חזותי (orig|forge|heatmap) ל-N הגרועים.
import fs from 'node:fs';
import path from 'node:path';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { SHOTS } from './lib.mjs';

const TOPN = +(process.env.TOPN || 48);          // כמה גיליונות-הפרש חזותיים לגרועים
const THRESH = +(process.env.THRESH || 32);      // סף-הפרש-אפור לפיקסל "שונה"
const idx = JSON.parse(fs.readFileSync(path.join(SHOTS, 'index.json'), 'utf8'));
const origDir = path.join(SHOTS, 'orig'), forgeDir = path.join(SHOTS, 'forge'), diffDir = path.join(SHOTS, 'diff');
fs.mkdirSync(diffDir, { recursive: true });
const uri = p => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');

const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await b.newPage({ viewport: { width: 400, height: 400 } });
await page.setContent('<canvas id="c"></canvas>');

async function diffPair(a, bImg) {
  return page.evaluate(async ({ a, b, TH }) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
    const cv = document.getElementById('c'); const cx = cv.getContext('2d', { willReadFrequently: true });
    const gray = (img, sw, sh) => { cv.width = sw; cv.height = sh; cx.imageSmoothingEnabled = true; cx.clearRect(0, 0, sw, sh); cx.drawImage(img, 0, 0, sw, sh); const d = cx.getImageData(0, 0, sw, sh).data; const g = new Float32Array(sw * sh); for (let i = 0, j = 0; i < d.length; i += 4, j++) g[j] = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114; return g; };
    // גלמי — פר-פיקסל (רגיש ל-AA של טקסט).
    const Aw = gray(ia, w, h), Bw = gray(ib, w, h); let mism = 0, sum = 0; const n = w * h;
    for (let i = 0; i < n; i++) { const dd = Math.abs(Aw[i] - Bw[i]); sum += dd; if (dd > TH) mism++; }
    // מבני — הקטנה ×0.25 (ממצעת שולי-AA, משמרת גושים/מיקום/צבע). זה מדד-הדירוג העיקרי.
    const sw = Math.max(1, Math.round(w * 0.25)), sh = Math.max(1, Math.round(h * 0.25));
    const As = gray(ia, sw, sh), Bs = gray(ib, sw, sh); let sm = 0; const sn = sw * sh;
    for (let i = 0; i < sn; i++) if (Math.abs(As[i] - Bs[i]) > 24) sm++;
    return { w, h, diffPct: +(mism / n * 100).toFixed(3), structPct: +(sm / sn * 100).toFixed(3), mean: +(sum / n).toFixed(2) };
  }, { a, b: bImg, TH: THRESH });
}

const rows = [];
let i = 0;
for (const a of idx) {
  const k = `${a.family}__${a.slug}`;
  const op = path.join(origDir, `${k}.png`), fp = path.join(forgeDir, `${k}.png`);
  const hasO = fs.existsSync(op), hasF = fs.existsSync(fp);
  if (!hasO || !hasF) { rows.push({ ...a, k, diffPct: 999, note: !hasO && !hasF ? 'no-orig,no-forge' : !hasO ? 'no-orig' : 'no-forge' }); continue; }
  const d = await diffPair(uri(op), uri(fp));
  rows.push({ ...a, k, ...d, note: '' });
  if (++i % 40 === 0) console.log(`  diff ${i}/${idx.length}`);
}
// דירוג לפי הפרש-גלמי (הפרדה נקייה יותר: גוש-אמיתי בולט מעל רצפת-רסטור-הטקסט ~5-7%); חסרי-render בראש.
const sortKey = r => r.note ? 1000 : r.diffPct;
rows.sort((x, y) => sortKey(y) - sortKey(x));

// גיליון-הפרש חזותי ל-TOPN הגרועים
const worst = rows.filter(r => r.note === '' && r.diffPct > 0).slice(0, TOPN);
for (let r = 0; r < worst.length; r++) {
  const a = worst[r]; const op = path.join(origDir, `${a.k}.png`), fp = path.join(forgeDir, `${a.k}.png`);
  const sheet = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#08080A;font-family:sans-serif">
  <div style="color:#fff;font-size:15px;padding:6px 10px;background:#1a1a1e">#${r + 1} ${a.k} — diff ${a.diffPct}%${a.theater ? ' (theater · מצב-ראשון)' : ''}</div>
  <div style="display:flex;gap:12px;padding:12px;align-items:flex-start">
   <div><div style="color:#7fd;font-size:11px">ORIG</div><img id="o" src="${uri(op)}" style="width:290px;display:block;outline:1px solid #333"></div>
   <div><div style="color:#a9f;font-size:11px">FORGE</div><img id="f" src="${uri(fp)}" style="width:290px;display:block;outline:1px solid #333"></div>
   <div><div style="color:#f77;font-size:11px">DIFF</div><canvas id="h" style="width:290px;display:block;outline:1px solid #333"></canvas></div>
  </div>
  <script>
   const o=document.getElementById('o'),f=document.getElementById('f'),h=document.getElementById('h');
   function draw(){const w=Math.max(o.naturalWidth,f.naturalWidth),ht=Math.max(o.naturalHeight,f.naturalHeight);
    h.width=w;h.height=ht;const cx=h.getContext('2d',{willReadFrequently:true});
    cx.drawImage(o,0,0);const A=cx.getImageData(0,0,w,ht);const a=A.data;
    cx.clearRect(0,0,w,ht);cx.drawImage(f,0,0);const b=cx.getImageData(0,0,w,ht).data;
    const out=cx.createImageData(w,ht),d=out.data;
    for(let i=0;i<a.length;i+=4){const ga=a[i]*0.299+a[i+1]*0.587+a[i+2]*0.114,gb=b[i]*0.299+b[i+1]*0.587+b[i+2]*0.114;const df=Math.abs(ga-gb);
     if(df>${THRESH}){d[i]=255;d[i+1]=40;d[i+2]=40;d[i+3]=255;}else{d[i]=12;d[i+1]=12;d[i+2]=14;d[i+3]=255;}}
    cx.putImageData(out,0,0);window.__done=true;}
   if(o.complete&&f.complete)draw();else{o.onload=f.onload=()=>{if(o.complete&&f.complete)draw();};}
  </script></body>`;
  const p = await b.newPage({ viewport: { width: 960, height: 700 }, deviceScaleFactor: 1 });
  await p.setContent(sheet);
  await p.waitForFunction('window.__done===true', { timeout: 5000 }).catch(() => {});
  await p.locator('body').screenshot({ path: path.join(diffDir, `${String(r + 1).padStart(3, '0')}_${a.k}.png`) });
  await p.close();
}
await b.close();

// ── מעקב: baseline + היסטוריה + זיהוי-רגרסיה ──────────────────────────────
// baseline.json נשמר בגיט (machtzev/audit/) = חוזה-האיכות. השוואה מול-baseline מסמנת רגרסיות/שיפורים.
const AUDIT = path.dirname(SHOTS);
const baseFile = path.join(AUDIT, 'baseline.json');
const setBaseline = process.argv.includes('--baseline');
const base = fs.existsSync(baseFile) ? JSON.parse(fs.readFileSync(baseFile, 'utf8')) : null;
const EPS = 1.5;   // סף-שינוי-משמעותי (מעל רעש-רסטור)
const cur = {};
for (const r of rows) cur[r.k] = r.note ? -1 : r.diffPct;   // -1 = חסר-render
const deltas = [];
if (base) for (const r of rows) {
  const b = base[r.k]; if (b == null) { r.trend = 'new'; continue; }
  const now = cur[r.k];
  if (b === -1 && now >= 0) { r.trend = 'fixed-render'; deltas.push({ k: r.k, from: 'no-render', to: now }); }
  else if (b >= 0 && now === -1) { r.trend = 'broke-render'; deltas.push({ k: r.k, from: b, to: 'no-render' }); }
  else if (now - b > EPS && now > 2) { r.trend = 'REGRESSED'; r.delta = +(now - b).toFixed(2); deltas.push({ k: r.k, from: b, to: now, d: r.delta }); }
  else if (b - now > EPS) { r.trend = 'improved'; r.delta = +(now - b).toFixed(2); }
}

fs.writeFileSync(path.join(SHOTS, 'report.json'), JSON.stringify(rows, null, 2));
const miss = rows.filter(r => r.note);
const withDiff = rows.filter(r => r.note === '');
const FLOOR = 8;
const clean = withDiff.filter(r => r.diffPct < 2).length;
const suspect = withDiff.filter(r => r.diffPct >= FLOOR).length;
const mean = withDiff.length ? +(withDiff.reduce((s, r) => s + r.diffPct, 0) / withDiff.length).toFixed(3) : 0;
const regressed = rows.filter(r => r.trend === 'REGRESSED');
const improved = rows.filter(r => r.trend === 'improved');
const brokeRender = rows.filter(r => r.trend === 'broke-render');
const fixedRender = rows.filter(r => r.trend === 'fixed-render');

// היסטוריה (מצטברת) — קו-מגמה לאורך זמן.
fs.appendFileSync(path.join(AUDIT, 'history.jsonl'), JSON.stringify({ t: new Date().toISOString(), atoms: rows.length, compared: withDiff.length, mean, clean, suspect, miss: miss.length, regressed: regressed.length, improved: improved.length }) + '\n');

if (setBaseline) { fs.writeFileSync(baseFile, JSON.stringify(cur, null, 0)); console.log(`✓ baseline נשמר (${Object.keys(cur).length} אטומים) ⇒ ${baseFile}`); }

const feat = r => (r.feats && r.feats.length ? r.feats.slice(0, 2).join(',') : '');
const md = [
  `# pixel-forge-audit — דוח (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`,
  ``,
  `סף-פיקסל-שונה: הפרש-אפור > ${THRESH}. אטומי-תאטרון = מצב-ראשון בלבד (כמו ה-FORGE).`,
  ``,
  `- אטומים: **${rows.length}** · הושוו: **${withDiff.length}** · חסרי-render: **${miss.length}**`,
  `- diff ממוצע: **${mean}%** · נמוכים (<2%): **${clean}** · חשודים (≥${FLOOR}%): **${suspect}**`,
  base ? `- מול-baseline: 🔴 רגרסיות **${regressed.length}** · 🟢 שיפורים **${improved.length}** · ✅ תוקן-render **${fixedRender.length}** · 💥 נשבר-render **${brokeRender.length}**` : `- _אין baseline — הרץ עם \`--baseline\` לקיבוע חוזה-איכות._`,
  `- **raw%** = הפרש-פיקסל אפור (~5-7% = רצפת-רסטור-טקסט) · **feats** = תכונות-CSS-קשות חשודות · ה-heatmap מכריע.`,
  ``,
  ...(regressed.length ? [`## 🔴 רגרסיות (החמירו מול baseline)`, ``, `| אטום | baseline% | עכשיו% | Δ | feats |`, `|---|---|---|---|---|`, ...regressed.sort((a, b) => b.delta - a.delta).map(r => `| ${r.k} | ${base[r.k]} | ${r.diffPct} | +${r.delta} | ${feat(r)} |`), ``] : []),
  ...(brokeRender.length ? [`## 💥 נשבר-render מול baseline`, brokeRender.map(r => `- ${r.k}`).join('\n'), ``] : []),
  `## 40 הגרועים (מהגרוע לטוב, לפי raw%)`,
  ``,
  `| # | אטום | raw% | struct% | feats | מגמה | הערה |`,
  `|---|------|------|---------|-------|------|------|`,
  ...rows.slice(0, 40).map((r, n) => `| ${n + 1} | ${r.k} | ${r.note ? '—' : r.diffPct} | ${r.note ? '—' : r.structPct} | ${feat(r)} | ${r.trend === 'REGRESSED' ? '🔴' : r.trend === 'improved' ? '🟢' : r.trend === 'new' ? '🆕' : ''} | ${r.note} |`),
  ``,
  `## חסרי-render (${miss.length})`,
  miss.length ? miss.map(r => `- ${r.k}${r.feats && r.feats.length ? ' · ' + r.feats.slice(0, 2).join(',') : ''}`).join('\n') : '_אין_',
  ``,
].join('\n');
fs.writeFileSync(path.join(SHOTS, 'report.md'), md);
console.log(`✓ diff: ${withDiff.length} הושוו · נקי ${clean} · ממוצע ${mean}%${base ? ` · 🔴${regressed.length} 🟢${improved.length}` : ''} · report.md`);
if (regressed.length) console.log(`⚠ רגרסיות: ${regressed.map(r => r.k).join(', ')}`);
