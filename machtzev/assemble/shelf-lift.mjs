#!/usr/bin/env node
/** 🛗 מחצב · מנוע-המדף v2 (shelf-lift) — חוזה: SHELF-LIFT-CONTRACT.md.
 *  מרים למדף, בלי-סוכן, widgets נקיים העומדים-ברשות-עצמם. v2 מוסיף:
 *  זוגות-Stateful · שמות-מסוייגים (התנגשות) · צרירת-עוזרים-פרטיים · צרירת-אחים ·
 *  היקש-imports דטרמיניסטי. כל ספק ⇒ דחייה-מנומקת. דטרמיניסטי.
 *  שימוש: node shelf-lift.mjs [screens-dir] */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { okType, inferImports, classBody, stripComments, HEB_STR, IO_PAT, RIVERPOD, blind, snake, screenPascal, bodyIssue, FOUNDATION, FOUNDATION_FN } from './lift-lib.mjs';
const ROOT = new URL('../../', import.meta.url).pathname;
const SCRATCH = process.argv[2] || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/all-screens';
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const OUT = path.join(SHELF, 'auto');
const MACHINE = path.join(ROOT, 'screens-seed/machine');




// ── קטלוג-הפיגמנטים: BsTokens מהמקור-החי ⇒ אטום-דאטה במדף (שכבה-0) ──
import { execSync } from 'node:child_process';
const BS = '/home/user/buildsmart';
fs.rmSync(OUT, { recursive: true, force: true });
let hasTokensAtom = false;
try {
  const tok = execSync("git show origin/main:app_flutter/lib/theme/tokens.dart", { cwd: BS, encoding: 'utf8' });
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'bs_tokens.dart'),
    `// 🛗 אטום-דאטה · קטלוג-הפיגמנטים (BsTokens) — הורם verbatim מהמקור-החי ע"י shelf-lift.\n// מוצא: app_flutter/lib/theme/tokens.dart (בנייה-חכמה main). שכבה-0 של פירוק-המסכים.\n${tok}`);
  hasTokensAtom = true;
} catch { /* אין clone ⇒ אטומים-תלויי-BsTokens יידחו */ }

// ── אינדקס-מחלקות-הפרויקט: ref למחלקה-פרויקטלית שאינה-בצרור ⇒ לא-עצמאי ──
let projectClasses = new Set();
try {
  projectClasses = new Set([...execSync("git grep -h -E 'class [A-Za-z0-9_]+' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 })
    .matchAll(/class\s+([A-Za-z0-9_]+)/g)].map(x => x[1]));
  projectClasses.delete('BsTokens'); // מכוסה ע"י אטום-הפיגמנטים
} catch { /* בלי אינדקס — שער-האחים עדיין פעיל */ }
let projectFns = new Set();
try {
  projectFns = new Set([...execSync("git grep -hE '^[A-Za-z][A-Za-z_<>,? ]+ [a-z][a-zA-Z0-9]+\\(' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 })
    .matchAll(/ ([a-z]\w+)\(/g)].map(x => x[1]));
} catch { }
const externalFn = (code) => {
  for (const m of new Set([...code.matchAll(/\b([a-z]\w+)\s*\(/g)].map(x => x[1]))) {
    if (!projectFns.has(m) || FOUNDATION_FN.has(m)) continue;
    if (new RegExp('(\\n|^)\\s*[A-Za-z_][\\w<>,? ]* ' + m + '\\(').test(code)) continue;
    return m;
  }
  return null;
};

// ── מלאי-המדף הקיים ──
const shelfNames = new Set(); const shelfHashes = new Map();
for (const f of fs.readdirSync(SHELF, { recursive: true }).map(String)) {
  const p = path.join(SHELF, f);
  if (!f.endsWith('.dart') || !fs.statSync(p).isFile() || f.startsWith('auto/') || f.startsWith('auto\\')) continue;
  const src = fs.readFileSync(p, 'utf8');
  for (const m of src.matchAll(/class\s+([A-Za-z0-9_]+)\s+extends\s+\w+/g)) {
    shelfNames.add(m[1]);
    const b = classBody(src, m.index); if (b) shelfHashes.set(blind(b, m[1]), m[1]);
  }
}


// ── איסוף הצהרות-קובץ (מחלקות + עוזרים-פרטיים עליונים) ──
function fileDecls(src) {
  const classes = new Map(); // name ⇒ {start, body, ext}
  for (const m of src.matchAll(/class\s+([A-Za-z0-9_]+)(?:<[^{]*>)?\s+extends\s+([A-Za-z0-9_<>, ]+?)\s*\{/g)) {
    const b = classBody(src, m.index);
    if (b) classes.set(m[1], { body: b, ext: m[2].trim() });
  }
  const helpers = new Map(); // _name ⇒ source
  for (const m of src.matchAll(/(?:^|\n)(?:const|final)\s+(?:[A-Za-z_<>\[\], ]+\s+)?(_[a-z]\w*)\s*=/g)) {
    const line = src.indexOf(';', m.index);
    if (line > 0 && line - m.index < 2000) helpers.set(m[1], src.slice(m.index, line + 1).trim());
  }
  for (const m of src.matchAll(/(?:^|\n)([A-Za-z_<>\[\], ]+\s+)?(_[a-z]\w*)\s*\([^)]*\)\s*(?:=>|\{)/g)) {
    if (/\b(if|for|while|switch|catch|return)\b/.test(m[2])) continue;
    const b = classBody(src, m.index);
    if (b && b.split('\n').length <= 40) helpers.set(m[2], src.slice(m.index, m.index + b.length + src.slice(m.index).indexOf(b[0])).trim());
  }
  return { classes, helpers };
}

// ── המעבר על כל מפות-המכונה ──
const report = { lifted: [], skipped: {} };
const skip = (why, id) => (report.skipped[why] ??= []).push(id);
const liftedHashes = new Map(); const usedNames = new Set(shelfNames);
const maps = fs.readdirSync(MACHINE).filter(f => f.endsWith('.json')).sort();
for (const mf of maps) {
  const map = JSON.parse(fs.readFileSync(path.join(MACHINE, mf), 'utf8'));
  const screen = mf.replace('.json', '');
  const srcPath = path.join(SCRATCH, screen + '.dart');
  if (!fs.existsSync(srcPath)) continue;
  const src = fs.readFileSync(srcPath, 'utf8');
  const { classes, helpers } = fileDecls(src);

  for (const w of map.widgets || []) {
    const id = screen + ':' + w.name;
    const isStateful = w.kind === 'StatefulWidget';
    if (!isStateful && (!w.dataClean || !w.pure)) continue;   // מלוכלך ⇒ תור-הליטוש
    const main = classes.get(w.name);
    if (!main) { skip('no-decl', id); continue; }

    // ── הרכבת-הצרור: המחלקה + (State) + אחים + עוזרים ──
    const bundle = [{ name: w.name, body: main.body }];
    if (isStateful) {
      const stateEntry = [...classes.entries()].find(([, c]) => new RegExp('State<\\s*' + w.name + '\\s*>').test(c.ext));
      if (!stateEntry) { skip('no-state-class', id); continue; }
      bundle.push({ name: stateEntry[0], body: stateEntry[1].body });
    }
    // בדיקת-ניקיון על כל הצרור עד-כה (ל-Stateful המפה לא בדקה את גוף-ה-State)
    let issue = bundle.map(b => bodyIssue(b.body)).find(Boolean);
    if (issue) { skip(issue === 'hebrew' ? 'dirty-state-body' : 'io-in-state', id); continue; }

    // טיפוסי-בנאי של המחלקה-הראשית בלבד
    const fields = [...stripComments(main.body).matchAll(/final\s+([A-Za-z_][\w<>,\s]*\??)\s+[a-zA-Z_]\w*\s*;/g)].map(x => x[1].trim());
    if (fields.some(t => !okType(t))) { skip('model-prop', id); continue; }

    // תלויות: אחים-מאותו-קובץ ⇒ צרירה (עד 2, פרטיים, נקיים); עוזרים-פרטיים ⇒ צרירה (עד 3, נקיים)
    let ok = true, guard = 0;
    while (ok && guard++ < 4) {
      const inBundle = new Set(bundle.map(b => b.name));
      const code = stripComments(bundle.map(b => b.body).join('\n'));
      const refs = new Set([...code.matchAll(/\b(_?[A-Z]\w+|_[a-z]\w*)\b/g)].map(x => x[1]));
      for (const b of bundle) refs.delete(b.name);
      let grew = false;
      for (const r of refs) {
        if (inBundle.has(r)) continue;
        if (classes.has(r)) {
          if (!r.startsWith('_') || bundle.length >= 4) { skip('sibling-class', id); ok = false; break; }
          const sib = classes.get(r);
          if (bodyIssue(sib.body)) { skip('dirty-sibling', id); ok = false; break; }
          bundle.push({ name: r, body: sib.body }); grew = true;
        } else if (/^_[a-z]/.test(r)) {
          const declared = new RegExp('(final|var|const|void|double|int|String|bool|Widget|Color|late)\\s+' + r + '\\b|[A-Za-z>]\\s+' + r + '\\s*\\(').test(code);
          if (declared) continue;
          if (!helpers.has(r) || bundle.length + 1 >= 6) { skip('private-dep', id); ok = false; break; }
          const h = helpers.get(r);
          if (HEB_STR.test(stripComments(h)) || IO_PAT.test(stripComments(h))) { skip('dirty-helper', id); ok = false; break; }
          bundle.push({ name: r, body: h }); grew = true;
        } else if (/^_[A-Z]/.test(r)) { skip('private-dep', id); ok = false; break; }
        else if (!FOUNDATION.has(r) && projectClasses.has(r)) { skip('project-dep', id + '⇒' + r); ok = false; break; }
      }
      if (!grew) break;
    }
    if (!ok) continue;
    const allCode = stripComments(bundle.map(b => b.body).join('\n'));
    if (RIVERPOD.test(allCode)) { skip('riverpod', id); continue; }
    const exFn = externalFn(allCode);
    if (exFn) { skip('project-fn', id + '⇒' + exFn); continue; }
    const needsTokens = /\bBsTokens\./.test(allCode);
    if (needsTokens && !hasTokensAtom) { skip('project-dep', id + '⇒BsTokens'); continue; }

    // ── דדופ (הכרעה-5) ──
    const h = blind(bundle.map(b => b.body).join('\n'), w.name);
    if (shelfHashes.has(h)) { skip('already-on-shelf', id + '⇒' + shelfHashes.get(h)); continue; }
    if (liftedHashes.has(h)) { liftedHashes.get(h).also.push(id); continue; }

    // ── שם-ציבורי: בסיס, ואם-תפוס ⇒ מסויג-במסך (v2) ──
    let pub = w.name.replace(/^_/, '');
    if (usedNames.has(pub)) pub = screenPascal(screen) + pub;
    if (usedNames.has(pub)) { skip('name-collision', id); continue; }
    usedNames.add(pub);
    liftedHashes.set(h, { id, pub, screen, bundle, name: w.name, stateful: isStateful, needsTokens, also: [] });
  }
}

// ── פליטה + שער-עצמי ──
fs.mkdirSync(OUT, { recursive: true });
for (const L of [...liftedHashes.values()].sort((a, b) => a.pub.localeCompare(b.pub))) {
  const file = path.join(OUT, snake(L.pub) + '.dart');
  let joined = L.bundle.map(b => b.body).join('\n\n');
  // שינוי-שם עקבי: המחלקה-הראשית ⇒ ציבורית; State ⇒ _<Pub>State
  joined = joined.replaceAll(L.name, L.pub);
  if (L.stateful) joined = joined.replaceAll('_' + L.name.replace(/^_/, '') + 'State', '_' + L.pub + 'State');
  const extras = inferImports(stripComments(joined));
  for (const [cls, imp] of FOUNDATION) if (new RegExp('\\b' + cls + '\\b').test(stripComments(joined))) extras.unshift(imp);
  for (const [fn, imp] of FOUNDATION_FN) if (new RegExp('\\b' + fn + '\\s*\\(').test(stripComments(joined)) && !extras.includes(imp)) extras.push(imp);
  const also = L.also.length ? `\n// משרת-גם (זהה-מבנית): ${L.also.join(' · ')}` : '';
  const kind = L.stateful ? 'Stateful+State' : L.bundle.length > 1 ? `צרור-${L.bundle.length}` : 'Stateless';
  const code = `// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: ${L.id} (בנייה-חכמה main) · ${kind}${also}
import 'package:flutter/material.dart';
${extras.join('\n')}${extras.length ? '\n' : ''}
${joined}
`;
  fs.writeFileSync(file, code);
  try {
    const chk = execFileSync('node', [path.join(ROOT, 'machtzev/carve/screen-decomp.mjs'), file], { encoding: 'utf8' });
    const dirty = /⚠️ טהורי-IO אך עם דאטה-צרובה/.test(chk);
    const cleanBody = stripComments(code);
    if (dirty || /[֐-׿]/.test(cleanBody.replace(/[^֐-׿]/g, (c) => c))) {
      if (dirty || HEB_STR.test(cleanBody)) throw new Error('לא-dataClean');
    }
    report.lifted.push({ atom: L.pub, from: L.id, kind, serves: 1 + L.also.length });
  } catch { fs.unlinkSync(file); skip('failed-self-gate', L.id); }
}

const skippedN = Object.values(report.skipped).reduce((a, v) => a + v.length, 0);
fs.writeFileSync(path.join(ROOT, 'screens-seed/shelf-lift-report.json'), JSON.stringify(report, null, 1));
const serves = report.lifted.reduce((a, x) => a + x.serves, 0);
const st = report.lifted.filter(x => x.kind.startsWith('Stateful')).length;
console.log(`🛗 מנוע-המדף v2 · הורמו: ${report.lifted.length} אטומים (${st} Stateful · משרתים ${serves} מופעים) · נדחו: ${skippedN}`);
for (const [why, ids] of Object.entries(report.skipped).sort((a, b) => b[1].length - a[1].length)) console.log(`   ⏭️ ${why}: ${ids.length}`);
console.log('⇒ new/dart-ui-bs/auto/ + screens-seed/shelf-lift-report.json');
