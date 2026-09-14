// gen/engine.mjs — לב-המחולל, רץ ב-Node ובדפדפן: ספק ⇒ תכנית ⇒ הוכחה-בריצה ⇒ הרכבה ⇒ {report, app}.
import { parseSpec } from './spec.mjs';
import { prove } from './prove.mjs';
import { renderApp } from './render.mjs';
import { derivePlan } from './plan.mjs';
import { sentenceToSpec } from './sentence.mjs';

export const isSpec = (text) => /^\s*אפליקציה:/.test(text || '');

export async function runGenerator({ text, specText, slug, shelf, NEEDS, LANG, dartProver = null, dartCount = 0, inventory = null, now = () => Date.now(), onStep = () => {} }) {
  const t0 = now();
  const needById = Object.fromEntries(NEEDS.map((n) => [n.id, n]));
  // משפט רגיל ⇒ ספק (שכבת-המשפט, עיוורת, מדאטה); ספק מדויק עובר כמו שהוא
  let sentence = null;
  if (specText == null) {
    if (isSpec(text)) specText = text;
    else { const r = sentenceToSpec(text, LANG || {}); specText = r.specText; sentence = { text, notes: r.notes }; onStep({ step: 'sentence', sentence, specText }); }
  }
  const spec = parseSpec(specText);
  onStep({ step: 'spec', spec });
  const plan = derivePlan(spec, NEEDS);
  onStep({ step: 'plan', plan });
  const needIds = [...new Set(plan.map((p) => p.needId))];
  const chosen = new Map();
  const proofs = [];
  for (const id of needIds) {
    const need = needById[id];
    const t = now();
    const r = await prove(need, shelf);
    const why = {};
    for (const f of r.failed) why[f.why] = (why[f.why] ?? 0) + 1;
    if (r.proven[0]) chosen.set(id, r.proven[0]);
    const proof = { need: id, label: need.label, from: need.from, examples: need.examples, tried: r.tried, failedBy: why, ms: Math.round(now() - t),
      proven: r.proven.map((a) => ({ name: a.name, fn: a.fn, n: a.n, role: a.role, tSource: a.tSource || null })), chosen: r.proven[0]?.name ?? null,
      usedBy: plan.filter((p) => p.needId === id).map((p) => p.label) };
    // שכבת-Dart: אותן דוגמאות מול האטומים שקיימים רק ב-Dart (מוכח במסוף; בדפדפן — תוצאה ארוזה)
    if (dartProver) { const d = await dartProver(need); if (d) { const dw = {}; for (const f of d.failed || []) dw[f.why] = (dw[f.why] ?? 0) + 1; proof.dart = { tried: d.tried, proven: (d.proven || []).map((a) => ({ name: a.name, fn: a.fn, file: a.file, params: a.params, ret: a.ret })), failedBy: dw, note: d.note || '' }; } }
    proofs.push(proof);
    onStep({ step: 'proof', proof });
  }
  const meta = { slug, built: new Date().toISOString(), ms: Math.round(now() - t0), shelf: shelf.length, fns: shelf.filter((a) => a.kind === 'fn').length, dart: dartCount, expiryWords: (LANG && LANG.extra && LANG.extra.expiryWords) || ['תוקף'], expiryWarnDays: (LANG && LANG.extra && LANG.extra.expiryWarnDays) || 30 };
  const app = renderApp(spec, chosen, plan, meta);
  const report = { app: spec.app, spec: specText, sentence, entities: spec.entities, dashboard: spec.dashboard, roles: spec.roles || [], plan, proofs,
    atoms: [...new Set([...chosen.values()])].map((a) => ({ name: a.name, fn: a.fn, n: a.n, hasT: a.hasT, role: a.role, file: a.file, src: a.src })),
    unproven: proofs.filter((p) => !p.chosen).map((p) => p.need), inventory, meta };
  onStep({ step: 'done', report });
  return { report, app };
}
