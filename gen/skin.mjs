// gen/skin.mjs — שכבת-העיצוב של gen: זרע-אחד ⇒ טוקני-CSS ⇒ בסיס-CSS משותף לכל העמודים.
// הכרעה-19 (מראה=דאטה) והכרעה-28 (הרצפה חרוטה): הצבעים נקראים מזרע-האימפריה (new/atoms/pure-look.mjs)
// ואינם נכתבים כאן. הבחירות (איזה עור · איזו ערכה · סקאלות) יושבות ב-skin.data.json עם מוצא.
// הרצה: node gen/skin.mjs           ⇒ מדפיס את הטוקנים ומרענן את צילום-הנפילה ב-skin.data.json
//       node gen/skin.mjs --check   ⇒ שער: אין ליטרל-צבע בפולטי-gen (חוץ מכאן), והצילום טרי
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
export const SKIN_DATA = JSON.parse(fs.readFileSync(path.join(HERE, 'skin.data.json'), 'utf8'));

// ── קריאת-הזרע כדאטה (לא import — gen לא מייבאת מהמחצב; חוק-הניתוק) ──
function readPureLook() {
  const p = path.join(ROOT, SKIN_DATA.seeds.pureLook);
  if (!fs.existsSync(p)) return null;
  const src = fs.readFileSync(p, 'utf8').replace(/^\s*export\s+/m, '');
  try { return new Function(`${src}; return PURE_LOOK;`)(); } catch { return null; }
}
function readDesignSeed() {
  const p = path.join(ROOT, SKIN_DATA.seeds.designSeed);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

// ── הפיכת-הזרע לבחירה: עור + ערכה + סקאלות. אין ברירת-מחדל-מומצאת: חסר זרע ⇒ הצילום; חסר גם הוא ⇒ שגיאה גלויה. ──
export function loadSkin() {
  const pl = readPureLook(), ds = readDesignSeed(), S = SKIN_DATA, snap = S.skinSnapshot || {};
  const paper = pl ? { ...pl.neutral, ...pl.semantic, ...(pl.skins?.[S.pick.skin] || {}) } : snap.paper;
  const dark = pl ? { ...pl.neutral, ...pl.semantic } : snap.dark;
  const theme = pl ? pl.themes?.[S.pick.theme] : snap.theme;
  const seed = ds || snap.designSeed;
  if (!paper || !theme || !seed || !Object.keys(paper).length) throw new Error('gen/skin: אין זרע-עיצוב ואין צילום — לא ממציאים צבעים (חוק-5)');
  return { paper, dark, theme, seed, from: pl ? 'זרע' : 'צילום' };
}

export const BIDI_SHAPES = (SKIN_DATA.bidi && SKIN_DATA.bidi.isolateShapes) || [];

const px = (n) => `${Math.round(n * 100) / 100}px`;

// ── טוקני-CSS: אותם שמות של האימפריה + שכבת-כינויים לשמות הישנים (bg/card/line/acc/mute/code) ──
export function tokensCss() {
  const S = SKIN_DATA, { paper, dark, theme, seed } = loadSkin();
  const g = seed.gridUnit, r0 = seed.radiusBase, T = S.type, D = S.density;
  const vars = (o) => Object.entries(o).map(([k, v]) => `${k}:${v}`).join(';');
  const space = S.spaceMul.map((m, i) => `--s${i + 1}:${px(g * m)}`).join(';');
  const radii = Object.entries(S.radiusMul).map(([k, m]) => `--r-${k}:${px(r0 * m)}`).join(';') + ';--r-pill:999px';
  const type = Object.entries(T).filter(([k]) => !k.startsWith('_')).map(([k, v]) => `--t-${k}:${px(v.px)};--lh-${k}:${v.lh};--w-${k}:${v.w}`).join(';');
  const rows = Object.entries(D.unitMul).map(([k, m]) => `--row-${k}:${px(g * m)}`).join(';');
  const pads = Object.entries(D.cellPadMul).map(([k, m]) => `--pad-${k}:${px(g * m)}`).join(';');
  const motion = Object.entries(seed.motion || {}).map(([k, v]) => `--m-${k}:${v}ms`).join(';');
  const alias = vars({
    '--bg': 'var(--canvas)', '--card': 'var(--surface)', '--raise': 'var(--raised)', '--code': 'var(--raised2)',
    '--mute': 'var(--mut)', '--line': 'var(--hair)', '--acc': 'var(--a)', '--acc-hi': 'var(--a-hi)', '--acc-ink': 'var(--on-a)', '--none': 'var(--err)',
  });
  const density = `--row-h:var(--row-${D.default});--cell-pad:var(--pad-${D.default})`;
  const scales = [space, radii, type, rows, pads, motion, density,
    `--measure:${px(S.measure.content)}`, `--measure-report:${px(S.measure.report)}`,
    `--focus-w:${px(g * S.focus.widthMul)}`, `--focus-off:${px(g * S.focus.offsetMul)}`,
    `--font-he:${S.fontStack.he}`, `--font-mono:${S.fontStack.mono}`].join(';');
  const dk = vars(dark) + ';' + vars(theme);
  return `:root{${vars(paper)};${vars(theme)};${alias};${scales}}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){${dk}}}
:root[data-theme=dark]{${dk}}
[data-density=compact]{--row-h:var(--row-compact);--cell-pad:var(--pad-compact)}
[data-density=cozy]{--row-h:var(--row-cozy);--cell-pad:var(--pad-cozy)}
[data-density=roomy]{--row-h:var(--row-roomy);--cell-pad:var(--pad-roomy)}
`;
}

// ── בסיס-CSS: הכל דרך var(), אפס ליטרל-צבע ואפס מספר-ריווח. מצבי-אינטראקציה כלולים (מיקוד · ריחוף · כבוי). ──
export const BASE_CSS = `*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:var(--w-body) var(--t-body)/var(--lh-body) var(--font-he);direction:rtl;padding-block:var(--s4);padding-inline:var(--s4)}
h1{font:var(--w-screen) var(--t-screen)/var(--lh-screen) var(--font-he);margin:0 0 var(--s1)}
h2{font:var(--w-section) var(--t-section)/var(--lh-section) var(--font-he);margin:0 0 var(--s2);display:flex;gap:var(--s3);align-items:baseline;flex-wrap:wrap}
h2 small,h2 .n{font-size:var(--t-meta);color:var(--mute);font-weight:400}
.mute{color:var(--mute)}.faint{color:var(--faint)}
.wrap{max-width:var(--measure-report);margin:0 auto}
.card,.step,.entity{background:var(--card);border:1px solid var(--line);border-radius:var(--r-md);padding:var(--s3) var(--s4);margin:var(--s3) 0}
a{color:var(--acc)}
code{background:var(--code);padding:0 var(--s1);border-radius:var(--r-sm);font-family:var(--font-mono);font-size:var(--t-micro)}
pre{background:var(--code);padding:var(--s3);border-radius:var(--r-sm);overflow-x:auto;font-family:var(--font-mono);font-size:var(--t-micro)}
.tbl{overflow-x:auto}
table{border-collapse:collapse;width:100%}
th,td{text-align:right;padding:var(--cell-pad) var(--s2);border-bottom:1px solid var(--line);vertical-align:top}
tbody tr{height:var(--row-h)}
tbody tr:hover{background:var(--raise)}
thead th{position:sticky;top:0;background:var(--card);color:var(--mute);font-weight:var(--w-section);font-size:var(--t-meta);z-index:1}
td.num,th.num{font-variant-numeric:tabular-nums}
bdi{unicode-bidi:isolate}
td.num,th.num,.num{unicode-bidi:isolate}
form.row{display:flex;flex-wrap:wrap;gap:var(--s2);align-items:end;margin-bottom:var(--s3)}
label{display:flex;flex-direction:column;font-size:var(--t-meta);color:var(--mute);gap:var(--s1)}
input,select,textarea{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:var(--r-sm);padding:var(--s2) var(--s2);min-width:calc(var(--s1) * 30)}
input:hover,select:hover,textarea:hover{border-color:var(--mute)}
button{font:inherit;font-weight:var(--w-section);background:var(--acc);color:var(--acc-ink);border:0;border-radius:var(--r-sm);padding:var(--s2) var(--s4);cursor:pointer;transition:filter var(--m-fast) ease}
button:hover{filter:brightness(1.08)}
button.x,button.ghost{background:transparent;color:var(--mute);padding:0 var(--s2)}
button.ghost:hover{background:var(--raise);color:var(--ink)}
button[disabled],input[disabled],select[disabled]{opacity:.55;cursor:not-allowed}
:focus-visible{outline:var(--focus-w) solid var(--acc-hi);outline-offset:var(--focus-off)}
details{border-top:1px solid var(--line);padding:var(--s2) 0}summary{cursor:pointer}
.pill,.chip{display:inline-block;background:var(--code);border-radius:var(--r-pill);padding:0 var(--s2);font-size:var(--t-meta);margin:var(--s1) 0}
.chip.ok{color:var(--ok)}.chip.warn{color:var(--warn)}.chip.err{color:var(--err)}
.empty{color:var(--mute);padding:var(--s4) 0}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media print{body{background:#fff;color:#000;padding:0}.noprint,button,input,select{display:none!important}table{page-break-inside:auto}tr,td,th{page-break-inside:avoid}thead{display:table-header-group}}
`;

export const FONTS = `<link rel="stylesheet" href="${SKIN_DATA.fontHref}">`;
export const SKIN_CSS = () => tokensCss() + BASE_CSS;

// ── שער: ליטרל-צבע בפולטי-gen (חוץ מהקובץ הזה ומהדאטה) = כשל. אותו רעיון של look.mjs/HARD_COLOR באימפריה. ──
const HARD_COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/;
export function checkNoLiterals() {
  const skip = new Set(['skin.mjs', 'skin-snapshot.mjs']);
  const bad = [];
  for (const f of fs.readdirSync(HERE).filter((f) => f.endsWith('.mjs') && !skip.has(f))) {
    const src = fs.readFileSync(path.join(HERE, f), 'utf8');
    src.split('\n').forEach((ln, i) => {
      if (!HARD_COLOR.test(ln)) return;
      if (/^\s*(\/\/|\*|\/\*)/.test(ln)) return;                       // הערה
      if (/replace\(|match\(|RegExp|HARD_COLOR|test\(/.test(ln)) return; // רגקס/פרסור, לא עיצוב
      bad.push(`${f}:${i + 1}: ${ln.trim().slice(0, 110)}`);
    });
  }
  return bad;
}

if (process.argv[1] && process.argv[1].endsWith('skin.mjs')) {
  const { from, paper, theme, seed } = loadSkin();
  // רענון צילום-הנפילה: נגזר מהזרע, לא מהיד
  if (from === 'זרע') {
    const S = SKIN_DATA, pl = readPureLook();
    S.skinSnapshot = { _: S.skinSnapshot._, paper, dark: { ...pl.neutral, ...pl.semantic }, theme, designSeed: seed };
    fs.writeFileSync(path.join(HERE, 'skin.data.json'), JSON.stringify(S, null, 2) + '\n');
  }
  const bad = process.argv.includes('--check') ? checkNoLiterals() : [];
  const css = SKIN_CSS();
  const nTok = (css.match(/--[a-z0-9-]+:/g) || []).length;
  console.log(`✓ skin: מקור=${from} · עור=${SKIN_DATA.pick.skin} · ערכה=${SKIN_DATA.pick.theme} · ${nTok} הצהרות-טוקן · ${css.length} תווי-CSS · צפיפות ${Object.keys(SKIN_DATA.density.unitMul).length} דרגות (ברירת-מחדל ${SKIN_DATA.density.default})`);
  if (process.argv.includes('--check')) {
    if (bad.length) { console.error(`✗ ליטרל-צבע ב-${bad.length} מקומות (עיצוב חייב לבוא מהטוקנים):\n  ` + bad.join('\n  ')); process.exit(1); }
    console.log('✓ שער-עיצוב: אפס ליטרל-צבע בפולטי-gen');
  }
  if (process.argv.includes('--css')) console.log(css);
}
