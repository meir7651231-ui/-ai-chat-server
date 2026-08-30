#!/usr/bin/env node
/** 🗿 מחצב · מנוע-הקשיחים (הכרעת-בעלים: "תקח את הכי קשים מכולם, תבנה עליהם את המנוע,
 *  ואם זה עובר — תריץ על כולם"). דור-AST מלא (typescript) לשלושת המקומות שהמנוע הקודם דילג:
 *    · מחרוזת-מפתח-אובייקט  ⇒ מפתח-מחושב [T.kN]
 *    · מחרוזת-ברירת-מחדל    ⇒ הצבה-בגוף (if (p === undefined) p = T.kN)
 *    · מחרוזות בעוזרי-מודול ⇒ השחלת פרמטר-השקע דרך גרף-הקריאות הפנימי
 *  הפלט: אטום-דאטה <base>-strings (מיזוג-המשך אם קיים) + עטיפות-קוראים (API חיצוני זהה).
 *  אימות מלא פר-אטום: node --check · בדיקות-עצמו/קוראים/צמודות · free-ref; אדום ⇒ החזרה.
 *  שימוש: --dry N · --run N (הקשים-ביותר תחילה, לפי ציון-הסורק) */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const _req = createRequire('/home/user/maor-system/');
const ts = _req('typescript');
const ROOT = new URL('../', import.meta.url).pathname;
const ATOMS = path.join(ROOT, 'new/atoms');
const HEB = /[\u0590-\u05FF]/;

const sf_ = (src) => ts.createSourceFile('x.mjs', src, ts.ScriptTarget.ES2022, true);

// ── מודל-הקובץ: פונקציות-מיוצאות · עוזרים · אתרי-מחרוזת ──
function model(src) {
  const sf = sf_(src);
  const exported = [];      // {name, node(fn-like), decl}
  const helpers = [];       // {name, node(fn-like)|null, decl, isFn}
  let unsupported = null;
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) || ts.isExportDeclaration(st)) continue;
    const isExp = (st.modifiers || []).some(m => m.kind === ts.SyntaxKind.ExportKeyword);
    if (ts.isFunctionDeclaration(st)) {
      (isExp ? exported : helpers).push({ name: st.name?.text, node: st, decl: st, isFn: true });
      continue;
    }
    if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (!ts.isIdentifier(d.name)) { unsupported = 'הכרזה-מפורקת'; continue; }
        const init = d.initializer;
        const isFn = init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init));
        (isExp ? exported : helpers).push({ name: d.name.text, node: isFn ? init : null, decl: st, isFn: !!isFn });
      }
      continue;
    }
    if (ts.isExpressionStatement(st)) continue;
    unsupported = 'מבנה-עליון-לא-נתמך: ' + ts.SyntaxKind[st.kind];
  }
  if (exported.some(e => !e.isFn)) unsupported = 'ייצוא-ערך (לא-פונקציה)';
  return { sf, exported, helpers, unsupported };
}

// ── איסוף-אתרים: רגיל + מפתח + ברירת-מחדל + חלקי-תבנית; משויכים לפונקציה-המכילה ──
function collectSites(src, mo) {
  const { sf } = mo;
  const sites = [];
  const owner = (n) => {
    let up = n;
    while (up) {
      for (const e of mo.exported) if (e.node && up === e.node) return { kind: 'exp', name: e.name };
      for (const h of mo.helpers) if (h.node && up === h.node) return { kind: 'help', name: h.name };
      up = up.parent;
    }
    return { kind: 'top' };
  };
  const push = (n, extra) => {
    const at = n.getStart(sf);
    sites.push({ at, len: n.end - at, v: n.text, own: owner(n), ...extra });
  };
  const walk = (n) => {
    if (ts.isStringLiteral(n)) {
      const p = n.parent;
      if (p && (ts.isImportDeclaration(p) || ts.isExportDeclaration(p))) return;
      if (!(HEB.test(n.text) || /[a-zA-Z]{3,}/.test(n.text))) return;
      if (p && ts.isPropertyAssignment(p) && p.name === n) { push(n, { key: true }); return; }
      let up = n;
      while (up) {
        if (ts.isParameter(up)) {
          // ברירת-מחדל: רק כשהליטרל הוא *כל* האתחול, והגוף הוא בלוק
          if (up.initializer === n) push(n, { def: up });
          return;
        }
        up = up.parent;
      }
      push(n, {});
      return;
    }
    if (n.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
      if (n.text && (HEB.test(n.text) || /[a-zA-Z]{3,}/.test(n.text))) {
        let up = n; while (up) { if (ts.isParameter(up)) return; up = up.parent; }
        push(n, {});
      }
      return;
    }
    if (ts.isTemplateExpression(n)) {
      const chunk = (t) => {
        if (!t.text || !(HEB.test(t.text) || /[a-zA-Z]{3,}/.test(t.text))) return;
        let up = t; while (up) { if (ts.isParameter(up)) return; up = up.parent; }
        const at = t.getStart(sf);
        const raw = src.slice(at, t.end);
        const suffix = raw.endsWith('${') ? '${' : '`';
        push(t, { wrap: (ref) => `${raw[0]}\${${ref}}${suffix}` });
      };
      chunk(n.head);
      for (const sp of n.templateSpans) { walk(sp.expression); chunk(sp.literal); }
      return;
    }
    ts.forEachChild(n, walk);
  };
  walk(sf);
  return sites;
}

// ── גרף-קריאות פנימי: מי-קורא-למי (לפי שם-מזהה) ──
function callGraph(mo) {
  const names = new Set([...mo.exported, ...mo.helpers].filter(x => x.isFn).map(x => x.name));
  const calls = new Map();          // caller-name ⇒ Set(callee)
  const valueUse = new Set();       // שם שנעשה-בו שימוש-כערך (לא-קריאה) בתוך הקובץ
  for (const fx of [...mo.exported, ...mo.helpers]) {
    if (!fx.node) continue;
    const mine = new Set();
    const walk = (n) => {
      if (ts.isIdentifier(n) && names.has(n.text) && n.text !== fx.name) {
        const p = n.parent;
        if (ts.isCallExpression(p) && p.expression === n) mine.add(n.text);
        else if (!(ts.isPropertyAccessExpression(p) && p.name === n)) valueUse.add(n.text);
      }
      ts.forEachChild(n, walk);
    };
    walk(fx.node.body || fx.node);
    calls.set(fx.name, mine);
  }
  return { calls, valueUse };
}

const balancedIdx = (s, i) => {
  const open = s[i], close = { '(': ')', '{': '}', '[': ']' }[open];
  let d = 0, str = null;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (str) { if (c === '\\') j++; else if (c === str) str = null; continue; }
    if (c === "'" || c === '"' || c === '`') { str = c; continue; }
    if (c === open) d++; else if (c === close && --d === 0) return j;
  }
  return -1;
};

function findings() {
  const md = fs.readFileSync(path.join(ROOT, 'machtzev/emit/DEEP-PURITY-FINDINGS.md'), 'utf8');
  return [...md.matchAll(/\| new\/atoms\/([^ |]+) \| (\d+) \|/g)].map(m => ({ f: m[1], score: +m[2] }));
}

function purifyHard(file, log) {
  const base = file.replace(/\.mjs$/, '');
  const dataBase = base + '-strings';
  const src = fs.readFileSync(path.join(ATOMS, file), 'utf8');
  const mo = model(src);
  if (mo.unsupported) return log(`~ ${base}: ${mo.unsupported}`);
  if (!mo.exported.length) return log(`~ ${base}: אפס פונקציות-מיוצאות`);
  const sites = collectSites(src, mo);
  if (!sites.length) return log(`~ ${base}: אין אתרי-מחרוזת`);
  if (sites.some(st => st.own.kind === 'top')) return log(`~ ${base}: מחרוזת ברמת-המודול (טבלה — למעבר-הטבלאות)`);
  const { calls, valueUse } = callGraph(mo);
  // עוזרים-נזקקים: בגופם אתר, או קוראים-לנזקק (סגור-טרנזיטיבי)
  const need = new Set(sites.filter(s => s.own.kind === 'help').map(s => s.own.name));
  let grew = true;
  while (grew) {
    grew = false;
    for (const [caller, cs] of calls) if (!need.has(caller)) for (const c of cs) if (need.has(c)) {
      if (mo.helpers.some(h => h.name === caller)) { need.add(caller); grew = true; }
    }
  }
  for (const h of need) if (valueUse.has(h)) return log(`~ ${base}: עוזר-נזקק בשימוש-כערך (${h})`);
  for (const h of need) { const hh = mo.helpers.find(x => x.name === h); if (!hh?.isFn) return log(`~ ${base}: עוזר-נזקק שאינו-פונקציה (${h})`); }
  // פונקציות-מיוצאות-נזקקות: אתר בגופן או קריאה (טרנזיטיבית) לעוזר-נזקק
  const expNeed = new Set(sites.filter(s => s.own.kind === 'exp').map(s => s.own.name));
  for (const e of mo.exported) {
    if (expNeed.has(e.name)) continue;
    const seen = new Set(); const stack = [...(calls.get(e.name) || [])];
    while (stack.length) { const c = stack.pop(); if (seen.has(c)) continue; seen.add(c); if (need.has(c)) { expNeed.add(e.name); break; } for (const c2 of calls.get(c) || []) stack.push(c2); }
  }
  if (!expNeed.size) return log(`~ ${base}: אין פונקציה-מיוצאת-נזקקת`);
  // המשך-חילוץ: מפתחות קיימים
  const dataPath = path.join(ATOMS, dataBase + '.mjs');
  const priorKeys = new Map();
  if (fs.existsSync(dataPath)) {
    for (const m of fs.readFileSync(dataPath, 'utf8').matchAll(/(k\d+): ("(?:\\.|[^"\\])*")/g)) priorKeys.set(JSON.parse(m[2]), m[1]);
    if (!priorKeys.size) return log(`~ ${base}: אטום-מחרוזות קיים בצורה לא-נקראת`);
  }
  // tParam: קיים (המשך) או חדש
  let tParam = null;
  if (priorKeys.size) {
    const e0 = mo.exported.find(e => expNeed.has(e.name));
    const lastP = e0.node.parameters.length ? e0.node.parameters[e0.node.parameters.length - 1].name : null;
    if (!lastP || !ts.isIdentifier(lastP) || !/^T\d*$/.test(lastP.text)) return log(`~ ${base}: פרמטר-שקע קיים לא-מזוהה`);
    tParam = lastP.text;
  } else { tParam = 'T'; let ti = 2; while (new RegExp(`\\b${tParam}\\b`).test(src)) tParam = 'T' + ti++; }
  const keys = new Map(priorKeys);
  for (const st of sites) if (!keys.has(st.v)) keys.set(st.v, 'k' + (keys.size + 1));
  if (priorKeys.size && keys.size === priorKeys.size) return log(`~ ${base}: אין מחרוזות חדשות`);
  // ── בניית-עריכות: {at, del, ins} ──
  const edits = [];
  const ref = (v) => `${tParam}.${keys.get(v)}`;
  for (const st of sites) {
    if (st.def) {
      // ברירת-מחדל ⇒ הצבה-בגוף; דורש גוף-בלוק בפונקציה-המכילה
      const fnNode = st.def.parent;
      if (!fnNode.body || !ts.isBlock(fnNode.body)) return log(`~ ${base}: ברירת-מחדל בפונקציית-ביטוי`);
      const pname = st.def.name.getText(mo.sf);
      const eqAt = src.lastIndexOf('=', st.at);
      edits.push({ at: eqAt, del: st.at + st.len - eqAt, ins: '' });                      // הסרת '= lit'
      const bodyAt = fnNode.body.getStart(mo.sf) + 1;
      edits.push({ at: bodyAt, del: 0, ins: `\n  if (${pname} === undefined) ${pname} = ${ref(st.v)};` });
    } else if (st.key) {
      edits.push({ at: st.at, del: st.len, ins: `[${ref(st.v)}]` });
    } else if (st.wrap) {
      edits.push({ at: st.at, del: st.len, ins: st.wrap(ref(st.v)) });
    } else {
      edits.push({ at: st.at, del: st.len, ins: ref(st.v) });
    }
  }
  // הרחבת-חתימה: פונקציות-מיוצאות-נזקקות (אם חדש) + עוזרים-נזקקים; והזרקת-ארגומנט בקריאות-פנימיות לנזקקים
  const widen = (fnNode) => {
    const ps = fnNode.parameters;
    if (!ps.length) return edits.push({ at: src.indexOf('(', fnNode.getStart(mo.sf)) + 1, del: 0, ins: tParam });
    // עד סוגר-הפרמטרים: פסיק-זנב קיים נבלע (לקח schedule-clash-text)
    const openAt = src.lastIndexOf('(', ps.pos);
    const closeAt = balancedIdx(src, openAt);
    edits.push({ at: ps.end, del: closeAt - ps.end, ins: `, ${tParam}` });
  };
  const arity = {};
  for (const e of mo.exported) if (expNeed.has(e.name)) {
    arity[e.name] = e.node.parameters.length;
    if (!priorKeys.size) widen(e.node);
  }
  for (const h of mo.helpers) if (need.has(h.name)) widen(h.node);
  // קריאות-פנימיות לעוזרים-נזקקים ⇒ הוספת tParam
  {
    const walk = (n) => {
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && need.has(n.expression.text)) {
        edits.push({ at: n.arguments.end, del: 0, ins: n.arguments.length ? `, ${tParam}` : tParam });
      }
      ts.forEachChild(n, walk);
    };
    walk(mo.sf);
  }
  let mech = src;
  for (const e of edits.sort((a, b) => b.at - a.at)) mech = mech.slice(0, e.at) + e.ins + mech.slice(e.at + e.del);
  // ── אטום-הדאטה ──
  const CONST = base.replace(/-/g, '_').toUpperCase() + '_T';
  const litObj = '{\n' + [...keys].map(([v, k]) => `  ${k}: ${JSON.stringify(v)},`).join('\n') + '\n}';
  const dataSrc = `/** אטום-דאטה · ${dataBase} — מחרוזות-הדאטה של ${base} (מנוע-הקשיחים, הכרעה 19). חוזה: ${dataBase}.contract.md */\nexport const ${CONST} = ${litObj};\n`;
  const contract = `# חוזה · ${dataBase}\nמחרוזות-דאטה (עברית/דומיין — כולל מפתחות וברירות-מחדל) שחולצו מכנית מ-${base} (הכרעה 19).\nהמנגנון מקבל אותן בשקע ${tParam}, מושחל גם דרך עוזרי-הקובץ; הקוראים כורכים. אפס לוגיקה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${dataBase}.test.mjs.\n`;
  const testSrc = `// בדיקת-צילום · ${dataBase} — המחרוזות זהות ביט-אחר-ביט למקור.\nimport { ${CONST} } from './${dataBase}.mjs';\nimport assert from 'node:assert';\nassert.strictEqual(JSON.stringify(${CONST}), ${JSON.stringify(JSON.stringify(Object.fromEntries([...keys].map(([v, k]) => [k, v]))))});\nconsole.log('OK ${dataBase}');\n`;
  // ── קוראים: עטיפה/הרחבה פר-פונקציה-נזקקת ──
  const callerFiles = new Set();
  const walkDir = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!/QUARANTINE|node_modules/.test(e.name)) walkDir(p); continue; }
    if (!p.endsWith('.mjs') || p.endsWith('/' + file)) continue;
    const t = fs.readFileSync(p, 'utf8');
    if (new RegExp(`from\\s+['"][^'"]*/${base}\\.mjs['"]`).test(t)) callerFiles.add(p);
  } };
  walkDir(path.join(ROOT, 'new'));
  const cEdits = new Map();
  const dAlias = `__d_${base.replace(/-/g, '_')}_T`;
  for (const cp of callerFiles) {
    let t = fs.readFileSync(cp, 'utf8');
    const im = t.match(new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*(['"])([^'"]*\\/${base}\\.mjs)\\2\\s*;?`));
    if (!im) return log(`~ ${base}: קורא בלי import-מפורש (${path.relative(ROOT, cp)})`);
    let braces = im[1];
    const wraps = [];
    let touched = false;
    for (const fn of expNeed) {
      const alias = `__pure_${fn}`;
      if (braces.includes(`${fn} as ${alias}`)) {
        const wre = new RegExp(`(const \\w+ = \\(\\.\\.\\.a\\) => ${alias}\\(\\.\\.\\.a,[^\\n]*)\\);`);
        if (!wre.test(t)) return log(`~ ${base}: עטיפה-קיימת לא-נמצאה (${path.relative(ROOT, cp)})`);
        if (!priorKeys.size) return log(`~ ${base}: עטיפה-קיימת בלי אטום-דאטה — חריג`);
        touched = true;                            // הדאטה מתעדכנת בקובץ-הדאטה; העטיפה כבר מזריקה
        continue;
      }
      const spec = braces.match(new RegExp(`\\b${fn}\\b(\\s+as\\s+(\\w+))?`));
      if (!spec) continue;
      const local = spec[2] || fn;
      braces = braces.replace(spec[0], `${fn} as ${alias}`);
      const pad = `...Array(Math.max(0, ${arity[fn]} - a.length)).fill(undefined)`;
      wraps.push(`const ${local} = (...a) => ${alias}(...a, ${pad}, ${dAlias});`);
      touched = true;
    }
    if (!touched) continue;
    let inject = '';
    if (wraps.length) {
      if (cp.endsWith('.test.mjs')) {
        inject = `\n// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)\nconst ${dAlias} = ${litObj};\n${wraps.join('\n')}`;
      } else {
        const rel = path.relative(path.dirname(cp), dataPath).replace(/^(?!\.)/, './');
        inject = `\nimport { ${CONST} as ${dAlias} } from '${rel}';\n// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה\n${wraps.join('\n')}`;
      }
      t = t.replace(im[0], im[0].replace(im[1], braces) + inject);
    }
    // המשך: רענון צילומי-inline ישנים
    if (priorKeys.size) {
      const dre = new RegExp(`const (__d_[\\w]+_T|__d_\\w+_${CONST}) = \\{[\\s\\S]*?\\n\\};`);
      if (dre.test(t)) t = t.replace(dre, `const $1 = ${litObj};`);
    }
    cEdits.set(cp, t);
  }
  // ── כתיבה + אימות + החזרה ──
  const backup = new Map([[path.join(ATOMS, file), src]]);
  for (const [pp] of cEdits) backup.set(pp, fs.readFileSync(pp, 'utf8'));
  if (priorKeys.size) backup.set(dataPath, fs.readFileSync(dataPath, 'utf8'));
  try {
    fs.writeFileSync(path.join(ATOMS, file), mech);
    fs.writeFileSync(dataPath, dataSrc);
    fs.writeFileSync(path.join(ATOMS, dataBase + '.contract.md'), contract);
    fs.writeFileSync(path.join(ATOMS, dataBase + '.test.mjs'), testSrc);
    for (const [pp, tt] of cEdits) fs.writeFileSync(pp, tt);
    for (const pp of [path.join(ATOMS, file), dataPath, ...cEdits.keys()]) execFileSync('node', ['--check', pp], { stdio: 'pipe' });
    const tests = new Set([path.join(ATOMS, dataBase + '.test.mjs')]);
    const ownT = path.join(ATOMS, base + '.test.mjs');
    if (fs.existsSync(ownT)) tests.add(ownT);
    for (const pp of cEdits.keys()) {
      if (pp.endsWith('.test.mjs')) tests.add(pp);
      else { const adj = pp.replace(/\.mjs$/, '.test.mjs'); if (fs.existsSync(adj)) tests.add(adj); }
    }
    for (const tt of tests) execFileSync('node', [tt], { stdio: 'pipe' });
    execFileSync('node', [path.join(ROOT, 'machtzev/emit/free-ref-scan.mjs'), '--gate'], { stdio: 'pipe' });
    log(`✅ ${base}: ${keys.size - priorKeys.size} מחרוזות (מפתחות/ברירות-מחדל/עוזרים) ⇒ ${dataBase} · ${cEdits.size} קוראים`);
    return true;
  } catch (e) {
    for (const [pp, tt] of backup) fs.writeFileSync(pp, tt);
    if (!priorKeys.size) for (const ext of ['.mjs', '.contract.md', '.test.mjs']) fs.rmSync(path.join(ATOMS, dataBase + ext), { force: true });
    return log(`✗ ${base}: אימות אדום — הוחזר (${String(e.stderr || e.message).slice(0, 200).replace(/\n/g, ' ⏎ ')})`);
  }
}

const mode = process.argv[2] || '--dry';
const N = parseInt(process.argv[3] || '10');
const flagged = findings().sort((a, b) => b.score - a.score).filter(x => fs.existsSync(path.join(ATOMS, x.f)) && !/-(strings|data|terms)\.mjs$/.test(x.f));
console.log(`🗿 מנוע-הקשיחים: ${flagged.length} אטומים מסומנים · יעד: ${Math.min(N, flagged.length)} הקשים-ביותר`);
let ok = 0;
for (const x of flagged.slice(0, mode === '--dry' ? N : flagged.length)) {
  if (mode === '--dry') { console.log(`  · ${x.f} (ציון ${x.score})`); continue; }
  if (ok >= N) break;
  if (purifyHard(x.f, (s) => console.log('  ' + s)) === true) ok++;
}
if (mode === '--run') console.log(`🗿 טוהרו: ${ok}`);
