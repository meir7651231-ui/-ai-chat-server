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

// ── אינדקס-המוצא: מסך:Widget ⇒ {atom, file, props} — שני פורמטי-תעודה + דוחות ──
const origin = new Map(); const byWidgetName = new Map(); // שם-widget ⇒ [entries]
const classByName = new Map();
for (const f of fs.readdirSync(SHELF, { recursive: true }).map(String)) {
  const p = path.join(SHELF, f);
  if (!f.endsWith('.dart') || !fs.statSync(p).isFile() || f.endsWith('wiring_notes.dart')) continue;
  const src = fs.readFileSync(p, 'utf8');
  const cm = src.match(/class\s+([A-Za-z0-9]+)\s+extends\s+(StatefulWidget|StatelessWidget)/);
  if (!cm) continue;
  const atom = cm[1];
  const body = classBody(src, cm.index) || '';
  const props = [...stripComments(body).matchAll(/final\s+([A-Za-z_][\w<>,? ]*?)\s+([a-zA-Z_]\w*)\s*;/g)]
    .map(x => ({ name: x[2], type: x[1].trim() }));
  const entry = { atom, file: f, props };
  classByName.set(atom, entry);
  const ids = [];
  const om = src.match(/\/\/ מוצא: ([\w:]+) /); if (om && om[1].includes(':')) ids.push(om[1]);
  const om2 = src.match(/\/\/ מוצא: (\w+)\.dart[^\n]*?·\s*(_?[A-Za-z0-9]+)/); if (om2) ids.push(om2[1] + ':' + om2[2]);
  const sm = src.match(/\/\/ משרת-גם[^:]*: ([^\n]+)/);
  if (sm) for (const x of sm[1].split('·')) { const t = x.trim().replace(/\s.*$/, ''); if (t.includes(':')) ids.push(t); }
  for (const id of ids) {
    if (!origin.has(id)) origin.set(id, entry);
    const wn = id.split(':')[1];
    (byWidgetName.get(wn) ?? byWidgetName.set(wn, []).get(wn)).push(entry);
  }
}
// דוחות: מיפויי 'כבר-במדף' (id⇒Atom) מרחיבים את המוצא
for (const rf of ['shelf-lift-report.json', 'data-lift-report.json']) {
  try {
    const rep = JSON.parse(fs.readFileSync(path.join(ROOT, 'screens-seed', rf), 'utf8'));
    for (const e of rep.skipped?.['already-on-shelf'] || []) {
      const mm = e.match(/^([\w:]+)⇒(\w+)$/);
      if (mm && classByName.has(mm[2]) && !origin.has(mm[1])) {
        origin.set(mm[1], classByName.get(mm[2]));
        const wn = mm[1].split(':')[1];
        (byWidgetName.get(wn) ?? byWidgetName.set(wn, []).get(wn)).push(classByName.get(mm[2]));
      }
    }
  } catch { }
}

// ── קבועי-התוכן פר-מסך (מנוע: auto/ שטוח · נחיל: records סמנטיים) ──
const contentConsts = new Map(); // screen ⇒ Set(constName)
if (fs.existsSync(CONTENT)) for (const f of fs.readdirSync(CONTENT)) {
  const scr = f.replace('_content.dart', '');
  contentConsts.set(scr, new Set([...fs.readFileSync(path.join(CONTENT, f), 'utf8').matchAll(/const String (\w+) =/g)].map(x => x[1])));
}
const contentRecords = new Map(); // screen ⇒ {file, rec, fields:Set}
const DATA = path.join(ROOT, 'new/dart-data-bs');
for (const f of fs.readdirSync(DATA)) {
  if (!f.endsWith('_content.dart')) continue;
  const scr = f.replace('_content.dart', '');
  const src = fs.readFileSync(path.join(DATA, f), 'utf8');
  const rm = src.match(/const (\w+) = \(/);
  if (!rm) continue;
  const body = src.slice(rm.index);
  const fields = new Set([...body.matchAll(/(?:^|\n)\s{2}(\w+):/g)].map(x => x[1]));
  contentRecords.set(scr, { file: f, rec: rm[1], fields });
}

const isCb = (t) => /VoidCallback|ValueChanged|Function/.test(t);
const isTok = (n, t) => t.replace(/\?$/, '') === 'Color' || (/^double$/.test(t.replace(/\?$/, '')) && /radius|size|width|height|space|pill|gap/i.test(n));

// ── המעבר על המסכים ──
fs.rmSync(OUT_DRAFT, { recursive: true, force: true });
fs.mkdirSync(OUT_FULL, { recursive: true });
fs.mkdirSync(OUT_DRAFT, { recursive: true });
// מניפסטים-מחוללים מריצה-קודמת נמחקים; ידניים (בלי generated:true) נשמרים
for (const f of fs.readdirSync(OUT_FULL)) {
  try { if (JSON.parse(fs.readFileSync(path.join(OUT_FULL, f), 'utf8')).generated) fs.unlinkSync(path.join(OUT_FULL, f)); } catch { }
}
const handWritten = new Set(fs.readdirSync(OUT_FULL));
const report = { full: [], draft: [], none: [], notScreen: [], holesByType: {} };
for (const mf of fs.readdirSync(path.join(ROOT, 'screens-seed/machine')).filter(f => f.endsWith('.json')).sort()) {
  const screen = mf.replace('.json', '');
  const srcPath = path.join(SCRATCH, screen + '.dart');
  if (!fs.existsSync(srcPath)) continue;
  const src = fs.readFileSync(srcPath, 'utf8');

  const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'screens-seed/machine', mf), 'utf8'));
  const names = (map.widgets || []).map(w => w.name);

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

  // סקציות: כל מופע-מחלקה בגוף-השורש, בסדר-המקור; פתרון: אותו-קובץ ⇒ מוצא · אחרת שם-ייחודי-גלובלי
  const sections = [];
  const consts = contentConsts.get(screen) || new Set();
  const rec = contentRecords.get(screen);
  let holes = 0; const holeTypes = new Set(); const seenAtoms = new Set();
  for (const im of rootBody.matchAll(/\b(_?[A-Z]\w{2,})\s*\(/g)) {
    const n = im[1];
    if (n === root) continue;
    let o = origin.get(screen + ':' + n);
    if (!o) { const g = byWidgetName.get(n); if (g && new Set(g.map(x => x.atom)).size === 1) o = g[0]; }
    if (!o || seenAtoms.has(o.atom)) continue;
    seenAtoms.add(o.atom);
    const props = {};
    for (const p of o.props) {
      const cn = snake(o.atom) + '_' + snake(p.name);
      if (consts.has(cn)) props[p.name] = '$: ' + cn;
      else if (rec && rec.fields.has(p.name) && p.type.startsWith('String')) props[p.name] = '$: ' + rec.rec + '.' + p.name;
      else if (isCb(p.type)) props[p.name] = '@:' + p.name;
      else if (isTok(p.name, p.type)) props[p.name] = '#:' + p.name;
      else { props[p.name] = '?:' + p.type; holes++; holeTypes.add(p.type); }
    }
    sections.push({ id: snake(o.atom), atom: o.atom, props });
  }
  let flat = false;
  if (!sections.length) {
    // ‏fallback עמוק: אטומי-מדף שמופעים בכל-הקובץ (מקוננים) — טיוטה-שטוחה, הלוח יקבע מבנה
    for (const im of maskComments(src).matchAll(/\b(_?[A-Z]\w{2,})\s*\(/g)) {
      const n = im[1];
      let o = origin.get(screen + ':' + n);
      if (!o) { const g = byWidgetName.get(n); if (g && new Set(g.map(x => x.atom)).size === 1) o = g[0]; }
      if (!o || seenAtoms.has(o.atom)) continue;
      seenAtoms.add(o.atom); flat = true;
      const props = {};
      for (const p of o.props) {
        const cn = snake(o.atom) + '_' + snake(p.name);
        if (consts.has(cn)) props[p.name] = '$: ' + cn;
        else if (rec && rec.fields.has(p.name) && p.type.startsWith('String')) props[p.name] = '$: ' + rec.rec + '.' + p.name;
        else if (isCb(p.type)) props[p.name] = '@:' + p.name;
        else if (isTok(p.name, p.type)) props[p.name] = '#:' + p.name;
        else { props[p.name] = '?:' + p.type; holes++; holeTypes.add(p.type); }
      }
      sections.push({ id: snake(o.atom), atom: o.atom, props });
    }
  }
  if (!sections.length) {
    if (!names.length) report.notScreen.push(screen); else report.none.push(screen);
    continue;
  }

  const manifest = {
    generated: true,
    screen: screen.replace(/^(screens|features)__/, '').replace(/__/g, '_'),
    ...(flat ? { flat: true } : {}),
    content: [...(consts.size ? ['auto/' + screen + '_content.dart'] : []), ...(rec && JSON.stringify(sections).includes(rec.rec + '.') ? [rec.file] : [])],
    sections,
  };
  for (const t of holeTypes) report.holesByType[t] = (report.holesByType[t] || 0) + 1;
  const fname = screen + '.manifest.json';
  if (!holes && !flat) {
    if (handWritten.has(manifest.screen + '.manifest.json')) continue;  // הפיילוט-הידני נשמר
    fs.writeFileSync(path.join(OUT_FULL, fname), JSON.stringify(manifest, null, 1));
    report.full.push(screen);
  } else {
    fs.writeFileSync(path.join(OUT_DRAFT, fname.replace('.json', '.draft.json')), JSON.stringify(manifest, null, 1));
    report.draft.push({ screen, holes, ...(flat ? { flat: true } : {}) });
  }
}

fs.writeFileSync(path.join(ROOT, 'screens-seed/gen-manifest-report.json'), JSON.stringify(report, null, 1));
console.log(`📋 מנוע-המניפסטים · שלמים: ${report.full.length} ⇒ manifests/ · טיוטות: ${report.draft.length} (${report.draft.filter(d => d.flat).length} שטוחות) ⇒ manifests-draft/ · בלי-אטומים: ${report.none.length} · לא-מסך (אפס-מחלקות): ${report.notScreen.length}`);
const ht = Object.entries(report.holesByType).sort((a, b) => b[1] - a[1]).slice(0, 6);
if (ht.length) console.log('   חורים-לפי-טיפוס (נתוני-ריצה ללוח): ' + ht.map(([t, n]) => t + ':' + n).join(' · '));
