// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/kushya-sources.mjs — 🔎 מקורות-התשובה של מרכז-הקושיות (yeshiva/kushya). כל מקור נרשם כאן פעם אחת.
//   shape    — חיפוש-הקשר (ein/shape): כבר רץ בלולאת-האין; כאן רק מדווח אם ענה (answers.__kush) — אותו תיקון של 0bb2c4b2
//   corpus   — הכורה (koreh) על תרחישי-הבעלים: «אין לי אלא» ⇒ כל כלל «תנאי → פעולה» לכל נושא · «כגון» ⇒ שורות-דוגמה · «מאי» ⇒ היכן המילה מופיעה
//   מקור חדש (מסמך נוסף, שרת…) = register נוסף כאן; לא נוגעים בדלת.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
let CORPUS = null, CORPUS_DIR = null;
const corpus = async (dir) => { if (!dir) return null; if (CORPUS_DIR !== dir) { const K = await import('./koreh.mjs'); CORPUS = await K.corpusOf(dir); CORPUS_DIR = dir; } return CORPUS; };
export function registerAll(KU) {
  KU.register('shape', ['אין לי אלא', 'מאי', 'כגון'], async (ctx, k) => { const done = (ctx.answers.__kush || []).some((w) => String(k.kind).includes(w)); return done ? { summary: 'חיפוש-הקשר רץ' } : null; });
  KU.register('corpus', ['אין לי אלא', 'כגון', 'מאי', 'מאן קתני'], async (ctx, k) => {
    const c = await corpus(ctx.answers.__corpus); if (!c) return null; const K = await import('./koreh.mjs'); const names = ctx.answers.__docEnts || []; const tag = `${k.kind} ${String(k.text).split(':')[0]}`;
    if (tag.includes('אין לי אלא')) {
      const SL = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '../machtzev/generator/spec-lang.data.json'), 'utf8')); const skip = SL.durationWords || [];
      const MI = K.mine(c, names); const instances = Object.fromEntries(MI.candidates.map((x) => [x.name, x.ent]));
      const CO = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '../machtzev/generator/knowledge/conditions.json'), 'utf8'));
      const R = K.rulesOf(c, names, { subjects: MI.units.map((u) => u.unit).filter((u) => !skip.includes(u)), skip, instances, when: CO.when || [] }); const subs = Object.keys(R); const n = subs.reduce((s, x) => s + R[x].length, 0);
      const f = path.join(ctx.outDir, 'rules-found.json'); fs.writeFileSync(f, JSON.stringify(R, null, 1));
      const md = subs.sort((a, b) => R[b].length - R[a].length).map((x) => `## ${x} (${R[x].length})\n` + R[x].map((r) => `- ${r.label ? `[${r.label}] ` : ''}${r.cond} → ${r.act}  ·  ${r.sources} מקורות  ·  ${r.ex}`).join('\n')).join('\n\n');
      fs.writeFileSync(path.join(ctx.outDir, 'rules-found.md'), `# כללים שנמצאו בתרחישים («אין לי אלא» ⇒ חיפוש)\n\n${md}\n`);
      return { found: subs.map((x) => ({ subject: x, rules: R[x].length })), summary: `${n} כללים «תנאי → פעולה» ב-${subs.length} נושאים מ-${c.length} תרחישים (rules-found.md)` }; }
    if (tag.includes('כגון')) { const res = K.mine(c, names); const rows = Object.values(res.sentRows || {}).reduce((s, x) => s + x.length, 0); return { summary: `${rows} משפטים עם כמויות (דוגמאות מועמדות) ב-${Object.keys(res.sentRows || {}).length} ישויות` }; }
    if (tag.includes('מאי') || tag.includes('מאן קתני')) { const ws = [...String(k.text).matchAll(/«([^»]+)»/g)].map((m) => m[1]).slice(0, 12); if (!ws.length) return null;
      const hits = ws.map((w) => ({ w, n: c.filter((d) => d.text.includes(w)).length })); return { found: hits, summary: hits.map((h) => `«${h.w}» ב-${h.n} תרחישים`).join(' · ') }; }
    return null; });
}
