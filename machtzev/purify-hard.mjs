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
  const valueExports = exported.filter(e => !e.isFn);
  return { sf, exported: exported.filter(e => e.isFn), valueExports, helpers, unsupported };
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
      for (const v of mo.valueExports || []) if (v.decl && up === v.decl) return { kind: 'val', name: v.name };
      up = up.parent;
    }
    return { kind: 'top' };
  };
  const push = (n, extra) => {
    const at = n.getStart(sf);
    const v = extra && extra.num ? (extra.negV ? -parseFloat(n.getText(sf).replace('-', '')) : parseFloat(n.getText ? n.getText(sf).replace(/^-/, '') : n.text)) : n.text;
    sites.push({ at, len: n.end - at, v, own: owner(n), ...extra });
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
    if (ts.isNumericLiteral(n)) {
      // מספר-קסם ⇒ אתר-דאטה: עשרוני ≥10, לא-מבני (ביטוויז/חזקת-2 מוחרגים — כמו הסורק)
      const val = parseFloat(n.text);
      if (!(val >= 10) || /^0[xbo]/i.test(n.text)) return;
      if (Number.isInteger(val) && (val & (val - 1)) === 0) return;          // חזקת-2 — מבני
      const p = n.parent;
      if (p && (ts.isBinaryExpression(p) && /[&|^]|<<|>>/.test(p.operatorToken.getText(sf)))) return;
      const neg = p && ts.isPrefixUnaryExpression(p) && p.operator === ts.SyntaxKind.MinusToken;
      const siteNode = neg ? p : n;
      let up = siteNode;
      while (up) {
        if (ts.isParameter(up)) {
          if (up.initializer === siteNode) { push(siteNode, { def: up, num: true, negV: neg }); }
          return;
        }
        up = up.parent;
      }
      push(siteNode, { num: true, negV: neg });
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

function replaceInlineSnap(t, aliasRe, litObj) {
  // רענון-צילום מאוזן: מאתרים 'const <alias> = {' ומחליפים עד הסוגר-התואם (לא רגקס-עצל)
  const m = t.match(new RegExp('const (' + aliasRe + ') = \\{'));
  if (!m) return null;
  const ob = t.indexOf('{', m.index);
  let d = 0, j = ob, str = null;
  for (; j < t.length; j++) {
    const c = t[j];
    if (str) { if (c === '\\') j++; else if (c === str) str = null; continue; }
    if (c === "'" || c === '"' || c === '`') { str = c; continue; }
    if (c === '{') d++; else if (c === '}' && --d === 0) break;
  }
  if (j >= t.length) return null;
  const end = t[j + 1] === ';' ? j + 2 : j + 1;
  return t.slice(0, m.index) + 'const ' + m[1] + ' = ' + litObj + ';' + t.slice(end);
}
function purifyHard(file, log) {
  const base = file.replace(/\.mjs$/, '');
  const dataBase = base + '-strings';
  const src = fs.readFileSync(path.join(ATOMS, file), 'utf8');
  const mo = model(src);
  if (mo.unsupported) return log(`~ ${base}: ${mo.unsupported}`);
  if (!mo.exported.length && !(mo.valueExports || []).length) return log(`~ ${base}: אפס ייצוא-נתמך`);
  const sites = collectSites(src, mo);
  // מחרוזת top שאינה בתוך טבלה-נבלעת ⇒ עדיין נדחית (תבוא ב-tblAbsorb או שאין-טיפול)

  // ייצואי-ערך נזקקים: מפעל-ערך. שימוש-פנימי בגוף-פונקציה ⇒ קריאת-מפעל (טהור — בנייה-מחדש שקולה)
  const valNeed = new Set(sites.filter(st => st.own.kind === 'val').map(st => st.own.name));
  const valUseFix = [];      // {at, len, vn} — הפניות-פנימיות להחלפה בקריאת-מפעל
  const valForcesFn = new Set();
  {
    const walkU = (n) => {
      if (ts.isIdentifier(n) && valNeed.has(n.text)) {
        const ve = mo.valueExports.find(x => x.name === n.text);
        const inOwnDecl = n.getStart(mo.sf) >= ve.decl.getStart(mo.sf) && n.end <= ve.decl.end;
        if (!inOwnDecl) {
          const p2 = n.parent;
          if (p2 && ts.isPropertyAccessExpression(p2) && p2.name === n) { /* a.X — לא שלנו */ }
          else {
            let up = n, ownFn = null;
            while (up) {
              const ex = mo.exported.find(e => e.node && up === e.node); if (ex) { ownFn = { kind: 'exp', name: ex.name }; break; }
              const hp = mo.helpers.find(h => h.node && up === h.node); if (hp) { ownFn = { kind: 'help', name: hp.name }; break; }
              up = up.parent;
            }
            if (!ownFn) { valUseFix.length = -1; }   // שימוש מחוץ-לפונקציה — נדחה בהמשך
            else { valUseFix.push({ at: n.getStart(mo.sf), len: n.text.length, vn: n.text }); valForcesFn.add(ownFn.name); }
          }
        }
      }
      ts.forEachChild(n, walkU);
    };
    try { walkU(mo.sf); } catch { }
    if (valUseFix.length < 0) return log(`~ ${base}: ייצוא-ערך בשימוש מחוץ-לפונקציה`);
  }
  // v10 · בליעת-טבלאות-מודול: const סטטי לא-מיוצא ⇒ מפתח-tbl בשקע; הפניות בגופי-פונקציות מוחלפות
  const tblAbsorb = [];      // {decl, name, value, refs:[{at,len}], forces:Set(fnName)}
  const staticLit = (n) => {
    if (!n) return false;
    if (ts.isStringLiteral(n) || ts.isNumericLiteral(n) || n.kind === ts.SyntaxKind.TrueKeyword || n.kind === ts.SyntaxKind.FalseKeyword || n.kind === ts.SyntaxKind.NullKeyword) return true;
    if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.MinusToken) return staticLit(n.operand);
    if (ts.isArrayLiteralExpression(n)) return n.elements.every(staticLit);
    if (ts.isObjectLiteralExpression(n)) return n.properties.every(pp => ts.isPropertyAssignment(pp) && (ts.isIdentifier(pp.name) || ts.isStringLiteral(pp.name)) && staticLit(pp.initializer));
    return false;
  };
  for (const h of mo.helpers) {
    if (h.isFn || !h.decl || !ts.isVariableStatement(h.decl)) continue;
    if (h.decl.declarationList.declarations.length !== 1) continue;
    const d0 = h.decl.declarationList.declarations[0];
    if (!d0.initializer || !staticLit(d0.initializer)) continue;
    const nm = h.name;
    if (new RegExp(`\\b${nm}\\s*\\.\\s*(push|pop|shift|unshift|splice|sort|reverse|fill)\\b|\\b${nm}\\s*\\[[^\\]]*\\]\\s*(=[^=]|\\+\\+|--)|\\b${nm}\\s*=[^=]`).test(src.slice(h.decl.end))) continue;
    const refs = []; const forces = new Set(); let outside = false;
    const walkR = (n) => {
      if (ts.isIdentifier(n) && n.text === nm) {
        const inDecl = n.getStart(mo.sf) >= h.decl.getStart(mo.sf) && n.end <= h.decl.end;
        const p2 = n.parent;
        if (!inDecl && !(p2 && ts.isPropertyAccessExpression(p2) && p2.name === n)) {
          let up = n, own2 = null;
          while (up) {
            const ex = mo.exported.find(e => e.node && up === e.node); if (ex) { own2 = ex.name; break; }
            const hp = mo.helpers.find(x => x.node && up === x.node); if (hp) { own2 = hp.name; break; }
            const vv = (mo.valueExports || []).find(x => x.decl && up === x.decl); if (vv) { own2 = null; outside = true; break; }
            up = up.parent;
          }
          if (own2) { refs.push({ at: n.getStart(mo.sf), len: nm.length }); forces.add(own2); }
          else outside = true;
        }
      }
      ts.forEachChild(n, walkR);
    };
    walkR(mo.sf);
    if (outside || !refs.length) continue;
    let value;
    try { value = eval('(' + src.slice(d0.initializer.getStart(mo.sf), d0.initializer.end) + ')'); } catch { continue; }
    tblAbsorb.push({ decl: h.decl, name: nm, value, refs, forces });
  }
  const topOnly = sites.filter(st => st.own.kind === 'top');
  const inAbsorbed = (st) => tblAbsorb.some(tb => st.at >= tb.decl.getStart(mo.sf) && st.at < tb.decl.end);
  if (topOnly.some(st => !inAbsorbed(st))) return log(`~ ${base}: מחרוזת ברמת-מודול מחוץ-לטבלה-נבלעת`);
  for (let i = sites.length - 1; i >= 0; i--) if (sites[i].own.kind === 'top') sites.splice(i, 1);
  if (!sites.length && !tblAbsorb.length) return log(`~ ${base}: אין אתרים`);
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
  for (const f2 of valForcesFn) { if (mo.exported.some(e => e.name === f2)) expNeed.add(f2); else need.add(f2); }
  for (const tb of tblAbsorb) for (const f2 of tb.forces) { if (mo.exported.some(e => e.name === f2)) expNeed.add(f2); else need.add(f2); }
  // סגירה-טרנזיטיבית נוספת אחרי הכפיות
  { let g2 = true; while (g2) { g2 = false;
    for (const [caller, cs] of calls) if (!need.has(caller) && !expNeed.has(caller)) for (const c of cs) if (need.has(c)) {
      if (mo.helpers.some(h => h.name === caller)) { need.add(caller); g2 = true; }
      else if (mo.exported.some(e => e.name === caller)) { expNeed.add(caller); g2 = true; }
    } } }
  if (!expNeed.size && !valNeed.size) return log(`~ ${base}: אין נזקקים`);
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
    const e0 = mo.exported.find(e => expNeed.has(e.name)) || mo.exported[0];
    const tp = e0 && e0.node.parameters.map(pp => pp.name).find(nm => ts.isIdentifier(nm) && /^T\d*$/.test(nm.text));
    if (!tp) return log(`~ ${base}: פרמטר-שקע קיים לא-מזוהה`);
    tParam = tp.text;
  } else { tParam = 'T'; let ti = 2; while (new RegExp(`\\b${tParam}\\b`).test(src)) tParam = 'T' + ti++; }
  const keys = new Map(priorKeys);
  for (const st of sites) if (!keys.has(st.v)) keys.set(st.v, 'k' + (keys.size + 1));
  const tblKeyOf = new Map();
  { let ti2 = 1;
    for (const tb of tblAbsorb) {
      while ([...keys.values()].includes('tbl' + ti2)) ti2++;
      const kk = 'tbl' + ti2++;
      keys.set(`__tbl__${tb.name}`, kk);            // מזהה-פנימי; הערך האמיתי מוזרק ב-litObj
      tblKeyOf.set(tb.name, { key: kk, value: tb.value });
    } }
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
    // NodeArray.end כולל פסיק-זנב — אם כבר יש פסיק, לא מוסיפים שני
    const hasTrail = src.slice(0, ps.end).trimEnd().endsWith(',');
    edits.push({ at: ps.end, del: closeAt - ps.end, ins: hasTrail ? ` ${tParam}` : `, ${tParam}` });
  };
  const arity = {};
  for (const e of mo.exported) if (expNeed.has(e.name)) {
    arity[e.name] = e.node.parameters.length;
    if (!priorKeys.size) widen(e.node);
  }
  for (const h of mo.helpers) if (need.has(h.name)) widen(h.node);
  // מפעלי-ערך: export const X = <expr> ⇒ export const makeX = (T) => (<expr>)
  const factoryOf = {};
  for (const vn of valNeed) {
    const ve = mo.valueExports.find(x => x.name === vn);
    const d = ve.decl.declarationList.declarations.find(dd => dd.name.text === vn);
    const factory = 'make' + vn.charAt(0).toUpperCase() + vn.slice(1);
    factoryOf[vn] = factory;
    if (new RegExp(`\\b${factory}\\b`).test(src)) return log(`~ ${base}: שם-מפעל תפוס (${factory})`);
    const nameAt = d.name.getStart(mo.sf);
    edits.push({ at: nameAt, del: vn.length, ins: factory });
    const initAt = d.initializer.getStart(mo.sf);
    edits.push({ at: initAt, del: 0, ins: `(${tParam}) => (` });
    edits.push({ at: d.initializer.end, del: 0, ins: ')' });
  }
  for (const u of valUseFix) edits.push({ at: u.at, del: u.len, ins: `${factoryOf[u.vn]}(${tParam})` });
  for (const tb of tblAbsorb) {
    const a0 = tb.decl.getStart(mo.sf);
    edits.push({ at: a0, del: tb.decl.end - a0 + (src[tb.decl.end] === '\n' ? 1 : 0), ins: '' });
    for (const r of tb.refs) edits.push({ at: r.at, del: r.len, ins: `${tParam}.${tblKeyOf.get(tb.name).key}` });
  }
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
  const litObj = '{\n' + [...keys].map(([v, k]) => {
    const tb = typeof v === 'string' && v.startsWith('__tbl__') ? tblKeyOf.get(v.slice(7)) : null;
    return `  ${k}: ${JSON.stringify(tb ? tb.value : v)},`;
  }).join('\n') + '\n}';
  const dataSrc = `/** אטום-דאטה · ${dataBase} — מחרוזות-הדאטה של ${base} (מנוע-הקשיחים, הכרעה 19). חוזה: ${dataBase}.contract.md */\nexport const ${CONST} = ${litObj};\n`;
  const contract = `# חוזה · ${dataBase}\nמחרוזות-דאטה (עברית/דומיין — כולל מפתחות וברירות-מחדל) שחולצו מכנית מ-${base} (הכרעה 19).\nהמנגנון מקבל אותן בשקע ${tParam}, מושחל גם דרך עוזרי-הקובץ; הקוראים כורכים. אפס לוגיקה.\n\n## דוגמאות-זהב\nצילום-ערך ב-${dataBase}.test.mjs.\n`;
  const testSrc = `// בדיקת-צילום · ${dataBase} — המחרוזות זהות ביט-אחר-ביט למקור.\nimport { ${CONST} } from './${dataBase}.mjs';\nimport assert from 'node:assert';\nassert.strictEqual(JSON.stringify(${CONST}), ${JSON.stringify(JSON.stringify(Object.fromEntries([...keys].map(([v, k]) => [k, (typeof v === 'string' && v.startsWith('__tbl__')) ? tblKeyOf.get(v.slice(7)).value : v]))))});\nconsole.log('OK ${dataBase}');\n`;
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
    if (!im) {
      // ענף-namespace: import * as NS — ערכים דרך מפעל בקריאה-במקום (טהור: בנייה-שקולה)
      const nsm = t.match(new RegExp(`import\\s*\\*\\s*as\\s+(\\w+)\\s+from\\s*(['"])([^'"]*\\/${base}\\.mjs)\\2\\s*;?`));
      if (!nsm) return log(`~ ${base}: קורא בלי import-מפורש (${path.relative(ROOT, cp)})`);
      if (expNeed.size) {
        // פונקציות דרך namespace: קריאות NS.fn(...) לא-משוכתבות בשלב-זה — דוחים בכבוד
        const usesFn = [...expNeed].some(fn => new RegExp(`\\b${nsm[1]}\\.${fn}\\b`).test(t));
        if (usesFn) return log(`~ ${base}: קורא-namespace לפונקציות (${path.relative(ROOT, cp)})`);
      }
      let t2 = t; let touchedNs = false;
      for (const vn of valNeed) {
        const re2 = new RegExp(`\\b${nsm[1]}\\.${vn}\\b`, 'g');
        if (re2.test(t2)) { t2 = t2.replace(re2, `${nsm[1]}.${factoryOf[vn]}(${dAlias})`); touchedNs = true; }
      }
      if (!touchedNs) continue;
      const inj = cp.endsWith('.test.mjs')
        ? `\n// צילום-מקומי (מנוע-הקשיחים · ענף-namespace)\nconst ${dAlias} = ${litObj};`
        : `\nimport { ${CONST} as ${dAlias} } from '${path.relative(path.dirname(cp), dataPath).replace(/^(?!\.)/, './')}';`;
      cEdits.set(cp, t2.replace(nsm[0], nsm[0] + inj));
      continue;
    }
    let braces = im[1];
    const wraps = [];
    let touched = false;
    for (const vn of valNeed) {
      const factory = factoryOf[vn];
      const alias = `__pure_${factory}`;
      if (braces.includes(`${factory} as ${alias}`)) { touched = true; continue; }
      const spec = braces.match(new RegExp(`\\b${vn}\\b(\\s+as\\s+(\\w+))?`));
      if (!spec) continue;
      const local = spec[2] || vn;
      braces = braces.replace(spec[0], `${factory} as ${alias}`);
      wraps.push(`const ${local} = ${alias}(${dAlias});`);
      touched = true;
    }
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
      const rp = replaceInlineSnap(t, `__d_[\\w]+_T|__d_\\w+_${CONST}`, litObj);
      if (rp) t = rp;
    }
    cEdits.set(cp, t);
  }
  // ── כתיבה + אימות + החזרה ──
  const backup = new Map([[path.join(ATOMS, file), src]]);
  for (const [pp] of cEdits) backup.set(pp, fs.readFileSync(pp, 'utf8'));
  if (priorKeys.size) for (const ext of ['.mjs', '.contract.md', '.test.mjs']) {
    const pf = path.join(ATOMS, dataBase + ext);
    if (fs.existsSync(pf)) backup.set(pf, fs.readFileSync(pf, 'utf8'));
  }
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
