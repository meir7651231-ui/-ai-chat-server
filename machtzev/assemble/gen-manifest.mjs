#!/usr/bin/env node
/** 📋 מחצב · מנוע-המניפסטים (gen-manifest) — חוזה: GEN-MANIFEST-CONTRACT.md.
 *  לכל מסך: אילו אטומי-מדף מרכיבים אותו + חיווט כל prop ($:תוכן · @:פעולה · #:טוקן · ?:חור).
 *  שלם ⇒ manifests/ (המרכיב בונה) · עם-חורים ⇒ manifests-draft/. דטרמיניסטי.
 *  שימוש: node gen-manifest.mjs [screens-dir] */
import fs from 'node:fs';
import path from 'node:path';
import { classBody, stripComments, maskComments, snake, loopContext, parseCallArgs } from './lift-lib.mjs';
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
  const props = [...stripComments(body).matchAll(/final\s+((?:\([^)]*\)\??|[A-Za-z_][\w<>,?() ]*?))\s+([a-zA-Z_]\w*)\s*;/g)]
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
// v2 · תוצרי-הריצה-הקודמת של תוכן-מאתר-הקריאה (content2) נמחקים לפני-הסריקה — אידמפוטנטיות
if (fs.existsSync(CONTENT)) for (const f of fs.readdirSync(CONTENT)) if (f.endsWith('_content2.dart')) fs.unlinkSync(path.join(CONTENT, f));
const contentConsts = new Map(); // screen ⇒ Set(constName)
if (fs.existsSync(CONTENT)) for (const f of fs.readdirSync(CONTENT)) {
  const scr = f.replace('_content.dart', '');
  contentConsts.set(scr, new Set([...fs.readFileSync(path.join(CONTENT, f), 'utf8').matchAll(/const String (\w+) =/g)].map(x => x[1])));
}
// כל רשומות-התוכן בקובץ, כל אחת בגבולות-גופה שלה — לא רשומה-ראשונה עם שדות-כל-הקובץ
// (הבאג שנפל בקומפילציה-מלאה: chatSettingsScreenContent.leadingGlyph כשהשדה ברשומה אחרת)
const contentRecords = new Map(); // screen ⇒ [{rec, fields:Set}]
const contentRecordFile = new Map(); // screen ⇒ שם-קובץ-התוכן הידני
const DATA = path.join(ROOT, 'new/dart-data-bs');
for (const f of fs.readdirSync(DATA)) {
  if (!f.endsWith('_content.dart')) continue;
  const scr = f.replace('_content.dart', '');
  const src = fs.readFileSync(path.join(DATA, f), 'utf8');
  const recs = [];
  for (const rm of src.matchAll(/const (\w+) = \(/g)) {
    const end = src.indexOf('\n);', rm.index);
    const body = src.slice(rm.index, end === -1 ? src.length : end);
    recs.push({ rec: rm[1], fields: new Set([...body.matchAll(/(?:^|\n)\s{2}(\w+):/g)].map(x => x[1])) });
  }
  if (recs.length) contentRecords.set(scr, recs);
  if (recs.length) contentRecordFile.set(scr, f);
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
  const recs = contentRecords.get(screen) || [];
  // בחירת-הרשומה הנכונה לשדה: רשומה-על-שם-האטום ⇒ רשומה-יחידה-שמכילה ⇒ אין (חור-כן)
  const pickRec = (atom, field) => {
    const pref = atom[0].toLowerCase() + atom.slice(1) + 'Content';
    const hit = recs.find(r => r.rec === pref && r.fields.has(field));
    if (hit) return hit.rec;
    const all = recs.filter(r => r.fields.has(field));
    return all.length === 1 ? all[0].rec : null;
  };
  // רישום-callbacks ברמת-המסך: שם-חוזר עם טיפוס-שונה ⇒ שם-ממוספר (onChanged2) —
  // אחרת שדה-אחד-בקומפוזר משרת אטומים עם חתימות-שונות ולא-מתקמפל
  const cbReg = new Map(); // name ⇒ type
  const extraConsts = new Map(); // v2 · תוכן-מאתר-הקריאה: constName ⇒ ליטרל
  // 🔁 מנוע-ה-repeat: widget שמופע-בלולאה במקור ⇒ סקציית-repeat; prop תלוי-משתנה-הלולאה ⇒ פר-פריט (~:)
  const buildSection = (o, origName) => {
    const lc = loopContext(src, origName);
    const args = lc ? parseCallArgs(src, origName, Math.max(0, lc.callIndex - 2)) : null;
    const cs = args || parseCallArgs(src, origName, 0);   // אתר-הקריאה גם בלי-לולאה (לתוכן-ליטרלי)
    const props = {};
    for (const p of o.props) {
      const argE = args ? (args.named[p.name] ?? null) : null;
      if (lc && argE && new RegExp('\\b' + lc.as + '\\b').test(argE)) { props[p.name] = '~:'; continue; }
      const cn = snake(o.atom) + '_' + snake(p.name);
      const recName = p.type.startsWith('String') ? pickRec(o.atom, p.name) : null;
      if (consts.has(cn)) props[p.name] = '$: ' + cn;
      else if (recName) props[p.name] = '$: ' + recName + '.' + p.name;
      else if (isCb(p.type)) {
        let cn2 = p.name, i = 2;
        while (cbReg.has(cn2) && cbReg.get(cn2) !== p.type) cn2 = p.name + i++;
        cbReg.set(cn2, p.type);
        props[p.name] = '@:' + cn2 + (p.type === 'VoidCallback' ? '' : '|' + p.type);
      }
      else if (isTok(p.name, p.type)) props[p.name] = '#:' + p.name;
      else {
        // v2 · תוכן-מאתר-הקריאה: ליטרל-מחרוזת נקי (בלי אינטרפולציה) שהועבר לאטום במקור ⇒
        // קבוע-תוכן אוטומטי (content2) במקום חור — verbatim, אפס-המצאה
        const litE = p.type.startsWith('String') ? String(cs?.named[p.name] ?? '').trim() : '';
        if (/^'(?:[^'\\$]|\\.)*'$/.test(litE)) { extraConsts.set(cn, litE); props[p.name] = '$: ' + cn; }
        else { props[p.name] = '?:' + p.type; holes++; holeTypes.add(p.type); }
      }
    }
    const sec = { id: snake(o.atom), atom: o.atom, props };
    if (lc && Object.values(props).includes('~:')) sec.repeat = { as: lc.as, item: o.atom + 'Item' };
    return sec;
  };
  let holes = 0; const holeTypes = new Set(); const seenAtoms = new Set();
  for (const im of rootBody.matchAll(/\b(_?[A-Z]\w{2,})\s*\(/g)) {
    const n = im[1];
    if (n === root) continue;
    let o = origin.get(screen + ':' + n);
    if (!o) { const g = byWidgetName.get(n); if (g && new Set(g.map(x => x.atom)).size === 1) o = g[0]; }
    if (!o || seenAtoms.has(o.atom)) continue;
    seenAtoms.add(o.atom);
    sections.push(buildSection(o, n));
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
      sections.push(buildSection(o, n));
    }
  }
  if (!sections.length) {
    if (!names.length) report.notScreen.push(screen); else report.none.push(screen);
    continue;
  }

  const manifest = {
    generated: true,
    src: screen,
    screen: screen.replace(/^(screens|features)__/, '').replace(/__/g, '_'),
    ...(flat ? { flat: true } : {}),
    content: [...(consts.size ? ['auto/' + screen + '_content.dart'] : []), ...(extraConsts.size ? ['auto/' + screen + '_content2.dart'] : []), ...(recs.some(r => JSON.stringify(sections).includes(r.rec + '.')) ? [contentRecordFile.get(screen)] : [])],
    sections,
  };
  for (const t of holeTypes) report.holesByType[t] = (report.holesByType[t] || 0) + 1;
  const fname = screen + '.manifest.json';
  if (handWritten.has(manifest.screen + '.manifest.json')) continue;  // הפיילוט-הידני נשמר
  if (extraConsts.size) fs.writeFileSync(path.join(CONTENT, screen + '_content2.dart'),
    '// 📦 דאטה · תוכן-מאתר-הקריאה שהורם ע"י מנוע-המניפסטים (content2) — verbatim מהמקור, אל תערוך ידנית.\n' +
    [...extraConsts].map(([n, v]) => `const String ${n} = ${v};`).join('\n') + '\n');
  fs.writeFileSync(path.join(OUT_FULL, fname), JSON.stringify(manifest, null, 1));
  (holes || flat ? report.draft : report.full).push(holes || flat ? { screen, holes, ...(flat ? { flat: true } : {}) } : screen);
}

fs.writeFileSync(path.join(ROOT, 'screens-seed/gen-manifest-report.json'), JSON.stringify(report, null, 1));
console.log(`📋 מנוע-המניפסטים · שלמים: ${report.full.length} ⇒ manifests/ · טיוטות: ${report.draft.length} (${report.draft.filter(d => d.flat).length} שטוחות) ⇒ manifests-draft/ · בלי-אטומים: ${report.none.length} · לא-מסך (אפס-מחלקות): ${report.notScreen.length}`);
const ht = Object.entries(report.holesByType).sort((a, b) => b[1] - a[1]).slice(0, 6);
if (ht.length) console.log('   חורים-לפי-טיפוס (נתוני-ריצה ללוח): ' + ht.map(([t, n]) => t + ':' + n).join(' · '));
