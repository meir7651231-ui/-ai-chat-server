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

// דוחות
fs.writeFileSync(path.join(SHOTS, 'report.json'), JSON.stringify(rows, null, 2));
const miss = rows.filter(r => r.note);
const withDiff = rows.filter(r => r.note === '');
const FLOOR = 8;   // רצפת-רסטור-טקסט משוערת — מעליה = חשוד-אמיתי
const clean = withDiff.filter(r => r.diffPct < 2).length;
const suspect = withDiff.filter(r => r.diffPct >= FLOOR).length;
const mean = withDiff.length ? (withDiff.reduce((s, r) => s + r.diffPct, 0) / withDiff.length).toFixed(3) : 0;
const md = [
  `# pixel-forge-audit — דוח (${new Date().toISOString().slice(0, 10)})`,
  ``,
  `סף-פיקסל-שונה: הפרש-אפור > ${THRESH}. אטומי-תאטרון = מצב-ראשון בלבד (כמו ה-FORGE).`,
  ``,
  `- אטומים: **${rows.length}** · הושוו: **${withDiff.length}** · חסרי-render: **${miss.length}**`,
  `- diff ממוצע: **${mean}%** · נמוכים (<2%): **${clean}** · חשודים (≥${FLOOR}%): **${suspect}**`,
  `- גיליונות-הפרש ל-${worst.length} הגרועים: \`shots/diff/\``,
  `- **raw%** = הפרש-פיקסל אפור (מעל ~5-7% = רצפת-רסטור-טקסט; חריגה גבוהה/גוש-רציף = באג-אמיתי).`,
  `  **struct%** = אחרי הקטנה ×0.25 (משני). כלי-ההכרעה הוא ה-heatmap, לא המספר לבדו.`,
  ``,
  `## 40 הגרועים (מהגרוע לטוב, לפי raw%)`,
  ``,
  `| # | אטום | raw% | struct% | theater | הערה |`,
  `|---|------|------|---------|---------|------|`,
  ...rows.slice(0, 40).map((r, n) => `| ${n + 1} | ${r.k} | ${r.note ? '—' : r.diffPct} | ${r.note ? '—' : r.structPct} | ${r.theater ? '✓' : ''} | ${r.note} |`),
  ``,
  `## חסרי-render (${miss.length})`,
  miss.length ? miss.map(r => `- ${r.k} — ${r.note}`).join('\n') : '_אין_',
  ``,
].join('\n');
fs.writeFileSync(path.join(SHOTS, 'report.md'), md);
console.log(`✓ diff: ${withDiff.length} הושוו · נקיים ${clean} · diff ממוצע ${mean}% · גרועים→shots/diff · report.md`);
