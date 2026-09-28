// pnet.mjs — a network that chooses whole pieces. Learns from solutions the engine found by itself (without the network)
// for other tasks (a "curriculum"), never from the task being tested.
import fs from 'node:fs';
import { variants, searchPieces, assemble, KINDS } from './pieces.mjs';
import { makeTask } from './tasks.mjs';
const CURRICULUM = ['צעד ברשימה', 'שני ברשימה', 'ראשון ועוד 1', 'סוף רשימה', 'אורך רשימה', 'חפש ברשימה'];
const CACHE = 'pnet-solutions.json';
export function curriculumSolutions(exclude) {
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  const vs = variants(JSON.parse(fs.readFileSync('lib2.json', 'utf8')).filter((m) => !m.name.startsWith('סוף') && !m.name.startsWith('חפש')));
  for (const t of CURRICULUM) { if (t === exclude || t in cache) continue;
    const { g, ok } = makeTask(t); const r = searchPieces(g, vs, { beam: 100, deadline: Date.now() + 120000 });
    cache[t] = r.solved && ok(assemble(r.ps)) ? r.ps.map((p) => p.kind) : null; fs.writeFileSync(CACHE, JSON.stringify(cache)); }
  return Object.entries(cache).filter(([t, s]) => t !== exclude && s).map(([, s]) => s); }
// ---- the network: sees the last two pieces (and how many so far) ⇒ which kind comes next
export function trainedPrior(exclude, keep = 4, given = null) {
  const kinds = KINDS(variants(JSON.parse(fs.readFileSync('lib2.json', 'utf8')).filter((m) => !m.name.startsWith('סוף') && !m.name.startsWith('חפש'))));
  const K = kinds.length, NIN = 2 * (K + 1) + 4, NH = 24; const idx = (k) => kinds.indexOf(k);
  const feats = (seq) => { const x = new Array(NIN).fill(0); const a = seq.length ? idx(seq[seq.length - 1]) : K, b = seq.length > 1 ? idx(seq[seq.length - 2]) : K;
    x[a] = 1; x[K + 1 + b] = 1; x[2 * (K + 1) + Math.min(seq.length, 3)] = 1; return x; };
  let s = 3; const R = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648 - 0.5; };
  const W1 = Array.from({ length: NH }, () => Array.from({ length: NIN }, () => R() * 0.6)), W2 = Array.from({ length: K }, () => Array.from({ length: NH + 1 }, () => R() * 0.6));
  const fwd = (x) => { const h = W1.map((w) => Math.tanh(w.reduce((a, v, i) => a + v * x[i], 0))); const z = W2.map((w) => w.reduce((a, v, j) => a + v * (j < NH ? h[j] : 1), 0));
    const m = Math.max(...z); const e = z.map((v) => Math.exp(v - m)); const S = e.reduce((a, b) => a + b); return { h, p: e.map((v) => v / S) }; };
  const sols = given || curriculumSolutions(exclude); const data = [];
  for (const seq of sols) for (let i = 0; i < seq.length; i++) data.push({ x: feats(seq.slice(0, i)), y: idx(seq[i]) });
  for (let ep = 0; ep < 500; ep++) for (const { x, y } of data) { const { h, p } = fwd(x); const g = p.map((v, o) => (o === y ? 1 : 0) - v);
    const gh = h.map((hj, j) => (1 - hj * hj) * g.reduce((a, go, o) => a + go * W2[o][j], 0));
    W2.forEach((w, o) => { for (let j = 0; j <= NH; j++) w[j] += 0.05 * g[o] * (j < NH ? h[j] : 1); }); W1.forEach((w, j) => { for (let i = 0; i < NIN; i++) if (x[i]) w[i] += 0.05 * gh[j]; }); }
  console.log(`the network learned from ${sols.length} solutions of other tasks (${data.length} choices)`);
  const filter = (seq) => new Set(fwd(feats(seq)).p.map((v, i) => [v, kinds[i]]).sort((a, b) => b[0] - a[0]).slice(0, keep).map(([, k]) => k));
  filter.probs = (seq) => new Map(fwd(feats(seq)).p.map((v, i) => [kinds[i], v])); return filter; }
