// gen/prove.mjs — הוכחה-בריצה. צורך = חתימה + דוגמאות מחייבות (קלט ⇒ פלט).
// כל אטום-פונקציה במדף נקרא על כל דוגמה; עובר רק מי שהחזיר בדיוק את הפלט המבוקש בכולן.
// אין שמות, אין מילון, אין ניחוש: הריצה היא ההוכחה. השם משמש רק כמפתח דטרמיניסטי לשבירת-שוויון.
import { pathToFileURL } from 'node:url';

const CACHE = new Map();
export async function loadAtom(a) {
  if (!CACHE.has(a.file)) CACHE.set(a.file, import(pathToFileURL(a.file).href));
  const mod = await CACHE.get(a.file);
  return mod[a.fn];
}

export function same(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a === 'number' && typeof b === 'number') return Number.isNaN(a) && Number.isNaN(b);
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && same(a[k], b[k]));
}

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const materialize = (arg) => (arg && typeof arg === 'object' && arg.$fn ? new Function('return (' + arg.$fn + ');')() : clone(arg));

export async function callAtom(a, fn, args) {
  const padded = [...args, ...Array(Math.max(0, a.n - args.length)).fill(undefined)];
  if (a.hasT) padded.push(a.T ?? {});
  return fn(...padded);
}

/** need = { id, examples: [{ args: [...], want }] } */
export async function prove(need, shelf) {
  const proven = [], failed = [];
  for (const a of shelf) {
    if (a.kind !== 'fn') continue;
    if (a.n < need.examples[0].args.length) { failed.push({ name: a.name, why: 'אורך-קריאה' }); continue; }
    let fn;
    try { fn = await loadAtom(a); } catch (e) { failed.push({ name: a.name, why: 'טעינה' }); continue; }
    if (typeof fn !== 'function') { failed.push({ name: a.name, why: 'לא פונקציה' }); continue; }
    let ok = true, why = '';
    for (const ex of need.examples) {
      let got;
      try { got = await callAtom(a, fn, ex.args.map(materialize)); }
      catch (e) { ok = false; why = 'זריקה'; break; }
      if (got && typeof got.then === 'function') { ok = false; why = 'אסינכרוני'; break; }
      if (!same(got, ex.want)) { ok = false; why = 'פלט שונה'; break; }
    }
    if (ok) proven.push(a); else failed.push({ name: a.name, why });
  }
  proven.sort((x, y) => x.n - y.n || x.name.localeCompare(y.name));
  return { proven, tried: proven.length + failed.length, failed };
}
