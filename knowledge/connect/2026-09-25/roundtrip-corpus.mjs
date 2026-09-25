// 🔁 הלוך-חזור על קורפוס: כל משפט ⇒ הכניסה (routeOf) ⇒ ספק ⇒ חזרה למילים (read.roundTrip) ⇒ כמה חזרו כפי שנאמרו.
//   קורא שני (tzinor) — למחלוקת. אפס כתיבה. שימוש: node knowledge/connect/2026-09-25/roundtrip-corpus.mjs <קובץ-משפטים> [-v] [--kinds]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const M = await import(path.join(ROOT, 'yeshiva/mavin.mjs')); const RD = await import(path.join(ROOT, 'yeshiva/read.mjs'));
const TZ = await import(path.join(ROOT, 'machtzev/generator/tzinor.mjs')); const G = await import(path.join(ROOT, 'machtzev/generator/generate.mjs'));
const ss = fs.readFileSync(process.argv[2], 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
let clean = 0; const K = {};
for (const s of ss) {
  const form = M.formOf(s); const r = G.routeOf(form, {});
  const covered = r.routes.filter((x) => x.route !== 'appds').map((x) => ({ role: x.route, text: x.thing }));
  let other = null; try { const t = TZ.specFromSentence(s); other = typeof t === 'string' ? t : t.spec; } catch {}
  const rt = RD.roundTrip({ sentence: s, words: form.words, frame: form.frame, spec: r.spec, covered, other });
  if (rt.clean) clean++; for (const q of rt.questions) (K[q.ask] ||= []).push(q.key);
  if (process.argv.includes('-v') && !rt.clean) console.log(`✗ «${s}»\n   ${rt.questions.map((q) => q.q).join('\n   ')}`);
}
if (process.argv.includes('--kinds')) for (const [k, v] of Object.entries(K)) console.log(`${k}: ${v.length}`);
console.log(`${clean}/${ss.length} חוזרים כפי שנאמרו · ${ss.length - clean} עם שאלה`);
