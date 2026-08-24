#!/usr/bin/env node
/** 🌳 מנוע-מורכב · JS→Dart מבוסס-AST (מפרש-TypeScript) — לא רגקס אלא הליכה על עץ-
 *  התחביר ⇒ עדיפויות/קינון/scope נכונים. ניב-האטומים: פונקציות טהורות. */
import { createRequire } from 'node:module';
const require = createRequire('/home/user/maor-system/');
const ts = require('typescript');

const STD = { // מיפוי-מתודות JS→Dart (על property-access בקריאה)
  includes: 'contains', filter: 'where', push: 'add', some: 'any', every: 'every',
  findIndex: 'indexWhere', find: 'firstWhere', slice: 'sublist', join: 'join',
  split: 'split', trim: 'trim', toLowerCase: 'toLowerCase', toUpperCase: 'toUpperCase',
  startsWith: 'startsWith', endsWith: 'endsWith', repeat: '_repeat', padStart: '_padStart',
  replace: 'replaceFirst', replaceAll: 'replaceAll', concat: '_concat', reverse: 'reversed',
};
const MATH = { round: '_round', floor: '_floor', ceil: '_ceil', abs: '_abs', min: 'min', max: 'max', pow: 'pow', sqrt: 'sqrt', trunc: '_trunc' };

export function emit(src) {
  const sf = ts.createSourceFile('a.js', src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
  const out = [];
  for (const st of sf.statements) out.push(gen(st));
  return out.filter(Boolean).join('\n');
}
function gen(n) {
  const K = ts.SyntaxKind;
  switch (n.kind) {
    case K.FunctionDeclaration: {
      const name = n.name.text, ps = n.parameters.map(param).join(', ');
      return `dynamic ${name}(${ps}) ${gen(n.body)}`;
    }
    case K.VariableStatement: {
      const d = n.declarationList.declarations[0];
      const init = d.initializer;
      if (init && (init.kind === K.ArrowFunction || init.kind === K.FunctionExpression)) {
        const ps = init.parameters.map(param).join(', ');
        const body = init.body.kind === K.Block ? gen(init.body) : `=> ${expr(init.body)};`;
        return `dynamic ${d.name.text}(${ps}) ${body}`;
      }
      return `var ${d.name.text} = ${expr(init)};`;
    }
    case K.Block: return `{\n${n.statements.map(s => '  ' + gen(s)).join('\n')}\n}`;
    case K.ReturnStatement: return `return ${n.expression ? expr(n.expression) : ''};`;
    case K.IfStatement: return `if (${expr(n.expression)}) ${gen(n.thenStatement)}${n.elseStatement ? ' else ' + gen(n.elseStatement) : ''}`;
    case K.ForOfStatement: { const v = n.initializer.declarations[0].name.text; return `for (final ${v} in ${expr(n.expression)}) ${gen(n.statement)}`; }
    case K.ExpressionStatement: return expr(n.expression) + ';';
    case K.ContinueStatement: return 'continue;';
    case K.BreakStatement: return 'break;';
    case K.ThrowStatement: return `throw ${expr(n.expression)};`;
    case K.ForStatement: {
      const init = n.initializer ? (n.initializer.kind === K.VariableDeclarationList ? 'var ' + n.initializer.declarations.map(d => `${d.name.text} = ${expr(d.initializer)}`).join(', ') : expr(n.initializer)) : '';
      return `for (${init}; ${n.condition ? expr(n.condition) : ''}; ${n.incrementor ? expr(n.incrementor) : ''}) ${gen(n.statement)}`;
    }
    case K.WhileStatement: return `while (${expr(n.expression)}) ${gen(n.statement)}`;
    case K.VariableDeclarationList: return n.declarations.map(d => `var ${d.name.text} = ${expr(d.initializer)};`).join(' ');
    default: return expr(n) + (n.kind === K.ExpressionStatement ? ';' : '');
  }
}
function param(p) {
  const name = p.name.text;
  if (p.initializer) return `[dynamic ${name} = ${expr(p.initializer)}]`;
  return `dynamic ${name}`;
}
function expr(n) {
  const K = ts.SyntaxKind;
  if (!n) return '';
  switch (n.kind) {
    case K.Identifier: return n.text;
    case K.NumericLiteral: return n.text;
    case K.StringLiteral: return `'${n.text.replace(/'/g, "\\'")}'`;
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
      const l = expr(n.left), r = expr(n.right);
      if (op === K.BarBarToken) {
        const boolish = (x) => [K.BinaryExpression, K.PrefixUnaryExpression, K.ParenthesizedExpression].includes(x.kind)
          && !(x.kind === K.BinaryExpression && [K.PlusToken, K.MinusToken, K.AsteriskToken].includes(x.operatorToken?.kind));
        return boolish(n.left) || boolish(n.right) ? `(${l} || ${r})` : `(${l} ?? ${r})`; // בוליאני מול ברירת-מחדל
      }
      if (op === K.QuestionQuestionToken) return `(${l} ?? ${r})`;
      if (op === K.AmpersandAmpersandToken) return `${l} && ${r}`;
      if (op === K.EqualsEqualsEqualsToken) return `${l} == ${r}`;
      if (op === K.ExclamationEqualsEqualsToken) return `${l} != ${r}`;
      return `${l} ${ts.tokenToString(op)} ${r}`;
    }
    case K.ConditionalExpression: return `${expr(n.condition)} ? ${expr(n.whenTrue)} : ${expr(n.whenFalse)}`;
    case K.ArrayLiteralExpression: return `[${n.elements.map(expr).join(', ')}]`;
    case K.ObjectLiteralExpression: return `{${n.properties.map(p => `'${p.name.text}': ${expr(p.initializer || p.name)}`).join(', ')}}`;
    case K.PropertyAccessExpression: {
      const obj = expr(n.expression), name = n.name.text;
      if (obj === 'Math' && MATH[name]) return MATH[name];          // Math.x → helper/dart:math
      if (name === 'length') return `${obj}.length`;
      return `${obj}.${name}`;
    }
    case K.ElementAccessExpression: return `${expr(n.expression)}[${expr(n.argumentExpression)}]`;
    case K.CallExpression: {
      const callee = n.expression;
      if (callee.kind === K.PropertyAccessExpression) {
        const obj = expr(callee.expression), m = callee.name.text;
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
        const dm = STD[m] || m;
        return `${obj}.${dm}(${n.arguments.map(expr).join(', ')})`;
      }
      if (callee.kind === K.Identifier) {
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
    case K.SpreadElement: return `...${expr(n.expression)}`;
    case K.PostfixUnaryExpression: return expr(n.operand) + ts.tokenToString(n.operator);
    case K.ArrowFunction: case K.FunctionExpression: {
      const ps = n.parameters.map(p => p.name.text).join(', ');
      return n.body.kind === K.Block ? `(${ps}) ${gen(n.body)}` : `(${ps}) => ${expr(n.body)}`;
    }
    default: return `/*?${ts.SyntaxKind[n.kind]}?*/`;
  }
}
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$');

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const code = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(l => !/^\s*(\/\*|\*|\/\/)/.test(l)).join('\n');
  console.log(emit(code));
}
