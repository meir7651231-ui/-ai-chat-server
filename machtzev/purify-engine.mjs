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
function fnSpans(src, fns) {
  // טווח-גוף לכל פונקציה-מיוצאת: מהחתימה עד סוגר-הגוף
  const spans = [];
  for (const fn of fns) {
    const sm = src.match(new RegExp(`export\\s+(?:const\\s+${fn}\\s*=\\s*(?:async\\s*)?|function\\s+${fn}\\s*)\\(`));
    if (!sm) return null;
    const po = src.indexOf('(', sm.index + sm[0].length - 1);
    const pc = balanced(src, po);
    if (pc < 0) return null;
    const ob = src.indexOf('{', pc);
    const arrowExpr = src.slice(pc + 1, ob < 0 ? pc + 1 : ob).trim();
    if (ob < 0 || (arrowExpr !== '' && arrowExpr !== '=>')) {
      // גוף-ביטוי (arrow ללא-בלוק): הטווח עד ; ברמת-אפס
      let d = 0, q = pc + 1, stq = null;
      for (; q < src.length; q++) {
        const c = src[q];
        if (stq) { if (c === '\\') q++; else if (c === stq) stq = null; continue; }
        if (c === "'" || c === '"' || c === '`') stq = c;
        else if ('([{'.includes(c)) d++;
        else if (')]}'.includes(c)) { if (d === 0) break; d--; }
        else if (c === ';' && d === 0) break;
      }
      spans.push({ fn, sig: sm.index, po, pc, end: q });
      continue;
    }
    const oe = balanced(src, ob);
    if (oe < 0) return null;
    spans.push({ fn, sig: sm.index, po, pc, end: oe });
  }
  return spans;
}
function eligible(file) {
  const src = fs.readFileSync(path.join(ATOMS, file), 'utf8');
  const code = strip(src);
  const fns = [...code.matchAll(/export\s+(?:const\s+(\w+)\s*=\s*(?:async\s*)?\(|function\s+(\w+)\s*\()/g)].map(m => m[1] || m[2]);
  if (!fns.length || fns.length > 6) return null;
  if ([...code.matchAll(/export\s+(?:const|let|var|\{|function)/g)].length !== fns.length) return null;
  const spans = fnSpans(src, fns);
  if (!spans) return null;
  const inSpan = (i) => spans.find(sp => i > sp.pc && i <= sp.end);
  const consts = [];
  for (const m of src.matchAll(/(?:^|\n)([ \t]*)const\s+([A-Za-z_$][\w$]*)\s*=\s*(?=[\[{]|-?\d|['"])/g)) {
    const start = m.index + m[0].length;
    let end;
    if ('[{'.includes(src[start])) {
      end = balanced(src, start);
      if (end < 0 || src[end + 1] !== ';') continue;
    } else {
      const sm2 = src.slice(start).match(/^(-?\d[\d._]*(?:e-?\d+)?|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")\s*;/);
      if (!sm2) continue;
      end = start + sm2[1].length - 1;
      if (src[end + 1] !== ';') { const semi = src.indexOf(';', start); if (src.slice(start, semi).trim() !== sm2[1]) continue; end = semi - 1; }
    }
    const lit = src.slice(start, end + 1);
    if (!isStaticLit(lit) || lit.length < 2) continue;
    if (new RegExp(`\\b${m[2]}\\s*\\.\\s*(push|pop|shift|unshift|splice|sort|reverse|fill)\\b|\\b${m[2]}\\s*\\[[^\\]]*\\]\\s*(=|\\+\\+|--|\\+=|-=)|\\b${m[2]}\\s*(=|\\+\\+|--)|(\\+\\+|--)\\s*${m[2]}\\b|Object\\.(assign|defineProperty)\\(\\s*${m[2]}\\b|delete\\s+${m[2]}\\b`).test(code.slice(code.indexOf(m[2]) + 1))) continue;
    consts.push({ name: m[2], lit, declStart: m.index + (m[0].startsWith('\n') ? 1 : 0), declEnd: end + 2 });
  }
  if (!consts.length) return null;
  if (new Set(consts.map(c => c.name)).size !== consts.length) return null;
  // מגן-טווחים: כל שימוש (מחוץ להכרזה) חייב לשבת בגוף פונקציה-מיוצאת; הפונקציות-המשתמשות יורחבו
  const users = new Set();
  for (const c of consts) {
    for (const u of src.matchAll(new RegExp(`\\b${c.name}\\b`, 'g'))) {
      if (u.index >= c.declStart && u.index <= c.declEnd) continue;
      const sp = inSpan(u.index);
      if (!sp) return null;                        // שימוש מחוץ-לגוף-מיוצא (עוזר-מודול) — דוחים
      users.add(sp.fn);
    }
  }
  if (!users.size) return null;
  return { file, src, fns: [...users], allFns: fns, consts };
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
const normLit = (x) => x.replace(/\s+/g, '');
function findExistingData(lit) {
  // הכרעה 5: אם ליטרל זהה כבר מיוצא מאטום-דאטה קיים — משתמשים בו, לא משכפלים
  for (const f of fs.readdirSync(ATOMS)) {
    if (!f.endsWith('.mjs') || f.endsWith('.test.mjs')) continue;
    const t = fs.readFileSync(path.join(ATOMS, f), 'utf8');
    for (const m of t.matchAll(/export const (\w+) = ([\[{])/g)) {
      const st = m.index + m[0].length - 1;
      const en = balanced(t, st);
      if (en > 0 && normLit(t.slice(st, en + 1)) === normLit(lit)) return { file: f, name: m[1] };
    }
  }
  return null;
}
function purifyOne(cand, log) {
  const base = cand.file.replace(/\.mjs$/, '');
  const dataBase = base + '-data';
  if (fs.existsSync(path.join(ATOMS, dataBase + '.mjs'))) return log(`~ ${base}: כבר קיים אטום-דאטה`);
  for (const c of cand.consts) c.existing = findExistingData(c.lit);
  const names = cand.consts.map(c => c.name);
  let mech = cand.src;
  for (const c of [...cand.consts].sort((a2, b2) => b2.declStart - a2.declStart))
    mech = mech.slice(0, c.declStart) + mech.slice(c.declEnd + (mech[c.declEnd] === '\n' ? 1 : 0));
  // הרחבת-חתימה לכל פונקציה-משתמשת (מהאחרונה לראשונה — אינדקסים יציבים) + אריות-מקור פר-פונקציה
  const arity = {};
  const spans2 = fnSpans(mech, cand.fns);
  if (!spans2) return log(`~ ${base}: טווחים לא-נקראים אחרי-הסרה`);
  for (const sp of [...spans2].sort((x, y) => y.po - x.po)) {
    const params = mech.slice(sp.po + 1, sp.pc).trim();
    let n = 0, d = 0, stq = null;
    if (params) { n = 1; for (let q = 0; q < params.length; q++) { const ch = params[q];
      if (stq) { if (ch === '\\') q++; else if (ch === stq) stq = null; continue; }
      if (ch === "'" || ch === '"' || ch === '`') stq = ch;
      else if ('([{'.includes(ch)) d++; else if (')]}'.includes(ch)) d--;
      else if (ch === ',' && d === 0) n++; } }
    arity[sp.fn] = n;
    mech = mech.slice(0, sp.po + 1) + (params ? params.replace(/,\s*$/, '') + ', ' : '') + names.join(', ') + mech.slice(sp.pc);
  }
  const newConsts = cand.consts.filter(c => !c.existing);
  const dataSrc = `/** אטום-דאטה · ${dataBase} — הדאטה שחולצה מ-${base} (מנוע-הטיהור, הכרעה 19). חוזה: ${dataBase}.contract.md */\n` +
    newConsts.map(c => `export const ${c.name} = ${c.lit};`).join('\n') + '\n';
  const contract = `# חוזה · ${dataBase}\nאטום-דאטה שחולץ מכנית מ-${base} על-ידי מנוע-הטיהור (הכרעה 19: קבועים ושמות-דומיין = דאטה).\nהמנגנון ${base} מקבל אותו כפרמטר-שקע; הקוראים מזריקים. צורת-דאטה טהורה — אפס לוגיקה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${dataBase}.test.mjs.\n`;
  const test = `// בדיקת-צילום · ${dataBase} — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).\nimport * as D from './${dataBase}.mjs';\nimport assert from 'node:assert';\n` +
    newConsts.map(c => `assert.strictEqual(JSON.stringify(D.${c.name}), ${JSON.stringify(JSON.stringify(eval('(' + c.lit + ')')))});`).join('\n') +
    `\nconsole.log('OK ${dataBase}');\n`;
  // קוראים: עטיפה פר-פונקציה-מורחבת שמיובאת אצלם
  const uniq = (c) => `__d_${base.replace(/-/g, '_')}_${c.name}`;
  const csSet = new Set();
  for (const fn of cand.fns) for (const cp of callers(base, fn)) csSet.add(cp);
  const edits = new Map();
  for (const cp of csSet) {
    let t = fs.readFileSync(cp, 'utf8');
    const im = t.match(new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*(['\"])([^'\"]*\\/${base}\\.mjs)\\2\\s*;?`));
    if (!im) return log(`~ ${base}: קורא בלי import-מפורש (${path.relative(ROOT, cp)})`);
    let braces = im[1];
    const wraps = [];
    let extended = false;
    for (const fn of cand.fns) {
      const alias = `__pure_${fn}`;
      if (braces.includes(`${fn} as ${alias}`)) {
        // 🔁 שילוב-מעברים: עטיפה קיימת — הדאטה החדשה מצטרפת לזנב-הקריאה
        const wre = new RegExp(`(const \\w+ = \\(\\.\\.\\.a\\) => ${alias}\\(\\.\\.\\.a,[^\\n]*)\\);`);
        if (!wre.test(t)) return log(`~ ${base}: עטיפה קיימת לא-נמצאה (${path.relative(ROOT, cp)})`);
        t = t.replace(wre, `$1, ${cand.consts.map(uniq).join(', ')});`);
        extended = true;
        continue;
      }
      const spec = braces.match(new RegExp(`\\b${fn}\\b(\\s+as\\s+(\\w+))?`));
      if (!spec) continue;                          // הקורא לא מייבא את הפונקציה הזו
      const local = spec[2] || fn;
      braces = braces.replace(spec[0], `${fn} as ${alias}`);
      const pad = `...Array(Math.max(0, ${arity[fn]} - a.length)).fill(undefined)`;
      wraps.push(`const ${local} = (...a) => ${alias}(...a, ${pad}, ${cand.consts.map(uniq).join(', ')});`);
    }
    if (!wraps.length && !extended) continue;
    let inject;
    if (cp.endsWith('.test.mjs')) {
      const inl = cand.consts.map(c => `const ${uniq(c)} = ${c.lit};`).join('\n');
      inject = `\n// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור; בדיקה לא מייבאת אטום-שכן)\n${inl}` + (wraps.length ? `\n${wraps.join('\n')}` : '');
    } else {
      const byHome = new Map();
      for (const c of cand.consts) {
        const home = c.existing ? c.existing.file : dataBase + '.mjs';
        const exp = c.existing ? c.existing.name : c.name;
        if (!byHome.has(home)) byHome.set(home, []);
        byHome.get(home).push(`${exp} as ${uniq(c)}`);
      }
      const ims = [...byHome].map(([home, specs]) => {
        const rel = path.relative(path.dirname(cp), path.join(ATOMS, home)).replace(/^(?!\.)/, './');
        return `import { ${specs.join(', ')} } from '${rel}';`;
      }).join('\n');
      inject = `\n${ims}` + (wraps.length ? `\n// עטיפת-כריכה (מנוע-הטיהור): הדאטה נכרכת כאן — ה-API החיצוני זהה\n${wraps.join('\n')}` : '');
    }
    edits.set(cp, t.replace(im[0], im[0].replace(im[1], braces) + inject));
  }

  // 🛡️ מגן-ספירת-ייבוא בקופסאות: ספירה נעולה בבדיקה הצמודה מתעדכנת לערך-האמת החדש
  for (const [cp, nu] of [...edits]) {
    if (cp.endsWith('.test.mjs')) continue;
    const adj = cp.replace(/\.mjs$/, '.test.mjs');
    if (!fs.existsSync(adj)) continue;
    const at = edits.has(adj) ? edits.get(adj) : fs.readFileSync(adj, 'utf8');
    const cnt = (nu.match(/from '\.\.\/atoms\//g) || []).length;
    const patched = at.replace(/\.length === (\d+), 'מגן: (\d+) ייבואי-אטום([^']*)'/g,
      (mm, a2, b2, rest) => `.length === ${cnt}, 'מגן: ${cnt} ייבואי-אטום${rest.includes('הכרעה 19') ? rest : rest + ' — הכרעה 19'}'`);
    if (patched !== at) edits.set(adj, patched);
  }
  const backup = new Map([[path.join(ATOMS, cand.file), cand.src]]);
  for (const [pp] of edits) backup.set(pp, fs.readFileSync(pp, 'utf8'));
  const mkData = newConsts.length > 0;
  try {
    fs.writeFileSync(path.join(ATOMS, cand.file), mech);
    if (mkData) {
      fs.writeFileSync(path.join(ATOMS, dataBase + '.mjs'), dataSrc);
      fs.writeFileSync(path.join(ATOMS, dataBase + '.contract.md'), contract);
      fs.writeFileSync(path.join(ATOMS, dataBase + '.test.mjs'), test);
    }
    for (const [pp, tt] of edits) fs.writeFileSync(pp, tt);
    for (const pp of [path.join(ATOMS, cand.file), ...(mkData ? [path.join(ATOMS, dataBase + '.mjs')] : []), ...edits.keys()])
      execFileSync('node', ['--check', pp], { stdio: 'pipe' });
    const tests = new Set(mkData ? [path.join(ATOMS, dataBase + '.test.mjs')] : []);
    const ownT = path.join(ATOMS, base + '.test.mjs');
    if (fs.existsSync(ownT)) tests.add(ownT);
    for (const pp of edits.keys()) {
      if (pp.endsWith('.test.mjs')) tests.add(pp);
      else { const adj = pp.replace(/\.mjs$/, '.test.mjs'); if (fs.existsSync(adj)) tests.add(adj); }
    }
    for (const tt of tests) execFileSync('node', [tt], { stdio: 'pipe' });
    execFileSync('node', [path.join(ROOT, 'machtzev/emit/free-ref-scan.mjs'), '--gate'], { stdio: 'pipe' });
    log(`✅ ${base}: ${names.join('+')} ⇒ ${dataBase} · ${cand.fns.length} פונקציות · ${edits.size} קוראים`);
    return true;
  } catch (e) {
    if (process.env.PDEBUG) { const dd = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/pdebug'; fs.mkdirSync(dd, { recursive: true }); for (const [pp] of backup) { try { fs.copyFileSync(pp, path.join(dd, base + '__' + path.basename(pp))); } catch { } } }
    for (const [pp, tt] of backup) fs.writeFileSync(pp, tt);
    if (mkData) for (const ext of ['.mjs', '.contract.md', '.test.mjs']) fs.rmSync(path.join(ATOMS, dataBase + ext), { force: true });
    return log(`✗ ${base}: אימות אדום — הוחזר (${String(e.message).slice(0, 60)} · ${String(e.stderr || '').slice(0, 200).replace(/\n/g, ' ⏎ ')})`);
  }
}


// 🎓 לקסר-אמת (typescript, כמו free-ref-scan): מחרוזות עם מיקום מדויק והקשר-הורה —
// אפס-ניחושי-רגקס (הלקח מקריסת wa: parity-של-backticks איננו לקסר).
import { createRequire } from 'node:module';
const _req = createRequire('/home/user/maor-system/');
const _ts = _req('typescript');
function collectStringSites(src) {
  const sf = _ts.createSourceFile('x.mjs', src, _ts.ScriptTarget.ES2022, true);
  const sites = [];
  const inParam = (n) => { let up = n; while (up) { if (_ts.isParameter(up)) return true; up = up.parent; } return false; };
  const pushTplChunk = (n) => {
    // חלק-סטטי של תבנית: `טקסט${ · }טקסט${ · }טקסט` — מוחלף ב-`${ref}` באותם גבולות
    if (!n.text || inParam(n)) return;
    const at = n.getStart(sf);
    const raw = src.slice(at, n.end);
    const suffix = raw.endsWith('${') ? '${' : '`';
    const prefix = raw[0];
    sites.push({ at, len: n.end - at, v: n.text, wrap: (ref) => `${prefix}\${${ref}}${suffix}` });
  };
  const walk = (n) => {
    if (n.kind === _ts.SyntaxKind.StringLiteral) {
      const p = n.parent;
      let skip = false;
      if (p && (_ts.isImportDeclaration(p) || _ts.isExportDeclaration(p))) skip = true;          // module specifier
      if (p && _ts.isPropertyAssignment(p) && p.name === n) skip = true;                          // מפתח-אובייקט
      if (inParam(n)) skip = true;                                                                // ברירת-מחדל בחתימה
      if (!skip) {
        const at = n.getStart(sf);
        sites.push({ at, len: n.end - at, v: n.text });
      }
      return;
    }
    if (n.kind === _ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
      if (n.text && !inParam(n)) { const at = n.getStart(sf); sites.push({ at, len: n.end - at, v: n.text }); }
      return;
    }
    if (n.kind === _ts.SyntaxKind.TemplateExpression) {
      pushTplChunk(n.head);
      for (const sp of n.templateSpans) { walk(sp.expression); pushTplChunk(sp.literal); }
      return;
    }
    _ts.forEachChild(n, walk);
  };
  walk(sf);
  return sites;
}
// ── 🧵 v3: חילוץ-מחרוזות-דאטה (עברית + דומיין) מהמנגנון לטבלת-שקע ──
const HEBRE = /[\u0590-\u05FF]/;
function eligibleStrings(file) {
  const src = fs.readFileSync(path.join(ATOMS, file), 'utf8');
  const code = strip(src);
  const fns = [...code.matchAll(/export\s+(?:const\s+(\w+)\s*=\s*(?:async\s*)?\(|function\s+(\w+)\s*\()/g)].map(m => m[1] || m[2]);
  if (fns.length !== 1) return null;
  const fn = fns[0];
  const sigAt = src.search(new RegExp(`export\\s+(?:const\\s+${fn}\\s*=|function\\s+${fn}\\s*\\()`));
  if (sigAt < 0) return null;
  const sites = [];
  for (const st of collectStringSites(src)) {
    const v = st.v;
    if (!v) continue;
    if (!(/[\u0590-\u05FF]/.test(v) || /[a-zA-Z]{3,}/.test(v))) continue;
    if (st.at < sigAt) return null;                                   // מחרוזת בעוזר-מודול — דוחים
    sites.push(st);
  }
  if (!sites.length) return null;
  return { file, src, fn, sites };
}
function purifyStrings(cand, log) {
  const base = cand.file.replace(/\.mjs$/, '');
  const dataBase = base + '-strings';
  if (fs.existsSync(path.join(ATOMS, dataBase + '.mjs'))) return log(`~ ${base}: כבר קיים אטום-מחרוזות`);
  const CONST = base.replace(/-/g, '_').toUpperCase() + '_T';
  let tParam = 'T'; let ti = 2;
  while (new RegExp(`\\b${tParam}\\b`).test(cand.src)) tParam = 'T' + ti++;
  // מיפוי ערכים-ייחודיים ⇒ מפתחות
  const keys = new Map();
  for (const st of cand.sites) if (!keys.has(st.v)) keys.set(st.v, 'k' + (keys.size + 1));
  // שכתוב מהסוף להתחלה
  let mech = cand.src;
  for (const st of [...cand.sites].sort((a, b) => b.at - a.at)) {
    const ref = `${tParam}.${keys.get(st.v)}`;
    mech = mech.slice(0, st.at) + (st.wrap ? st.wrap(ref) : ref) + mech.slice(st.at + st.len);
  }
  // הרחבת-חתימה
  const sig = new RegExp(`(export\\s+(?:const\\s+${cand.fn}\\s*=\\s*(?:async\\s*)?|function\\s+${cand.fn}\\s*))\\(`);
  const sm = mech.match(sig);
  if (!sm) return log(`~ ${base}: חתימה לא-משוכתבת`);
  const po = mech.indexOf('(', sm.index + sm[1].length - 1);
  const pc = balanced(mech, po);
  if (pc < 0) return log(`~ ${base}: פרמטרים לא-נקראים`);
  const params = mech.slice(po + 1, pc).trim();
  let origArity = 0, dpt = 0, stq = null;
  if (params) { origArity = 1; for (let q = 0; q < params.length; q++) { const ch = params[q];
    if (stq) { if (ch === '\\') q++; else if (ch === stq) stq = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') stq = ch;
    else if ('([{'.includes(ch)) dpt++; else if (')]}'.includes(ch)) dpt--;
    else if (ch === ',' && dpt === 0) origArity++; } }
  mech = mech.slice(0, po + 1) + (params ? params.replace(/,\s*$/, '') + ', ' : '') + tParam + mech.slice(pc);
  const litObj = '{\n' + [...keys].map(([v, k]) => `  ${k}: ${JSON.stringify(v).replace(/\u2028|\u2029/g, '')},`).join('\n') + '\n}';
  const existing = findExistingData(litObj);
  const dataSrc = `/** אטום-דאטה · ${dataBase} — מחרוזות-התצוגה/דומיין שחולצו מ-${base} (מנוע-הטיהור v3, הכרעה 19). חוזה: ${dataBase}.contract.md */\nexport const ${CONST} = ${litObj};\n`;
  const contract = `# חוזה · ${dataBase}\nמחרוזות-דאטה (עברית/דומיין) שחולצו מכנית מהמנגנון ${base} (הכרעה 19: שמות ומשמעות = דאטה).\nהמנגנון מקבל אותן כטבלת-שקע ${tParam}; הקוראים כורכים דרך העטיפה. אפס לוגיקה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${dataBase}.test.mjs.\n`;
  const test = `// בדיקת-צילום · ${dataBase} — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.\nimport { ${CONST} } from './${dataBase}.mjs';\nimport assert from 'node:assert';\nassert.strictEqual(JSON.stringify(${CONST}), ${JSON.stringify(JSON.stringify(Object.fromEntries([...keys].map(([v, k]) => [k, v]))))});\nconsole.log('OK ${dataBase}');\n`;
  // קוראים — אותה כריכת-עטיפה של v2
  const cs = callers(base, cand.fn);
  const edits = new Map();
  for (const cp of cs) {
    let t = fs.readFileSync(cp, 'utf8');
    const im = t.match(new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*(['\"])([^'\"]*\\/${base}\\.mjs)\\2\\s*;?`));
    if (!im) return log(`~ ${base}: קורא בלי import-מפורש (${path.relative(ROOT, cp)})`);
    const alias = `__pure_${cand.fn}`;
    if (im[1].includes(`${cand.fn} as ${alias}`)) {
      // 🔁 שילוב-מעברים: הרחבת עטיפה קיימת בדאטת-המחרוזות
      const wre = new RegExp(`(const \\w+ = \\(\\.\\.\\.a\\) => ${alias}\\(\\.\\.\\.a,[^\\n]*)\\);`);
      if (!wre.test(t)) return log(`~ ${base}: עטיפה קיימת לא-נמצאה (${path.relative(ROOT, cp)})`);
      const dAlias2 = `__d_${cand.fn}_${CONST}`;
      t = t.replace(wre, `$1, ${dAlias2});`);
      if (cp.endsWith('.test.mjs')) {
        edits.set(cp, t.replace(im[0], im[0] + `\nconst ${dAlias2} = ${litObj};`));
      } else {
        const home2 = existing ? existing.file : dataBase + '.mjs';
        const exp2 = existing ? existing.name : CONST;
        const rel2 = path.relative(path.dirname(cp), path.join(ATOMS, home2)).replace(/^(?!\.)/, './');
        edits.set(cp, t.replace(im[0], im[0] + `\nimport { ${exp2} as ${dAlias2} } from '${rel2}';`));
      }
      continue;
    }
    const spec = im[1].match(new RegExp(`\\b${cand.fn}\\b(\\s+as\\s+(\\w+))?`));
    if (!spec) return log(`~ ${base}: היבוא לא נמצא במפרט`);
    const local = spec[2] || cand.fn;
    const newBraces = im[1].replace(spec[0], `${cand.fn} as ${alias}`);
    const pad = `...Array(Math.max(0, ${origArity} - a.length)).fill(undefined)`;
    const dAlias = `__d_${cand.fn}_${CONST}`;
    const wrap = `const ${local} = (...a) => ${alias}(...a, ${pad}, ${dAlias});`;
    let inject;
    if (cp.endsWith('.test.mjs')) {
      inject = `\n// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)\nconst ${dAlias} = ${litObj};\n${wrap}`;
    } else {
      const home = existing ? existing.file : dataBase + '.mjs';
      const exp = existing ? existing.name : CONST;
      const rel = path.relative(path.dirname(cp), path.join(ATOMS, home)).replace(/^(?!\.)/, './');
      inject = `\nimport { ${exp} as ${dAlias} } from '${rel}';\n// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן\n${wrap}`;
    }
    edits.set(cp, t.replace(im[0], im[0].replace(im[1], newBraces) + inject));
  }

  // 🛡️ מגן-ספירת-ייבוא בקופסאות: ספירה נעולה בבדיקה הצמודה מתעדכנת לערך-האמת החדש
  for (const [cp, nu] of [...edits]) {
    if (cp.endsWith('.test.mjs')) continue;
    const adj = cp.replace(/\.mjs$/, '.test.mjs');
    if (!fs.existsSync(adj)) continue;
    const at = edits.has(adj) ? edits.get(adj) : fs.readFileSync(adj, 'utf8');
    const cnt = (nu.match(/from '\.\.\/atoms\//g) || []).length;
    const patched = at.replace(/\.length === (\d+), 'מגן: (\d+) ייבואי-אטום([^']*)'/g,
      (mm, a2, b2, rest) => `.length === ${cnt}, 'מגן: ${cnt} ייבואי-אטום${rest.includes('הכרעה 19') ? rest : rest + ' — הכרעה 19'}'`);
    if (patched !== at) edits.set(adj, patched);
  }
  const backup = new Map([[path.join(ATOMS, cand.file), cand.src]]);
  for (const [pp] of edits) backup.set(pp, fs.readFileSync(pp, 'utf8'));
  const mkData = !existing;
  try {
    fs.writeFileSync(path.join(ATOMS, cand.file), mech);
    if (mkData) {
      fs.writeFileSync(path.join(ATOMS, dataBase + '.mjs'), dataSrc);
      fs.writeFileSync(path.join(ATOMS, dataBase + '.contract.md'), contract);
      fs.writeFileSync(path.join(ATOMS, dataBase + '.test.mjs'), test);
    }
    for (const [pp, tt] of edits) fs.writeFileSync(pp, tt);
    for (const pp of [path.join(ATOMS, cand.file), ...(mkData ? [path.join(ATOMS, dataBase + '.mjs')] : []), ...edits.keys()])
      execFileSync('node', ['--check', pp], { stdio: 'pipe' });
    const tests = new Set(mkData ? [path.join(ATOMS, dataBase + '.test.mjs')] : []);
    const ownT = path.join(ATOMS, base + '.test.mjs');
    if (fs.existsSync(ownT)) tests.add(ownT);
    for (const pp of edits.keys()) {
      if (pp.endsWith('.test.mjs')) tests.add(pp);
      else { const adj = pp.replace(/\.mjs$/, '.test.mjs'); if (fs.existsSync(adj)) tests.add(adj); }
    }
    for (const tt of tests) execFileSync('node', [tt], { stdio: 'pipe' });
    execFileSync('node', [path.join(ROOT, 'machtzev/emit/free-ref-scan.mjs'), '--gate'], { stdio: 'pipe' });
    log(`✅ ${base}: ${keys.size} מחרוזות ⇒ ${existing ? existing.file : dataBase} · ${edits.size} קוראים נכרכו`);
    return true;
  } catch (e) {
    if (process.env.PDEBUG) { const dd = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/pdebug'; fs.mkdirSync(dd, { recursive: true }); for (const [pp] of backup) { try { fs.copyFileSync(pp, path.join(dd, base + '__' + path.basename(pp))); } catch { } } }
    for (const [pp, tt] of backup) fs.writeFileSync(pp, tt);
    if (mkData) for (const ext of ['.mjs', '.contract.md', '.test.mjs']) fs.rmSync(path.join(ATOMS, dataBase + ext), { force: true });
    return log(`✗ ${base}: אימות אדום — הוחזר (${String(e.message).slice(0, 60)} · ${String(e.stderr || '').slice(0, 200).replace(/\n/g, ' ⏎ ')})`);
  }
}


// ── 🪺 v4: קינון-עוזרים — עוזרי-מודול נבלעים לתוך הפונקציה-המיוצאת (קובץ חד-ייצוא),
// כך שחילוץ-הדאטה (v2/v3) מגיע לכל הגוף: הפרמטר-שקע נראה גם לעוזרים (סגירה). ──
function nestHelpers(file) {
  const src = fs.readFileSync(path.join(ATOMS, file), 'utf8');
  const code = strip(src);
  const exps = [...code.matchAll(/export\s+(?:const|function|let|var|\{)/g)];
  if (exps.length !== 1) return null;
  const fm = code.match(/export\s+(?:const\s+(\w+)\s*=\s*(?:async\s*)?\(|function\s+(\w+)\s*\()/);
  if (!fm) return null;
  const fn = fm[1] || fm[2];
  // מקננים רק אטום-מזוהם (מחרוזת-דאטה או טבלת-const בגוף) — אטום נקי לא נוגעים
  const noCom = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const hasData = /['"][^'"\n]*[\u0590-\u05FF]/.test(noCom) || /['"][^'"\n]*[a-zA-Z]{3,}[^'"\n]*['"]/.test(noCom) || /(?:^|\n)[ \t]*const\s+\w+\s*=\s*[\[{]/.test(noCom);
  if (!hasData) return null;
  const sigAt = src.search(new RegExp(`export\\s+(?:const\\s+${fn}\\s*=|function\\s+${fn}\\s*\\()`));
  if (sigAt < 0) return null;
  // איסוף הכרזות-עזר ברמת-המודול (פונקציות/קבועים), לפני או אחרי הייצוא
  const helpers = [];
  const declRe = /(?:^|\n)(?:function\s+(\w+)|const\s+(\w+)\s*=)/g;
  let m;
  while ((m = declRe.exec(src))) {
    const at = m.index + (m[0].startsWith('\n') ? 1 : 0);
    if (at === sigAt || src.slice(Math.max(0, at - 7), at).includes('export')) continue;
    // גוף-ההכרזה: פונקציה ⇒ סוגריים-מאוזנים אחרי ה-{; קבוע ⇒ עד ; ברמת-אפס
    let end;
    if (m[1]) {
      const ob = src.indexOf('{', declRe.lastIndex);
      if (ob < 0) return null;
      end = balanced(src, ob);
      if (end < 0) return null;
      end++;
    } else {
      let d = 0, q = declRe.lastIndex, stq = null;
      for (; q < src.length; q++) {
        const c = src[q];
        if (stq) { if (c === '\\') q++; else if (c === stq) stq = null; continue; }
        if (c === "'" || c === '\"' || c === '`') stq = c;
        else if ('([{'.includes(c)) d++;
        else if (')]}'.includes(c)) d--;
        else if (c === ';' && d === 0) break;
      }
      if (q >= src.length) return null;
      end = q + 1;
    }
    helpers.push({ at, end, text: src.slice(at, end), name: m[1] || m[2] });
    declRe.lastIndex = end;
  }
  if (!helpers.length) return null;
  // הסרה מהמודול (מהסוף) והזרקה אחרי פתיחת-גוף-הפונקציה
  let out = src;
  for (const h of [...helpers].sort((a, b) => b.at - a.at))
    out = out.slice(0, h.at) + out.slice(h.end + (out[h.end] === '\n' ? 1 : 0));
  const sig2 = out.search(new RegExp(`export\\s+(?:const\\s+${fn}\\s*=|function\\s+${fn}\\s*\\()`));
  const po = out.indexOf('(', sig2);
  const pc = balanced(out, po);
  if (pc < 0) return null;
  const ob = out.indexOf('{', pc);
  const arrowAt = out.slice(pc, pc + 12).match(/^\)\s*(?:=>)?/);
  if (ob < 0 || (out.slice(pc + 1, ob).trim() !== '' && out.slice(pc + 1, ob).trim() !== '=>')) return null; // גוף-ביטוי — לא מקננים
  const nested = '\n  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה\n' +
    helpers.map(h => '  ' + h.text.replace(/\n/g, '\n  ')).join('\n') + '\n';
  return { file, src, out: out.slice(0, ob + 1) + nested + out.slice(ob + 1), fn };
}

// ── 📦 v6: מטהר-קופסאות — מחרוזות-דאטה בקופסה יורדות לאטום-דאטה שהקופסה מייבאת ישירות
// (חוק-חיווט: קופסה⇐אטום מותר — אין צורך בעטיפות/פרמטרים). ──
const BOXES = path.join(ROOT, 'new/boxes');
function purifyBox(file, log) {
  const src = fs.readFileSync(path.join(BOXES, file), 'utf8');
  const base = file.replace(/\.mjs$/, '');
  const dataBase = base + '-terms';
  if (fs.existsSync(path.join(ATOMS, dataBase + '.mjs'))) return log(`~ ${base}: כבר קיים אטום-מונחים`);
  const sites = collectStringSites(src).filter(st => /[\u0590-\u05FF]/.test(st.v) || /[a-zA-Z]{3,}/.test(st.v));  // עברית + מחרוזות-דומיין
  if (!sites.length) return log(`~ ${base}: אין מחרוזות-עבריות פשוטות`);
  const CONST = base.replace(/-/g, '_').toUpperCase() + '_TERMS';
  const keys = new Map();
  for (const st of sites) if (!keys.has(st.v)) keys.set(st.v, 'k' + (keys.size + 1));
  let out = src;
  for (const st of [...sites].sort((a, b) => b.at - a.at)) {
    const ref = `${CONST}.${keys.get(st.v)}`;
    out = out.slice(0, st.at) + (st.wrap ? st.wrap(ref) : ref) + out.slice(st.at + st.len);
  }
  // ייבוא אחרי ה-import האחרון הקיים
  const lastIm = [...out.matchAll(/^import[^\n]*$/gm)].pop();
  const imLine = `import { ${CONST} } from '../atoms/${dataBase}.mjs';`;
  out = lastIm ? out.slice(0, lastIm.index + lastIm[0].length) + '\n' + imLine + out.slice(lastIm.index + lastIm[0].length) : imLine + '\n' + out;
  if (!lastIm) return log(`~ ${base}: קופסה בלי imports — חריג`);
  const litObj = '{\n' + [...keys].map(([v, k]) => `  ${k}: ${JSON.stringify(v)},`).join('\n') + '\n}';
  const dataSrc = `/** אטום-דאטה · ${dataBase} — מונחי-התצוגה של קופסת-${base} (מנוע-הטיהור v6, הכרעה 19). חוזה: ${dataBase}.contract.md */\nexport const ${CONST} = ${litObj};\n`;
  const contract = `# חוזה · ${dataBase}\nמונחי-תצוגה עבריים שחולצו מכנית מקופסת-${base} (הכרעה 19: המשמעות = דאטה; הקופסה מחווטת).\nהקופסה מייבאת ישירות (קופסה⇐אטום מותר). אפס לוגיקה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${dataBase}.test.mjs.\n`;
  const test = `// בדיקת-צילום · ${dataBase} — המונחים זהים ביט-אחר-ביט למקור.\nimport { ${CONST} } from './${dataBase}.mjs';\nimport assert from 'node:assert';\nassert.strictEqual(JSON.stringify(${CONST}), ${JSON.stringify(JSON.stringify(Object.fromEntries([...keys].map(([v, k]) => [k, v]))))});\nconsole.log('OK ${dataBase}');\n`;
  // מגן-ספירה בבדיקה הצמודה
  const adj = path.join(BOXES, base + '.test.mjs');
  let adjOut = null;
  if (fs.existsSync(adj)) {
    const at = fs.readFileSync(adj, 'utf8');
    const cnt = (out.match(/from '\.\.\/atoms\//g) || []).length;
    let patched = at.replace(/\.length === (\d+), 'מגן: (\d+) ייבואי-אטום([^']*)'/g,
      (mm, a2, b2, rest) => `.length === ${cnt}, 'מגן: ${cnt} ייבואי-אטום${rest.includes('הכרעה 19') ? rest : rest + ' — הכרעה 19'}'`);
    // מגני-מקור שמצמידים ליטרל שהוזז: הצורה מתעדכנת ל-CONST.kN; ההתנהגות מוצמדת בצילום-הדאטה
    let touchedPins = false;
    for (const [v, k] of keys) {
      const tok = `'${v.replace(/\\/g, '\\\\')}'`;
      if (patched.includes(tok)) { patched = patched.split(tok).join(`${CONST}.${k}`); touchedPins = true; }
    }
    if (touchedPins) {
      const fi = patched.match(/^import[^\n]*$/m);
      const snap = `const ${CONST} = ${litObj};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)`;
      patched = fi ? patched.replace(fi[0], fi[0] + '\n' + snap) : snap + '\n' + patched;
    }
    if (patched !== at) adjOut = patched;
  }
  const backup = new Map([[path.join(BOXES, file), src]]);
  if (adjOut) backup.set(adj, fs.readFileSync(adj, 'utf8'));
  try {
    fs.writeFileSync(path.join(BOXES, file), out);
    fs.writeFileSync(path.join(ATOMS, dataBase + '.mjs'), dataSrc);
    fs.writeFileSync(path.join(ATOMS, dataBase + '.contract.md'), contract);
    fs.writeFileSync(path.join(ATOMS, dataBase + '.test.mjs'), test);
    if (adjOut) fs.writeFileSync(adj, adjOut);
    execFileSync('node', ['--check', path.join(BOXES, file)], { stdio: 'pipe' });
    execFileSync('node', [path.join(ATOMS, dataBase + '.test.mjs')], { stdio: 'pipe' });
    if (fs.existsSync(adj)) execFileSync('node', [adj], { stdio: 'pipe' });
    log(`✅ ${base}: ${keys.size} מונחים ⇒ ${dataBase}`);
    return true;
  } catch (e) {
    if (process.env.PDEBUG) { const dd = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/pdebug'; fs.mkdirSync(dd, { recursive: true }); try { fs.copyFileSync(path.join(BOXES, file), path.join(dd, 'box__' + file)); } catch { } }
    for (const [pp, tt] of backup) fs.writeFileSync(pp, tt);
    for (const ext of ['.mjs', '.contract.md', '.test.mjs']) fs.rmSync(path.join(ATOMS, dataBase + ext), { force: true });
    return log(`✗ ${base}: אימות אדום — הוחזר (${String(e.stderr || e.message).slice(0, 500).replace(/\n/g, ' ⏎ ')})`);
  }
}

const mode = process.argv[2] || '--dry';
const N = parseInt(process.argv[3] || '5');
const files = fs.readdirSync(ATOMS).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs') && !f.endsWith('-data.mjs'));
const cands = files.map(eligible).filter(Boolean);
console.log(`🧼 מנוע-הטיהור: ${cands.length} אטומים זכאים-מכנית (מתוך ${files.length})`);
if (mode === '--dry') cands.slice(0, 30).forEach(c => console.log(`  · ${c.file} — ${c.consts.map(x => x.name).join(', ')}`));
if (mode === '--boxes') {
  let ok = 0;
  for (const f of fs.readdirSync(BOXES).filter(x => x.endsWith('.mjs') && !x.endsWith('.test.mjs'))) {
    if (ok >= N) break;
    if (purifyBox(f, (x) => console.log('  ' + x)) === true) ok++;
  }
  console.log(`📦 קופסאות טוהרו: ${ok}`);
}
if (mode === '--nest') {
  let ok = 0;
  for (const f of files) {
    if (ok >= N) break;
    const nh = nestHelpers(f);
    if (!nh) continue;
    const base = f.replace(/\.mjs$/, '');
    try {
      fs.writeFileSync(path.join(ATOMS, f), nh.out);
      execFileSync('node', ['--check', path.join(ATOMS, f)], { stdio: 'pipe' });
      const ownT = path.join(ATOMS, base + '.test.mjs');
      if (fs.existsSync(ownT)) execFileSync('node', [ownT], { stdio: 'pipe' });
      execFileSync('node', [path.join(ROOT, 'machtzev/emit/free-ref-scan.mjs'), '--gate'], { stdio: 'pipe' });
      console.log(`  🪺 ${base}: עוזרים קוננו`);
      ok++;
    } catch (e) {
      fs.writeFileSync(path.join(ATOMS, f), nh.src);
      console.log(`  ✗ ${base}: קינון נכשל — הוחזר`);
    }
  }
  console.log(`🪺 קוננו: ${ok}`);
}
if (mode === '--strings') {
  const scands = files.filter(f => !f.endsWith('-strings.mjs')).map(eligibleStrings).filter(Boolean);
  console.log(`🧵 חילוץ-מחרוזות: ${scands.length} מועמדים`);
  let ok = 0;
  for (const c of scands) { if (ok >= N) break; if (purifyStrings(c, (x) => console.log('  ' + x)) === true) ok++; }
  console.log(`🧵 טוהרו: ${ok}`);
}
if (mode === '--run') {
  let ok = 0;
  for (const c of cands) { if (ok >= N) break; if (purifyOne(c, (s) => console.log('  ' + s)) === true) ok++; }
  console.log(`🧼 טוהרו: ${ok}`);
}
