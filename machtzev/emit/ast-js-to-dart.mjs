#!/usr/bin/env node
/** 🌳 מנוע-מורכב · JS→Dart מבוסס-AST (מפרש-TypeScript) — לא רגקס אלא הליכה על עץ-
 *  התחביר ⇒ עדיפויות/קינון/scope נכונים. ניב-האטומים: פונקציות טהורות. */
import { requireTs } from '../lib-ts.mjs';
const ts = requireTs();

const STD = { // מיפוי-מתודות JS→Dart (על property-access בקריאה)
  includes: 'contains', filter: 'where', push: 'add', some: 'any', every: 'every',
  findIndex: 'indexWhere', find: 'firstWhere', slice: 'sublist', join: 'join',
  split: 'split', trim: 'trim', toLowerCase: 'toLowerCase', toUpperCase: 'toUpperCase',
  startsWith: 'startsWith', endsWith: 'endsWith', repeat: '_repeat', padStart: '_padStart',
  replace: 'replaceFirst', replaceAll: 'replaceAll', concat: '_concat', reverse: '_reverse',   /* JS reverse הופך במקום ומחזיר; Dart reversed הוא getter */
 
  pop: '_pop', shift: '_shift', splice: '_splice', unshift: '_unshift', at: '_at', fill: '_fill',   // מחלקות · JS pop/shift על ריק ⇒ undefined (Dart removeLast זורק)
};
const MATH = { round: '_round', floor: '_floor', ceil: '_ceil', abs: '_abs', min: 'min', max: 'max', pow: 'pow', sqrt: 'sqrt', trunc: '_trunc', imul: '_imul', PI: 'pi', E: 'e' };   // מחלקות · imul (כפל-32) · קבועים

// ── G20 · הידוק-טיפוסים בתוך המנוע (הכרעה-25: החוזה של צעד-3 חד) ──
//   שני מקורות, אפס מילון-דומיין: (א) הסקה סטטית מצורת-ה-JS — ברירת-מחדל ליטרלית, שימוש בגוף (מתודות-מחרוזת/רשימה, גישת-שדה ⇒ Map,
//   אריתמטיקה ⇒ num, for-of ⇒ List, קריאה ⇒ פונקציה=נשאר dynamic), בדיקות-null ⇒ T? · (ב) ראיית-בדיקות (type-evidence.json, מוכללת) — גוברת.
//   סתירה ⇒ dynamic. פרמטר-Map ⇒ גישת-שדה נפלטת כ-`m['k']` (לא `m.k`). ההחזרה מהביטויים המוחזרים.
let TYPES = {};   // {fn: {params: {name: type}, ret}} לפונקציה הנפלטת כעת
let CTX = null;   // {params: Map name⇒type} בזמן פליטת-גוף
const STR_M = new Set(['trim', 'toLowerCase', 'toUpperCase', 'startsWith', 'endsWith', 'split', 'replace', 'replaceAll', 'padStart', 'padEnd', 'repeat', 'charCodeAt', 'substring', 'substr', 'toFixed_', 'localeCompare', 'trimStart', 'trimEnd', 'charAt', 'normalize']);
const LIST_M = new Set(['map', 'filter', 'some', 'every', 'forEach', 'reduce', 'find', 'findIndex', 'flat', 'flatMap', 'sort', 'push', 'join', 'slice_']);
const NUM_M = new Set(['toFixed']);
const litType = (e) => { const K = ts.SyntaxKind; if (!e) return null; switch (e.kind) { case K.StringLiteral: case K.NoSubstitutionTemplateLiteral: case K.TemplateExpression: return 'String'; case K.NumericLiteral: return 'num'; case K.TrueKeyword: case K.FalseKeyword: return 'bool'; case K.ArrayLiteralExpression: return 'List<dynamic>'; case K.ObjectLiteralExpression: return CLASSES.size ? null : 'Map<String, dynamic>'; case K.NullKeyword: return 'null'; case K.PrefixUnaryExpression: return e.operator === K.MinusToken ? 'num' : e.operator === K.ExclamationToken ? 'bool' : null; default: return null; } };
const join = (a, b) => (!a ? b : !b ? a : a === b ? a : 'dynamic');
export function inferFn(params, body) {
  const K = ts.SyntaxKind; const names = params.map((p) => p.name.text); const use = {}; const nul = new Set(); const fn = new Set(); const tof = new Set();
  const note = (nm, t) => { if (!names.includes(nm)) return; use[nm] = join(use[nm], t); };
  const id = (e) => (e && e.kind === K.Identifier ? e.text : null);
  const walk = (n) => {
    if (!n) return;
    switch (n.kind) {
      case K.CallExpression: {
        const c = n.expression; const callee = id(c); if (callee && names.includes(callee)) fn.add(callee);
        if (c.kind === K.PropertyAccessExpression) { const o = id(c.expression), m = c.name.text; if (o) { if (STR_M.has(m)) note(o, 'String'); else if (LIST_M.has(m)) note(o, 'List<dynamic>'); else if (NUM_M.has(m)) note(o, 'num'); } }
        break; }
      case K.PropertyAccessExpression: { const o = id(n.expression); if (o && n.name.text !== 'length' && !(n.parent && n.parent.kind === K.CallExpression && n.parent.expression === n)) note(o, 'Map<String, dynamic>'); break; }
      case K.ElementAccessExpression: { const o = id(n.expression); if (o) { const k = n.argumentExpression; if (k.kind === K.StringLiteral) note(o, 'Map<String, dynamic>'); else if (k.kind === K.NumericLiteral) note(o, 'List<dynamic>'); } break; }
      case K.ForOfStatement: { const o = id(n.expression); if (o) note(o, 'List<dynamic>'); break; }
      case K.BinaryExpression: {
        const op = n.operatorToken.kind; const l = id(n.left), r = id(n.right);
        if ([K.MinusToken, K.AsteriskToken, K.SlashToken, K.PercentToken, K.LessThanToken, K.GreaterThanToken, K.LessThanEqualsToken, K.GreaterThanEqualsToken].includes(op)) { if (l) note(l, 'num'); if (r) note(r, 'num'); }
        if ([K.EqualsEqualsEqualsToken, K.ExclamationEqualsEqualsToken, K.EqualsEqualsToken, K.ExclamationEqualsToken].includes(op)) { const isNull = (e) => e.kind === K.NullKeyword || (e.kind === K.Identifier && e.text === 'undefined'); if (l && isNull(n.right)) nul.add(l); if (r && isNull(n.left)) nul.add(r); if (l && n.right.kind === K.StringLiteral) note(l, 'String'); if (r && n.left.kind === K.StringLiteral) note(r, 'String'); if (l && n.right.kind === K.NumericLiteral) note(l, 'num'); if (r && n.left.kind === K.NumericLiteral) note(r, 'num'); }
        if (op === K.QuestionQuestionToken || op === K.BarBarToken) { if (l) nul.add(l); }
        break; }
      case K.TypeOfExpression: { const o = id(n.expression); if (o) tof.add(o); break; }   // מחלקות · typeof d === 'number' + d.kind ⇒ איחוד (Dist): לא Map קשיח
      case K.PrefixUnaryExpression: { if (n.operator === K.ExclamationToken) { const o = id(n.operand); if (o) nul.add(o); } break; }
      case K.IfStatement: case K.ConditionalExpression: { const o = id(n.kind === K.IfStatement ? n.expression : n.condition); if (o) nul.add(o); break; }
    }
    ts.forEachChild(n, walk);
  };
  walk(body);
  const out = {};
  for (const p of params) { const nm = p.name.text; let t = use[nm] || null; const d = litType(p.initializer); if (d && d !== 'null') t = join(t, d === 'num' && t === 'num' ? 'num' : d); if (fn.has(nm)) t = null; if (t && /^Map</.test(t) && (tof.has(nm) || CLASSES.size)) { out[nm] = 'dynamic#map'; continue; } if (t && t !== 'dynamic' && nul.has(nm) && !p.initializer) t += '?'; if (t === 'dynamic') t = null; out[nm] = t; }
  // החזרה: מהביטויים המוחזרים
  let ret = null, retNull = false, seen = 0;
  const rw = (n) => { if (!n) return; if (n.kind === K.ArrowFunction || n.kind === K.FunctionExpression || n.kind === K.FunctionDeclaration) return; if (n.kind === K.ReturnStatement) { seen++; const e = n.expression; if (!e || e.kind === K.NullKeyword) retNull = true; else { let t = litType(e); if (!t && e.kind === K.BinaryExpression) { const op = e.operatorToken.kind; if ([K.LessThanToken, K.GreaterThanToken, K.LessThanEqualsToken, K.GreaterThanEqualsToken, K.EqualsEqualsEqualsToken, K.ExclamationEqualsEqualsToken, K.AmpersandAmpersandToken].includes(op)) t = 'bool'; else if ([K.MinusToken, K.AsteriskToken, K.SlashToken, K.PercentToken].includes(op)) t = 'num'; else if (op === K.PlusToken && (litType(e.left) === 'String' || litType(e.right) === 'String')) t = 'String'; } if (!t && e.kind === K.ConditionalExpression) { const a = litType(e.whenTrue), b = litType(e.whenFalse); if (a && b && a !== 'null' && b !== 'null') t = join(a, b); else if (a === 'null' && b) { t = b; retNull = true; } else if (b === 'null' && a) { t = a; retNull = true; } } if (!t && e.kind === K.PrefixUnaryExpression && e.operator === K.ExclamationToken) t = 'bool'; if (!t && e.kind === K.CallExpression && e.expression.kind === K.Identifier && /^_?(falsy|truthy)$/.test(e.expression.text)) t = 'bool'; ret = t ? join(ret, t) : 'dynamic'; } } ts.forEachChild(n, rw); };
  if (body && body.kind !== K.Block) { const t = litType(body); return { params: out, ret: t && t !== 'null' ? t : null }; }   // חץ עם גוף-ביטוי: ההחזרה מהביטוי, לעולם לא void
  rw(body);
  if (!seen) ret = 'void';
  if (ret && ret !== 'dynamic' && ret !== 'void' && retNull) ret += '?';
  if (ret === 'dynamic' || ret === 'null') ret = null;
  return { params: out, ret };
}
const typeOfParam = (fnName, p) => { const nm = p.name.text; const ev = (TYPES[fnName] || {}).params || {}; const st = (CTX && CTX.params.get(nm + '#static')) || null; return ev[nm] || st || null; };
let INFER = true;   // opts.infer=false ⇒ ניב-הבסיס (הכל dynamic) — למדידת לפני/אחרי
let FORCE = false;   // opts.force ⇒ override מפורש ב-types (גם 'dynamic') גובר על ההסקה
export function emit(src, opts = {}) {
  TYPES = opts.types || {}; INFER = opts.infer !== false; FORCE = !!opts.force;
  const sf = ts.createSourceFile('a.js', src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
  CLASSES = new Set(sf.statements.filter((st) => st.kind === ts.SyntaxKind.ClassDeclaration && st.name).map((st) => st.name.text)); FIELD_CLASS = {}; CUR_CLASS = null;
  ARITY = {}; for (const st of sf.statements) if (st.kind === ts.SyntaxKind.ClassDeclaration) for (const m of st.members) if (m.kind === ts.SyntaxKind.MethodDeclaration && m.name.kind === ts.SyntaxKind.Identifier) ARITY[m.name.text] = Math.max(ARITY[m.name.text] || 0, m.parameters.length);   /* דריסה עם פחות פרמטרים (Sink.canAccept()) ⇒ ריפוד אופציונלי */
  HINT = opts.hint || { fields: {}, params: {} }; GLOBALS = new Map(); FIELD_COLL = {}; for (const st of sf.statements) if (st.kind === ts.SyntaxKind.ClassDeclaration && st.name) scanFields(st);
  const out = [], init = [];   // מחלקות · פקודה ברמת-המודול (registerNodeType(...)) ⇒ Dart אוסר ⇒ _moduleInit() שהקורא מריץ פעם אחת
  for (const st of sf.statements) (st.kind === ts.SyntaxKind.ExpressionStatement ? init : out).push(gen(st));
  if (init.length) out.push(`void _moduleInit() {\n${init.map((x) => '  ' + x).join('\n')}\n}`);
  return out.filter(Boolean).join('\n');
}
// מחלקות · מודול עם class ⇒ «מצב-אובייקטים»: ליטרל-אובייקט ⇒ _o({...}) (Map שגם נגיש בנקודה, noSuchMethod) · מקלט ממחלקה ידועה ⇒ המתודה שלו (לא STD)
let FIELD_COLL = {}, ARITY = {}; let CLASSES = new Set(), FIELD_CLASS = {}, CUR_CLASS = null, HINT = { fields: {}, params: {} }, GLOBALS = new Map();   // HINT: טיפוסי-מחלקה מה-TS (sim: Sim) · GLOBALS: Map/Set ברמת-המודול
const classOf = (e) => { const K = ts.SyntaxKind; if (!e) return null; if (e.kind === K.ThisKeyword) return CUR_CLASS;
  if (e.kind === K.PropertyAccessExpression && e.expression.kind === K.ThisKeyword && CUR_CLASS) return (FIELD_CLASS[CUR_CLASS] || {})[e.name.text] || null;
  if (e.kind === K.Identifier) { const t = (CTX && CTX.locals.get(e.text)) || GLOBALS.get(e.text); return t && t.startsWith('class:') ? t.slice(6) : null; }
  if (e.kind === K.NewExpression && e.expression.kind === K.Identifier && CLASSES.has(e.expression.text)) return e.expression.text; return null; };
// מחלקות · TS ⇒ Dart: מתרגמים TS⇒JS (פרמטר אופציונלי `x?: T` ⇒ `x = undefined`, כדי שלא ילך לאיבוד בתרגום), מורידים import/export, ואז emit.
export function emitTs(src, opts = {}) {
  const hint = { fields: {}, params: {}, coll: {}, locals: {}, ret: {} }; const sf = ts.createSourceFile('a.ts', src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);   // טיפוסי-מחלקה מה-TS לפני שהתרגום מוחק אותם
  const cls = new Set(); ts.forEachChild(sf, (n) => { if (ts.isClassDeclaration(n) && n.name) cls.add(n.name.text); });
  const collT = (t) => (t && ts.isTypeReferenceNode(t) && ts.isIdentifier(t.typeName) ? ({ Set: 'Set', ReadonlySet: 'Set', Map: 'Map', ReadonlyMap: 'Map' })[t.typeName.text] || null : null);
  const IFACE = {}; ts.forEachChild(sf, (n) => { if (ts.isInterfaceDeclaration(n)) { const m = (IFACE[n.name.text] = {}); for (const x of n.members) if (ts.isPropertySignature(x) && ts.isIdentifier(x.name) && collT(x.type)) m[x.name.text] = collT(x.type); } });   // ממשק: שדות Map/Set (Graph.succ)
  const tn = (t) => t && ts.isTypeReferenceNode(t) && ts.isIdentifier(t.typeName) && cls.has(t.typeName.text) ? t.typeName.text : null;
  const walk = (n, owner) => { if (ts.isClassDeclaration(n) && n.name) { const c = n.name.text; hint.fields[c] = hint.fields[c] || {};
      for (const m of n.members) { if (ts.isPropertyDeclaration(m) && ts.isIdentifier(m.name) && m.type && ts.isTypeReferenceNode(m.type) && ts.isIdentifier(m.type.typeName) && /^(Map|Set)$/.test(m.type.typeName.text)) ((hint.coll[c] = hint.coll[c] || {})[m.name.text] = m.type.typeName.text);
        if (ts.isPropertyDeclaration(m) && ts.isIdentifier(m.name) && tn(m.type)) hint.fields[c][m.name.text] = tn(m.type); if (ts.isConstructorDeclaration(m)) for (const p of m.parameters) if (ts.isIdentifier(p.name) && tn(p.type) && p.modifiers && p.modifiers.length) hint.fields[c][p.name.text] = tn(p.type); }
      ts.forEachChild(n, (x) => walk(x, c)); return; }
    const fname = (ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n)) && n.name && ts.isIdentifier(n.name) ? n.name.text : ts.isConstructorDeclaration(n) ? owner : ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && (ts.isArrowFunction(n.initializer) || ts.isFunctionExpression(n.initializer)) ? n.name.text : null;
    if (fname) { const ps = ts.isVariableDeclaration(n) ? n.initializer.parameters : n.parameters; const key = owner + '.' + fname;   /* = מפתח fnHead: (CUR_CLASS||'') + '.' + שם */
      for (const p of ps) if (ts.isIdentifier(p.name) && tn(p.type)) (hint.params[key] = hint.params[key] || {})[p.name.text] = tn(p.type);
      // ⇄ אוספים מהטיפוס (שדרוג 25.9 — graph.reach של systems-engine): פרמטר Set/Map/ReadonlySet · משתנה מקומי = שדה-ממשק מטיפוס Map/Set (גם בתנאי «a ? g.succ : g.pred») · החזרה Set/Map
      const lc = (hint.locals[key] = hint.locals[key] || {}); const ifp = {};
      for (const p of ps) if (ts.isIdentifier(p.name) && p.type) { const c = collT(p.type); if (c) lc[p.name.text] = c; else if (ts.isTypeReferenceNode(p.type) && ts.isIdentifier(p.type.typeName) && IFACE[p.type.typeName.text]) ifp[p.name.text] = IFACE[p.type.typeName.text]; }
      const rt = (ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n)) && n.type ? collT(n.type) : null; if (rt) hint.ret[fname] = rt;
      const propColl = (e) => (e && ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) && ifp[e.expression.text] ? ifp[e.expression.text][e.name.text] || null : null);
      const body = ts.isVariableDeclaration(n) ? n.initializer.body : n.body; const scan = (x) => { if (ts.isVariableDeclaration(x) && ts.isIdentifier(x.name) && x.initializer) { const i = x.initializer; const c = propColl(i) || (ts.isConditionalExpression(i) && propColl(i.whenTrue) && propColl(i.whenTrue) === propColl(i.whenFalse) ? propColl(i.whenTrue) : null) || (x.type ? collT(x.type) : null); if (c) lc[x.name.text] = c; } ts.forEachChild(x, scan); }; if (body) scan(body); }
    ts.forEachChild(n, (x) => walk(x, owner)); };
  walk(sf, '');
  const f = ts.factory; const opt = (ctx) => (root) => { const v = (n) => { n = ts.visitEachChild(n, v, ctx); return ts.isParameter(n) && n.questionToken && !n.initializer && !n.dotDotDotToken ? f.updateParameterDeclaration(n, n.modifiers, n.dotDotDotToken, n.name, undefined, n.type, f.createIdentifier('undefined')) : n; }; return ts.visitNode(root, v); };
  const js = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, useDefineForClassFields: true, removeComments: true }, transformers: { before: [opt] } }).outputText;
  return emit(js.replace(/^import .*$/mg, '').replace(/^export \{[^}]*\};?$/mg, '').replace(/^export (default )?/mg, ''), { ...opts, hint });
}
const CTX_STACK = [];   // פונקציה מקוננת (חץ בתוך גוף) — שומרים/משחזרים את הקשר-הטיפוסים של החיצונית
function fnHead(name, params, body) {
  const inf = INFER ? inferFn(params, body) : { params: {}, ret: null }; const ev = TYPES[name] || {};
  CTX_STACK.push(CTX); CTX = { params: new Map(CTX ? CTX.params : []), locals: new Map(CTX ? CTX.locals : []), nullables: new Set(CTX ? CTX.nullables : []) };   // up-converter · פונקציה-מקוננת יורשת את טיפוסי-הפרמטרים של החיצונית (T.k1 בתוך arrow ⇒ T['k1'])
  for (const [v, c] of Object.entries((HINT.locals || {})[(CUR_CLASS || '') + '.' + name] || {})) CTX.locals.set(v, c);   // ⇄ Set/Map מהטיפוס (פרמטר · שדה-ממשק · מקומי)
  const hp = HINT.params[(CUR_CLASS || '') + '.' + name] || {}; for (const p of params) if (p.name.kind === ts.SyntaxKind.Identifier && hp[p.name.text]) CTX.locals.set(p.name.text, 'class:' + hp[p.name.text]);   // מחלקות · (sim: Sim) מה-TS
  for (const p of params) { const nm = p.name.text; const o = ev.params && ev.params[nm]; const t = hp[nm] ? null : (FORCE && o) ? (o === 'dynamic' ? null : o) : (o || inf.params[nm] || null); CTX.params.set(nm, t);   /* רמז-TS גובר על הסקה (sim.every ≠ List) */ }
  const ret = (FORCE && ev.ret) ? ev.ret : (ev.ret || inf.ret || 'dynamic');
  let lastReq = -1; params.forEach((p, i) => { if (!p.initializer) lastReq = i; });   // up-converter · ברירת-מחדל לפני פרמטר-חובה ⇒ Dart אוסר [x = v] באמצע; נפלט כחובה (הרתמה מעבירה את כל הארגומנטים)
  const pre = [];   // up-converter · פרמטר-מפורק ({a,b} / [a,b]) ⇒ dynamic __pN + פירוק בגוף
  CONST_DEF_PRE = pre; const parts = params.map((p, i) => { if (p.dotDotDotToken && p.name.kind === ts.SyntaxKind.Identifier) { const rs = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => `__r${k}`); pre.push(`final ${p.name.text} = _rest([${rs.join(', ')}]);`); return `[${rs.map((r) => `dynamic ${r} = _NA`).join(', ')}]`; }   /* מחלקות · ...ids ⇒ עד 8 ארגומנטים אופציונליים (_NA = לא-נשלח) */
    if (p.name.kind !== ts.SyntaxKind.Identifier) { const v = '__p' + i; pre.push(...bindingPre(p.name, v)); return `dynamic ${v}`; } return param(p, i < lastReq); });
  CONST_DEF_PRE = null; const opt = parts.filter((x) => x.startsWith('[')); const ps = opt.length < 2 ? parts.join(', ') : [...parts.filter((x) => !x.startsWith('[')), `[${opt.map((x) => x.slice(1, -1)).join(', ')}]`].join(', ');   // מחלקות · (mean = 0, sd = 1) ⇒ [a, b] אחד (Dart אוסר שני סוגריים)
  return { ret, ps, pre: pre.join(' ') };
}
function gen(n) {
  const K = ts.SyntaxKind;
  switch (n.kind) {
    case K.FunctionDeclaration: {
      const name = n.name.text; const { ret, ps, pre } = fnHead(name, n.parameters, n.body);
      const body = withPre(gen(n.body), pre); CTX = CTX_STACK.pop();
      return `${ret} ${name}(${ps}) ${body}`;
    }
    case K.VariableStatement: {
      const d = n.declarationList.declarations[0];
      const init = d.initializer;
      if (init && (init.kind === K.ArrowFunction || init.kind === K.FunctionExpression)) {
        const { ret, ps, pre } = fnHead(d.name.text, init.parameters, init.body);
        const body = withPre(init.body.kind === K.Block ? gen(init.body) : `=> ${expr(init.body)};`, pre); CTX = CTX_STACK.pop();
        return `${ret} ${d.name.text}(${ps}) ${body}`;
      }
      // 3 · הצהרות-מרובות (const a = 1, b = 2) ופירוק (const [d, m, y] = …; const {a, b} = …)
      if (n.declarationList.declarations.length > 1 || d.name.kind !== K.Identifier) {
        return n.declarationList.declarations.map((dd, j) => { if (dd.name.kind === K.Identifier) { noteLocal(dd.name.text, dd.initializer); return `var ${dd.name.text} = ${expr(dd.initializer)};`; } const v = `__d${j}`; return `var ${v} = ${expr(dd.initializer)}; ${bindingPre(dd.name, v).join(' ')}`; }).join(' ');
      }
      if (!CTX && init) { const t = init.kind === K.NewExpression && init.expression.kind === K.Identifier && /^(Set|Map)$/.test(init.expression.text) ? init.expression.text : localTypeOf(init); if (t) GLOBALS.set(d.name.text, t); }   // מחלקות · ברמת-המודול
      if (CTX && init && init.kind === K.NewExpression && init.expression.kind === K.Identifier && (init.expression.text === 'Set' || init.expression.text === 'Map')) CTX.locals.set(d.name.text, init.expression.text);   // up-converter · Set/Map מקומיים ⇒ API של Dart
      else noteLocal(d.name.text, init);
      if (!init) return `dynamic ${d.name.text};`;   // let x; ⇒ dynamic
      if (init.kind === K.NumericLiteral && !/^[ijkn]$|idx|index|^pos$|^cur$/i.test(d.name.text)) return `num ${d.name.text} = ${expr(init)};`;   // up-converter · var sum = 0 ⇒ num (Dart היה מסיק int ו-+= של num נופל)
      return `var ${d.name.text} = ${expr(init)};`;
    }
    case K.ClassDeclaration: return classDecl(n);
    case K.Block: return `{\n${n.statements.map(s => '  ' + gen(s)).join('\n')}\n}`;
    case K.ReturnStatement: return `return ${n.expression ? expr(n.expression) : ''};`;
    case K.IfStatement: return `if (${boolCtx(n.expression)}) ${gen(n.thenStatement)}${n.elseStatement ? ' else ' + gen(n.elseStatement) : ''}`;
    case K.ForOfStatement: { const nm = n.initializer.declarations[0].name;
      if (nm.kind === K.ArrayBindingPattern || nm.kind === K.ObjectBindingPattern) {   // up-converter · for (const [k, v] of …) / for (const {a} of …)
        const els = nm.elements.filter((e) => e.name).map((e, i) => nm.kind === K.ArrayBindingPattern ? `final ${e.name.text} = __e[${i}];` : `final ${e.name.text} = __e['${(e.propertyName || e.name).text}'];`);
        const body = n.statement.kind === K.Block ? n.statement.statements.map(gen).join('\n') : gen(n.statement);
        return `for (final __e in ${expr(n.expression)}) {\n${els.join(' ')}\n${body}\n}`; }
      const v = nm.text; if (CTX && n.expression.kind === K.Identifier && CTX.locals.get(n.expression.text) === 'List<String>') CTX.locals.set(v, 'String');   // up-converter · for (const line of iso.split(…)) ⇒ line: String
      return `for (final ${v} in ${expr(n.expression)}) ${gen(n.statement)}`; }
    case K.ExpressionStatement: { const e = n.expression;   // מחלקות · [a, b] = [b, a] (החלפה/פירוק-השמה) ⇒ זמני + השמות
      if (e.kind === K.BinaryExpression && e.operatorToken.kind === K.EqualsToken && e.left.kind === K.ArrayLiteralExpression) return `{ final __t = ${expr(e.right)}; ${e.left.elements.map((x, i) => x.kind === K.OmittedExpression ? '' : `${expr(x)} = __t[${i}];`).join(' ')} }`;
      return expr(e) + ';'; }
    case K.ContinueStatement: return 'continue;';
    case K.BreakStatement: return 'break;';
    case K.ThrowStatement: return `throw ${expr(n.expression)};`;
    case K.ForStatement: {
      const init = n.initializer ? (n.initializer.kind === K.VariableDeclarationList ? 'var ' + n.initializer.declarations.map(d => `${d.name.text} = ${expr(d.initializer)}`).join(', ') : expr(n.initializer)) : '';
      return `for (${init}; ${n.condition ? expr(n.condition) : ''}; ${n.incrementor ? expr(n.incrementor) : ''}) ${gen(n.statement)}`;
    }
    case K.WhileStatement: return `while (${boolCtx(n.expression)}) ${gen(n.statement)}`;
    case K.TryStatement: {
      let r = `try ${gen(n.tryBlock)}`;
      if (n.catchClause) r += ` catch (${n.catchClause.variableDeclaration ? n.catchClause.variableDeclaration.name.text : '_'}) ${gen(n.catchClause.block)}`;
      if (n.finallyBlock) r += ` finally ${gen(n.finallyBlock)}`;
      return r;
    }
    case K.SwitchStatement: {
      const isConst = (e) => [K.StringLiteral, K.NumericLiteral, K.TrueKeyword, K.FalseKeyword, K.NullKeyword, K.NoSubstitutionTemplateLiteral].includes(e.kind);
      if (n.caseBlock.clauses.some((c) => c.kind !== K.DefaultClause && !isConst(c.expression))) {   // up-converter · case T['k1']: ⇒ Dart דורש קבוע ⇒ שרשרת if/else (בלי fallthrough)
        const stmts = (c) => c.statements.filter((st) => st.kind !== K.BreakStatement).map(gen).join('\n');
        const cases = n.caseBlock.clauses.filter((c) => c.kind !== K.DefaultClause), def = n.caseBlock.clauses.find((c) => c.kind === K.DefaultClause);
        return `{ final __s = ${expr(n.expression)};\n${cases.map((c, i) => `${i ? 'else ' : ''}if (__s == ${expr(c.expression)}) {\n${stmts(c)}\n}`).join('\n')}${def ? `\nelse {\n${stmts(def)}\n}` : ''}\n}`;
      }
      const cs = n.caseBlock.clauses.map(c => c.kind === K.DefaultClause
        ? `default:\n${c.statements.map(gen).join('\n')}`
        : `case ${expr(c.expression)}:\n${c.statements.map(gen).join('\n')}`).join('\n');
      return `switch (${expr(n.expression)}) {\n${cs}\n}`;
    }
    case K.EmptyStatement: return ';';
    case K.VariableDeclarationList: return n.declarations.map(d => `var ${d.name.text} = ${expr(d.initializer)};`).join(' ');
    default: return expr(n) + (n.kind === K.ExpressionStatement ? ';' : '');
  }
}
// פירוק-קשירה: [a, , b] ⇒ final a = v[0]; final b = v[2]; · {a, b: c} ⇒ final a = v['a']; final c = v['b'];
function bindingPre(pat, v) { const K = ts.SyntaxKind; const out = [];
  pat.elements.forEach((e, i) => { if (!e.name) return; if (e.name.kind !== K.Identifier) return;
    if (e.dotDotDotToken) { const taken = pat.elements.filter((x) => !x.dotDotDotToken && x.name).map((x) => `'${(x.propertyName || x.name).text}'`); out.push(pat.kind === K.ArrayBindingPattern ? `final ${e.name.text} = (${v} as List).sublist(${i});` : `final ${e.name.text} = _omit(${v}, [${taken.join(', ')}]);`); return; }   /* מחלקות · {id, ...rest} / [a, ...xs] */   // קינון עמוק — לא נתמך (נשאר undefined ⇒ נופל באנלייזר)
    if (pat.kind === K.ArrayBindingPattern) out.push(`final ${e.name.text} = ${v}[${i}];`); else out.push(CLASSES.size ? `final ${e.name.text} = (${v} as dynamic).${(e.propertyName || e.name).text};` : `final ${e.name.text} = ${v}['${(e.propertyName || e.name).text}'];`); });   // מחלקות · const {opts} = this ⇒ גישה בנקודה
  return out; }
const withPre = (body, pre) => !pre ? body : body.startsWith('{') ? '{\n  ' + pre + body.slice(1) : `{ ${pre} return ${body.replace(/^=>\s*/, '').replace(/;$/, '')}; }`;
// up-converter · הסקת-טיפוס מקומית (מבנית, אפס-מילון): ליטרל/תבנית/trim()/… ⇒ String · [ ]/split/map/filter ⇒ List · מספר/אריתמטיקה/length ⇒ num · { } ⇒ Map
const STR_CALLS = new Set(['trim', 'toLowerCase', 'toUpperCase', 'toString', 'join', 'padStart', 'padEnd', 'replace', 'replaceAll', 'substring', 'substr', 'repeat', 'normalize', 'toFixed', 'trimStart', 'trimEnd', 'charAt']);
const LIST_CALLS = new Set(['split', 'map', 'filter', 'concat', 'sort', 'reverse', 'flat', 'flatMap', 'keys', 'values', 'entries']);
function localTypeOf(init) { const K = ts.SyntaxKind; if (!init) return null;
  if (init.kind === K.NewExpression && init.expression.kind === K.Identifier && CLASSES.has(init.expression.text)) return 'class:' + init.expression.text;
  if (init.kind === K.StringLiteral || init.kind === K.NoSubstitutionTemplateLiteral || init.kind === K.TemplateExpression) return 'String';
  if (init.kind === K.NumericLiteral) return 'num'; if (init.kind === K.ArrayLiteralExpression) return 'List'; if (init.kind === K.ObjectLiteralExpression) return CLASSES.size ? null : 'Map';
  if (init.kind === K.ParenthesizedExpression) return localTypeOf(init.expression);
  if (init.kind === K.ConditionalExpression) { const a = localTypeOf(init.whenTrue), b = localTypeOf(init.whenFalse); if (a && a === b) return a; if (init.whenTrue.kind === K.NullKeyword || init.whenFalse.kind === K.NullKeyword) return 'nullable'; return null; }
  if (init.kind === K.CallExpression && init.expression.kind === K.PropertyAccessExpression && init.expression.name.text === 'split') return 'List<String>';
  if (init.kind === K.CallExpression && init.expression.kind === K.PropertyAccessExpression && (init.expression.name.text === 'exec' || init.expression.name.text === 'match')) return 'nullable';   // RegExp.exec ⇒ firstMatch ⇒ RegExpMatch?
  if (init.kind === K.CallExpression) { const c = init.expression; if (c.kind === K.PropertyAccessExpression) { const m = c.name.text; if (STR_CALLS.has(m)) return 'String'; if (LIST_CALLS.has(m)) return 'List'; if (m === 'slice' && !init.arguments.length) return 'List'; if (m === 'slice' && isStrParam(c.expression)) return 'String'; if (c.expression.kind === K.Identifier && c.expression.text === 'Math') return 'num'; }
    if (c.kind === K.Identifier && c.text === 'String') return 'String'; if (c.kind === K.Identifier && (c.text === 'Number' || c.text === 'parseInt' || c.text === 'parseFloat')) return 'num'; return null; }
  if (init.kind === K.BinaryExpression) { const op = init.operatorToken.kind; if (op === K.PlusToken) { const l = localTypeOf(init.left), r = localTypeOf(init.right); if (l === 'String' || r === 'String' || isStrParam(init.left) || isStrParam(init.right)) return 'String'; if (l === 'num' && r === 'num') return 'num'; return null; } if ([K.MinusToken, K.AsteriskToken, K.SlashToken, K.PercentToken].includes(op)) return 'num'; return null; }
  if (init.kind === K.PropertyAccessExpression && init.name.text === 'length') return 'num';
  return null; }
const noteLocal = (name, init) => { if (!CTX) return; const t = localTypeOf(init); if (t === 'nullable') { CTX.nullables.add(name); return; } if (t) CTX.locals.set(name, t); };
let CONST_DEF_PRE = null;
const isConstExpr = (e) => { const K = ts.SyntaxKind; if (!e) return true; if ([K.NumericLiteral, K.StringLiteral, K.TrueKeyword, K.FalseKeyword, K.NullKeyword, K.NoSubstitutionTemplateLiteral].includes(e.kind)) return true;
  if (e.kind === K.Identifier) return ['undefined', 'Infinity', 'NaN'].includes(e.text); if (e.kind === K.PrefixUnaryExpression) return isConstExpr(e.operand);
  if (e.kind === K.ArrayLiteralExpression) return e.elements.length === 0; if (e.kind === K.ObjectLiteralExpression) return e.properties.length === 0 && !CLASSES.size; return false; };
function param(p, forceRequired = false) {
  const name = p.name.text; const t = ((CTX && CTX.params.get(name)) || 'dynamic').replace('#map', '');
  if (p.initializer && !forceRequired && CONST_DEF_PRE && !isConstExpr(p.initializer)) { CONST_DEF_PRE.push(`${name} ??= ${expr(p.initializer)};`); return `[dynamic ${name}]`; }   // מחלקות · (x, d = x) ⇒ Dart דורש ברירת-מחדל קבועה
  if (p.initializer && !forceRequired) { const init = expr(p.initializer); return `[${t === 'dynamic' || init === 'null' ? (t === 'dynamic' ? 'dynamic' : t.replace(/\?$/, '') + '?') : t} ${name} = ${init}]`; }
  return `${t} ${name}`;
}
// G20 · הקשר-בוליאני על פרמטר מוקלד לא-bool (String/num/List/Map) ⇒ `_truthy(x)` (סמנטיקת-JS: '' ו-0 שקריים) — אחרת non_bool_condition
const boolCtx = (e) => { const K = ts.SyntaxKind; if (!CTX || !e) return expr(e);
  if (e.kind === K.BinaryExpression && (e.operatorToken.kind === K.AmpersandAmpersandToken || e.operatorToken.kind === K.BarBarToken)) return `(${boolCtx(e.left)} ${e.operatorToken.kind === K.AmpersandAmpersandToken ? '&&' : '||'} ${boolCtx(e.right)})`;   // up-converter · a && b בהקשר-בוליאני ⇒ שני הצדדים בוליאניים
  if (e.kind === K.PrefixUnaryExpression && e.operator === K.ExclamationToken) return `!${boolCtx(e.operand)}`;
  if (e.kind === K.Identifier) { if (CTX.nullables.has(e.text)) return `(${e.text} != null)`; const t = CTX.params.get(e.text); if (t && t !== 'bool' && t !== 'bool?') return `_truthy(${e.text})`; const lt = CTX.locals.get(e.text); if (lt && lt !== 'bool') return `_truthy(${e.text})`; if (CLASSES.size && !t) return `_truthy(${e.text})`; } if (e.kind === K.ParenthesizedExpression) return `(${boolCtx(e.expression)})`;
  if ((e.kind === K.PropertyAccessExpression && e.name.text === 'length') || (e.kind === K.BinaryExpression && [K.MinusToken, K.AsteriskToken, K.SlashToken, K.PercentToken, K.PlusToken].includes(e.operatorToken.kind)) || localTypeOf(e) === 'num' || localTypeOf(e) === 'String') return `_truthy(${expr(e)})`;   // up-converter · length/אריתמטיקה/מחרוזת בהקשר-בוליאני
  if (CLASSES.size && !isBoolish(e)) return `_truthy(${expr(e)})`;   /* מחלקות · if (opts.mtbf && opts.mttr) — אמיתיות-JS על כל ערך */
  return expr(e); };
const isBoolish = (x) => { const K = ts.SyntaxKind; const B = [K.EqualsEqualsEqualsToken, K.EqualsEqualsToken, K.ExclamationEqualsEqualsToken, K.ExclamationEqualsToken, K.LessThanToken, K.GreaterThanToken, K.LessThanEqualsToken, K.GreaterThanEqualsToken, K.AmpersandAmpersandToken, K.BarBarToken, K.InstanceOfKeyword, K.InKeyword];
  return x.kind === K.ParenthesizedExpression ? isBoolish(x.expression) : x.kind === K.PrefixUnaryExpression ? x.operator === K.ExclamationToken : x.kind === K.BinaryExpression ? B.includes(x.operatorToken.kind) : (x.kind === K.TrueKeyword || x.kind === K.FalseKeyword); };
const nullableParam = (e) => { const K = ts.SyntaxKind; if (!CTX || !e || e.kind !== K.Identifier) return false; const t = CTX.params.get(e.text); return !!(t && t.endsWith('?')); };
const bang = (e) => (nullableParam(e) || (CTX && e && e.kind === ts.SyntaxKind.Identifier && CTX.nullables.has(e.text)) ? `${e.text}!` : expr(e));   // up-converter · גם מקומי-nullable (x = cond ? v : null · exec)   // שימוש-ישיר בפרמטר-nullable (גישה/קריאה/אריתמטיקה) ⇒ `p!` — JS היה זורק על null באותה נקודה
const isStrParam = (e) => { const K = ts.SyntaxKind; if (!e) return false; if (e.kind === K.StringLiteral || e.kind === K.NoSubstitutionTemplateLiteral || e.kind === K.TemplateExpression) return true; if (e.kind === K.ParenthesizedExpression) return isStrParam(e.expression);
  if (e.kind === K.CallExpression && e.expression.kind === K.PropertyAccessExpression && STR_CALLS.has(e.expression.name.text)) return true;   // .trim().slice(…) ⇒ substring
  if (!CTX || e.kind !== K.Identifier) return false; const t = CTX.params.get(e.text); if (t && /^String\??$/.test(t)) return true; return CTX.locals.get(e.text) === 'String'; };   // up-crosslang · מקלט מוקלד-String (מהראיות/מטיפוסי-הצורך) ⇒ slice = substring, לא sublist
const isMapParam = (e) => { const K = ts.SyntaxKind; if (!CTX || !e || e.kind !== K.Identifier) return null; const t = CTX.params.get(e.text); if (t && /^Map</.test(t)) return t; if (t === 'dynamic#map') return CLASSES.size ? null : 'Map<String, dynamic>';   /* מחלקות · במצב-אובייקטים גישה בנקודה (עובד על _JsObj ועל מחלקה) */ return CTX.locals.get(e.text) === 'Map' ? 'Map<String, dynamic>' : null; };   // up-converter · גם מקומי מאובייקט-ליטרל
function expr(n) {
  const K = ts.SyntaxKind;
  if (!n) return '';
  switch (n.kind) {
    case K.Identifier: return n.text === 'undefined' ? 'null' : n.text === 'NaN' ? 'double.nan' : n.text === 'Infinity' ? 'double.infinity' : n.text;   // up-converter · undefined/NaN/Infinity
    case K.NumericLiteral: return n.text;
    case K.StringLiteral: return `'${esc(n.text)}'`;
    case K.TrueKeyword: return 'true'; case K.FalseKeyword: return 'false';
    case K.ThisKeyword: return 'this'; case K.SuperKeyword: return 'super';   // מחלקות
    case K.NullKeyword: case K.UndefinedKeyword: return 'null';
    case K.TemplateExpression: {
      let s = "'" + esc(n.head.text);
      for (const sp of n.templateSpans) s += '${' + expr(sp.expression) + '}' + esc(sp.literal.text);
      return s + "'";
    }
    case K.NoSubstitutionTemplateLiteral: return `'${esc(n.text)}'`;
    case K.ParenthesizedExpression: return `(${expr(n.expression)})`;
    case K.PrefixUnaryExpression:
      if (n.operator === K.ExclamationToken && n.operand.kind !== K.ParenthesizedExpression && n.operand.kind !== K.BinaryExpression && n.operand.kind !== K.CallExpression)
        return `_falsy(${expr(n.operand)})`; // truthiness של JS על ערך-דינמי
      if (n.operator === K.PlusToken) return `_toNum(${expr(n.operand)})`;   // up-converter · +x ⇒ מספר
      return ts.tokenToString(n.operator) + expr(n.operand);
    case K.BinaryExpression: {
      const op = n.operatorToken.kind;
      // typeof x === 'string'|'number'|'boolean'|'object'|'function'|'undefined'
      const TM = { string: 'String', number: 'num', boolean: 'bool', object: 'Map', function: 'Function', undefined: 'Null' };
      const tof = (side, other, neg) => side.kind === K.TypeOfExpression && other.kind === K.StringLiteral
        ? `${neg ? '!(' : ''}${expr(side.expression)} is ${TM[other.text] || 'dynamic'}${neg ? ')' : ''}` : null;
      if ([K.EqualsEqualsEqualsToken, K.EqualsEqualsToken].includes(op)) { const t = tof(n.left, n.right) || tof(n.right, n.left); if (t) return t; }
      if ([K.ExclamationEqualsEqualsToken, K.ExclamationEqualsToken].includes(op)) { const t = tof(n.left, n.right, true) || tof(n.right, n.left, true); if (t) return t; }
      { const bw = bitwise(n); if (bw) return bw; }
      if (op === K.AsteriskAsteriskToken) return `pow(${expr(n.left)}, ${expr(n.right)})`;   // מחלקות · a ** b
      if (op === K.AsteriskAsteriskEqualsToken) return `${expr(n.left)} = pow(${expr(n.left)}, ${expr(n.right)})`;   // מחלקות · סמנטיקת-32-ביט של JS (Dart int = 64)
      const arith = [K.MinusToken, K.AsteriskToken, K.SlashToken, K.PercentToken, K.LessThanToken, K.GreaterThanToken, K.LessThanEqualsToken, K.GreaterThanEqualsToken].includes(op);
      const l = arith ? bang(n.left) : expr(n.left), r = arith ? bang(n.right) : expr(n.right);
      if ([K.LessThanToken, K.GreaterThanToken, K.LessThanEqualsToken, K.GreaterThanEqualsToken].includes(op) && (isStrParam(n.left) || isStrParam(n.right))) return `(${l}.compareTo(${r}) ${n.operatorToken.getText ? n.operatorToken.getText() : ts.tokenToString(op)} 0)`;   // up-converter · השוואת-מחרוזות ב-JS ⇒ compareTo
      if (op === K.BarBarToken) {
        const BOOL_OPS = [K.EqualsEqualsEqualsToken, K.EqualsEqualsToken, K.ExclamationEqualsEqualsToken, K.ExclamationEqualsToken, K.LessThanToken, K.GreaterThanToken, K.LessThanEqualsToken, K.GreaterThanEqualsToken, K.AmpersandAmpersandToken, K.BarBarToken, K.InstanceOfKeyword, K.InKeyword];
        const boolish = (x) => x.kind === K.ParenthesizedExpression ? boolish(x.expression) : x.kind === K.PrefixUnaryExpression ? x.operator === K.ExclamationToken : x.kind === K.BinaryExpression ? BOOL_OPS.includes(x.operatorToken.kind) : (x.kind === K.TrueKeyword || x.kind === K.FalseKeyword);   // up-converter · +x / ?? / אריתמטיקה אינם בוליאניים
        const numish = (x) => x.kind === K.ParenthesizedExpression ? numish(x.expression) : x.kind === K.NumericLiteral || (x.kind === K.BinaryExpression && (!!BIT()[x.operatorToken.kind] || [K.PlusToken, K.MinusToken, K.AsteriskToken, K.SlashToken, K.PercentToken].includes(x.operatorToken.kind)));
        if (CLASSES.size) return boolish(n.left) || boolish(n.right) ? `(${boolCtx(n.left)} || ${boolCtx(n.right)})` : `_or(${l}, () => ${r})`;   /* מחלקות · a || b: 0/''/null שקריים, b מחושב רק בצורך */
        if (!boolish(n.left) && numish(n.left)) return `(_truthy(${l}) ? ${l} : ${r})`;   // מחלקות · seed >>> 0 || 1: ב-JS 0 שקרי ⇒ 1 (?? היה משאיר 0)
        return boolish(n.left) || boolish(n.right) ? `(${l} || ${r})` : `(${l} ?? ${r})`; // בוליאני מול ברירת-מחדל
      }
      if (op === K.QuestionQuestionToken) return `(${l} ?? ${r})`;
      if (op === K.AmpersandAmpersandToken) return `${boolCtx(n.left)} && ${boolCtx(n.right)}`;
      if (op === K.EqualsEqualsEqualsToken) return `${l} == ${r}`;
      if (op === K.ExclamationEqualsEqualsToken) return `${l} != ${r}`;
      return `${l} ${ts.tokenToString(op)} ${r}`;
    }
    case K.ConditionalExpression: return `${boolCtx(n.condition)} ? ${expr(n.whenTrue)} : ${expr(n.whenFalse)}`;
    case K.ArrayLiteralExpression: return `${CLASSES.size ? '<dynamic>' : ''}[${n.elements.map(expr).join(', ')}]`;   // מחלקות · מערך-JS מחזיק כל ערך (Dart היה מסיק List<int>)
    case K.DeleteExpression: { const t = n.expression; if (t.kind === K.PropertyAccessExpression) return `${expr(t.expression)}.remove('${t.name.text}')`; if (t.kind === K.ElementAccessExpression) return `${expr(t.expression)}.remove(${expr(t.argumentExpression)})`; return `/*?DeleteExpression?*/`; }   // up-converter
    case K.ObjectLiteralExpression: return (CLASSES.size ? '_o(' : '') + `<String, dynamic>{${n.properties.map(p => {
      if (p.kind === K.SpreadAssignment) return `...${expr(p.expression)}`;                       // {...a}
      if (p.kind === K.ShorthandPropertyAssignment) return `'${p.name.text}': ${p.name.text}`;   // {a}
      if (!p.name) return `/*?${ts.SyntaxKind[p.kind]}?*/`;
      const key = p.name.kind === K.ComputedPropertyName ? expr(p.name.expression) : p.name.kind === K.StringLiteral || p.name.kind === K.NumericLiteral ? `'${esc(p.name.text)}'` : `'${p.name.text}'`;
      if (p.kind === K.MethodDeclaration) return `${key}: ${expr(Object.assign(ts.factory.createArrowFunction(undefined, undefined, p.parameters, undefined, undefined, p.body), { parent: p }))}`;   // {cancel() {…}}
      return `${key}: ${expr(p.initializer || p.name)}`;
    }).join(', ')}}` + (CLASSES.size ? ')' : '');
    case K.PropertyAccessExpression: {
      const obj = bang(n.expression), name = n.name.text;
      if (n.questionDotToken && CLASSES.size) return `${obj}?.${name}`;   // מחלקות · a?.b (מחוץ למצב-אובייקטים: כמו קודם)
      if (obj === 'Math' && MATH[name]) return MATH[name];          // Math.x → helper/dart:math
      if (name === 'length') return `${obj}.length`;
      if (name === 'size' && CTX && n.expression.kind === K.Identifier && /^(Set|Map)$/.test(CTX.locals.get(n.expression.text) || '')) return `${obj}.length`;
      if (name === 'size' && collOf(n.expression)) return `${obj}.length`;
      if (name === 'size' && n.expression.kind === K.CallExpression && n.expression.expression.kind === K.Identifier && (HINT.ret || {})[n.expression.expression.text]) return `${obj}.length`;   // reach(...).size — פונקציה שמחזירה Set   /* this.stocks.size */   // up-converter · Set/Map.size
      { const mt = isMapParam(n.expression); if (mt) return `${obj}['${name}']`; }   // G20 · פרמטר-Map ⇒ גישת-מפתח (nullable כבר קיבל !)
      return `${obj}.${name}`;
    }
    case K.ElementAccessExpression: { const idx = n.argumentExpression; const rt = CTX && n.expression.kind === K.Identifier ? (CTX.params.get(n.expression.text) || CTX.locals.get(n.expression.text) || '') : '';
      const listy = /^List/.test(rt); const intIdx = listy && idx.kind !== K.NumericLiteral && idx.kind !== K.StringLiteral && !(idx.kind === K.Identifier && /^[ijk]$/.test(idx.text)) && (idx.kind === K.BinaryExpression || idx.kind === K.CallExpression || idx.kind === K.ParenthesizedExpression || idx.kind === K.Identifier);
      return `${bang(n.expression)}[${intIdx ? `(${expr(idx)}).toInt()` : expr(idx)}]`; }   // up-converter · אינדקס-num על List ⇒ toInt (JS: כל מספר num)
    case K.CallExpression: {
      const callee = n.expression;
      if (n.questionDotToken && CLASSES.size) return `${expr(callee)}?.call(${n.arguments.map(expr).join(', ')})`;   /* מחלקות · f?.(x) — חסר ⇒ null */
      if (callee.kind === K.PropertyAccessExpression) {
        const obj = bang(callee.expression), m = callee.name.text;
        const fcoll = collOf(callee.expression);
        if (!fcoll && classOf(callee.expression))
          return `${obj}${callee.questionDotToken ? '?.' : '.'}${m}(${n.arguments.map(expr).join(', ')})`;   // מחלקות · מתודה של מחלקה במודול (heap.push ≠ List.add)
        if (callee.questionDotToken && CLASSES.size) return `${obj}?.${m}(${n.arguments.map(expr).join(', ')})`;
        const argE = (a) => a.kind === K.Identifier && a.text === 'Boolean' ? '_truthy' : a.kind === K.Identifier && a.text === 'Number' ? '_toNum' : expr(a);   // up-converter · Boolean/Number כ-callback
        const A = () => n.arguments.map(argE).join(', ');
        const gl = (x) => x.kind === K.Identifier && !(CTX && (CTX.locals.has(x.text) || CTX.params.has(x.text))) && /^(Set|Map)$/.test(GLOBALS.get(x.text) || '') ? GLOBALS.get(x.text) : null;   // מחלקות · Map/Set ברמת-המודול
        const loc = fcoll || gl(callee.expression) || ((CTX && callee.expression.kind === K.Identifier) ? (CTX.locals.get(callee.expression.text) || (/^Map</.test(CTX.params.get(callee.expression.text) || '') ? 'Map' : null)) : null);   // Set/Map מקומי או פרמטר-Map
        if (loc === 'Set') { if (m === 'has') return `${obj}.contains(${A()})`; if (m === 'delete') return `${obj}.remove(${A()})`; if (m === 'add') return `${obj}.add(${A()})`; }
        if (loc === 'Map' && /^(keys|values|entries)$/.test(m) && !n.arguments.length) return m === 'entries' ? `${obj}.entries.map((e) => <dynamic>[e.key, e.value]).toList()` : `${obj}.${m}.toList()`;   // מחלקות · Map.keys() ⇒ .keys
        if (loc === 'Set' && m === 'values' && !n.arguments.length) return `${obj}.toList()`;
        if (loc === 'Map') { if (m === 'get') return `${obj}[${A()}]`; if (m === 'has') return `${obj}.containsKey(${A()})`; if (m === 'delete') return `${obj}.remove(${A()})`; if (m === 'set' && n.arguments.length === 2) return `(${obj}[${expr(n.arguments[0])}] = ${expr(n.arguments[1])})`; }
        { const ar = (a) => a && (a.kind === K.ArrowFunction || a.kind === K.FunctionExpression) ? a.parameters.length : -1; const a0 = n.arguments[0];   // מחלקות · JS מתעלם מארגומנטים עודפים/חסרים בקולבק; Dart לא
          if (['map', 'filter', 'some', 'every', 'forEach', 'find', 'findIndex'].includes(m) && ar(a0) >= 2) return `_${m}I(${obj}, ${expr(a0)})`;   // (x, i) ⇒ עוזר-אינדקס
          if (m === 'reduce' && n.arguments.length === 2 && ar(a0) >= 3) return `_reduceI(${obj}, ${expr(n.arguments[1])}, ${expr(a0)})`;
          if (['map', 'filter', 'some', 'every', 'forEach', 'find', 'findIndex'].includes(m) && ar(a0) === 0) { const f = expr(a0).replace(/^\(\)/, '(_)'); const dm = m === 'filter' ? 'where' : Object.hasOwn(STD, m) ? STD[m] : m; return m === 'map' || m === 'filter' ? `${obj}.${dm}${m === 'map' && CLASSES.size ? '<dynamic>' : ''}(${f}).toList()` : `${obj}.${dm}(${f})`; } }
        if (m === 'test' && n.arguments.length === 1) return `${obj}.hasMatch(${A()})`;   // RegExp.test
        if (m === 'exec' && n.arguments.length === 1) return `${obj}.firstMatch(${A()})`;   // RegExp.exec (קבוצות: API שונה)
        if (m === 'filter') return `${obj}.where(${A()}).toList()`;
        if (m === 'push' && n.arguments.length === 1 && n.arguments[0].kind === K.SpreadElement) return `${obj}.addAll(${expr(n.arguments[0].expression)})`;   // push(...xs) ⇒ addAll
        if (m === 'push' && n.arguments.length > 1) return `${obj}.addAll([${A()}])`;
        if (obj === 'JSON' && m === 'stringify') return `jsonEncode(${expr(n.arguments[0])})`;
        if (obj === 'JSON' && m === 'parse') return `jsonDecode(${expr(n.arguments[0])})`;   // where ⇒ Iterable; JS filter ⇒ מערך
        if (obj === 'Date' && m === 'parse') return `DateTime.parse(${A()}).millisecondsSinceEpoch`;
        if (obj === 'Date' && m === 'now') return `DateTime.now().millisecondsSinceEpoch`;
        if (obj === 'Number' && m === 'isNaN') return `((${A()}) is num && (${A()}).isNaN)`;
        if (obj === 'Number' && m === 'isInteger') return `((${A()}) is int)`;
        if (m === 'setDate' && n.arguments.length === 1 && n.arguments[0].kind === K.BinaryExpression && n.arguments[0].operatorToken.kind === K.PlusToken && /getDate|\.day\b/.test(expr(n.arguments[0].left))) return `${obj} = ${obj}.add(Duration(days: ${expr(n.arguments[0].right)}))`;   // up-converter · d.setDate(d.getDate()+k)
        if (obj === 'Object' && m === 'entries') return `(${expr(n.arguments[0])} as Map).entries.map((e) => [e.key, e.value]).toList()`;
        if (obj === 'Object' && m === 'values') return `(${expr(n.arguments[0])} as Map).values.toList()`;
        if (obj === 'Math' && (m === 'max' || m === 'min') && n.arguments.length === 1 && n.arguments[0].kind === K.SpreadElement) return `_m${m}L(${expr(n.arguments[0].expression)})`;   // מחלקות · Math.max(...xs) (ריק ⇒ ∓Infinity כמו JS)
        if (obj === 'Math' && (m === 'max' || m === 'min') && CLASSES.size) return `_m${m}(${n.arguments.map(expr).join(', ')})`;   // מחלקות · בתוך מחלקה עם get max ⇒ max() היה נפתר לחבר
        if (obj === 'Array' && m === 'from') { const a0 = n.arguments[0], f = n.arguments[1];   // מחלקות · Array.from({length: n}, fn) / Array.from(iter[, fn])
          const lenP = a0 && a0.kind === K.ObjectLiteralExpression && a0.properties.find((p) => p.name && p.name.text === 'length');
          const call = (x) => { const ar = f && (f.kind === K.ArrowFunction || f.kind === K.FunctionExpression) ? f.parameters.length : 2; return `(${expr(f)})(${[x, '__i'].slice(0, ar).join(', ')})`; };
          if (lenP) return `List<dynamic>.generate(_toNum(${expr(lenP.initializer)}).toInt(), (__i) => ${f ? call('null') : 'null'})`;
          return f ? `_mapI(List<dynamic>.from(${expr(a0)}), (__x, __i) => ${call('__x')})` : `List<dynamic>.from(${expr(a0)})`; }
        if (obj === 'Math') return `${Object.hasOwn(MATH, m) ? MATH[m] : m}(${n.arguments.map(expr).join(', ')})`;
        if (obj === 'Number' && m === 'isFinite') return `_isFinite(${n.arguments.map(expr).join(', ')})`;
        if (obj === 'Array' && m === 'isArray') return `(${expr(n.arguments[0])} is List)`;
        if (obj === 'Object' && m === 'keys') return `(${expr(n.arguments[0])} as Map).keys.toList()`;
        const DATE = { getTime: '.millisecondsSinceEpoch', getFullYear: '.year', getDate: '.day', getHours: '.hour', getMinutes: '.minute', getDay: '.weekday % 7' };
        if (m === 'getMonth') return `(${obj}.month - 1)`;        // JS 0-אינדקס → Dart 1-אינדקס (חוק-4!)
        if (Object.hasOwn(DATE, m)) return `${obj}${DATE[m]}`;
        if (m === 'toISOString') return `${obj}.toIso8601String()`;
        if (m === 'reduce' && n.arguments.length === 2)
          return `${obj}.fold${CLASSES.size ? '<dynamic>' : ''}(${expr(n.arguments[1])}, ${expr(n.arguments[0])})`;
        if (m === 'map') return `${obj}.map${CLASSES.size ? '<dynamic>' : ''}(${n.arguments.map(expr).join(', ')}).toList()`;
        if (m === 'toLocaleString') return `_toLocaleString(${obj}${n.arguments.length ? ', ' + n.arguments.map(expr).join(', ') : ''})`; // שקע — פורמט-מקומי
        if (m === 'charCodeAt') return `${obj}.codeUnitAt(${n.arguments.map(expr).join(', ')})`;
        if (m === 'substring' || m === 'substr') return `${obj}.substring(${n.arguments.map(expr).join(', ')})`;
        if (m === 'indexOf') return `${obj}.indexOf(${n.arguments.map(expr).join(', ')})`;
        if (m === 'toFixed') return `${obj}.toStringAsFixed(${n.arguments.map(expr).join(', ')})`;
        const intArg = (a) => a.kind === K.NumericLiteral ? expr(a) : `(${expr(a)}).toInt()`;   // up-converter · אינדקסים ל-substring/sublist חייבים int
        if (m === 'slice' && n.arguments.length && isStrParam(callee.expression)) return `${obj}.substring(${n.arguments.map(intArg).join(', ')})`;   // up-crosslang · מחרוזת מוקלדת ⇒ substring
        if (m === 'slice' && !n.arguments.length) return `${obj}.toList()`;
        if (m === 'slice' && n.arguments.length) return `${obj}.sublist(${n.arguments.map(intArg).join(', ')})`;
        if (m === 'substring' || m === 'substr') return `${obj}.substring(${n.arguments.map(intArg).join(', ')})`;   // JS slice() = העתק; Dart sublist דורש ארגומנט (נחשף ע"י ההקלדה)
        if (m === 'sort') return `_sort(${[obj, ...n.arguments.map(expr)].join(', ')})`;   /* JS: משווה מחזיר מספר כלשהו (Dart דורש int) · בלי משווה ⇒ סדר-מחרוזות */
        if (m === 'flat') return `${obj}.expand((x) => x is List ? x : [x]).toList()`;
        if (m === 'flatMap') return `${obj}.expand(${n.arguments.map(expr).join(', ')}).toList()`;
        const dm = Object.hasOwn(STD, m) ? STD[m] : m;   // up-converter · לא STD[m]||m: toLocaleString/toString/constructor הם חברי Object.prototype ⇒ "[native code]" 
        if (dm.startsWith('_')) return `${dm}(${[obj, ...n.arguments.map(argE)].join(', ')})`;   // up-converter · עוזר (_padStart/_repeat/_concat) הוא פונקציה, לא מתודה
        return `${obj}.${dm}(${n.arguments.map(argE).join(', ')})`;
      }
      if (callee.kind === K.Identifier) {
        if (callee.text === 'parseInt') return `int.tryParse(${expr(n.arguments[0])}.toString()) ?? 0`;
        if (callee.text === 'parseFloat') return `double.tryParse(${expr(n.arguments[0])}.toString()) ?? 0`;
        if (callee.text === 'String') return `${expr(n.arguments[0])}.toString()`;
        if (callee.text === 'Number') return `_toNum(${expr(n.arguments[0])})`;
        if (callee.text === 'Boolean') return `_truthy(${expr(n.arguments[0])})`;
        if (callee.text === 'isNaN') return `(${expr(n.arguments[0])}).isNaN`;
        if (callee.text === 'encodeURIComponent') return `Uri.encodeComponent(${expr(n.arguments[0])})`;
        if (callee.text === 'decodeURIComponent') return `Uri.decodeComponent(${expr(n.arguments[0])})`;
      }
      return `${expr(callee)}(${n.arguments.map(expr).join(', ')})`;
    }
    case K.NewExpression: {
      const c = expr(n.expression), args = (n.arguments||[]).map(expr).join(', ');
      if (c === 'Date') { const as = (n.arguments || []).map(expr); return as.length >= 2 ? `DateTime(${as[0]}, ${as[1]} + 1${as.slice(2).map((x) => ', ' + x).join('')})` : args ? `DateTime.parse(${args})` : 'DateTime.now()'; }   // up-converter · new Date(y, m0, d) ⇒ חודש 1-אינדקס
      if (c === 'RegExp') return `RegExp(${args})`;
      if (/^(Error|TypeError|RangeError)$/.test(c)) return `Exception(${args})`;   // Dart Error() בלי הודעה
      if (c === 'Set') return `<dynamic>{${args ? '...'+args : ''}}`;
      if (c === 'Map') return '<dynamic, dynamic>{}';
      return `${c}(${args})`;
    }
    case K.RegularExpressionLiteral: {
      const mm = n.text.match(/^\/([^]*)\/([gimsuy]*)$/);
      return `RegExp(r'${mm[1]}')`;
    }
    case K.TypeOfExpression: return `_typeof(${expr(n.expression)})`;
    case K.VoidExpression: return 'null';
    case K.SpreadElement: return `...${expr(n.expression)}`;
    case K.PostfixUnaryExpression: return expr(n.operand) + ts.tokenToString(n.operator);
    case K.ArrowFunction: case K.FunctionExpression: {
      const ps = n.parameters.map(p => p.name.text).join(', ');
      return n.body.kind === K.Block ? `(${ps}) ${gen(n.body)}` : `(${ps}) => ${expr(n.body)}`;
    }
    default: return `/*?${ts.SyntaxKind[n.kind]}?*/`;
  }
}
// ── מחלקות (class) ⇒ מחלקת-Dart: שדות · בנאי (super ⇒ רשימת-אתחול) · מתודות · get/set · static. new X() ⇒ X() (קיים). ──
// מחלקות · סריקה-מוקדמת של כל המחלקות: שדה ⇒ מחלקה (new X / רמז-TS) · שדה ⇒ Map/Set (new Map() / רמז-TS). מוקדם ⇒ גם שימוש לפני ההגדרה.
function scanFields(n) { const K = ts.SyntaxKind; const name = n.name.text;
  const fc = FIELD_CLASS[name] = { ...(HINT.fields[name] || {}) }; const coll = FIELD_COLL[name] = { ...((HINT.coll || {})[name] || {}) };
  const kindOf = (e) => e && e.kind === K.NewExpression && e.expression.kind === K.Identifier ? (CLASSES.has(e.expression.text) ? ['c', e.expression.text] : /^(Map|Set)$/.test(e.expression.text) ? ['m', e.expression.text] : null) : null;
  const put = (f, e) => { const k = kindOf(e); if (k) (k[0] === 'c' ? fc : coll)[f] = k[1]; };
  const walkF = (x) => { if (x.kind === K.BinaryExpression && x.operatorToken.kind === K.EqualsToken && x.left.kind === K.PropertyAccessExpression && x.left.expression.kind === K.ThisKeyword) put(x.left.name.text, x.right); ts.forEachChild(x, walkF); };
  for (const m of n.members) { if (m.kind === K.PropertyDeclaration && m.name.kind === K.Identifier) put(m.name.text, m.initializer); if (m.kind === K.Constructor && m.body) walkF(m.body); } }
const collOf = (e) => { const K = ts.SyntaxKind; if (!e || e.kind !== K.PropertyAccessExpression) return null; const c = classOf(e.expression); return c ? (FIELD_COLL[c] || {})[e.name.text] || null : null; };   /* m.nodes.has(x) כש-m: Model */
function classDecl(n) { const K = ts.SyntaxKind; const name = n.name ? n.name.text : '_Anon'; const prevCls = CUR_CLASS; CUR_CLASS = name;

  const ext = (n.heritageClauses || []).find((h) => h.token === K.ExtendsKeyword); const head = `class ${name}${ext ? ' extends ' + expr(ext.types[0].expression) : ''}`;
  const isStatic = (m) => (ts.getModifiers ? ts.getModifiers(m) || [] : m.modifiers || []).some((x) => x.kind === K.StaticKeyword);
  const mname = (m) => m.name.kind === K.PrivateIdentifier ? '_' + m.name.text.slice(1) : m.name.kind === K.StringLiteral ? m.name.text : m.name.text;
  const constLit = (e) => !e || [K.NumericLiteral, K.StringLiteral, K.TrueKeyword, K.FalseKeyword, K.NullKeyword, K.NoSubstitutionTemplateLiteral].includes(e.kind) || (e.kind === K.PrefixUnaryExpression && e.operand.kind === K.NumericLiteral);
  const out = [];
  for (const m of n.members) { const st = isStatic(m) ? 'static ' : '';
    if (m.kind === K.PropertyDeclaration) { const nm = mname(m);   // אתחול לא-קבוע (new/this/[]) ⇒ late: Dart אוסר this בשדה לא-late
      out.push(m.initializer ? `${st}${constLit(m.initializer) || st ? '' : 'late '}dynamic ${nm} = ${expr(m.initializer)};` : `${st}dynamic ${nm};`); continue; }
    if (m.kind === K.Constructor) { const { ps, pre } = fnHead(name, m.parameters, m.body); let stmts = m.body ? [...m.body.statements] : []; let init = '';
      const first = stmts[0]; if (first && first.kind === K.ExpressionStatement && first.expression.kind === K.CallExpression && first.expression.expression.kind === K.SuperKeyword) { init = ` : super(${first.expression.arguments.map(expr).join(', ')})`; stmts = stmts.slice(1); }
      const body = withPre(`{\n${stmts.map((s) => '  ' + gen(s)).join('\n')}\n}`, pre); CTX = CTX_STACK.pop();
      out.push(`${name}(${ps})${init} ${body}`); continue; }
    if (m.kind === K.MethodDeclaration || m.kind === K.GetAccessor || m.kind === K.SetAccessor) { const nm = mname(m); const h = fnHead(nm, m.parameters, m.body); const { ret, pre } = h; let ps = h.ps;
      const pad = m.kind === K.MethodDeclaration && !m.parameters.some((p) => p.dotDotDotToken) ? (ARITY[nm] || 0) - m.parameters.length : 0;
      if (pad > 0) { const extra = Array.from({ length: pad }, (_, k) => `dynamic __x${k}`); ps = /\]$/.test(ps) ? ps.replace(/\]$/, ', ' + extra.join(', ') + ']') : [ps, `[${extra.join(', ')}]`].filter(Boolean).join(', '); }
      const body = m.body ? withPre(gen(m.body), pre) : ';'; CTX = CTX_STACK.pop();
      out.push(m.kind === K.GetAccessor ? `${st}${ret} get ${nm} ${body}` : m.kind === K.SetAccessor ? `${st}set ${nm}(${ps}) ${body}` : `${st}${ret} ${nm}(${ps}) ${body}`); continue; }
    if (m.kind === K.SemicolonClassElement) continue;
    out.push(`/*?${K[m.kind]}?*/`); }
  CUR_CLASS = prevCls; return `${head} {\n${out.map((x) => '  ' + x.replace(/\n/g, '\n  ')).join('\n')}\n}`; }
// JS: אופרטורי-סיביות ממירים ל-int32 (>>> ל-uint32). Dart int הוא 64 ⇒ עוזרים _i32/_u32 שומרים את התוצאה זהה-ביט.
const BIT = () => { const K = ts.SyntaxKind; return { [K.CaretToken]: '^', [K.BarToken]: '|', [K.AmpersandToken]: '&', [K.LessThanLessThanToken]: '<<', [K.GreaterThanGreaterThanToken]: '>>', [K.GreaterThanGreaterThanGreaterThanToken]: '>>>',
  [K.CaretEqualsToken]: '^=', [K.BarEqualsToken]: '|=', [K.AmpersandEqualsToken]: '&=', [K.LessThanLessThanEqualsToken]: '<<=', [K.GreaterThanGreaterThanEqualsToken]: '>>=', [K.GreaterThanGreaterThanGreaterThanEqualsToken]: '>>>=' }; };
function bitwise(n) { const op = BIT()[n.operatorToken.kind]; if (!op) return null;
  const core = (o, l, r) => o === '>>>' ? `(_u32(${l}) >> (_i32(${r}) & 31))` : o === '>>' ? `(_i32(${l}) >> (_i32(${r}) & 31))` : o === '<<' ? `_i32(_i32(${l}) << (_i32(${r}) & 31))` : `_i32(_i32(${l}) ${o} _i32(${r}))`;
  const l = expr(n.left), r = expr(n.right);
  if (op.endsWith('=') ) return `${l} = ${core(op.slice(0, -1), l, `(${r})`)}`;   // t ^= x ⇒ t = _i32(_i32(t) ^ _i32(x))
  return core(op, l, r); }
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');   // G20 · תווי-בקרה בליטרל (JS '\n' הגיע כשורה-חדשה גולמית ⇒ unterminated_string_literal)

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
// ראיית-בדיקות (G20): type-evidence.json ⇒ {fn: {params:{name:type}, ret}} מוכלל — הכללה זהה ל-tighten-types (int⇒num · ערכי-Map⇒dynamic · פונקציות לא)
export function typesFromEvidence(evPath, src) {
  let ev; try { ev = JSON.parse(fs.readFileSync(evPath, 'utf8')); } catch { return {}; }
  const gen = (sh) => { if (!sh || sh === '?' || sh === 'null' || sh === 'dynamic' || /Function/.test(sh) || /<\?/.test(sh)) return null; const nul = sh.endsWith('?'); const c = nul ? sh.slice(0, -1) : sh; let g; if (c === 'int' || c === 'double') g = 'num'; else if (['String', 'bool', 'num', 'DateTime'].includes(c)) g = c; else if (c.startsWith('Map<String, ')) g = 'Map<String, dynamic>'; else if (c.startsWith('List<')) { const i = c.slice(5, -1).replace(/\?$/, ''); g = /^(String|bool)$/.test(i) ? `List<${i}>` : /^(int|double|num)$/.test(i) ? 'List<num>' : i.startsWith('Map<String') ? 'List<Map<String, dynamic>>' : 'List<dynamic>'; } else return null; return nul ? g + '?' : g; };
  const out = {};
  const sf = ts.createSourceFile('a.js', src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
  for (const st of sf.statements) {
    let name = null, params = null;
    if (st.kind === ts.SyntaxKind.FunctionDeclaration) { name = st.name.text; params = st.parameters; }
    else if (st.kind === ts.SyntaxKind.VariableStatement) { const d = st.declarationList.declarations[0]; if (d.initializer && (d.initializer.kind === ts.SyntaxKind.ArrowFunction || d.initializer.kind === ts.SyntaxKind.FunctionExpression)) { name = d.name.text; params = d.initializer.parameters; } }
    if (!name) continue;
    const e = Object.values(ev).find((x) => x && x.fn === name); if (!e || !e.calls) continue;
    const pm = {}; params.forEach((p, i) => { const t = gen(e.params[i]); if (t) pm[p.name.text] = t; });
    out[name] = { params: pm, ret: gen(e.ret) };
  }
  return out;
}
// G20 · פליטה-מאומתת: מקלידים רק מה שהאנלייזר מקבל. ניסיון מלא ⇒ כשל ⇒ מורידים החזרה ⇒ מורידים פרמטר-פרמטר (חמדני) ⇒ במקרה הגרוע dynamic (≡ הבסיס).
//   כל ניסיון = dart analyze על קובץ-זמני עם שקעי-השפה (H של parity-ast). עלות: שניות לאטום — המרה היא חד-פעמית.
export function emitVerified(js, { types = {}, analyze, helpers = '' } = {}) {
  // analyze(code) ⇒ null (נקי) | טקסט-שגיאה. מסכה: override מפורש ('dynamic') לאיברים שנפסלו; בחירה מונחית-שגיאה (שם-הפרמטר בטקסט/בשורה), אחרת הבא בתור.
  const sf = ts.createSourceFile('a.js', js, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
  const fns = [];
  for (const st of sf.statements) { if (st.kind === ts.SyntaxKind.FunctionDeclaration) fns.push({ name: st.name.text, params: st.parameters.map((p) => p.name.text) }); else if (st.kind === ts.SyntaxKind.VariableStatement) { const d = st.declarationList.declarations[0]; if (d.initializer && (d.initializer.kind === ts.SyntaxKind.ArrowFunction || d.initializer.kind === ts.SyntaxKind.FunctionExpression)) fns.push({ name: d.name.text, params: d.initializer.parameters.map((p) => p.name.text) }); } }
  const over = {}; for (const f of fns) over[f.name] = { params: {}, ret: null };
  const merged = () => { const t = {}; for (const f of fns) { const ev = types[f.name] || {}; t[f.name] = { params: { ...(ev.params || {}), ...over[f.name].params }, ret: over[f.name].ret || ev.ret || null }; } return t; };
  const attempt = () => emit(js, { types: merged(), force: true });
  const base = emit(js, { infer: false }); if (analyze(helpers + '\n' + base + '\nvoid main(){}')) return { code: base, dropped: ['base-fails'] };   // הבסיס (dynamic) לא מתקמפל ⇒ לא בעיית-טיפוסים; לא מורידים כלום
  const dropped = []; const remaining = fns.flatMap((f) => [{ f: f.name, k: 'ret' }, ...f.params.map((p) => ({ f: f.name, k: p }))]);
  for (let i = 0; i < 40; i++) {
    const code = attempt(); const err = analyze(helpers + '\n' + code + '\nvoid main(){}');
    if (!err) return { code, dropped };
    if (!remaining.length) break;
    const line = (err.match(/:(\d+):\d+/) || [])[1]; const srcLine = line ? (helpers + '\n' + code).split('\n')[+line - 1] || '' : '';
    let pick = remaining.find((r) => r.k !== 'ret' && (new RegExp(`\\b${r.k}\\b`).test(err) || new RegExp(`\\b${r.k}\\b`).test(srcLine)));
    if (!pick && /return|can't be returned|return_of_invalid_type/.test(err)) pick = remaining.find((r) => r.k === 'ret');
    if (!pick) pick = remaining[0];
    remaining.splice(remaining.indexOf(pick), 1); dropped.push(`${pick.f}:${pick.k}`);
    if (pick.k === 'ret') over[pick.f].ret = 'dynamic'; else over[pick.f].params[pick.k] = 'dynamic';
  }
  return { code: base, dropped: [...dropped, 'all'] };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const code = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(l => !/^\s*(\/\*|\*|\/\/)/.test(l)).join('\n');
  const ti = process.argv.indexOf('--types'); const types = ti > -1 ? typesFromEvidence(process.argv[ti + 1], code) : {};
  console.log(emit(code, { types }));
}
