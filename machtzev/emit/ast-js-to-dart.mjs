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
  replace: 'replaceFirst', replaceAll: 'replaceAll', concat: '_concat', reverse: 'reversed',
};
const MATH = { round: '_round', floor: '_floor', ceil: '_ceil', abs: '_abs', min: 'min', max: 'max', pow: 'pow', sqrt: 'sqrt', trunc: '_trunc' };

// ── G20 · הידוק-טיפוסים בתוך המנוע (הכרעה-25: החוזה של צעד-3 חד) ──
//   שני מקורות, אפס מילון-דומיין: (א) הסקה סטטית מצורת-ה-JS — ברירת-מחדל ליטרלית, שימוש בגוף (מתודות-מחרוזת/רשימה, גישת-שדה ⇒ Map,
//   אריתמטיקה ⇒ num, for-of ⇒ List, קריאה ⇒ פונקציה=נשאר dynamic), בדיקות-null ⇒ T? · (ב) ראיית-בדיקות (type-evidence.json, מוכללת) — גוברת.
//   סתירה ⇒ dynamic. פרמטר-Map ⇒ גישת-שדה נפלטת כ-`m['k']` (לא `m.k`). ההחזרה מהביטויים המוחזרים.
let TYPES = {};   // {fn: {params: {name: type}, ret}} לפונקציה הנפלטת כעת
let CTX = null;   // {params: Map name⇒type} בזמן פליטת-גוף
const STR_M = new Set(['trim', 'toLowerCase', 'toUpperCase', 'startsWith', 'endsWith', 'split', 'replace', 'replaceAll', 'padStart', 'padEnd', 'repeat', 'charCodeAt', 'substring', 'substr', 'toFixed_', 'localeCompare', 'trimStart', 'trimEnd', 'charAt', 'normalize']);
const LIST_M = new Set(['map', 'filter', 'some', 'every', 'forEach', 'reduce', 'find', 'findIndex', 'flat', 'flatMap', 'sort', 'push', 'join', 'slice_']);
const NUM_M = new Set(['toFixed']);
const litType = (e) => { const K = ts.SyntaxKind; if (!e) return null; switch (e.kind) { case K.StringLiteral: case K.NoSubstitutionTemplateLiteral: case K.TemplateExpression: return 'String'; case K.NumericLiteral: return 'num'; case K.TrueKeyword: case K.FalseKeyword: return 'bool'; case K.ArrayLiteralExpression: return 'List<dynamic>'; case K.ObjectLiteralExpression: return 'Map<String, dynamic>'; case K.NullKeyword: return 'null'; case K.PrefixUnaryExpression: return e.operator === K.MinusToken ? 'num' : e.operator === K.ExclamationToken ? 'bool' : null; default: return null; } };
const join = (a, b) => (!a ? b : !b ? a : a === b ? a : 'dynamic');
export function inferFn(params, body) {
  const K = ts.SyntaxKind; const names = params.map((p) => p.name.text); const use = {}; const nul = new Set(); const fn = new Set();
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
      case K.PrefixUnaryExpression: { if (n.operator === K.ExclamationToken) { const o = id(n.operand); if (o) nul.add(o); } break; }
      case K.IfStatement: case K.ConditionalExpression: { const o = id(n.kind === K.IfStatement ? n.expression : n.condition); if (o) nul.add(o); break; }
    }
    ts.forEachChild(n, walk);
  };
  walk(body);
  const out = {};
  for (const p of params) { const nm = p.name.text; let t = use[nm] || null; const d = litType(p.initializer); if (d && d !== 'null') t = join(t, d === 'num' && t === 'num' ? 'num' : d); if (fn.has(nm)) t = null; if (t && t !== 'dynamic' && nul.has(nm) && !p.initializer) t += '?'; if (t === 'dynamic') t = null; out[nm] = t; }
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
  const out = [];
  for (const st of sf.statements) out.push(gen(st));
  return out.filter(Boolean).join('\n');
}
const CTX_STACK = [];   // פונקציה מקוננת (חץ בתוך גוף) — שומרים/משחזרים את הקשר-הטיפוסים של החיצונית
function fnHead(name, params, body) {
  const inf = INFER ? inferFn(params, body) : { params: {}, ret: null }; const ev = TYPES[name] || {};
  CTX_STACK.push(CTX); CTX = { params: new Map() };
  for (const p of params) { const nm = p.name.text; const o = ev.params && ev.params[nm]; const t = (FORCE && o) ? (o === 'dynamic' ? null : o) : (o || inf.params[nm] || null); CTX.params.set(nm, t); }
  const ret = (FORCE && ev.ret) ? ev.ret : (ev.ret || inf.ret || 'dynamic');
  const ps = params.map(param).join(', ');
  return { ret, ps };
}
function gen(n) {
  const K = ts.SyntaxKind;
  switch (n.kind) {
    case K.FunctionDeclaration: {
      const name = n.name.text; const { ret, ps } = fnHead(name, n.parameters, n.body);
      const body = gen(n.body); CTX = CTX_STACK.pop();
      return `${ret} ${name}(${ps}) ${body}`;
    }
    case K.VariableStatement: {
      const d = n.declarationList.declarations[0];
      const init = d.initializer;
      if (init && (init.kind === K.ArrowFunction || init.kind === K.FunctionExpression)) {
        const { ret, ps } = fnHead(d.name.text, init.parameters, init.body);
        const body = init.body.kind === K.Block ? gen(init.body) : `=> ${expr(init.body)};`; CTX = CTX_STACK.pop();
        return `${ret} ${d.name.text}(${ps}) ${body}`;
      }
      return `var ${d.name.text} = ${expr(init)};`;
    }
    case K.Block: return `{\n${n.statements.map(s => '  ' + gen(s)).join('\n')}\n}`;
    case K.ReturnStatement: return `return ${n.expression ? expr(n.expression) : ''};`;
    case K.IfStatement: return `if (${boolCtx(n.expression)}) ${gen(n.thenStatement)}${n.elseStatement ? ' else ' + gen(n.elseStatement) : ''}`;
    case K.ForOfStatement: { const v = n.initializer.declarations[0].name.text; return `for (final ${v} in ${expr(n.expression)}) ${gen(n.statement)}`; }
    case K.ExpressionStatement: return expr(n.expression) + ';';
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
function param(p) {
  const name = p.name.text; const t = (CTX && CTX.params.get(name)) || 'dynamic';
  if (p.initializer) { const init = expr(p.initializer); return `[${t === 'dynamic' || init === 'null' ? (t === 'dynamic' ? 'dynamic' : t.replace(/\?$/, '') + '?') : t} ${name} = ${init}]`; }
  return `${t} ${name}`;
}
// G20 · הקשר-בוליאני על פרמטר מוקלד לא-bool (String/num/List/Map) ⇒ `_truthy(x)` (סמנטיקת-JS: '' ו-0 שקריים) — אחרת non_bool_condition
const boolCtx = (e) => { const K = ts.SyntaxKind; if (!CTX || !e) return expr(e); if (e.kind === K.Identifier) { const t = CTX.params.get(e.text); if (t && t !== 'bool' && t !== 'bool?') return `_truthy(${e.text})`; } if (e.kind === K.ParenthesizedExpression) return `(${boolCtx(e.expression)})`; return expr(e); };
const nullableParam = (e) => { const K = ts.SyntaxKind; if (!CTX || !e || e.kind !== K.Identifier) return false; const t = CTX.params.get(e.text); return !!(t && t.endsWith('?')); };
const bang = (e) => (nullableParam(e) ? `${e.text}!` : expr(e));   // שימוש-ישיר בפרמטר-nullable (גישה/קריאה/אריתמטיקה) ⇒ `p!` — JS היה זורק על null באותה נקודה
const isMapParam = (e) => { const K = ts.SyntaxKind; if (!CTX || !e || e.kind !== K.Identifier) return null; const t = CTX.params.get(e.text); return t && /^Map</.test(t) ? t : null; };
function expr(n) {
  const K = ts.SyntaxKind;
  if (!n) return '';
  switch (n.kind) {
    case K.Identifier: return n.text;
    case K.NumericLiteral: return n.text;
    case K.StringLiteral: return `'${esc(n.text)}'`;
    case K.TrueKeyword: return 'true'; case K.FalseKeyword: return 'false';
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
      return ts.tokenToString(n.operator) + expr(n.operand);
    case K.BinaryExpression: {
      const op = n.operatorToken.kind;
      // typeof x === 'string'|'number'|'boolean'|'object'|'function'|'undefined'
      const TM = { string: 'String', number: 'num', boolean: 'bool', object: 'Map', function: 'Function', undefined: 'Null' };
      const tof = (side, other, neg) => side.kind === K.TypeOfExpression && other.kind === K.StringLiteral
        ? `${neg ? '!(' : ''}${expr(side.expression)} is ${TM[other.text] || 'dynamic'}${neg ? ')' : ''}` : null;
      if ([K.EqualsEqualsEqualsToken, K.EqualsEqualsToken].includes(op)) { const t = tof(n.left, n.right) || tof(n.right, n.left); if (t) return t; }
      if ([K.ExclamationEqualsEqualsToken, K.ExclamationEqualsToken].includes(op)) { const t = tof(n.left, n.right, true) || tof(n.right, n.left, true); if (t) return t; }
      const arith = [K.MinusToken, K.AsteriskToken, K.SlashToken, K.PercentToken, K.LessThanToken, K.GreaterThanToken, K.LessThanEqualsToken, K.GreaterThanEqualsToken].includes(op);
      const l = arith ? bang(n.left) : expr(n.left), r = arith ? bang(n.right) : expr(n.right);
      if (op === K.BarBarToken) {
        const boolish = (x) => [K.BinaryExpression, K.PrefixUnaryExpression, K.ParenthesizedExpression].includes(x.kind)
          && !(x.kind === K.BinaryExpression && [K.PlusToken, K.MinusToken, K.AsteriskToken].includes(x.operatorToken?.kind));
        return boolish(n.left) || boolish(n.right) ? `(${l} || ${r})` : `(${l} ?? ${r})`; // בוליאני מול ברירת-מחדל
      }
      if (op === K.QuestionQuestionToken) return `(${l} ?? ${r})`;
      if (op === K.AmpersandAmpersandToken) return `${boolCtx(n.left)} && ${boolCtx(n.right)}`;
      if (op === K.EqualsEqualsEqualsToken) return `${l} == ${r}`;
      if (op === K.ExclamationEqualsEqualsToken) return `${l} != ${r}`;
      return `${l} ${ts.tokenToString(op)} ${r}`;
    }
    case K.ConditionalExpression: return `${boolCtx(n.condition)} ? ${expr(n.whenTrue)} : ${expr(n.whenFalse)}`;
    case K.ArrayLiteralExpression: return `[${n.elements.map(expr).join(', ')}]`;
    case K.ObjectLiteralExpression: return `{${n.properties.map(p => {
      if (p.kind === K.SpreadAssignment) return `...${expr(p.expression)}`;                       // {...a}
      if (p.kind === K.ShorthandPropertyAssignment) return `'${p.name.text}': ${p.name.text}`;   // {a}
      if (!p.name) return `/*?${ts.SyntaxKind[p.kind]}?*/`;
      const key = p.name.kind === K.ComputedPropertyName ? expr(p.name.expression) : p.name.kind === K.StringLiteral || p.name.kind === K.NumericLiteral ? `'${esc(p.name.text)}'` : `'${p.name.text}'`;
      return `${key}: ${expr(p.initializer || p.name)}`;
    }).join(', ')}}`;
    case K.PropertyAccessExpression: {
      const obj = bang(n.expression), name = n.name.text;
      if (obj === 'Math' && MATH[name]) return MATH[name];          // Math.x → helper/dart:math
      if (name === 'length') return `${obj}.length`;
      { const mt = isMapParam(n.expression); if (mt) return `${obj}['${name}']`; }   // G20 · פרמטר-Map ⇒ גישת-מפתח (nullable כבר קיבל !)
      return `${obj}.${name}`;
    }
    case K.ElementAccessExpression: return `${bang(n.expression)}[${expr(n.argumentExpression)}]`;
    case K.CallExpression: {
      const callee = n.expression;
      if (callee.kind === K.PropertyAccessExpression) {
        const obj = bang(callee.expression), m = callee.name.text;
        if (obj === 'Math') return `${MATH[m] || m}(${n.arguments.map(expr).join(', ')})`;
        if (obj === 'Number' && m === 'isFinite') return `_isFinite(${n.arguments.map(expr).join(', ')})`;
        if (obj === 'Array' && m === 'isArray') return `(${expr(n.arguments[0])} is List)`;
        if (obj === 'Object' && m === 'keys') return `(${expr(n.arguments[0])} as Map).keys.toList()`;
        const DATE = { getTime: '.millisecondsSinceEpoch', getFullYear: '.year', getDate: '.day', getHours: '.hour', getMinutes: '.minute', getDay: '.weekday % 7' };
        if (m === 'getMonth') return `(${obj}.month - 1)`;        // JS 0-אינדקס → Dart 1-אינדקס (חוק-4!)
        if (DATE[m]) return `${obj}${DATE[m]}`;
        if (m === 'toISOString') return `${obj}.toIso8601String()`;
        if (m === 'reduce' && n.arguments.length === 2)
          return `${obj}.fold(${expr(n.arguments[1])}, ${expr(n.arguments[0])})`;
        if (m === 'map') return `${obj}.map(${n.arguments.map(expr).join(', ')}).toList()`;
        if (m === 'toLocaleString') return `_toLocaleString(${obj}${n.arguments.length ? ', ' + n.arguments.map(expr).join(', ') : ''})`; // שקע — פורמט-מקומי
        if (m === 'charCodeAt') return `${obj}.codeUnitAt(${n.arguments.map(expr).join(', ')})`;
        if (m === 'substring' || m === 'substr') return `${obj}.substring(${n.arguments.map(expr).join(', ')})`;
        if (m === 'indexOf') return `${obj}.indexOf(${n.arguments.map(expr).join(', ')})`;
        if (m === 'toFixed') return `${obj}.toStringAsFixed(${n.arguments.map(expr).join(', ')})`;
        if (m === 'slice' && !n.arguments.length) return `${obj}.toList()`;   // JS slice() = העתק; Dart sublist דורש ארגומנט (נחשף ע"י ההקלדה)
        if (m === 'sort') return `(${obj}..sort(${n.arguments.map(expr).join(', ')}))`;
        if (m === 'flat') return `${obj}.expand((x) => x is List ? x : [x]).toList()`;
        if (m === 'flatMap') return `${obj}.expand(${n.arguments.map(expr).join(', ')}).toList()`;
        const dm = STD[m] || m;
        return `${obj}.${dm}(${n.arguments.map(expr).join(', ')})`;
      }
      if (callee.kind === K.Identifier) {
        if (callee.text === 'parseInt') return `int.tryParse(${expr(n.arguments[0])}.toString()) ?? 0`;
        if (callee.text === 'parseFloat') return `double.tryParse(${expr(n.arguments[0])}.toString()) ?? 0`;
        if (callee.text === 'String') return `${expr(n.arguments[0])}.toString()`;
        if (callee.text === 'Number') return `_toNum(${expr(n.arguments[0])})`;
        if (callee.text === 'Boolean') return `_truthy(${expr(n.arguments[0])})`;
        if (callee.text === 'isNaN') return `(${expr(n.arguments[0])}).isNaN`;
      }
      return `${expr(callee)}(${n.arguments.map(expr).join(', ')})`;
    }
    case K.NewExpression: {
      const c = expr(n.expression), args = (n.arguments||[]).map(expr).join(', ');
      if (c === 'Date') return args ? `DateTime.parse(${args})` : 'DateTime.now()';
      if (c === 'RegExp') return `RegExp(${args})`;
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
