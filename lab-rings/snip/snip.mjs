// snip.mjs — renders a short piece of real source code as a "seamless feed" PNG:
// no window, no frame, no shadow; code letters straight on the background, GitHub colors, marker-highlighted lines.
//
//   node snip.mjs --file <path> --lines 12-30 [--hot 20,22] [--theme light|dark|transparent|all] [--out <file.png>]
//                 [--wrap 64] [--ratio 4:5|1:1]
//   node snip.mjs --text <snippet.txt> --lang js ...        (a snippet already cut by hand)
//
// --hot takes FILE line numbers (or "/regex/" to match lines). Output is 1080 wide at 2x (2160 px).
// It refuses to render anything that looks like a secret (keys, tokens, passwords, private keys).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const A = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? a.concat([[x.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]]) : a), []));
if (!A.file && !A.text) { console.error('usage: node snip.mjs --file <path> --lines A-B [--hot N,M|/re/] [--theme light|dark|transparent|all] [--out x.png]'); process.exit(2); }

const src = fs.readFileSync(A.file || A.text, 'utf8').split('\n');
let from = 1, to = src.length;
if (A.lines) { const m = String(A.lines).match(/^(\d+)(?:-(\d+))?$/); if (!m) throw new Error('--lines A-B'); from = +m[1]; to = +(m[2] || m[1]); }
let lines = src.slice(from - 1, to);
const fileNo = lines.map((_, i) => from + i);

// ---- secret guard -------------------------------------------------------------------------
const SECRET = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /\bsk-[A-Za-z0-9_-]{16,}/, /\bsk-ant-[A-Za-z0-9_-]{10,}/, /\bAKIA[0-9A-Z]{16}\b/, /\bAIza[0-9A-Za-z_-]{30,}/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}/, /\bxox[abpr]-[A-Za-z0-9-]{10,}/, /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\./,
  /(api[_-]?key|secret|token|passw(or)?d|bearer)\s*[:=]\s*['"][^'"\s]{8,}['"]/i,
];
for (const [i, l] of lines.entries()) for (const re of SECRET) if (re.test(l)) { console.error(`REFUSED: line ${fileNo[i]} looks like a secret (${re}). Pick other lines.`); process.exit(3); }

// ---- dedent + soft wrap long lines (keeps every token; continuation lines get +4 indent) ----
const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].replace(/\t/g, '  ').length));
lines = lines.map((l) => l.replace(/\t/g, '  ').slice(ind).replace(/\s+$/, ''));
const WRAP = +(A.wrap || 60);
const ext0 = (A.lang || path.extname(A.file || '').slice(1) || 'js').toLowerCase();
const CMT = ['py', 'sh', 'bash'].includes(ext0) ? '#' : '//';
let hotText = [];   // when --hot gives file line numbers, remember their text so they survive reformatting
if (A.hot && A.hot !== true && !String(A.hot).startsWith('/')) for (const n of String(A.hot).split(',').map(Number)) if (n >= from && n <= to) hotText.push(lines[n - from].trim());
// JS/TS: pretty-print the snippet with prettier at the target width (tokens unchanged; --raw keeps the original layout)
let formatted = null;
if (!A.raw && ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx'].includes(ext0)) {
  try {
    const prettier = await import('/opt/node-tools/node_modules/prettier/index.mjs').catch(() => import('prettier'));
    const parser = ext0.startsWith('ts') ? 'typescript' : 'babel';
    formatted = (await prettier.format(lines.join('\n'), { parser, printWidth: WRAP, singleQuote: true, trailingComma: 'none', semi: true })).replace(/\n+$/, '').split('\n');
  } catch (e) { formatted = null; console.warn('prettier skipped (snippet does not parse alone) — soft wrap instead'); }
}
const outL = [], outNo = [];
const baseL = formatted || lines, baseNo = formatted ? formatted.map(() => null) : fileNo;
for (const [i, l] of baseL.entries()) {
  if (l.length <= WRAP) { outL.push(l); outNo.push(baseNo[i]); continue; }
  const lead = l.match(/^\s*/)[0], isCm = l.trimStart().startsWith(CMT);
  let rest = l, first = true;
  while (rest.length > WRAP) {
    let cut = -1;
    for (const sep of [' || ', ' && ', ', ', ' ? ', ' : ', '; ', ' = ', ' ']) { const k = rest.lastIndexOf(sep, WRAP - 1); if (k > lead.length + 8) { cut = k + sep.length - (sep.endsWith(' ') ? 1 : 0); break; } }
    if (cut < 0) cut = WRAP;
    outL.push(rest.slice(0, cut).replace(/\s+$/, '')); outNo.push(first ? baseNo[i] : null); first = false;
    rest = lead + (isCm ? CMT + '   ' : '    ') + rest.slice(cut).trimStart();
  }
  outL.push(rest); outNo.push(first ? baseNo[i] : null);
}

// ---- hot lines ---------------------------------------------------------------------------
let hot = new Set();
if (A.hot && A.hot !== true) {
  const h = String(A.hot);
  if (h.startsWith('/')) { const re = new RegExp(h.slice(1, h.lastIndexOf('/'))); outL.forEach((l, i) => re.test(l) && hot.add(i)); }
  else for (const t of hotText) { const key = t.slice(0, 24); const i = outL.findIndex((l, j) => !hot.has(j) && l.trim().startsWith(key)); if (i >= 0) hot.add(i); else { const k = outL.findIndex((l) => l.includes(key.slice(0, 14))); if (k >= 0) hot.add(k); } }
}

// ---- language ----------------------------------------------------------------------------
const ext = ext0;
const LANG = {
  js: { kw: 'const let var for while do if else return try catch finally throw new typeof instanceof in of class extends super this async await yield import export from default switch case break continue function true false null undefined', cm: '//' },
  dart: { kw: 'final const var for while do if else return try catch on finally throw new is as in class extends implements with mixin super this async await yield import export library part show hide switch case break continue void dynamic late required static abstract enum true false null Future Stream', cm: '//' },
  py: { kw: 'def class return if elif else for while in not and or is try except finally raise with as import from lambda yield async await pass break continue global nonlocal True False None self', cm: '#' },
  sh: { kw: 'if then else elif fi for while do done case esac in function return local export', cm: '#' },
};
const L = LANG[{ mjs: 'js', cjs: 'js', ts: 'js', tsx: 'js', jsx: 'js', bash: 'sh' }[ext] || ext] || LANG.js;

// ---- layout: pick the largest font that fits 1080 x H with 56px side padding -------------
const ratio = String(A.ratio || '4:5');
const W = 1080, H = ratio === '1:1' ? 1080 : 1350, PADX = 56, PADY = 90;
const maxLen = Math.max(...outL.map((l) => l.length), 20);
const byW = (W - 2 * PADX - 24) / (maxLen * 0.6);           // JetBrains Mono advance ≈ 0.6em
const byH = (H - 2 * PADY) / (outL.length * 1.4);
const font = Math.max(16, Math.min(36, Math.floor(Math.min(byW, byH) * 2) / 2));
if (Math.min(byW, byH) < 16) console.warn(`WARNING: snippet is large (${outL.length} lines, ${maxLen} cols) — text will be small on a phone; consider fewer lines.`);

const page = (theme) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${HERE}/fonts/fonts.css"><style>
:root{--bg:#FFFFFF;--text:#1F2328;--kw:#CF222E;--fn:#8250DF;--cm:#6E7781;--str:#0A3069;--num:#0550AE;--prop:#953800;--mark:#FFF8C5;--bar:#D4A72C}
:root[data-t=dark],:root[data-t=transparent]{--bg:#242526;--text:#E6EDF3;--kw:#FF7B72;--fn:#D2A8FF;--cm:#8B949E;--str:#A5D6FF;--num:#79C0FF;--prop:#FFA657;--mark:rgba(187,128,9,.22);--bar:#D29922}
:root[data-t=transparent]{--bg:transparent}
html,body{margin:0;background:var(--bg)}
.frame{width:${W}px;height:${H}px;background:var(--bg);display:flex;align-items:center;box-sizing:border-box;padding:0 ${PADX}px}
pre{margin:0;width:100%;font-family:'JetBrains Mono','Heebo',monospace;font-size:${font}px;line-height:${(font * 1.4).toFixed(1)}px;color:var(--text);white-space:pre;font-variant-ligatures:none;font-feature-settings:'calt' 0,'liga' 0}
.ln{display:block;padding-left:20px;border-left:4px solid transparent;margin-left:-24px}.ln.hot{background:var(--mark);border-left-color:var(--bar)}
.c{color:var(--cm);font-style:italic}.s,bdi{unicode-bidi:isolate}pre{direction:ltr}.k{color:var(--kw)}.s{color:var(--str)}.n{color:var(--num)}.f{color:var(--fn)}.p{color:var(--prop)}
</style></head><body><div class="frame" id="f"><pre id="code"></pre></div><script>
document.documentElement.dataset.t=${JSON.stringify(theme)};
const lines=${JSON.stringify(outL)}, hot=new Set(${JSON.stringify([...hot])});
const KW=new Set(${JSON.stringify(L.kw.split(' '))}), CM=${JSON.stringify(L.cm)};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function hl(line){
  const cmt=(t)=>{ const lead=t.length-t.trimStart().length; let k=lead; for(const mk of ['/**','/*','*/','//','#','*']){ if(t.startsWith(mk,lead)){ k=lead+mk.length; break; } } while(t[k]===' ') k++; return '<span class="c">'+esc(t.slice(0,k))+'<bdi dir="auto">'+esc(t.slice(k))+'</bdi></span>'; };
  const tt=line.trimStart(); if(CM==='//'&&(tt.startsWith('/*')||tt.startsWith('*'))) return cmt(line);
  let inStr=null, ci=-1;
  for(let i=0;i<line.length;i++){ const ch=line[i]; if(inStr){ if(ch==='\\\\'){i++;continue;} if(ch===inStr) inStr=null; continue; }
    if(ch==="'"||ch==='"'||ch==='\`'){inStr=ch;continue;} if(line.startsWith(CM,i)){ci=i;break;} }
  let rest=ci>=0?line.slice(0,ci):line, tail=ci>=0?cmt(line.slice(ci)):'';
  const re=/('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*"|\`(?:[^\`\\\\]|\\\\.)*\`)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_$][\\w$]*)(\\s*\\()?|(\\.[A-Za-z_$][\\w$]*)(\\s*\\()?|([\\s\\S])/g;
  let out='',m; while((m=re.exec(rest))){
    if(m[1]) out+='<span class="s">'+esc(m[1])+'</span>';
    else if(m[2]) out+='<span class="n">'+m[2]+'</span>';
    else if(m[3]){ if(KW.has(m[3])) out+='<span class="k">'+m[3]+'</span>'+(m[4]||''); else if(m[4]) out+='<span class="f">'+m[3]+'</span>'+m[4]; else out+=m[3]; }
    else if(m[5]) out+= m[6] ? '.<span class="f">'+m[5].slice(1)+'</span>'+m[6] : '.<span class="p">'+m[5].slice(1)+'</span>';
    else out+=esc(m[7]); }
  return out+tail; }
document.getElementById('code').innerHTML=lines.map((l,i)=>'<span class="ln'+(hot.has(i)?' hot':'')+'">'+(hl(l)||' ')+'</span>').join('');
</script></body></html>`;

const { chromium } = await import('/opt/node-tools/node_modules/playwright/index.mjs').catch(() => import('playwright'));
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const themes = A.theme === 'all' ? ['light', 'dark', 'transparent'] : [A.theme && A.theme !== true ? A.theme : 'light'];
const base = (A.out && A.out !== true ? A.out : path.join(process.cwd(), 'snip.png')).replace(/\.png$/, '');
for (const t of themes) {
  const tmp = path.join(HERE, `.snip-${process.pid}-${t}.html`); fs.writeFileSync(tmp, page(t));
  const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  if (errs.length) throw new Error('render error: ' + errs.join('; '));
  const out = themes.length > 1 ? `${base}-${t}.png` : `${base}.png`;
  await p.locator('#f').screenshot({ path: out, omitBackground: t === 'transparent' }); await p.close(); fs.unlinkSync(tmp);
  console.log(`ok ${out}  (${outL.length} lines, ${maxLen} cols, font ${font}px, ${t})`);
}
await browser.close();
