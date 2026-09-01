#!/usr/bin/env node
// 🧽 מכונת-הטיהור · מחלצת דאטה-צרובה ממנועים — דטרמיניסטי, לא נחיל.
// מזהה בלוק-דאטה עליון (const/final Map|List|Set literal, ≥סף ערכים) בכל אטום,
// ומחלץ אותו לקובץ-דאטה + משאיר במנוע הפניה-לשקע.
//
// שימוש:
//   node machtzev/purify.mjs --scan            # אינוונטר: כל מנוע נושא-דאטה
//   node machtzev/purify.mjs --scan --json      # פלט-מכונה
//   node machtzev/purify.mjs --extract <file>   # חילוץ בלוק-הדאטה (מנוע→שקע, דאטה→קובץ)
//
// גבול (חוק-מנגנון): בלוק ≥MIN ערכי-מחרוזת = דאטה-עסקית. פונקציה/control-flow
// אינם נתפסים (רק const/final ברמת-המודול). קבועי-פיזיקה קטנים (<MIN) לא-נתפסים.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('../../new/', import.meta.url).pathname;
const DIRS = [
  { dir: 'dart', data: 'dart-data', lang: 'dart' },
  { dir: 'dart-maor', data: 'dart-data-maor', lang: 'dart' },
  { dir: 'atoms', data: 'atoms-data', lang: 'js' },
];
const MIN = 4; // סף ערכים כדי להיחשב טבלת-דאטה

// --- מציאת בלוק-דאטה עליון: const/final <Type> NAME = { ... }; (או [ ... ]) ---
function findDataBlocks(src) {
  const blocks = [];
  // Dart: const Map<..> _x = { ; JS: const X = { / [
  const re = /^(?:\s*)((?:const|final)\s+(?:[A-Za-z_][\w<>,?\s]*\s+)?)([A-Za-z_]\w*)\s*=\s*(?:const\s*)?([{[])/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const open = m[3];
    const close = open === '{' ? '}' : ']';
    // התאמת-סוגריים מהמיקום של הפותח
    let i = m.index + m[0].length - 1;
    let depth = 0, end = -1, inStr = false, q = '';
    for (; i < src.length; i++) {
      const c = src[i];
      if (inStr) { if (c === q && src[i - 1] !== '\\') inStr = false; continue; }
      if (c === '"' || c === "'") { inStr = true; q = c; continue; }
      if (c === open) depth++;
      else if (c === close) { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end < 0) continue;
    const body = src.slice(m.index, end + 1);
    // ספירת-ערכים: פריטי-מפה 'k': v  או פריטי-רשימה 'x',
    const entries = (body.match(/['"][^'"]{1,}['"]\s*:/g) || []).length
      || (body.match(/['"][^'"]{1,}['"]\s*,/g) || []).length;
    if (entries >= MIN) {
      const startLine = src.slice(0, m.index).split('\n').length;
      const endLine = src.slice(0, end).split('\n').length;
      blocks.push({ name: m[2], decl: m[1].trim(), open, startLine, endLine, entries, span: [m.index, end + 1], body });
    }
  }
  return blocks;
}

function scan(asJson) {
  const rows = [];
  for (const { dir } of DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (!/\.(dart|mjs)$/.test(f)) continue;
      if (/_test\.|\.test\.|\.contract\./.test(f)) continue;
      const src = fs.readFileSync(path.join(abs, f), 'utf8');
      const blocks = findDataBlocks(src);
      if (blocks.length) rows.push({ file: `${dir}/${f}`, blocks: blocks.map(b => ({ name: b.name, entries: b.entries, lines: `${b.startLine}-${b.endLine}` })) });
    }
  }
  if (asJson) { console.log(JSON.stringify(rows, null, 2)); return rows; }
  let engines = 0, values = 0;
  console.log('🧽 אינוונטר-טיהור · מנועים שנושאים דאטה-צרובה (בלוק ≥' + MIN + ' ערכים)\n');
  const byDir = {};
  for (const r of rows) { const d = r.file.split('/')[0]; (byDir[d] ||= []).push(r); }
  for (const [d, list] of Object.entries(byDir)) {
    console.log(`── ${d} (${list.length} מנועים) ──`);
    for (const r of list) {
      engines++;
      const bs = r.blocks.map(b => `${b.name}[${b.entries}]`).join(' · ');
      r.blocks.forEach(b => values += b.entries);
      console.log(`  🔴 ${r.file.split('/')[1]} — ${bs}`);
    }
    console.log('');
  }
  console.log(`═══ סה"כ: ${engines} מנועים · ${values} ערכי-דאטה צרובים ═══`);
  return rows;
}

// ============ המחלץ — מזיז דאטה→קובץ, משכתב מנוע→שקע, מאמת, מחזיר-לאחור-אם-נכשל ============
import { execSync } from 'node:child_process';

function pubName(n) { const b = n.replace(/^_/, ''); return 'k' + b[0].toUpperCase() + b.slice(1); }

// מוסיף פרמטר-named-required לפונקציה top-level (השם זהה ל-const ⇒ גוף לא משתנה).
// מחזיר {src, fn} — הקוד החדש ושם-הפונקציה (לחיווט הבדיקה).
function addNamedParam(src, typeDecl, name) {
  // מזהה פונקציית-top-level (עמודה-0) עם איזון-סוגריים אמיתי — תומך גוף-חץ (=>) ו-async,
  // ופרמטרים מקוננים (String Function(String) x). מדלג על מילות-מפתח ומתודות-מחלקה (מוזחות).
  const KW = new Set(['if','for','while','switch','return','const','final','var','class','enum','import','export','assert','new','void','get','set','typedef','extension','mixin','part']);
  const re = /^(?:[A-Za-z_][\w<>,?.\s]*\s+)?([a-zA-Z_]\w*)\s*\(/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const fn = m[1];
    if (KW.has(fn)) continue;
    // איזון-סוגריים מה-( בסוף-ההתאמה (מדלג נכון על פרמטרים מקוננים)
    let open = m.index + m[0].length - 1, depth = 0, j = open, inStr = false, q = '';
    for (; j < src.length; j++) { const c = src[j];
      if (inStr) { if (c === q && src[j-1] !== '\\') inStr = false; continue; }
      if (c === '"' || c === "'") { inStr = true; q = c; continue; }
      if (c === '(') depth++; else if (c === ')') { depth--; if (depth === 0) break; } }
    if (j >= src.length) continue;
    const close = j;
    let k = close + 1; while (k < src.length && /\s/.test(src[k])) k++;
    // אחרי ה-) חייב לבוא גוף-פונקציה: { , => , async/sync — אחרת זו קריאה/הצהרה, לא הגדרה
    if (!(src[k] === '{' || src.startsWith('=>', k) || /^(async|sync)\b/.test(src.slice(k, k+8)))) continue;
    const params = src.slice(open + 1, close);
    const decl = `required ${typeDecl} ${name}`;
    let newParams;
    if (/\{/.test(params)) {
      newParams = params.replace(/\}(\s*)$/, `, ${decl},}$1`);
      if (newParams === params) newParams = params.replace(/\{/, `{${decl}, `);
    } else {
      newParams = params.trim() ? `${params}, {${decl}}` : `{${decl}}`;
    }
    return { src: src.slice(0, open + 1) + newParams + src.slice(close), fn };
  }
  return null;
}

// מזריק arg-named לכל קריאות fn( ... ) במקור (התאמת-סוגריים).
// dotted=true ⇒ רק קריאות-מנוקדות `alias.fn(` (קופסאות; מונע פגיעה בהגדרת-wrapper).
function injectNamedArg(src, fn, argName, argVal, dotted = false) {
  let out = '', i = 0;
  const call = new RegExp((dotted ? '\\.\\s*' : '\\b') + fn + '\\s*\\(', 'g');
  let m;
  while ((m = call.exec(src)) !== null) {
    let depth = 1, j = m.index + m[0].length, inStr = false, q = '';
    for (; j < src.length; j++) {
      const c = src[j];
      if (inStr) { if (c === q && src[j - 1] !== '\\') inStr = false; continue; }
      if (c === '"' || c === "'") { inStr = true; q = c; continue; }
      if (c === '(') depth++;
      else if (c === ')') { depth--; if (depth === 0) break; }
    }
    const after = src.slice(j + 1).replace(/^\s*/, '');
    if (!dotted && after.startsWith('{')) continue; // הגדרה, לא קריאה
    out += src.slice(i, j) + `, ${argName}: ${argVal}` + src[j];
    i = j + 1;
    call.lastIndex = i;
  }
  return out + src.slice(i);
}

function extract(rel) {
  const [dir] = rel.split('/');
  const cfg = DIRS.find(d => d.dir === dir);
  if (!cfg) { console.log('✗ תיקייה לא-מוכרת:', dir); return false; }
  const abs = path.join(ROOT, rel);
  const src0 = fs.readFileSync(abs, 'utf8');
  const blocks = findDataBlocks(src0);
  if (blocks.length !== 1) { console.log(`↷ דילוג ${rel}: ${blocks.length} בלוקים (המחלץ הבטוח = בלוק-יחיד).`); return false; }
  const b = blocks[0];
  if (b.name.startsWith('k') && /^k[A-Z]/.test(b.name)) { console.log(`↷ ${rel}: כבר-מחולץ (${b.name}).`); return false; }
  // איסוף-צרכנים: קופסאות/לוח שמייבאים את האטום (יחוברו + יאומתו דרך ה-proof).
  const baseName = path.basename(rel).replace(/\.(dart|mjs)$/, '');
  const consumers = []; // {abs, src0, proofAbs}
  for (const cdir of ['dart-boxes', '.']) {
    const cabs = path.join(ROOT, cdir);
    if (!fs.existsSync(cabs)) continue;
    for (const cf of fs.readdirSync(cabs)) {
      if (!/\.(dart|mjs)$/.test(cf) || /_test|\.test\.|proof/.test(cf)) continue;
      const cpath = path.join(cabs, cf);
      const csrc = fs.readFileSync(cpath, 'utf8');
      const m = new RegExp(`import ['"][^'"]*/${baseName}\\.(dart|mjs)['"](?:\\s+as\\s+(\\w+))?`).exec(csrc);
      if (m) {
        const proofCandidates = [cf.replace(/\.dart$/, '-proof.dart'), 'board-proof.dart'];
        const proofs = proofCandidates.map(p => path.join(cabs, p)).filter(p => fs.existsSync(p));
        consumers.push({ abs: cpath, src0: csrc, alias: m[2] || null, proofs });
      }
    }
  }
  // סוג-הבלוק (Map/List/Set<..>) מההצהרה
  const typeM = /(?:const|final)\s+([A-Za-z_][\w<>,?\s]*?)\s+[A-Za-z_]\w*\s*=/.exec(b.decl + ' =');
  const typeDecl = typeM ? typeM[1].trim() : (b.open === '{' ? 'Map<String, dynamic>' : 'List<dynamic>');
  const lit = src0.slice(src0.indexOf(b.open === '{' ? '{' : '[', b.span[0]), b.span[1]);
  // סוף-ההצהרה כולל ; (וגם whitespace לפניו)
  let stmtEnd = b.span[1];
  while (stmtEnd < src0.length && /\s/.test(src0[stmtEnd])) stmtEnd++;
  if (src0[stmtEnd] === ';') stmtEnd++;
  const pub = pubName(b.name);
  const ext = cfg.lang === 'js' ? 'mjs' : 'dart';
  const base = path.basename(rel).replace(/\.(dart|mjs)$/, '');
  const dataRel = `${cfg.data}/${base}.${ext}`;
  const dataAbs = path.join(ROOT, dataRel);

  // 1) קובץ-דאטה
  const dataHdr = `// 🗄️ דאטה · חולץ מ-${rel} ע"י machtzev/purify.mjs. נערך בלי לגעת במנוע.\n`;
  const dataContent = cfg.lang === 'js'
    ? `${dataHdr}export const ${pub} = ${lit};\n`
    : `${dataHdr}const ${pub} = ${lit};\n// re-export שם-המקור לנוחות-הזרקה:\nfinal ${b.name.replace(/^_/, '')} = ${pub};\n`;
  // 2) מנוע: הסר את כל הצהרת-ה-const (start..stmtEnd), הוסף פרמטר (שם=שם-const ⇒ גוף לא משתנה)
  let atom = (src0.slice(0, b.span[0]) + src0.slice(stmtEnd)).replace(/\n{3,}/g, '\n\n');
  // אם השם היה פרטי (_x) — הסר את הקו-התחתון מכל ההפניות בגוף (הפרמטר יהיה ציבורי)
  const paramName = b.name.replace(/^_/, '');
  if (paramName !== b.name) atom = atom.replace(new RegExp('\\b' + b.name + '\\b', 'g'), paramName);
  const res = addNamedParam(atom, typeDecl, paramName);
  if (!res) { console.log(`↷ ${rel}: לא נמצאה פונקציה-ראשית להוספת-שקע.`); return false; }

  // בדיקה + גיבוי לשחזור
  const testRel = rel.replace(/\.(dart|mjs)$/, cfg.lang === 'js' ? '.test.$1'.replace('$1','mjs') : '_test.dart');
  const testAbs = path.join(ROOT, testRel);
  const hasTest = fs.existsSync(testAbs);
  const testSrc0 = hasTest ? fs.readFileSync(testAbs, 'utf8') : '';

  fs.mkdirSync(path.dirname(dataAbs), { recursive: true });
  fs.writeFileSync(dataAbs, dataContent);
  fs.writeFileSync(abs, res.src);

  const dataImport = cfg.lang === 'js'
    ? `import { ${pub} } from '../${cfg.data}/${base}.mjs';\n`
    : `import '../${cfg.data}/${base}.dart';\n`;

  // חיווט-הבדיקה: import הדאטה + הזרקת-arg (bare — הבדיקה מייבאת ללא-alias)
  if (hasTest) {
    fs.writeFileSync(testAbs, injectNamedArg(dataImport + testSrc0, res.fn, paramName, pub));
  }
  // חיווט-צרכנים: קופסאות/לוח — import הדאטה + הזרקה לקריאות alias.fn( (dotted)
  for (const c of consumers) {
    fs.writeFileSync(c.abs, injectNamedArg(dataImport + c.src0, res.fn, paramName, pub, true));
  }

  const cwd = path.join(ROOT, '..');
  const restore = () => {
    fs.writeFileSync(abs, src0); fs.rmSync(dataAbs, { force: true });
    if (hasTest) fs.writeFileSync(testAbs, testSrc0);
    for (const c of consumers) fs.writeFileSync(c.abs, c.src0);
  };
  try {
    if (cfg.lang === 'dart') {
      execSync(`dart analyze ${abs} ${dataAbs}`, { cwd, stdio: 'pipe' });
      if (hasTest) execSync(`dart run --enable-asserts ${testAbs}`, { cwd, stdio: 'pipe' });
      // הרצת ה-proofs של הצרכנים (ייחודי)
      const proofs = [...new Set(consumers.flatMap(c => c.proofs))];
      for (const p of proofs) execSync(`dart run --enable-asserts ${p}`, { cwd, stdio: 'pipe' });
    } else if (hasTest) {
      execSync(`node ${testAbs}`, { cwd, stdio: 'pipe' });
    }
    const cn = consumers.length;
    console.log(`✅ ${rel} — מנוע-נקי · ${b.entries} ערכים ל-${dataRel}${hasTest ? ' · בדיקה ✓' : ''}${cn ? ` · ${cn} צרכנים חוברו ✓` : ''} · שקע: ${paramName}`);
    return { ok: true, rel, dataRel, paramName, pub, entries: b.entries, consumers: consumers.length };
  } catch (e) {
    restore();
    console.log(`↩ ${rel}: אימות נכשל — הוחזר לאחור (מנוע+דאטה+בדיקה+${consumers.length} צרכנים).`);
    return false;
  }
}

function extractAll() {
  const rows = scan(true);
  let ok = 0, skip = 0;
  const cleaned = [];
  for (const r of rows) {
    const res = extract(r.file);
    if (res && res.ok) { ok++; cleaned.push(res); } else skip++;
  }
  console.log(`\n═══ מכונת-הטיהור · אצווה ═══`);
  console.log(`✅ טוהרו-ירוק: ${ok} מנועים · ↷ דולגו (צרכן/מורכב): ${skip}`);
  return cleaned;
}

const args = process.argv.slice(2);
if (args[0] === '--all') {
  extractAll();
} else if (args.includes('--scan') || args.length === 0) {
  scan(args.includes('--json'));
} else if (args[0] === '--extract' && args[1]) {
  extract(args[1]);
} else {
  console.log('שימוש: node machtzev/purify.mjs --scan [--json] | --extract <file> | --all');
}
