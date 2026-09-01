#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  oracle.mjs — האורקל-המאוחד (שלב-0 · יסוד): כל 1332 האטומים במקום-אחד,
//  חוצה-שכבות (display · logic). מאחד atom-index.json (תצוגה) + logic-census.json
//  (לוגיקה) ⇒ atom-index-full.json. **§21 דורש שהמחולל יראה את כל האטומים** — אורקל
//  תצוגה-בלבד שובר את זה מהיסוד. אפס-איבוד: --gate נכשל אם אטום נפל.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
const G = new URL('../generator/', import.meta.url).pathname;
const rj = (f) => JSON.parse(fs.readFileSync(path.join(G, f), 'utf8'));

const disp = rj('atom-index.json');   // תצוגה (dart-ui-bs widgets)
const logic = rj('logic-census.json'); // לוגיקה (dart-maor + dart)

// מיזוג נורמלי — כל אטום עם layer + מפתח-זהות אחיד (id).
const merged = [
  ...disp.map((a) => ({ id: a.cls, layer: 'display', file: a.file, seam: a.seam, caps: a.caps || [], purpose: a.purpose || [] })),
  ...logic.map((a) => ({ id: a.name, layer: 'logic', file: a.file, ret: a.ret, params: a.params || [], argc: a.argc, wireable: !!a.wireable })),
].sort((a, b) => (a.layer + a.id < b.layer + b.id ? -1 : 1));

const expect = disp.length + logic.length;
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(G, 'atom-index-full.json'), JSON.stringify(merged, null, 0) + '\n');
  console.log(`🧬 אורקל-מאוחד נכתב: ${merged.length} אטומים (תצוגה ${disp.length} + לוגיקה ${logic.length})`);
  process.exit(0);
}
if (process.argv.includes('--gate')) {
  let full; try { full = rj('atom-index-full.json'); } catch { console.error('🔴 אין atom-index-full.json — הרץ --write'); process.exit(1); }
  if (full.length !== expect) { console.error(`🔴 אורקל לא-שלם: ${full.length} ≠ ${expect} (תצוגה+לוגיקה) — אטום נפל!`); process.exit(1); }
  const d = full.filter((a) => a.layer === 'display').length, l = full.filter((a) => a.layer === 'logic').length;
  if (d !== disp.length || l !== logic.length) { console.error(`🔴 אורקל לא-מאוזן: display ${d}/${disp.length} · logic ${l}/${logic.length}`); process.exit(1); }
  console.log(`✓ אורקל-מאוחד שלם: ${full.length} = תצוגה ${d} + לוגיקה ${l} (אפס-איבוד)`);
  process.exit(0);
}
console.log(`אורקל-מאוחד: ${merged.length} אטומים · תצוגה ${disp.length} · לוגיקה ${logic.length}`);
