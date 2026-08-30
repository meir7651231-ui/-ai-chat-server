#!/usr/bin/env node
/** 🧼 מחצב · מנוע-הטיהור (הכרעה 19 — "תשדרג את המנוע, לא גל-נחילים").
 *  מטהר אטומי-מנגנון מכנית: const-ליטרל סטטי בגוף/בראש האטום ⇒
 *    (1) אטום-דאטה חדש `<שם>-data.mjs` (צורת-דאטה טהורה + חוזה + בדיקת-צילום)
 *    (2) המנגנון מקבל את הדאטה כפרמטר-שקע (לא import — אטום לא מייבא אטום, חוק-חיווט)
 *    (3) כל הקוראים (קופסאות · בדיקות · לוחות) משוכתבים: import מאטום-הדאטה + העברה בקריאה
 *    (4) אימות: node --check לכל קובץ שנגעו בו + הרצת כל בדיקות-הנגועים; אדום ⇒ החזרה מלאה
 *  v1 שמרני: אטום עם פונקציה-מיוצאת יחידה, ליטרלים סטטיים בלבד, קריאות פשוטות בלבד.
 *  שימוש: --dry (מי זכאי) · --run N (טהר N אטומים) */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('../', import.meta.url).pathname;
const ATOMS = path.join(ROOT, 'new/atoms');
const SCOPES = ['new/atoms', 'new/boxes', 'new'];
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const isStaticLit = (expr) => {
  const noStr = expr.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '""');
  return !/[A-Za-z_$][\w$]*/.test(noStr.replace(/\b(true|false|null)\b/g, ''));
};
const balanced = (s, i) => {                       // מ-i (פותח) עד הסוגר התואם
  const open = s[i], close = { '[': ']', '{': '}', '(': ')' }[open];
  let d = 0, j = i, str = null;
  for (; j < s.length; j++) {
    const c = s[j];
    if (str) { if (c === '\\') j++; else if (c === str) str = null; continue; }
    if (c === "'" || c === '"' || c === '`') { str = c; continue; }
    if (c === open) d++; else if (c === close && --d === 0) return j;
  }
  return -1;
};
function eligible(file) {
  const src = fs.readFileSync(path.join(ATOMS, file), 'utf8');
  const code = strip(src);
  const fns = [...code.matchAll(/export\s+(?:const\s+(\w+)\s*=\s*(?:async\s*)?\(|function\s+(\w+)\s*\()/g)].map(m => m[1] || m[2]);
  if (fns.length !== 1) return null;
  const fn = fns[0];
  const consts = [];
  for (const m of src.matchAll(/(?:^|\n)([ \t]*)const\s+([A-Za-z_$][\w$]*)\s*=\s*(?=[\[{])/g)) {
    const start = m.index + m[0].length;
    const end = balanced(src, start);
    if (end < 0 || src[end + 1] !== ';') continue;
    const lit = src.slice(start, end + 1);
    if (lit.length < 8 || !isStaticLit(lit)) continue;
    // מגן-מוטציה: דאטה שהמנגנון משנה בגוף (push/מיון/הצבה) אינה קבוע — חילוץ היה יוצר מצב-משותף
    if (new RegExp(`\\b${m[2]}\\s*\\.\\s*(push|pop|shift|unshift|splice|sort|reverse|fill)\\b|\\b${m[2]}\\s*\\[[^\\]]*\\]\\s*=|\\b${m[2]}\\s*=`).test(code.slice(code.indexOf(m[2]) + 1))) continue;
    consts.push({ name: m[2], lit, declStart: m.index + (m[0].startsWith('\n') ? 1 : 0), declEnd: end + 2 });
  }
  if (!consts.length) return null;
  if (new Set(consts.map(c => c.name)).size !== consts.length) return null;
  // מגן-תחום: שימוש בקבוע לפני חתימת-הפונקציה-המיוצאת = עוזר-מודול חיצוני (לקח amount-in-words):
  // הרחבת-החתימה לא תגיע אליו ⇒ הפניה-חופשית בזמן-ריצה. דוחים בכבוד.
  const sigAt = code.search(new RegExp(`export\\s+(?:const\\s+${fn}\\s*=|function\\s+${fn}\\s*\\()`));
  for (const c of consts) {
    const uses = [...code.matchAll(new RegExp(`\\b${c.name}\\b`, 'g'))].map(u => u.index);
    if (uses.some(u => u < sigAt && u !== code.indexOf(`const ${c.name}`) && !code.slice(Math.max(0, u - 8), u).includes('const')))
      return null;
  }
  return { file, src, fn, consts };
}
const callers = (base, fn) => {
  const out = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!/QUARANTINE|node_modules/.test(e.name)) walk(p); continue; }
    if (!p.endsWith('.mjs') || p.endsWith(base + '.mjs')) continue;
    const t = fs.readFileSync(p, 'utf8');
    if (new RegExp(`from\\s+['"][^'"]*/${base}\\.mjs['"]`).test(t) && new RegExp(`\\b${fn}\\b`).test(t)) out.push(p);
  } };
  walk(path.join(ROOT, 'new'));
  return out;
};
function appendArgAtCalls(src, fn, extra) {   // fn(<args>) ⇒ fn(<args>, extra) · שימוש-כערך ⇒ null
  // מיסוך מחרוזות/הערות כדי שסריקה לא תתעתע; אזורי-import מוחרגים (שם מותר אזכור-לא-קריאה)
  const mask = src.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, m => 'x'.repeat(m.length))
    .replace(/\/\*[\s\S]*?\*\//g, m => 'x'.repeat(m.length))
    .replace(/\/\/[^\n]*/g, m => 'x'.repeat(m.length));
  const importSpans = [...mask.matchAll(/import[\s\S]*?from\s*x+\s*;|import\s*x+\s*;/g)]
    .map(m => [m.index, m.index + m[0].length]);
  const inImport = (i) => importSpans.some(([a, b]) => i >= a && i < b);
  const sites = [];
  for (const m of mask.matchAll(new RegExp(`\\b${fn}\\b`, 'g'))) {
    if (inImport(m.index)) continue;
    if (/[.\w$]/.test(mask[m.index - 1] || '')) continue;         // obj.fn — לא שלנו
    let j = m.index + fn.length;
    while (/\s/.test(mask[j])) j++;
    if (mask[j] !== '(') return null;                              // הפניה-כערך — לא משכתבים
    sites.push(j);
  }
  if (!sites.length) return null;
  let out = '', prev = 0;
  for (const po of sites) {
    const close = balanced(src, po);
    if (close < 0) return null;
    const inner = src.slice(po + 1, close);
    out += src.slice(prev, close) + (inner.trim() ? ', ' : '') + extra;
    prev = close;
  }
  out += src.slice(prev);
  return out;
}
function purifyOne(cand, log) {
  const base = cand.file.replace(/\.mjs$/, '');
  const dataBase = base + '-data';
  if (fs.existsSync(path.join(ATOMS, dataBase + '.mjs'))) return log(`~ ${base}: כבר קיים אטום-דאטה`);
  const names = cand.consts.map(c => c.name);
  // (1) המנגנון: הסרת ההכרזות + הרחבת-חתימה
  let mech = cand.src;
  for (const c of [...cand.consts].sort((a, b) => b.declStart - a.declStart))
    mech = mech.slice(0, c.declStart) + mech.slice(c.declEnd + (mech[c.declEnd] === '\n' ? 1 : 0));
  const sig = new RegExp(`(export\\s+(?:const\\s+${cand.fn}\\s*=\\s*(?:async\\s*)?|function\\s+${cand.fn}\\s*))\\(`);
  const sm = mech.match(sig);
  if (!sm) return log(`~ ${base}: חתימה לא-משוכתבת`);
  const po = mech.indexOf('(', sm.index + sm[1].length - 1);
  const pc = balanced(mech, po);
  if (pc < 0) return log(`~ ${base}: פרמטרים לא-נקראים`);
  const params = mech.slice(po + 1, pc).trim();
  // אריות-מקור: כמה פרמטרים היו — העטיפה בקוראים מרפדת עד-אליה כדי שברירות-מחדל יישמרו
  let origArity = 0, dpt = 0, st = null;
  if (params) { origArity = 1; for (let q = 0; q < params.length; q++) { const ch = params[q];
    if (st) { if (ch === '\\') q++; else if (ch === st) st = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') st = ch;
    else if ('([{'.includes(ch)) dpt++; else if (')]}'.includes(ch)) dpt--;
    else if (ch === ',' && dpt === 0) origArity++; } }
  mech = mech.slice(0, po + 1) + (params ? params + ', ' : '') + names.join(', ') + mech.slice(pc);
  // (2) אטום-הדאטה + חוזה + בדיקה
  const dataSrc = `/** אטום-דאטה · ${dataBase} — הדאטה שחולצה מ-${base} (מנוע-הטיהור, הכרעה 19). חוזה: ${dataBase}.contract.md */\n` +
    cand.consts.map(c => `export const ${c.name} = ${c.lit};`).join('\n') + '\n';
  const contract = `# חוזה · ${dataBase}\nאטום-דאטה שחולץ מכנית מ-${base} על-ידי מנוע-הטיהור (הכרעה 19: קבועים ושמות-דומיין = דאטה).\nהמנגנון ${base} מקבל אותו כפרמטר-שקע; הקוראים מזריקים. צורת-דאטה טהורה — אפס לוגיקה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${dataBase}.test.mjs.\n`;
  const test = `// בדיקת-צילום · ${dataBase} — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).\nimport * as D from './${dataBase}.mjs';\nimport assert from 'node:assert';\n` +
    cand.consts.map(c => `assert.strictEqual(JSON.stringify(D.${c.name}), ${JSON.stringify(JSON.stringify(eval('(' + c.lit + ')')))});`).join('\n') +
    `\nconsole.log('OK ${dataBase}');\n`;
  // (3) הקוראים — כריכת-עטיפה (v2): הקורא מייבא את האטום-הטהור בכינוי, כורך את הדאטה
  // בעטיפה מרופדת-אריות (ברירות-מחדל נשמרות), וכל שאר הקובץ — קריאות, re-export,
  // הזרקה-כערך — רואה את העטיפה. ה-API החיצוני של קופסאות לא זז.
  const cs = callers(base, cand.fn);
  const edits = new Map();
  for (const cp of cs) {
    const t = fs.readFileSync(cp, 'utf8');
    const im = t.match(new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*(['\"])([^'\"]*\\/${base}\\.mjs)\\2\\s*;?`));
    if (!im) return log(`~ ${base}: קורא בלי import-מפורש (${path.relative(ROOT, cp)})`);
    const spec = im[1].match(new RegExp(`\\b${cand.fn}\\b(\\s+as\\s+(\\w+))?`));
    if (!spec) return log(`~ ${base}: היבוא לא נמצא במפרט (${path.relative(ROOT, cp)})`);
    const local = spec[2] || cand.fn;
    const alias = `__pure_${cand.fn}`;
    const newBraces = im[1].replace(spec[0], `${cand.fn} as ${alias}`);
    const pad = `...Array(Math.max(0, ${origArity} - a.length)).fill(undefined)`;
    const wrap = `const ${local} = (...a) => ${alias}(...a, ${pad}, ${names.join(', ')});`;
    let inject;
    if (cp.endsWith('.test.mjs')) {
      const inl = cand.consts.map(c => `const ${c.name} = ${c.lit};`).join('\n');
      inject = `\n// צילום-מקומי מ-${dataBase} + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)\n${inl}\n${wrap}`;
    } else {
      const relData = path.relative(path.dirname(cp), path.join(ATOMS, dataBase + '.mjs')).replace(/^(?!\.)/, './');
      inject = `\nimport { ${names.join(', ')} } from '${relData}';\n// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה\n${wrap}`;
    }
    const stmt = im[0];
    const nu = t.replace(stmt, stmt.replace(im[1], newBraces) + inject);
    edits.set(cp, nu);
  }
  // כתיבה + אימות + החזרה-על-אדום
  const backup = new Map([[path.join(ATOMS, cand.file), cand.src]]);
  for (const [p] of edits) backup.set(p, fs.readFileSync(p, 'utf8'));
  try {
    fs.writeFileSync(path.join(ATOMS, cand.file), mech);
    fs.writeFileSync(path.join(ATOMS, dataBase + '.mjs'), dataSrc);
    fs.writeFileSync(path.join(ATOMS, dataBase + '.contract.md'), contract);
    fs.writeFileSync(path.join(ATOMS, dataBase + '.test.mjs'), test);
    for (const [p, t] of edits) fs.writeFileSync(p, t);
    for (const p of [path.join(ATOMS, cand.file), path.join(ATOMS, dataBase + '.mjs'), ...edits.keys()])
      execFileSync('node', ['--check', p], { stdio: 'pipe' });
    const tests = new Set([path.join(ATOMS, dataBase + '.test.mjs')]);
    const ownT = path.join(ATOMS, base + '.test.mjs');
    if (fs.existsSync(ownT)) tests.add(ownT);
    for (const p of edits.keys()) {
      if (p.endsWith('.test.mjs')) tests.add(p);
      else { const adj = p.replace(/\.mjs$/, '.test.mjs'); if (fs.existsSync(adj)) tests.add(adj); }  // בדיקת-הקופסה הצמודה (מגני-הכרעה!)
    }
    for (const t of tests) execFileSync('node', [t], { stdio: 'pipe' });
    // מגן-הפניות: הסורק הגלובלי חייב להישאר ירוק (תופס עוזרי-מודול שהוחמצו — לקח amount-in-words)
    execFileSync('node', [path.join(ROOT, 'machtzev/emit/free-ref-scan.mjs'), '--gate'], { stdio: 'pipe' });
    log(`✅ ${base}: ${names.join('+')} ⇒ ${dataBase} · ${edits.size} קוראים שוכתבו · בדיקות ירוקות`);
    return true;
  } catch (e) {
    for (const [p, t] of backup) fs.writeFileSync(p, t);
    for (const ext of ['.mjs', '.contract.md', '.test.mjs']) fs.rmSync(path.join(ATOMS, dataBase + ext), { force: true });
    return log(`✗ ${base}: אימות אדום — הוחזר (${String(e.message).slice(0, 60)})`);
  }
}
const mode = process.argv[2] || '--dry';
const N = parseInt(process.argv[3] || '5');
const files = fs.readdirSync(ATOMS).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs') && !f.endsWith('-data.mjs'));
const cands = files.map(eligible).filter(Boolean);
console.log(`🧼 מנוע-הטיהור: ${cands.length} אטומים זכאים-מכנית (מתוך ${files.length})`);
if (mode === '--dry') cands.slice(0, 30).forEach(c => console.log(`  · ${c.file} — ${c.consts.map(x => x.name).join(', ')}`));
if (mode === '--run') {
  let ok = 0;
  for (const c of cands) { if (ok >= N) break; if (purifyOne(c, (s) => console.log('  ' + s)) === true) ok++; }
  console.log(`🧼 טוהרו: ${ok}`);
}
