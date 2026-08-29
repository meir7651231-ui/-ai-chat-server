#!/usr/bin/env node
/** 🧽 מחצב · מנוע-הליטוש v2 — "מנוע-המטרות" (data-lift) — חוזה: DATA-LIFT-CONTRACT.md.
 *  הכרעת-הבעלים 29.8: לא מחפשים *שם* — מחפשים את *המטרה* של כל מחרוזת-עברית:
 *  לאיזה פרמטר של איזה בנאי היא זורמת (לפי הגדרת-הבנאי האמיתית במקור), ומחליפים.
 *  כולל צרירת-משפחות: מחרוזת שזורמת ל-widget-אח ⇒ prop מושחל בשרשרת עד השורש.
 *  כל ספק ⇒ דחייה-מנומקת. דטרמיניסטי. רץ אחרי shelf-lift (אותו מדף).
 *  שימוש: node data-lift.mjs [screens-dir] */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import { inferImports, classBody, stripComments, maskComments, HEB_STR, IO_PAT, RIVERPOD, blind, snake, screenPascal, okType, FOUNDATION } from './lift-lib.mjs';
const ROOT = new URL('../../', import.meta.url).pathname;
const SCRATCH = process.argv[2] || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/all-screens';
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const OUT = path.join(SHELF, 'auto');
const CONTENT_OUT = path.join(ROOT, 'new/dart-data-bs/auto');
const MACHINE = path.join(ROOT, 'screens-seed/machine');
const BS = '/home/user/buildsmart';

// ── אינדקס-מחלקות-הפרויקט ──
let projectClasses = new Set();
try {
  projectClasses = new Set([...execSync("git grep -h -E 'class [A-Za-z0-9_]+' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 })
    .matchAll(/class\s+([A-Za-z0-9_]+)/g)].map(x => x[1]));
  projectClasses.delete('BsTokens');
} catch { }

// ── מלאי-המדף (כולל auto/ של shelf-lift) ──
const usedNames = new Set(); const shelfHashes = new Map();
for (const f of fs.readdirSync(SHELF, { recursive: true }).map(String)) {
  const p = path.join(SHELF, f);
  if (!f.endsWith('.dart') || !fs.statSync(p).isFile()) continue;
  const src = fs.readFileSync(p, 'utf8');
  for (const m of src.matchAll(/class\s+([A-Za-z0-9_]+)\s+extends\s+\w+/g)) {
    usedNames.add(m[1]);
    const b = classBody(src, m.index); if (b) shelfHashes.set(blind(b, m[1]), m[1]);
  }
}

const ANY_LIT = /'(?:[^'\\\n]|\\.)*'/g;
const maskLits = (s) => s.replace(ANY_LIT, (m) => "'" + 'x'.repeat(m.length - 2) + "'");
// מטרות-Flutter מוכרות לפרמטר-מיקומי-ראשון (טבלה סגורה)
const FLUTTER_POS = { Text: ['label'], SelectableText: ['label'], CfgText: ['id', 'fallback'] };


// ── אינדקס-בנאים של קובץ: מחלקה ⇒ שמות-הפרמטרים-המיקומיים (המטרות) ──
function ctorPositionals(name, body) {
  const m = body.match(new RegExp('(?:const\\s+)?' + name + '\\s*\\('));
  if (!m) return null;
  let d = 0, j = body.indexOf('(', m.index), open = j;
  for (; j < body.length; j++) { const c = body[j]; if (c === '(') d++; else if (c === ')') { d--; if (!d) break; } }
  const plist = body.slice(open + 1, j);
  const positional = [];
  let depth = 0, cur = '';
  for (const c of plist) {
    if (c === '{' || c === '[') { if (!depth) break; depth++; }
    else if (c === '(' || c === '<') depth++;
    else if (c === ')' || c === '>' || c === ']' || c === '}') depth--;
    else if (c === ',' && !depth) { positional.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) positional.push(cur);
  return positional.map(p => (p.match(/this\.(\w+)/) || p.match(/(\w+)\s*$/) || [])[1]).filter(Boolean);
}

/** המטרה של ליטרל-מיקומי: הבנאי-העוטף + האינדקס ⇒ שם-הפרמטר במקור. */
function purposeOf(scan, litStart, ctorIndex) {
  let d = 0, commas = 0, named = 0, k = litStart - 1;
  for (; k >= 0; k--) {
    const c = scan[k];
    if (c === ')' || c === ']' || c === '}') d++;
    else if (c === '[' || c === '{') { if (!d) return null; d--; }
    else if (c === '(') { if (!d) break; d--; }
    else if (c === ',' && !d) commas++;
  }
  if (k < 0) return null;
  const inv = scan.slice(0, k).match(/([A-Za-z_][\w.]*)\s*$/);
  if (!inv) return null;
  const invName = inv[1].split('.')[0];
  for (const nm of scan.slice(k + 1, litStart).matchAll(/[({,]\s*[a-zA-Z_]\w*\s*:/g)) named++;
  const idx = Math.max(0, commas - named);
  const params = ctorIndex.get(invName) || FLUTTER_POS[invName];
  return params?.[idx] || null;
}

// ── ליבת-ההרמה (per-body): עברית ⇒ props, שמות לפי מטרה ──
function hoistStrings(body, ctorIndex, propBase) {
  const masked = maskComments(body);
  const scan = maskLits(masked);
  const runs = [];
  let cur = null;
  for (const m of [...masked.matchAll(ANY_LIT)]) {
    if (cur && /^\s*$/.test(masked.slice(cur.end, m.index))) { cur.end = m.index + m[0].length; cur.parts.push(m[0]); }
    else { cur = { start: m.index, end: m.index + m[0].length, parts: [m[0]] }; runs.push(cur); }
  }
  const lits = runs.map(r => ({ ...r, value: r.parts.map(p => p.slice(1, -1)).join('') })).filter(r => /[֐-׿]/.test(r.value));
  if (!lits.length) return { out: body, props: [] };

  const props = []; const seen = new Map(propBase);
  for (const m of lits) {
    if (m.value.includes('$')) return { fail: 'interpolation' };
    if (/[=!]=\s*$/.test(scan.slice(0, m.start))) return { fail: 'logic-token' };
    // הליכה-לאחור אל תחילת-הארגומנט
    let d = 0, k = m.start - 1;
    for (; k >= 0; k--) {
      const c = scan[k];
      if (c === ')' || c === ']' || c === '}') d++;
      else if (c === '(' || c === '[' || c === '{') { if (!d) break; d--; }
      else if (c === ',' && !d) break;
    }
    const argPrefix = scan.slice(k + 1, m.start);
    let name = null, isDefault = false;
    const nm = argPrefix.match(/^\s*([a-zA-Z_]\w*)\s*:/);
    const dp = argPrefix.match(/this\.([a-zA-Z_]\w*)\s*=\s*$/);
    if (dp) { name = dp[1]; isDefault = true; }
    else if (nm && !['children', 'style', 'key'].includes(nm[1])) name = nm[1];
    else if (/(\breturn|=>)\s*$/.test(scan.slice(0, m.start).replace(/\s+$/, ' '))) name = 'text';
    else name = purposeOf(scan, m.start, ctorIndex);          // 🎯 מנוע-המטרות
    if (!name) return { fail: 'unnamed-string' };
    if (/=\s*$/.test(scan.slice(0, m.start)) && !isDefault) return { fail: 'default-param' };
    let n = (seen.get(name) || 0) + 1;
    const fieldRe = (p) => new RegExp('final\\s+[A-Za-z_][\\w<>?]*\\s+' + p + '\\s*;');
    while (!isDefault && fieldRe(n === 1 ? name : name + n).test(body)) n++;
    seen.set(name, n);
    props.push({ prop: n === 1 ? name : name + n, value: m.value, start: m.start, len: m.end - m.start, isDefault });
  }
  // החלפה מהסוף-להתחלה
  let out = body;
  for (const p of [...props].sort((a, b) => b.start - a.start)) {
    if (p.isDefault) {
      const eq = out.lastIndexOf('=', p.start);
      out = out.slice(0, eq).replace(/\s+$/, '') + out.slice(p.start + p.len);
    } else out = out.slice(0, p.start) + p.prop + out.slice(p.start + p.len);
  }
  for (const p of props.filter(x => x.isDefault))
    out = out.replace(new RegExp('([{,(]\\s*)this\\.' + p.prop + '\\b'), '$1required this.' + p.prop);
  out = stripConstOn(out, props.map(p => p.prop));
  return { out, props };
}

// הפשטת-const מביטויים שמכילים props (לא-קבועים) — איטרטיבי
function stripConstOn(out, propNames) {
  if (!propNames.length) return out;
  const propWord = new RegExp('\\b(' + propNames.join('|') + ')\\b');
  let changed = true;
  while (changed) {
    changed = false;
    for (const cm of [...out.matchAll(/\bconst\s+(?=_?[A-Z]\w*\s*\(|\[)/g)]) {
      const rel = out.slice(cm.index).search(/[([]/);
      const open = cm.index + rel;
      const openCh = out[open], closeCh = openCh === '(' ? ')' : ']';
      let d = 0, j = open, inS = 0;
      for (; j < out.length; j++) {
        const c = out[j];
        if (inS) { if (c === '\\') j++; else if (c === "'") inS = 0; continue; }
        if (c === "'") inS = 1;
        else if (c === openCh) d++; else if (c === closeCh) { d--; if (!d) break; }
      }
      if (propWord.test(out.slice(open, j + 1))) {
        out = out.slice(0, cm.index) + out.slice(cm.index + cm[0].length);
        changed = true; break;
      }
    }
  }
  return out;
}

// ── הזרקת בנאי+שדות למחלקה ──
function injectProps(body, cls, allProps) {
  const props = allProps.filter(p => !p.isDefault);
  if (!props.length) return body;
  const decls = props.map(p => `  final String ${p.prop};`).join('\n');
  const params = props.map(p => 'required this.' + p.prop).join(', ');
  const ctorRe = new RegExp('(const\\s+)?' + cls + '\\s*\\(');
  const cm = body.match(ctorRe);
  if (cm && !/=>/.test(body.slice(cm.index, cm.index + 20))) {
    let d = 0, j = body.indexOf('(', cm.index), open = j, inS = 0;
    for (; j < body.length; j++) {
      const c = body[j];
      if (inS) { if (c === '\\') j++; else if (c === "'") inS = 0; continue; }
      if (c === "'") inS = 1; else if (c === '(') d++; else if (c === ')') { d--; if (!d) break; }
    }
    const plist = body.slice(open + 1, j);
    let np;
    if (plist.includes('{')) np = plist.replace('{', '{' + params + ', ');
    else if (plist.trim() === '') np = '{' + params + '}';
    else np = plist.replace(/,?\s*$/, '') + ', {' + params + '}';
    let end = body.indexOf(';', j); const brace = body.indexOf('{', j);
    if (brace > 0 && (end < 0 || brace < end)) { const b2 = classBody(body, j); end = j + (b2 ? body.slice(j).indexOf(b2) + b2.length : 0); }
    if (end < 0) return null;
    return body.slice(0, open + 1) + np + body.slice(j, end + 1) + '\n' + decls + body.slice(end + 1);
  }
  const openBrace = body.indexOf('{');
  return body.slice(0, openBrace + 1) + `\n  const ${cls}({${params}});\n` + decls + body.slice(openBrace + 1);
}

// ── השחלת-props במעלה-השרשרת: A ⇐מופע⇐ B ⇒ A מקבל את props-של-B ומעביר ──
function threadProps(bundle) {
  // bundle: [{name, out, props(own)}] — root ראשון. מחזיר bundle עם passProps + call-sites מתוקנים.
  let changed = true, guard = 0;
  while (changed && guard++ < 10) {
    changed = false;
    for (const holder of bundle) {
      for (const target of bundle) {
        if (target === holder || !target.allProps.length) continue;
        const invRe = new RegExp('\\b' + target.name + '\\s*\\(', 'g');
        const scan = maskLits(maskComments(holder.out));
        for (const m of [...scan.matchAll(invRe)]) {
          if (/class\s+$/.test(scan.slice(Math.max(0, m.index - 8), m.index))) continue;
          // אילו props כבר מסופקים בקריאה?
          let d = 0, j = scan.indexOf('(', m.index), open = j;
          for (; j < scan.length; j++) { const c = scan[j]; if (c === '(') d++; else if (c === ')') { d--; if (!d) break; } }
          const argText = scan.slice(open + 1, j);
          const missing = target.allProps.filter(p => !new RegExp('\\b' + p + '\\s*:').test(argText));
          if (!missing.length) continue;
          // הוספת הארגומנטים החסרים (ערך = prop-של-holder באותו-שם);
          // עריכה-אחת-לסיבוב — ה-while החיצוני סורק-מחדש (אינדקסים טריים)
          const insert = (argText.trim() ? ', ' : '') + missing.map(p => `${p}: ${p}`).join(', ');
          holder.out = holder.out.slice(0, j) + insert + holder.out.slice(j);
          for (const p of missing) if (!holder.allProps.includes(p)) { holder.allProps.push(p); holder.threaded.push(p); }
          changed = true; break;
        }
        if (changed) break;
      }
      if (changed) break;
    }
  }
  return guard < 10;
}

// ── המעבר ──
const report = { lifted: [], skipped: {} };
const skip = (why, id) => (report.skipped[why] ??= []).push(id);
fs.rmSync(CONTENT_OUT, { recursive: true, force: true });
fs.mkdirSync(CONTENT_OUT, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const liftedHashes = new Map();
const contentByScreen = new Map();
for (const mf of fs.readdirSync(MACHINE).filter(f => f.endsWith('.json')).sort()) {
  const map = JSON.parse(fs.readFileSync(path.join(MACHINE, mf), 'utf8'));
  const screen = mf.replace('.json', '');
  const srcPath = path.join(SCRATCH, screen + '.dart');
  if (!fs.existsSync(srcPath)) continue;
  const src = fs.readFileSync(srcPath, 'utf8');
  const widgetKind = new Map((map.widgets || []).map(w => [w.name, w]));
  const classes = new Map();
  for (const m of src.matchAll(/class\s+([A-Za-z0-9_]+)(?:<[^{]*>)?\s+extends\s+([A-Za-z0-9_<>, ]+?)\s*\{/g)) {
    const b = classBody(src, m.index);
    if (b) classes.set(m[1], { body: b, ext: m[2].trim() });
  }
  const ctorIndex = new Map();
  for (const [n, c] of classes) { const ps = ctorPositionals(n, c.body); if (ps) ctorIndex.set(n, ps); }

  for (const w of map.widgets || []) {
    const id = screen + ':' + w.name;
    if (w.dataClean || !w.pure || w.kind !== 'StatelessWidget') continue;
    const main = classes.get(w.name);
    if (!main) { skip('no-decl', id); continue; }

    // ── בניית-הצרור: השורש + סגירת-האחים (פרטיים; Stateless-טהורים; נקיים-או-מתלטשים) ──
    const bundle = [{ name: w.name, body: main.body }];
    let ok = true, guard = 0;
    while (ok && guard++ < 6) {
      const inB = new Set(bundle.map(b => b.name));
      const code = stripComments(bundle.map(b => b.body).join('\n'));
      const refs = new Set([...code.matchAll(/\b(_?[A-Z]\w+|_[a-z]\w*)\b/g)].map(x => x[1]));
      for (const b of bundle) refs.delete(b.name);
      let grew = false;
      for (const r of refs) {
        if (inB.has(r)) continue;
        if (classes.has(r)) {
          const wk = widgetKind.get(r);
          if (!r.startsWith('_') || bundle.length >= 6 || (wk && (wk.kind !== 'StatelessWidget' || !wk.pure))) { skip('sibling-class', id); ok = false; break; }
          bundle.push({ name: r, body: classes.get(r).body }); grew = true;
        } else if (/^_[a-z]/.test(r)) {
          const declared = new RegExp('(final|var|const|void|double|int|String|bool|Widget|Color|late)\\s+' + r + '\\b|[A-Za-z>]\\s+' + r + '\\s*\\(').test(code);
          if (!declared) { skip('private-dep', id); ok = false; break; }
        } else if (/^_[A-Z]/.test(r)) { skip('private-dep', id); ok = false; break; }
        else if (!FOUNDATION.has(r) && projectClasses.has(r)) { skip('project-dep', id); ok = false; break; }
      }
      if (!grew) break;
    }
    if (!ok) continue;
    const allRaw = stripComments(bundle.map(b => b.body).join('\n'));
    if (IO_PAT.test(allRaw) || RIVERPOD.test(allRaw)) { skip('io', id); continue; }
    const fields = [...stripComments(main.body).matchAll(/final\s+([A-Za-z_][\w<>,\s]*\??)\s+[a-zA-Z_]\w*\s*;/g)].map(x => x[1].trim());
    if (fields.some(t => !okType(t))) { skip('model-prop', id); continue; }

    // ── ליטוש כל גופי-הצרור (namespace-props משותף) ──
    const propBase = new Map();
    let fail = null;
    for (const b of bundle) {
      const h = hoistStrings(b.body, ctorIndex, propBase);
      if (h.fail) { fail = h.fail; break; }
      b.out = h.out; b.props = h.props;
      b.allProps = h.props.map(p => p.prop); b.threaded = [];
      for (const p of h.props) propBase.set(p.prop.replace(/\d+$/, ''), Math.max(propBase.get(p.prop.replace(/\d+$/, '')) || 0, +(p.prop.match(/(\d+)$/)?.[1] || 1)));
    }
    if (fail) { skip(fail, id); continue; }
    if (HEB_STR.test(stripComments(bundle.map(b => b.out).join('\n')))) { skip('hebrew-left', id); continue; }

    // ── השחלת-props במעלה-השרשרת + הזרקת-בנאים ──
    if (!threadProps(bundle)) { skip('thread-cycle', id); continue; }
    let bad = false;
    for (const b of bundle) {
      const inj = injectProps(b.out, b.name, [...b.props, ...b.threaded.map(p => ({ prop: p, isDefault: false }))]);
      if (!inj) { bad = true; break; }
      b.final = stripConstOn(inj, b.allProps);
    }
    if (bad) { skip('ctor-shape', id); continue; }
    const rootProps = bundle[0].allProps;
    if (!rootProps.length) { skip('no-props', id); continue; }

    // ── דדופ + שם ──
    const joinedAll = bundle.map(b => b.final).join('\n\n');
    const hash = blind(joinedAll, w.name);
    if (shelfHashes.has(hash)) { skip('already-on-shelf', id); continue; }
    if (liftedHashes.has(hash)) { liftedHashes.get(hash).also.push(id); continue; }
    let pub = w.name.replace(/^_/, '');
    if (usedNames.has(pub)) pub = screenPascal(screen) + pub;
    if (usedNames.has(pub)) { skip('name-collision', id); continue; }
    usedNames.add(pub);
    const allContent = bundle.flatMap(b => b.props.map(p => ({ prop: p.prop, value: p.value })));
    liftedHashes.set(hash, { id, pub, screen, name: w.name, joined: joinedAll, content: allContent, nBundle: bundle.length, rootProps, also: [] });
  }
}

// ── פליטה + שער-עצמי + שימור ──
for (const L of [...liftedHashes.values()].sort((a, b) => a.pub.localeCompare(b.pub))) {
  const file = path.join(OUT, snake(L.pub) + '.dart');
  if (fs.existsSync(file)) { skip('file-collision', L.id); continue; }
  let joined = L.joined.replaceAll(L.name, L.pub);
  const extras = inferImports(stripComments(joined));
  for (const [cls, imp] of FOUNDATION) if (new RegExp('\\b' + cls + '\\b').test(stripComments(joined))) extras.unshift(imp);
  const also = L.also.length ? `\n// משרת-גם (זהה-מבנית): ${L.also.join(' · ')}` : '';
  const code = `// 🧽 לוטש ע"י מנוע-המטרות (data-lift v2) — הדאטה הורמה ל-props לפי מטרתה, אל תערוך ידנית.
// מוצא: ${L.id} (בנייה-חכמה main) · צרור-${L.nBundle} · props-שורש: ${L.rootProps.join(', ')}
// התוכן: new/dart-data-bs/auto/${L.screen}_content.dart${also}
import 'package:flutter/material.dart';
${extras.join('\n')}${extras.length ? '\n' : ''}
${joined}
`;
  fs.writeFileSync(file, code);
  try {
    const chk = execFileSync('node', [path.join(ROOT, 'machtzev/carve/screen-decomp.mjs'), file], { encoding: 'utf8' });
    if (/⚠️ טהורי-IO אך עם דאטה-צרובה/.test(chk)) throw new Error('לא-dataClean');
    (contentByScreen.get(L.screen) ?? contentByScreen.set(L.screen, []).get(L.screen))
      .push(...L.content.map(p => `const String ${snake(L.pub)}_${snake(p.prop)} = '${p.value}';`));
    report.lifted.push({ atom: L.pub, from: L.id, bundle: L.nBundle, props: L.content.length, serves: 1 + L.also.length });
  } catch { fs.unlinkSync(file); skip('failed-self-gate', L.id); }
}
for (const [screen, lines] of [...contentByScreen.entries()].sort()) {
  fs.writeFileSync(path.join(CONTENT_OUT, screen + '_content.dart'),
    `// 📦 דאטה · תוכן-שהורם ע"י data-lift מ-${screen} — verbatim מהמקור, אל תערוך ידנית.\n${lines.join('\n')}\n`);
}

const skippedN = Object.values(report.skipped).reduce((a, v) => a + v.length, 0);
const strings = report.lifted.reduce((a, x) => a + x.props, 0);
fs.writeFileSync(path.join(ROOT, 'screens-seed/data-lift-report.json'), JSON.stringify(report, null, 1));
console.log(`🧽 מנוע-המטרות · לוטשו: ${report.lifted.length} widgets (${strings} מחרוזות⇒props · משרתים ${report.lifted.reduce((a, x) => a + x.serves, 0)}) · נדחו: ${skippedN}`);
for (const [why, ids] of Object.entries(report.skipped).sort((a, b) => b[1].length - a[1].length)) console.log(`   ⏭️ ${why}: ${ids.length}`);
console.log('⇒ new/dart-ui-bs/auto/ + new/dart-data-bs/auto/ + screens-seed/data-lift-report.json');
