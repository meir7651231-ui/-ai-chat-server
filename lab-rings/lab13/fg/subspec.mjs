// subspec.mjs - the compose-style FALLBACK of the compiler: a list⇒list or list⇒number sub-term that has no brick becomes an
// ordinary task for the machine's own stages (brain-all.mjs solveAny). Its examples come from a gen that draws a parent list,
// runs the found program's witness up to the sub-term's input (the list at cell 1) and takes the sub-term's value as the answer.
// The program solveAny returns is inlined into the compiled program (shifted like pipeline.mjs/shiftC does).
// Results are cached by the sub-spec's behaviour (fg/subspec-cache.json), so the same sub-task is solved once.
import fs from 'fs'; import crypto from 'crypto';
import { solveAny, genFor } from '../brain-all.mjs';
import { deepRelocOk, repairJumps } from '../jumpfix.mjs';
import { relocFix } from './reloc.mjs';
const CACHE = new URL('./subspec-cache.json', import.meta.url);
let C = null; const load = () => { if (!C) { try { C = JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { C = {}; } } return C; };
const save = () => { try { const cur = (() => { try { return JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { return {}; } })(); fs.writeFileSync(CACHE, JSON.stringify({ ...cur, ...C })); } catch {} };
export const SUBSTATS = { calls: 0, solved: 0, cached: 0, ms: 0, log: [] };
// fixed parent lists for the behaviour key (machine-chosen, task independent)
let seed = 4242; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x80000000;
const KEYLISTS = (() => { seed = 4242; const out = [[]]; for (let k = 0; k < 400; k++) { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let i = 7; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } out.push(p.slice(0, k % 9)); } return out; })();
// budgets for one sub-spec: every stage gets at most FG_SUBMS (stagestats may cut it further)
const STAGE_VARS = ['VMS', 'LOOPMS', 'CASEMS', 'POMS', 'SCANMS', 'HFMS', 'PICKMS', 'WIDEMS', 'POSMS', 'IFPMS', 'CUTMS', 'IFMS', 'KSMS', 'IFEMS', 'PERMMS', 'WIDE2MS', 'SSMS', 'PAIRMS', 'WINMS', 'GREEDYMS', 'RUNSMS', 'WALKMS', 'TUPMS', 'RANKMS', 'REARRMS'];
// solveSub({kind:'list2list'|'list2num', input(l) ⇒ list at cell 1, want(l) ⇒ answer, label}) ⇒ {prog, how, stage} | null
export async function solveSub({ kind, input, want, label = '' }) {
  SUBSTATS.calls++;
  const pairs = KEYLISTS.map((l) => { const x = input([...l]); return [x, want([...l])]; });
  // the sub-spec must be a function of the list it sees
  const fm = new Map(); for (const [x, y] of pairs) { const k = x.join(','); const v = JSON.stringify(kind === 'list2num' ? y & 15 : y); if (fm.has(k) && fm.get(k) !== v) return { prog: null, why: 'not a function of its input list' }; fm.set(k, v); }
  if (pairs.some(([x]) => !Array.isArray(x) || x.length > 8 || new Set(x).size !== x.length || x.some((v) => v < 8 || v > 15))) return { prog: null, why: 'input is not a machine list' };
  if (kind === 'list2list' && pairs.some(([, y]) => !Array.isArray(y) || y.length > 8 || new Set(y).size !== y.length || y.some((v) => v < 8 || v > 15))) return { prog: null, why: 'output is not a machine list' };
  if (kind === 'list2num' && pairs.some(([, y]) => !Number.isInteger(y))) return { prog: null, why: 'answer is not an integer' };
  const key = kind + ':' + crypto.createHash('md5').update(JSON.stringify(pairs.map(([x, y]) => [x, kind === 'list2num' ? y & 15 : y]).sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1)))).digest('hex');
  const cache = load(); const ms = +process.env.FG_SUBMS || 20000;
  if (cache[key] && (cache[key].prog || (cache[key].budget || 0) >= ms)) { SUBSTATS.cached++; return { ...cache[key], cached: true }; }
  if (process.env.FG_NOSUB) return { prog: null, why: 'sub-specs off' };
  const draw = () => { const n = Math.floor(Math.random() * 9); const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let i = 7; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } const l = p.slice(0, n); return { l: input([...l]), y: want([...l]) }; };
  const prev = {}; for (const v of STAGE_VARS) { prev[v] = process.env[v]; process.env[v] = String(Math.min(+(process.env[v] || 1e9), ms)); }
  const prevN = process.env.NUMMS; const t0 = Date.now(); let r = null;
  try { r = await solveAny({ kind, name: 'fg-sub ' + label, draw }, { say: (s) => { if (process.env.FGDBG) console.error('   [sub]', label, s); } }); }
  catch (e) { r = { ok: false, err: String(e.message || e).slice(0, 120) }; }
  finally { for (const v of STAGE_VARS) { if (prev[v] === undefined) delete process.env[v]; else process.env[v] = prev[v]; } if (prevN === undefined) delete process.env.NUMMS; else process.env.NUMMS = prevN; }
  const dt = Date.now() - t0; SUBSTATS.ms += dt;
  let prog = r && r.ok && r.prog ? r.prog : null, reloc = null;
  // inlining moves the program: it must survive a trapped padding prefix (deepRelocOk); if not, jump repair, then the trampoline (reloc.mjs)
  if (prog) { const g = genFor({ kind, draw }); if (!deepRelocOk(prog, g)) { const a = repairJumps(prog, g); if (a && deepRelocOk(a, g)) { prog = a; reloc = 'repairJumps'; } else { const b = relocFix(prog, g); if (b && deepRelocOk(b, g)) { prog = b; reloc = 'trampoline'; } else prog = null; } } }
  const res = prog ? { prog, how: r.how, stage: r.stage, ms: dt, reloc } : { prog: null, budget: ms, ms: dt, tried: r && r.tried };
  if (res.prog) SUBSTATS.solved++;
  SUBSTATS.log.push({ label, kind, ok: !!res.prog, ms: dt, stage: res.stage || null });
  cache[key] = res; save();
  return res;
}
