#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  oracle.mjs — האורקל-המאוחד (שלב-0 · יסוד): כל 1332 האטומים במקום-אחד,
//  חוצה-שכבות (display · logic). מאחד atom-index.json (תצוגה) + logic-census.json
//  (לוגיקה) ⇒ atom-index-full.json. **§21 דורש שהמחולל יראה את כל האטומים** — אורקל
//  תצוגה-בלבד שובר את זה מהיסוד. אפס-איבוד: --gate נכשל אם אטום נפל.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../root.mjs';
import { atomIndex } from './atom-index.mjs';
import { logicCensus } from './logic-census.mjs';
const G = R.GEN_DIR;
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
  // c4ב · הכרעה C (R2-4.11): השער החי היחיד בשרשרת TRUTH→full→index — הליכה-בזיכרון ≡ committed.
  // עד היום oracle השווה 3 קבצי-JSON committed זה-לזה, ו-atom-census.json הזדקן ל-522 בלי שאיש הרגיש.
  const liveIdx = atomIndex(), liveLogic = logicCensus();
  const setOf = (xs, k) => new Set(xs.map((a) => a[k]));
  const dIdx = [...setOf(liveIdx, 'cls')].filter((c) => !setOf(disp, 'cls').has(c)), dIdx2 = [...setOf(disp, 'cls')].filter((c) => !setOf(liveIdx, 'cls').has(c));
  const dLog = [...setOf(liveLogic, 'name')].filter((c) => !setOf(logic, 'name').has(c)), dLog2 = [...setOf(logic, 'name')].filter((c) => !setOf(liveLogic, 'name').has(c));
  if (dIdx.length || dIdx2.length || dLog.length || dLog2.length) {
    console.error(`🔴 האינדקס ישן מול העץ: תצוגה +${dIdx.length}/−${dIdx2.length} · לוגיקה +${dLog.length}/−${dLog2.length} — הרץ census/atom-index.mjs + census/logic-census.mjs + oracle --write`);
    [...dIdx.slice(0, 5), ...dIdx2.slice(0, 5)].forEach((c) => console.error('   · ' + c)); process.exit(1);
  }
  // ראצ׳ט-כפילויות (הכרעה K · R2-4.2): שם-מחלקה בשני קבצים — הראשון-אלפביתית מנצח בשקט. כפילות **חדשה** = אדום.
  const byCls = {};
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith('.dart')) for (const m of fs.readFileSync(f, 'utf8').matchAll(/class ([A-Za-z0-9]+) extends (?:StatelessWidget|StatefulWidget)/g)) (byCls[m[1]] ||= []).push(path.relative(R.NEW, f)); } })(R.NEW + 'dart-ui-bs');
  const dups = Object.keys(byCls).filter((c) => byCls[c].length > 1).sort();
  const DUPB = R.MACH + 'dup-class-baseline.json';
  const known = new Set(fs.existsSync(DUPB) ? JSON.parse(fs.readFileSync(DUPB, 'utf8')) : []);
  const freshDup = dups.filter((c) => !known.has(c));
  if (freshDup.length) { console.error(`🔴 שם-מחלקה כפול חדש (${freshDup.length}): ${freshDup.map((c) => c + ' [' + byCls[c].join(' | ') + ']').join(' · ')}`); process.exit(1); }
  if (dups.length < known.size) console.log(`ℹ️ baseline may shrink: dup-class ${known.size}→${dups.length} — מוחל בטבעת-push`);
  let full; try { full = rj('atom-index-full.json'); } catch { console.error('🔴 אין atom-index-full.json — הרץ --write'); process.exit(1); }
  if (full.length !== expect) { console.error(`🔴 אורקל לא-שלם: ${full.length} ≠ ${expect} (תצוגה+לוגיקה) — אטום נפל!`); process.exit(1); }
  const d = full.filter((a) => a.layer === 'display').length, l = full.filter((a) => a.layer === 'logic').length;
  if (d !== disp.length || l !== logic.length) { console.error(`🔴 אורקל לא-מאוזן: display ${d}/${disp.length} · logic ${l}/${logic.length}`); process.exit(1); }
  console.log(`✓ אורקל-מאוחד שלם: ${full.length} = תצוגה ${d} + לוגיקה ${l} (אפס-איבוד) · אינדקס ≡ עץ-חי · כפילויות-מחלקה ${dups.length} (חוב-מנוהל, רק-יורד)`);
  process.exit(0);
}
console.log(`אורקל-מאוחד: ${merged.length} אטומים · תצוגה ${disp.length} · לוגיקה ${logic.length}`);
