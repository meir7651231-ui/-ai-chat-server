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
  for (const m of src.matchAll(/(?:^|\n)([ \t]*)const\s+([A-Za-z_$][\w$]*)\s*=\s*(?=[\[{]|-?\d|['"])/g)) {
    const start = m.index + m[0].length;
    let end;
    if ('[{'.includes(src[start])) {
      end = balanced(src, start);
      if (end < 0 || src[end + 1] !== ';') continue;
    } else {
      // סקלר: מספר או מחרוזת פשוטה עד ;
      const sm2 = src.slice(start).match(/^(-?\d[\d._]*(?:e-?\d+)?|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")\s*;/);
      if (!sm2) continue;
      end = start + sm2[1].length - 1;
      if (src[end + 1] !== ';') { const semi = src.indexOf(';', start); if (src.slice(start, semi).trim() !== sm2[1]) continue; end = semi - 1; }
    }
    const lit = src.slice(start, end + 1);
    if (!isStaticLit(lit)) continue;
    if (lit.length < 2) continue;
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
  for (const c of cand.consts) c.existing = findExistingData(c.lit);
  const allExisting = cand.consts.every(c => c.existing);
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
  const newConsts = cand.consts.filter(c => !c.existing);
  const dataSrc = `/** אטום-דאטה · ${dataBase} — הדאטה שחולצה מ-${base} (מנוע-הטיהור, הכרעה 19). חוזה: ${dataBase}.contract.md */\n` +
    newConsts.map(c => `export const ${c.name} = ${c.lit};`).join('\n') + '\n';
  const contract = `# חוזה · ${dataBase}\nאטום-דאטה שחולץ מכנית מ-${base} על-ידי מנוע-הטיהור (הכרעה 19: קבועים ושמות-דומיין = דאטה).\nהמנגנון ${base} מקבל אותו כפרמטר-שקע; הקוראים מזריקים. צורת-דאטה טהורה — אפס לוגיקה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${dataBase}.test.mjs.\n`;
  const test = `// בדיקת-צילום · ${dataBase} — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).\nimport * as D from './${dataBase}.mjs';\nimport assert from 'node:assert';\n` +
    newConsts.map(c => `assert.strictEqual(JSON.stringify(D.${c.name}), ${JSON.stringify(JSON.stringify(eval('(' + c.lit + ')')))});`).join('\n') +
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
    const uniq = (c) => `__d_${cand.fn}_${c.name}`;
    const wrap = `const ${local} = (...a) => ${alias}(...a, ${pad}, ${cand.consts.map(uniq).join(', ')});`;
    let inject;
    if (cp.endsWith('.test.mjs')) {
      const inl = cand.consts.map(c => `const ${uniq(c)} = ${c.lit};`).join('\n');
      inject = `\n// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)\n${inl}\n${wrap}`;
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
      inject = `\n${ims}\n// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה\n${wrap}`;
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
    if (newConsts.length) {
      fs.writeFileSync(path.join(ATOMS, dataBase + '.mjs'), dataSrc);
      fs.writeFileSync(path.join(ATOMS, dataBase + '.contract.md'), contract);
      fs.writeFileSync(path.join(ATOMS, dataBase + '.test.mjs'), test);
    }
    for (const [p, t] of edits) fs.writeFileSync(p, t);
    for (const p of [path.join(ATOMS, cand.file), ...(newConsts.length ? [path.join(ATOMS, dataBase + '.mjs')] : []), ...edits.keys()])
      execFileSync('node', ['--check', p], { stdio: 'pipe' });
    const tests = new Set(newConsts.length ? [path.join(ATOMS, dataBase + '.test.mjs')] : []);
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
    if (process.env.PDEBUG) { const dd = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/pdebug'; fs.mkdirSync(dd, { recursive: true }); for (const [pp] of backup) { try { fs.copyFileSync(pp, path.join(dd, base + '__' + path.basename(pp))); } catch { } } }
    for (const [p, t] of backup) fs.writeFileSync(p, t);
    if (newConsts.length) for (const ext of ['.mjs', '.contract.md', '.test.mjs']) fs.rmSync(path.join(ATOMS, dataBase + ext), { force: true });
    return log(`✗ ${base}: אימות אדום — הוחזר (${String(e.message).slice(0, 60)})`);
  }
}

// ── 🧵 v3: חילוץ-מחרוזות-דאטה (עברית + דומיין) מהמנגנון לטבלת-שקע ──
const HEBRE = /[\u0590-\u05FF]/;
function eligibleStrings(file) {
  const src = fs.readFileSync(path.join(ATOMS, file), 'utf8');
  const code = strip(src);
  const fns = [...code.matchAll(/export\s+(?:const\s+(\w+)\s*=\s*(?:async\s*)?\(|function\s+(\w+)\s*\()/g)].map(m => m[1] || m[2]);
  if (fns.length !== 1) return null;
  const fn = fns[0];
  // מיסוך הערות בלבד (מחרוזות נשארות גלויות לאיסוף)
  const noCom = src.replace(/\/\*[\s\S]*?\*\//g, m => 'x'.repeat(m.length)).replace(/\/\/[^\n]*/g, m => 'x'.repeat(m.length));
  const sigAt = noCom.search(new RegExp(`export\\s+(?:const\\s+${fn}\\s*=|function\\s+${fn}\\s*\\()`));
  if (sigAt < 0) return null;
  const sites = [];
  for (const m of noCom.matchAll(/(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g)) {
    const v = m[2];
    if (!v) continue;
    if (!(HEBRE.test(v) || /[a-zA-Z]{3,}/.test(v))) continue;
    const before = noCom.slice(0, m.index);
    if (/(?:import|export)\s*(?:\{[^}]*\}\s*)?from\s*$/.test(before) || /import\s*$/.test(before)) continue;
    // תבנית-בתוך-template — הליטרל בתוך backtick? בדיקת-איזון גסה: מספר ה-backticks לפניו אי-זוגי ⇒ דלג
    if ((before.match(/`/g) || []).length % 2 === 1) continue;
    const prevC = (before.match(/(\S)\s*$/) || [])[1] || '';
    const afterC = (noCom.slice(m.index + m[0].length).match(/^\s*(\S)/) || [])[1] || '';
    if ((prevC === '{' || prevC === ',') && afterC === ':') continue;   // מפתח-אובייקט — לא בגרסה זו
    if (m.index < sigAt) return null;                                   // מחרוזת בעוזר-מודול — דוחים
    sites.push({ at: m.index, len: m[0].length, v, raw: m[0] });
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
  for (const st of [...cand.sites].sort((a, b) => b.at - a.at))
    mech = mech.slice(0, st.at) + `${tParam}.${keys.get(st.v)}` + mech.slice(st.at + st.len);
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
  mech = mech.slice(0, po + 1) + (params ? params + ', ' : '') + tParam + mech.slice(pc);
  const litObj = '{\n' + [...keys].map(([v, k]) => `  ${k}: ${JSON.stringify(v).replace(/\u2028|\u2029/g, '')},`).join('\n') + '\n}';
  const existing = findExistingData(litObj);
  const dataSrc = `/** אטום-דאטה · ${dataBase} — מחרוזות-התצוגה/דומיין שחולצו מ-${base} (מנוע-הטיהור v3, הכרעה 19). חוזה: ${dataBase}.contract.md */\nexport const ${CONST} = ${litObj};\n`;
  const contract = `# חוזה · ${dataBase}\nמחרוזות-דאטה (עברית/דומיין) שחולצו מכנית מהמנגנון ${base} (הכרעה 19: שמות ומשמעות = דאטה).\nהמנגנון מקבל אותן כטבלת-שקע ${tParam}; הקוראים כורכים דרך העטיפה. אפס לוגיקה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${dataBase}.test.mjs.\n`;
  const test = `// בדיקת-צילום · ${dataBase} — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.\nimport { ${CONST} } from './${dataBase}.mjs';\nimport assert from 'node:assert';\nassert.strictEqual(JSON.stringify(${CONST}), ${JSON.stringify(JSON.stringify(Object.fromEntries([...keys].map(([v, k]) => [k, v]))))});\nconsole.log('OK ${dataBase}');\n`;
  // קוראים — אותה כריכת-עטיפה של v2
  const cs = callers(base, cand.fn);
  const edits = new Map();
  for (const cp of cs) {
    const t = fs.readFileSync(cp, 'utf8');
    if (t.includes(`__pure_${cand.fn}`)) return log(`~ ${base}: קורא כבר-עטוף (שילוב-מעברים — בהמשך)`);
    const im = t.match(new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*(['\"])([^'\"]*\\/${base}\\.mjs)\\2\\s*;?`));
    if (!im) return log(`~ ${base}: קורא בלי import-מפורש (${path.relative(ROOT, cp)})`);
    const spec = im[1].match(new RegExp(`\\b${cand.fn}\\b(\\s+as\\s+(\\w+))?`));
    if (!spec) return log(`~ ${base}: היבוא לא נמצא במפרט`);
    const local = spec[2] || cand.fn;
    const alias = `__pure_${cand.fn}`;
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
    return log(`✗ ${base}: אימות אדום — הוחזר (${String(e.message).slice(0, 60)})`);
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
const mode = process.argv[2] || '--dry';
const N = parseInt(process.argv[3] || '5');
const files = fs.readdirSync(ATOMS).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs') && !f.endsWith('-data.mjs'));
const cands = files.map(eligible).filter(Boolean);
console.log(`🧼 מנוע-הטיהור: ${cands.length} אטומים זכאים-מכנית (מתוך ${files.length})`);
if (mode === '--dry') cands.slice(0, 30).forEach(c => console.log(`  · ${c.file} — ${c.consts.map(x => x.name).join(', ')}`));
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
