// G20 · מקליט-צורות: נטען ב---import לפני בדיקת-JS של אטום; רושם צורת-ריצה של כל ארגומנט/החזרה של הפונקציה-המיוצאת ⇒ TT_OUT (JSON)
import { register } from 'node:module';
import fs from 'node:fs';
import { POOL } from '../tools/probe-pool.mjs';
const POOL_SER = new Set(POOL.map((v) => { try { return JSON.stringify(v === undefined ? null : v); } catch { return ''; } }));
// L89 · קריאה-מגישוש: כל ארגומנט הוא איבר-סל (Golden-מאפיון של promote-auto) ⇒ הצורה משקפת גישוש, לא חוזה-קורא
const isProbe = (args) => args.length > 0 && args.every((a) => { try { return POOL_SER.has(JSON.stringify(a === undefined ? null : a)); } catch { return false; } });
const OUT = process.env.TT_OUT;
const calls = [];
const shape = (v, depth = 0) => {
  if (v === null || v === undefined) return 'null';
  const t = typeof v;
  if (t === 'string') return 'String';
  if (t === 'number') return Number.isNaN(v) || !Number.isFinite(v) ? 'double' : Number.isInteger(v) ? 'int' : 'double';
  if (t === 'boolean') return 'bool';
  if (t === 'function') return 'Function/' + v.length;
  if (depth > 3) return 'dynamic';
  if (Array.isArray(v)) return 'List<' + unify(v.map((x) => shape(x, depth + 1))) + '>';
  if (v instanceof Date) return 'DateTime';
  if (v instanceof Set) return 'Set<' + unify([...v].map((x) => shape(x, depth + 1))) + '>';
  if (v instanceof Map) return 'Map<dynamic, dynamic>';
  if (t === 'object') { const vals = Object.values(v); return 'Map<String, ' + (vals.length ? unify(vals.map((x) => shape(x, depth + 1))) : '?') + '>'; }
  return 'dynamic';
};
// איחוד צורות: זהה ⇒ הוא · int/double ⇒ num · T/null ⇒ T? · List<?>/List<T> ⇒ List<T> · ערכי-Map מעורבים ⇒ dynamic · אחרת dynamic
export function unify(shapes) {
  const s = [...new Set(shapes)]; if (!s.length) return '?';
  const nul = s.includes('null'); const rest = s.filter((x) => x !== 'null');
  if (!rest.length) return 'null';
  let u;
  if (rest.length === 1) u = rest[0];
  else if (rest.every((x) => x === 'int' || x === 'double' || x === 'num')) u = 'num';
  else if (rest.every((x) => x.startsWith('List<'))) { const inner = unify(rest.map((x) => x.slice(5, -1))); u = 'List<' + (inner === '?' ? '?' : inner) + '>'; }
  else if (rest.every((x) => x.startsWith('Map<String, '))) { const inner = unify(rest.map((x) => x.slice(12, -1))); u = 'Map<String, ' + (inner === '?' || inner === 'null' ? 'dynamic' : inner) + '>'; }
  else if (rest.every((x) => x.startsWith('Function/'))) u = 'Function/?';
  else u = 'dynamic';
  if (u === '?') return nul ? 'null' : '?';
  return nul && u !== 'dynamic' ? u + '?' : u;
}
globalThis.__ttUnify = unify;
globalThis.__ttRec = (name, fn) => function (...args) {
  const rec = { name, args: args.map((a) => shape(a)), argc: args.length, probe: isProbe(args) };
  try { const r = fn.apply(this, args); rec.ret = shape(r); calls.push(rec); return r; }
  catch (e) { rec.ret = '__THROW__'; calls.push(rec); throw e; }
};
process.on('exit', () => { if (OUT) fs.writeFileSync(OUT, JSON.stringify(calls)); });
register('./tighten-loader.mjs', import.meta.url);
