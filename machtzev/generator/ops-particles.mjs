#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  ops-particles.mjs — **פעולות-יסוד ⇒ חלקיקים** (הכרעה-27 · G23 · G2).
//  ────────────────────────────────────────────────────────────────────────
//  הפער שזה סוגר: המסלול-החופשי פלט רק שורות-ישות ו**אפס חלקיקים**, ולכן כל
//  מה שהמחולל יודע לעשות נשען על שמות-שדות — ושם אין מונחים עבריים (‏0 מונחי-
//  שדה בכל הריפו). המסלול הנכון הוא חלקיקים: `shape-ops.json` כבר גוזר לכל
//  ישות את **פעולות-היסוד שלה מטיפוסי-השדות** (‏Family ⇒ 39), ו-`particles.mjs`
//  כבר יודע לפתור צורה ⇒ פעולות ⇒ אטומים ⇒ שקעים בחיפוש-פתוח.
//
//  ⚙️ אפס-מילון (§23 · §19-ד): שתי הקצוות **דאטה**, וההתאמה ביניהן היא
//  **זהות-שם**, לא טבלה — שם-ה-op ב-`shape-ops.json` (‏table/search/filter/
//  export) ≡ ‏`shape.kind` ש-`shapeOf` מזהה. המילה העברית מגיעה מאטום-השפה
//  `spec-lang.data.json` (‏pTable/pSearch/…), אותו אטום שהמנתח עצמו קורא.
//
//  🔒 רק צורות **חסרות-שדה**: צורה שדורשת שם-שדה (‏[מספר] · [סכום] · [לוח])
//  הייתה מחייבת מונח עברי שאינו קיים ⇒ ∅ מדווח, לא ניחוש (L57).
//
//  שימוש: node ops-particles.mjs Family [שם-עברי]
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';

const GEN = R.GEN_DIR;
const SOPS = JSON.parse(fs.readFileSync(GEN + 'shape-ops.json', 'utf8'));
const SL = JSON.parse(fs.readFileSync(GEN + 'spec-lang.data.json', 'utf8'));

// צורות שהמנתח פותר **בלי שם-שדה**. המפתח = שם-ה-op (זהות-שם, לא מילון);
// הערך = מפתח-המילה באטום-השפה. הוספת צורה = שורה כאן + קיומה בשני הדאטות.
const FIELD_FREE = { table: 'pTable', search: 'pSearch', filter: 'pFilter', export: 'pExport' };

const word = (key) => { const v = SL[key]; return Array.isArray(v) ? v[0] : v; };

/** ops של מחלקה — נגזרים מטיפוסי-השדות (G2), לא משמותיהם. */
export function opsOf(cls) {
  const e = (SOPS.entities || []).find((x) => x.entity === cls);
  return e ? e.ops || [] : [];
}

/**
 * מחלקה + המילה-העברית של הישות ⇒ שורות-חלקיק שהמנתח יודע לפתור.
 * מחזיר `{ lines, ops, skipped }` — `skipped` = פעולות-יסוד שהישות תומכת בהן
 * אבל צורתן דורשת שם-שדה (מתג, לא המצאה).
 */
export function particlesFor(cls, entityWord) {
  const ops = opsOf(cls);
  const lines = [], used = [];
  for (const op of ops) {
    const k = FIELD_FREE[op]; if (!k) continue;
    const w = word(k); if (!w) continue;
    lines.push(`${SL.particleWord} ${entityWord}: [${w}]`);
    used.push(op);
  }
  return { lines, ops, used, skipped: ops.filter((o) => !FIELD_FREE[o]) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cls = process.argv[2], w = process.argv[3] || cls;
  if (!cls) {
    console.log(`ישויות עם פעולות-יסוד: ${(SOPS.entities || []).length}`);
    const cov = (SOPS.entities || []).map((e) => ({ e: e.entity, n: (e.ops || []).filter((o) => FIELD_FREE[o]).length }));
    const with_ = cov.filter((x) => x.n).length;
    console.log(`מתוכן עם ≥1 צורה חסרת-שדה: ${with_} (${(with_ / cov.length * 100).toFixed(0)}%)`);
    console.log('usage: node ops-particles.mjs <Class> [מילה-עברית]');
    process.exit(0);
  }
  const r = particlesFor(cls, w);
  console.log(`${cls}: ${r.ops.length} פעולות-יסוד · ${r.lines.length} חלקיקים`);
  for (const l of r.lines) console.log('  ' + l);
  console.log(`  דורשות שם-שדה (מתג): ${r.skipped.length} — ${r.skipped.slice(0, 10).join(', ')}`);
}
