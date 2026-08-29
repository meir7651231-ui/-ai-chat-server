#!/usr/bin/env node
/** 📋 מחצב · מנוע-המניפסטים (gen-manifest) — חוזה: GEN-MANIFEST-CONTRACT.md.
 *  לכל מסך: אילו אטומי-מדף מרכיבים אותו + חיווט כל prop ($:תוכן · @:פעולה · #:טוקן · ?:חור).
 *  שלם ⇒ manifests/ (המרכיב בונה) · עם-חורים ⇒ manifests-draft/. דטרמיניסטי.
 *  שימוש: node gen-manifest.mjs [screens-dir] */
import fs from 'node:fs';
import path from 'node:path';
import { classBody, stripComments, maskComments, snake } from './lift-lib.mjs';
const ROOT = new URL('../../', import.meta.url).pathname;
const SCRATCH = process.argv[2] || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/all-screens';
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const CONTENT = path.join(ROOT, 'new/dart-data-bs/auto');
const OUT_FULL = path.join(ROOT, 'screens-seed/manifests');
const OUT_DRAFT = path.join(ROOT, 'screens-seed/manifests-draft');

// ── אינדקס-המוצא: מסך:Widget ⇒ {atom, file, props:[{name,type}]} ──
const origin = new Map();
for (const f of fs.readdirSync(SHELF, { recursive: true }).map(String)) {
  const p = path.join(SHELF, f);
  if (!f.endsWith('.dart') || !fs.statSync(p).isFile()) continue;
  const src = fs.readFileSync(p, 'utf8');
  const cm = src.match(/class\s+([A-Za-z0-9]+)\s+extends\s+StatefulWidget|class\s+([A-Za-z0-9]+)\s+extends\s+StatelessWidget/);
  if (!cm) continue;
  const atom = cm[1] || cm[2];
  const body = classBody(src, cm.index) || '';
  const props = [...stripComments(body).matchAll(/final\s+([A-Za-z_][\w<>,? ]*?)\s+([a-zA-Z_]\w*)\s*;/g)]
    .map(x => ({ name: x[2], type: x[1].trim() }));
  const ids = [];
  const om = src.match(/\/\/ מוצא: ([\w:]+)/); if (om) ids.push(om[1]);
  const sm = src.match(/\/\/ משרת-גם[^:]*: ([^\n]+)/);
  if (sm) for (const x of sm[1].split('·')) { const t = x.trim().replace(/\s.*$/, ''); if (t.includes(':')) ids.push(t); }
  for (const id of ids) if (!origin.has(id)) origin.set(id, { atom, file: f, props });
}

// ── קבועי-התוכן פר-מסך ──
const contentConsts = new Map(); // screen ⇒ Set(constName)
if (fs.existsSync(CONTENT)) for (const f of fs.readdirSync(CONTENT)) {
  const scr = f.replace('_content.dart', '');
  contentConsts.set(scr, new Set([...fs.readFileSync(path.join(CONTENT, f), 'utf8').matchAll(/const String (\w+) =/g)].map(x => x[1])));
}

const isCb = (t) => /VoidCallback|ValueChanged|Function/.test(t);
const isTok = (n, t) => t.replace(/\?$/, '') === 'Color' || (/^double$/.test(t.replace(/\?$/, '')) && /radius|size|width|height|space|pill|gap/i.test(n));

// ── המעבר על המסכים ──
fs.rmSync(OUT_DRAFT, { recursive: true, force: true });
fs.mkdirSync(OUT_FULL, { recursive: true });
fs.mkdirSync(OUT_DRAFT, { recursive: true });
// מניפסטים-ידניים (הפיילוט) לא נדרסים
const handWritten = new Set(fs.readdirSync(OUT_FULL));
const report = { full: [], draft: [], none: [], holesByType: {} };
for (const mf of fs.readdirSync(path.join(ROOT, 'screens-seed/machine')).filter(f => f.endsWith('.json')).sort()) {
  const screen = mf.replace('.json', '');
  const srcPath = path.join(SCRATCH, screen + '.dart');
  if (!fs.existsSync(srcPath)) continue;
  const src = fs.readFileSync(srcPath, 'utf8');

  // מיפוי widget-בקובץ ⇒ אטום-מדף
  const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'screens-seed/machine', mf), 'utf8'));
  const names = (map.widgets || []).map(w => w.name);
  const onShelf = new Map();
  for (const n of names) { const o = origin.get(screen + ':' + n); if (o) onShelf.set(n, o); }
  if (!onShelf.size) { report.none.push(screen); continue; }

  // מחלקת-השורש: in-degree 0 בגרף-המופעים בקובץ
  const bodies = new Map();
  for (const n of names) {
    const d = src.match(new RegExp('class\\s+' + n + '\\b'));
    if (d) bodies.set(n, classBody(src, d.index) || '');
  }
  const inDeg = new Map(names.map(n => [n, 0]));
  for (const [n, b] of bodies) for (const m of names) if (m !== n && new RegExp('\\b' + m + '\\s*\\(').test(stripComments(b))) inDeg.set(m, (inDeg.get(m) || 0) + 1);
  const roots = names.filter(n => !inDeg.get(n) && bodies.get(n));
  const root = roots.find(n => /Screen$|Tab$|Sheet$|Shell$/.test(n)) || roots[0] || names[0];
  const rootBody = maskComments(bodies.get(root) || '');

  // סקציות: אטומי-מדף שמופעים בגוף-השורש, בסדר-מופע-ראשון
  const sections = [];
  const consts = contentConsts.get(screen) || new Set();
  let holes = 0; const holeTypes = new Set();
  for (const [n, o] of [...onShelf].sort((a, b) => {
    const ia = rootBody.search(new RegExp('\\b' + a[0].replace(/^_/, '') + '\\b|\\b' + a[0] + '\\b'));
    const ib = rootBody.search(new RegExp('\\b' + b[0].replace(/^_/, '') + '\\b|\\b' + b[0] + '\\b'));
    return (ia < 0 ? 1e9 : ia) - (ib < 0 ? 1e9 : ib);
  })) {
    if (n === root) continue;
    if (!new RegExp('\\b' + n + '\\s*\\(').test(rootBody)) continue;   // מקונן ⇒ לא-סקציה
    const props = {};
    for (const p of o.props) {
      const cn = snake(o.atom) + '_' + snake(p.name);
      if (consts.has(cn)) props[p.name] = '$: ' + cn;
      else if (isCb(p.type)) props[p.name] = '@:' + p.name;
      else if (isTok(p.name, p.type)) props[p.name] = '#:' + p.name;
      else { props[p.name] = '?:' + p.type; holes++; holeTypes.add(p.type); }
    }
    sections.push({ id: snake(o.atom), atom: o.atom, props });
  }
  if (!sections.length) { report.none.push(screen); continue; }

  const manifest = {
    screen: screen.replace(/^(screens|features)__/, '').replace(/__/g, '_'),
    content: consts.size ? ['auto/' + screen + '_content.dart'] : [],
    sections,
  };
  for (const t of holeTypes) report.holesByType[t] = (report.holesByType[t] || 0) + 1;
  const fname = screen + '.manifest.json';
  if (!holes) {
    if (handWritten.has(manifest.screen + '.manifest.json')) continue;  // הפיילוט-הידני נשמר
    fs.writeFileSync(path.join(OUT_FULL, fname), JSON.stringify(manifest, null, 1));
    report.full.push(screen);
  } else {
    fs.writeFileSync(path.join(OUT_DRAFT, fname.replace('.json', '.draft.json')), JSON.stringify(manifest, null, 1));
    report.draft.push({ screen, holes });
  }
}

fs.writeFileSync(path.join(ROOT, 'screens-seed/gen-manifest-report.json'), JSON.stringify(report, null, 1));
console.log(`📋 מנוע-המניפסטים · שלמים: ${report.full.length} ⇒ manifests/ · טיוטות-עם-חורים: ${report.draft.length} ⇒ manifests-draft/ · בלי-אטומים-עדיין: ${report.none.length}`);
const ht = Object.entries(report.holesByType).sort((a, b) => b[1] - a[1]).slice(0, 6);
if (ht.length) console.log('   חורים-לפי-טיפוס (נתוני-ריצה ללוח): ' + ht.map(([t, n]) => t + ':' + n).join(' · '));
