// 🧪 display-synth — סינתזת-תצוגה מיסודות (הכרעת-בעלים 23.9 «בסרט, הכל קיים» ⇒ «תחבר»): חיבור של שלושה מנועים קיימים, אפס מנוע חדש.
//   · synth (המתודה): חיפוש הרכבות עד עומק חסום, הצלחה = הוכחה, כישלון = דוח כן.
//   · ds-forge.forgeCell (היסודות): תא-Pure (קופסה · טקסט · שורה/עמודה · נקודה · אייקון · גוון) ⇒ אטום-Dart לובש-עור + רשומת-אותות-צורה.
//   · auto-skin.fits/score (המדד): הצורה מגשימה את התפקיד? — אותו מודד שפוסק על 923 האטומים.
//   כשלפעולה אין אטום מדוד-חיובי, insight מבקש כאן הרכבה לתפקיד: המרחב = הרכבות של יסודות-Pure (אוצר-המילים של machtzev/pure: var(--…), .nb, .tone-*),
//   כל הרכבה נחצבת ל-Dart ונמדדת; הטובה-מעל-אפס חוזרת כאטום-מועמד ועולה לפסק כמו כולם. אפס שם-אטום בניקוד, אפס דעה: המדד הוא auto-skin.
//   הפלט = קובץ בתיקיית-הפלט (לא במדף); רישום למדף = פקודת-בעלים (composites --register).
//   שימוש: node machtzev/generator/display-synth.mjs <role> [--show]   · API: synthDisplay({ role, need }) ⇒ { cls, file, src, atom, score, tried, ms } | null
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { forgeCell, parseStyle, PURE, pascal } from '../ds-forge.mjs';
import { fits, score, ROLES } from './auto-skin.mjs';
const GEN = path.dirname(fileURLToPath(import.meta.url));
let MAP = null;
// מפת-ה-CSS: רק המשפחות שהיסודות משתמשים במחלקות שלהן (.nb/.dt/.nbt ⇐ feedback); מיזוג של חמש משפחות דרס את .nb ⇒ הפריט ירד לטקסט-בלי-קופסה
const MAPS = {};   // לכל משפחה מפה משלה: המשפחה של התפקיד ⇐ card ⇐ feedback (המחלקות שהיסודות משתמשים בהן, .nb/.dt/.nbt, גוברות) — מיזוג-על-הכל דרס אותן (הבאג הקודם)
const cssMapOf = (fam) => { if (MAPS[fam]) return MAPS[fam]; const map = {}; for (const x of [...new Set([fam, 'card', 'feedback'])]) { const f = path.join(PURE, `${x}-family.html`); if (!fs.existsSync(f)) continue; const m = fs.readFileSync(f, 'utf8').match(/<style>([\s\S]*?)<\/style>/); if (m) Object.assign(map, parseStyle(m[1])); } return (MAPS[fam] = map); };
const cssMap = () => cssMapOf('card');
const sh = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 6);

// ── יסודות (צורה בלבד) ──
const box = (dir, decorated, inner, extra = '') => `<div style="display:flex;flex-direction:${dir};gap:6px;padding:14px 16px;border-radius:14px;${decorated ? 'background:var(--surface);border:1px solid var(--hair);' : ''}${extra}">${inner}</div>`;
const text = (demo, fs, fw, tone = 'ink') => `<span style="font-size:${fs}px;font-weight:${fw};color:var(--${tone})">${demo}</span>`;
const dot = (tone) => `<span style="display:inline-block;width:8px;height:8px;border-radius:999px;background:var(--${tone})"></span>`;
const btn = (inner) => `<button style="display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:12px;background:var(--a);color:var(--on-a);border:0">${inner}</button>`;
const link = (inner) => `<a style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:var(--surface);border:1px solid var(--hair)">${inner}</a>`;
const icon = () => `<svg viewBox="0 0 24 24" style="width:16px;height:16px"><circle cx="12" cy="12" r="9" fill="none" stroke="var(--mut)" stroke-width="2"/></svg>`;
const product = (...lists) => lists.reduce((acc, l) => acc.flatMap((a) => l.map((b) => [...a, b])), [[]]);

// ── מרחב-החיפוש לפי צורת-הצורך (ROLES[role].need), לא לפי שם-התפקיד ──
// רמזי-המטרה (צורה): tap = המטרה דורשת הקשה ⇒ שורש role=button (ds-forge ⇒ onAction) · state = סף במקור ⇒ ארבעה פריטי-גוון (Pure .nb.tone-*) ⇒ חור-variants
const TONES = ['info', 'ok', 'warn', 'err'];
const toned = (inner) => TONES.map((t) => `<div class="nb tone-${t}"><span class="dt"></span>${inner}</div>`).join('');
const tapRoot = (inner, dir = 'column') => `<div role="button" tabindex="0" style="display:flex;flex-direction:${dir};gap:6px">${inner}</div>`;
export function candidatesFor(role, hints = {}) {
  const R = ROLES[role]; if (!R) return [];
  const out = [];
  if (R.need === 'value+label') {
    for (const [dir, dec, lfs, lfw, vfs, vfw, first] of product(['column', 'row'], [true, false], [11, 12.5, 14], [600, 700], [16, 20, 24, 30, 36], [700, 800, 900], ['label', 'value']))
      { const L = text('Label', lfs, lfw, 'mut'), V = text('248', vfs, vfw, 'ink'); const inner = first === 'label' ? L + V : V + L;
        if (hints.state) { if (dir === 'row') out.push(tapRoot(toned(inner))); }   // מצב ⇒ פריטי-גוון (השורה היא הפריט; השורש לחיץ)
        else out.push(hints.tap ? tapRoot(box(dir, dec, inner)) : box(dir, dec, inner)); }
  } else if (R.need === 'text2') {
    for (const [dir, dec, tone, withDot, fs1, fs2] of product(['row', 'column'], [true, false], ['a', 'ok', 'warn', 'err'], [true, false], [12.5, 14, 15], [11, 12.5]))
      out.push(R.fam && R.fam.includes('nav') && !withDot ? link(icon() + text('Label', fs1, 600) + text('Label', fs2, 400, 'mut')) : box(dir, dec, (withDot ? dot(tone) : '') + text('Label', fs1, 600) + text('Label', fs2, 400, 'mut'), withDot ? `border-color:var(--${tone});` : ''));
  } else if (R.need === 'value+values') {
    for (const [dec, lfs, vfs, vfw, h] of product([true, false], [11, 12.5], [12, 14, 16], [600, 700], [4, 6, 8]))
      out.push(box('column', dec, `<div style="display:flex;justify-content:space-between">${text('Label', lfs, 600, 'mut')}${text('72%', vfs, vfw, 'ink')}</div><div style="height:${h}px;border-radius:999px;background:var(--raised2)"><div style="width:72%;height:${h}px;border-radius:999px;background:var(--a)"></div></div>`));
  } else if (R.need === 'text1') {
    for (const [fs, fw, withIcon] of product([12.5, 14, 15], [600, 700], [true, false])) out.push(R.fam && R.fam.includes('action') ? btn((withIcon ? icon() : '') + text('Label', fs, fw, 'on-a')) : box('row', true, (withIcon ? dot('a') : '') + text('Label', fs, fw)));
  } else if (R.need === 'child+text1') {
    for (const [fs, fw] of product([15, 18, 22], [600, 700])) out.push(box('column', true, text('Label', fs, fw)));
  }
  return out;
}

/** חיפוש: כל מועמד נחצב (ds-forge) ונמדד (auto-skin); הטוב-ביותר מעל אפס חוזר. */
export function synthDisplay({ role, need = [], limit = 2000, floor = 0, hints = {} } = {}) {   // floor = הציון של הטוב-הקיים; ההרכבה חייבת לעלות עליו (אין קיים ⇒ הקורא נותן −∞: הרכבה מתאימה עדיפה על «אין»)
  const R = ROLES[role]; if (!R) return null;
  const t0 = Date.now(); const fam = (R.fam || ['card'])[0]; const map = cssMapOf(fam);
  let best = null, tried = 0, fitN = 0;
  for (const html of candidatesFor(role, hints).slice(0, limit)) {
    tried++;
    const cls = `Synth${pascal(role)}${sh(html)}`; const file = `synth_${role}_${sh(html)}.dart`;
    let r; try { r = forgeCell({ name: `${role} ${sh(html)}`, seam: 'fields', body: html }, fam, map, cls, file); } catch { continue; }
    const a = { ...r.atom, family: fam, cls, file };
    if (!fits(a, R)) continue; fitN++;
    const sc = score(role, a); if (sc == null) continue;
    if (!best || sc > best.score) best = { cls, file, html, atom: a, score: sc, src: r.src.replace("import '../../dart-ui-bs/ds/ds_seam.dart';", "import '../dart-ui-bs/ds/ds_seam.dart';") };
  }
  const ms = Date.now() - t0;
  if (!best || !(best.score > floor)) return { cls: null, role, tried, fit: fitN, best: best ? best.score : null, ms, why: best ? `הטוב ${best.score.toFixed(1)} ≤ ${Number.isFinite(floor) ? floor.toFixed(1) : '−∞'}${floor === 0 ? '' : ' (הקיים)'}` : `אף הרכבה מ-${tried} לא מקיימת ${R.need}` };
  return { ...best, role, tried, fit: fitN, ms };
}
/** רשומת-ווידג׳ט (בצורת האטלס) לאטום מסונתז — השקעים מהרשומה האמיתית של ds-forge, לא מהנחה. */
export function widgetRecordOf(sy, file) {
  const a = sy.atom; const types = [['fields', 'List<String>?'], ['child', 'Widget?']];
  if (a.actions > 0) types.push(['onAction', 'void Function(int)?']);
  if (a.items && a.items.slots) { types.push(['items', 'List<List<String>>?']); if (a.items.variants) types.push(['variants', 'List<int>?']); if (a.items.selectable) types.push(['onSelect', 'void Function(int)?']); }
  if (a.values > 0) types.push(['values', 'List<double>?']);
  if (a.columns) types.push(['columns', 'List<String>?']);
  return { cls: sy.cls, file, shelf: 'synth', types: new Map(types), required: new Set(), positional: [], flexRoot: false, he: [] };
}
// ── רישום (פקודת-בעלים): אטומים מסונתזים מתיקיית-פלט ⇒ מדף new/dart-synth-bs + synth-manifest.json (רשומת-אותות + תפקיד + ציון + מקור).
//   מרגע הרישום הם באטלס (נייר), במניפסט של הפסק ובמועמדי-התפקיד (forgeCands) — הרכבה שנולדה פעם היא אטום-מדף בפעם הבאה.
const SYNTH_SHELF = path.resolve(GEN, '../../new/dart-synth-bs'); const SYNTH_MAN = path.join(SYNTH_SHELF, 'synth-manifest.json');
export const readSynthManifest = () => { try { return JSON.parse(fs.readFileSync(SYNTH_MAN, 'utf8')).atoms || []; } catch { return []; } };
export function sidecarOf(sy, from) { return { cls: sy.cls, role: sy.role, score: sy.score, tried: sy.tried, html: sy.html, atom: sy.atom, from }; }
export function registerSynth(outDir) {
  const done = [];
  for (const f of fs.readdirSync(outDir).filter((x) => /^gen_synth_.*\.json$/.test(x))) {
    const sc = JSON.parse(fs.readFileSync(path.join(outDir, f), 'utf8')); const dart = path.join(outDir, f.replace(/\.json$/, '.dart')); if (!fs.existsSync(dart)) continue;
    fs.mkdirSync(SYNTH_SHELF, { recursive: true }); const file = `${sc.cls.toLowerCase()}.dart`;
    fs.writeFileSync(path.join(SYNTH_SHELF, file), fs.readFileSync(dart, 'utf8'));
    const cur = readSynthManifest().filter((a) => a.cls !== sc.cls);
    cur.push({ ...sc.atom, cls: sc.cls, file, role: sc.role, score: sc.score, html: sc.html, from: sc.from || null, registeredAt: new Date().toISOString() });
    fs.writeFileSync(SYNTH_MAN, JSON.stringify({ _: 'אטומי-תצוגה שנולדו בסינתזה ונרשמו בפקודת-בעלים (display-synth --register). רשומת-אותות בצורת forge-manifest + תפקיד + ציון + המשפט שהוליד.', atoms: cur }, null, 1) + '\n');
    done.push(sc.cls);
  }
  return done;
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain && process.argv.includes('--register')) { const dir = process.argv[process.argv.indexOf('--register') + 1]; const d = registerSynth(dir); console.log(`📌 display-synth: נרשמו ${d.length} אטומים מסונתזים למדף new/dart-synth-bs: ${d.join(', ') || '—'}`); process.exit(0); }
if (isMain) {
  const role = process.argv[2] || 'kpi'; const r = synthDisplay({ role });
  if (!r || !r.cls) { console.log(`🧪 display-synth ${role}: אין — ${r ? r.why : 'תפקיד לא מוכר'} (${r ? r.tried : 0} הרכבות · ${r ? r.ms : 0}ms)`); process.exit(1); }
  console.log(`🧪 display-synth ${role}: ${r.cls} · ציון ${r.score.toFixed(2)} · ${r.fit}/${r.tried} מתאימות · ${r.ms}ms · numEmph ${r.atom.sig.numEmph} · חריצים ${r.atom.fieldDemo.join('/')}`);
  if (process.argv.includes('--show')) { console.log(r.html); console.log(r.src); }
}
