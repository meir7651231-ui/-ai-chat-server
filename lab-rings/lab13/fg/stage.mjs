// fg/stage.mjs - the stage 'דקדוק' («דקדוק»: חיפוש בדקדוק G0) for list2num / list2list.
// Finds an AST of grammar G0 from the task's examples (index first, then live search + CEGIS, all verified on every
// valid list), stores it in fg/found.jsonl, and hands it to compileAst (Track B). The task is used only as an
// oracle (the same black box genFor builds); its source text is never read by the search.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { solveLists } from './search.mjs';
import { loadIndex } from './index.mjs';
import { compileAst } from './compile.mjs';
const DIR = path.dirname(fileURLToPath(import.meta.url));
let IDX, PRIOR;
const index = () => { if (IDX === undefined) { const f = process.env.FGINDEX || path.join(DIR, 'index.bin'); try { IDX = fs.existsSync(f) ? loadIndex(f) : null; } catch { IDX = null; } } return IDX; };
const prior = () => { if (PRIOR === undefined) { const f = process.env.FGPRIOR || path.join(DIR, 'prior', 'upto5.json'); try { PRIOR = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { PRIOR = null; } } return PRIOR; };
export function oracleOf(spec) { const f = new Function('return (' + spec.src + ')')(); return spec.kind === 'list2num' ? (l) => f([...l]) & 15 : (l) => f([...l]); }
export async function grammarStage(spec, { ms = +process.env.FGMS || 60000 } = {}) {
  if (spec.kind !== 'list2num' && spec.kind !== 'list2list') return { prog: null };
  if (!spec.src) return { prog: null };   // a sub-spec of the compiler (spec.draw, no oracle on chosen lists): not searched here, no recursion
  const r = solveLists(spec.kind, oracleOf(spec), { ms, index: index(), prior: prior() });
  if (!r.ok) return { prog: null, ptag: r.cexs ? ` [cex ${r.cexs}]` : '' };
  try { fs.appendFileSync(process.env.FGFOUND || path.join(DIR, 'found.jsonl'), JSON.stringify({ src: 'stage', name: spec.name, kind: spec.kind, prog: r.prog, ast: r.ast, how: r.how, via: r.via, ms: r.ms, at: new Date().toISOString() }) + '\n'); } catch {}
  let c; try { c = await compileAst(r.ast, spec); } catch (e) { c = { ok: false, reason: String(e.message || e).slice(0, 80) }; }
  if (!c || !c.ok || !c.prog) return { prog: null, ast: r.ast, ptag: ' [AST: ' + r.prog.slice(0, 60) + ' · לא הודר]' };
  return { prog: c.prog, ast: r.ast, how: c.how || 'דקדוק: ' + r.prog };
}
