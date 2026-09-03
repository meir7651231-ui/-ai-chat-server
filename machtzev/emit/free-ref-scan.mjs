#!/usr/bin/env node
/** 🔎 סורק-הפניות-חופשיות — מוצא בכל אטום-JS מזהה שנקרא אך לא-מוגדר (לא פרמטר/מקומי/
 *  import/גלובל) = חור-חילוץ (קבוע-שכן/שקע שלא-הוטמע, כמו HEX2). סטטי, מהיר, פר-681. */
import fs from 'node:fs';
import { requireTs } from '../lib-ts.mjs';
const ts = requireTs();
const DIR = new URL('../../new/atoms/', import.meta.url).pathname;

const GLOBALS = new Set(['Math','Number','String','Object','Array','JSON','Date','RegExp','Boolean','Map','Set','Symbol','Promise','parseInt','parseFloat','isNaN','isFinite','undefined','null','NaN','Infinity','console','globalThis','encodeURIComponent','decodeURIComponent','structuredClone','Intl','BigInt','Error','TypeError','arguments','require','process','fetch','crypto','navigator','URL','URLSearchParams','Uint8Array','Uint16Array','TextDecoder','TextEncoder','Blob','FileReader','atob','btoa','localStorage','sessionStorage','document','window','setTimeout','clearTimeout','AbortController','WeakMap','DataView','Function']);

function scan(file) {
  const src = fs.readFileSync(DIR + file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
  const declared = new Set(GLOBALS);
  const imported = new Set();
  // אסוף הכרזות גלובליות + imports
  const collectDecls = (n) => {
    if (n.kind === ts.SyntaxKind.FunctionDeclaration && n.name) declared.add(n.name.text);
    if (n.kind === ts.SyntaxKind.VariableDeclaration && n.name.kind === ts.SyntaxKind.Identifier) declared.add(n.name.text);
    if (n.kind === ts.SyntaxKind.ImportSpecifier) imported.add(n.name.text);
    if (n.kind === ts.SyntaxKind.ImportClause && n.name) imported.add(n.name.text);
    ts.forEachChild(n, collectDecls);
  };
  collectDecls(sf);
  const free = new Set();
  // הליכה עם scope: אסוף פרמטרים+מקומיים פר-פונקציה
  const walk = (n, scope) => {
    if (ts.isFunctionLike(n)) {
      const s = new Set(scope);
      (n.parameters || []).forEach(p => { if (p.name.kind === ts.SyntaxKind.Identifier) s.add(p.name.text); else collectBinding(p.name, s); });
      if (n.body) collectLocals(n.body, s);
      ts.forEachChild(n, (c) => walk(c, s));
      return;
    }
    if (n.kind === ts.SyntaxKind.Identifier) {
      const p = n.parent;
      // דלג על שמות-מאפיין (a.NAME), מפתחות-אובייקט, הכרזות
      const isProp = p && p.kind === ts.SyntaxKind.PropertyAccessExpression && p.name === n;
      const isKey = p && (p.kind === ts.SyntaxKind.PropertyAssignment && p.name === n);
      const isDecl = p && (ts.isVariableDeclaration(p) || ts.isParameter(p) || ts.isFunctionDeclaration(p)) && p.name === n;
      if (!isProp && !isKey && !isDecl && !scope.has(n.text) && !declared.has(n.text) && !imported.has(n.text))
        free.add(n.text);
      return;
    }
    ts.forEachChild(n, (c) => walk(c, scope));
  };
  const collectBinding = (name, s) => { if (name.elements) name.elements.forEach(e => e.name && (e.name.kind === ts.SyntaxKind.Identifier ? s.add(e.name.text) : collectBinding(e.name, s))); };
  const collectLocals = (n, s) => {
    if (ts.isVariableDeclaration(n)) { n.name.kind === ts.SyntaxKind.Identifier ? s.add(n.name.text) : collectBinding(n.name, s); }
    if (ts.isFunctionDeclaration(n) && n.name) s.add(n.name.text);
    ts.forEachChild(n, (c) => collectLocals(c, s));
  };
  walk(sf, new Set());
  return [...free];
}

const atoms = fs.readdirSync(DIR).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs'));
let bad = 0; const hits = [];
for (const f of atoms) {
  try { const free = scan(f); if (free.length) { bad++; hits.push(`${f.replace('.mjs','')}: ${free.join(', ')}`); } }
  catch (e) { hits.push(`${f}: ⚠️ parse ${String(e.message).slice(0,40)}`); }
}
console.log(`🔎 סורק-הפניות-חופשיות: ${atoms.length} אטומים · ${bad} עם הפניה-חופשית חשודה`);
hits.forEach(h => console.log('  🚨 ' + h));
if (process.argv.includes('--gate')) process.exit(bad > 0 ? 1 : 0);
