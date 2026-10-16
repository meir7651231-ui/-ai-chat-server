// fg/stage.mjs - the stage 'דקדוק' («דקדוק»: חיפוש בדקדוק G0, ואחריו G1) for list2num / list2list.
// Finds an AST from the task's examples (index first, then live search + CEGIS, all verified on every valid list),
// stores it in fg/found.jsonl, and hands it to compileAst (Track B). The task is used only as an oracle (the same black box
// genFor builds); its source text is never read by the search.
// G1: the G0 pass runs exactly as before (same index, prior, productions). Only when it does not end in compiled code, the G1
// pass looks in the G1 supplement index (fg/index-g1.bin: nodes that use a G1 production; meet-in-the-middle with partners from
// both indexes). FG1=0 turns the G1 pass off; FG1LIVE=<ms> allows a live G1 search after counterexamples (default 0: lookup only).
// Track C (fg/learn.mjs, merged in r7): the G0 pass also matches the machine's own history entries (delta) and uses the prior refit
// from that history; every AST found by either pass joins the history (recordAst), even if it does not compile. LEARN=0 turns it off.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { solveLists } from './search.mjs';
import { loadIndex, matchG1 } from './index.mjs';
import { compileAst } from './compile.mjs';
import { deltaOrNull, HDIR, recordAst } from './learn.mjs';   // Track C: the machine's own history (history entries of the index, learned prior)
const DIR = path.dirname(fileURLToPath(import.meta.url));
let IDX, PRIOR, IDX1, PRIOR1;
const learnOff = () => process.env.LEARN === '0';
// index: FGINDEX, else the index rebuilt from the learned prior (fg/index-learned.bin, learn.mjs refit --rebuild), else fg/index.bin
const index = () => { if (IDX === undefined) { const L = path.join(DIR, 'index-learned.bin'); const f = process.env.FGINDEX || (!learnOff() && fs.existsSync(L) ? L : path.join(DIR, 'index.bin')); try { IDX = fs.existsSync(f) ? loadIndex(f) : null; } catch { IDX = null; } } return IDX; };
// prior (live search): FGPRIOR, else the prior refit from the machine's history (learn.mjs), else prior/upto5.json
const prior = () => { if (PRIOR === undefined) { const H = path.join(HDIR(), 'prior.json'); const f = process.env.FGPRIOR || (!learnOff() && fs.existsSync(H) ? H : path.join(DIR, 'prior', 'upto5.json')); try { PRIOR = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { PRIOR = null; } } return PRIOR; };
const index1 = () => { if (IDX1 === undefined) { const f = process.env.FG1INDEX || path.join(DIR, 'index-g1.bin'); try { IDX1 = fs.existsSync(f) ? loadIndex(f) : null; } catch { IDX1 = null; } } return IDX1; };
const prior1 = () => { if (PRIOR1 === undefined) { const f = process.env.FG1PRIOR || path.join(DIR, 'prior', 'upto5-g1.json'); try { PRIOR1 = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { PRIOR1 = null; } } return PRIOR1; };
export function oracleOf(spec) { const f = new Function('return (' + spec.src + ')')(); return spec.kind === 'list2num' ? (l) => f([...l]) & 15 : (l) => f([...l]); }
const note = (spec, r, pass) => { try { fs.appendFileSync(process.env.FGFOUND || path.join(DIR, 'found.jsonl'), JSON.stringify({ src: 'stage', pass, name: spec.name, kind: spec.kind, prog: r.prog, ast: r.ast, how: r.how, via: r.via, ms: r.ms, at: new Date().toISOString() }) + '\n'); } catch {} };
async function compiled(r, spec) { let c; try { c = await compileAst(r.ast, spec); } catch (e) { c = { ok: false, reason: String(e.message || e).slice(0, 80) }; } return c && c.ok && c.prog ? c : null; }
export async function grammarStage(spec, { ms = +process.env.FGMS || 60000 } = {}) {
  if (spec.kind !== 'list2num' && spec.kind !== 'list2list') return { prog: null };
  if (!spec.src) return { prog: null };   // a sub-spec of the compiler (spec.draw, no oracle on chosen lists): not searched here, no recursion
  const T0 = Date.now(); const oracle = oracleOf(spec);
  const r = solveLists(spec.kind, oracle, { ms, index: index(), prior: prior(), delta: deltaOrNull() });   // G0 pass (+ Track C history entries)
  let fail = { prog: null, ptag: r.cexs ? ` [cex ${r.cexs}]` : '' };
  if (r.ok) { try { recordAst(spec, r); } catch {}   // Track C: the AST joins the history even if it does not compile
    note(spec, r, 'G0'); const c = await compiled(r, spec); if (c) return { prog: c.prog, ast: r.ast, how: c.how || 'דקדוק: ' + r.prog };
    fail = { prog: null, ast: r.ast, ptag: ' [AST: ' + r.prog.slice(0, 60) + ' · לא הודר]' }; }
  if (process.env.FG1 === '0') return fail;
  const left = ms - (Date.now() - T0); const g1 = index1(); if (left < 1000 || !g1) return fail;
  const live = +process.env.FG1LIVE || 0;
  const r1 = solveLists(spec.kind, oracle, { ms: Math.min(left, (live || 0) + 15000), index: g1, indexMatch: (k, t, tc, o) => matchG1(g1, index(), k, t, tc, o), prior: prior1(), g1: true, live: live > 0 ? 'auto' : false });
  if (!r1.ok) return { ...fail, ptag: (fail.ptag || '') + (r1.cexs ? ` [G1 cex ${r1.cexs}]` : '') };
  try { recordAst(spec, r1); } catch {}   // Track C: a G1 AST joins the history too
  note(spec, r1, 'G1'); const c1 = await compiled(r1, spec);
  if (!c1) return { prog: null, ast: r1.ast, ptag: (fail.ptag || '') + ' [G1 AST: ' + r1.prog.slice(0, 60) + ' · לא הודר]' };
  return { prog: c1.prog, ast: r1.ast, how: c1.how || 'דקדוק G1: ' + r1.prog };
}
