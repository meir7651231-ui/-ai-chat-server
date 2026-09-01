/** 🧩 מגן-עצמאות — מוכיח ש"מערכת אחת שיכולה לחיות אחד בלי השני":
 *  · קופסאות-מאור (dart-boxes/*.dart, ללא bs-) לא מייבאות אטומי-בנייה-חכמה (../dart/).
 *  · קופסאות-בנייה-חכמה (bs-*.dart) לא מייבאות אטומי-מאור (../dart-maor/).
 *  · רק לוח-האם (board.dart) מגשר בין השניים.
 *  הפרה ⇒ exit 1. הרצה: node new/independence-check.mjs */
import { readFileSync, readdirSync } from 'node:fs';
const DIR = new URL('../../new/dart-boxes/', import.meta.url);
const files = readdirSync(DIR).filter((f) => f.endsWith('.dart') && !f.endsWith('-proof.dart') && f !== 'atoms.dart');
let viol = 0;
for (const f of files) {
  const src = readFileSync(new URL(f, DIR), 'utf8');
  const isBs = f.startsWith('bs-');
  if (!isBs && /import '\.\.\/dart\//.test(src)) { console.error(`🚨 קופסת-מאור ${f} מייבאת אטום-בנייה-חכמה`); viol++; }
  if (isBs && /import '\.\.\/dart-maor\//.test(src)) { console.error(`🚨 קופסת-בנייה-חכמה ${f} מייבאת אטום-מאור`); viol++; }
}
// הלוח רשאי לגשר; שום קופסה אחרת לא.
if (viol) { console.error(`❌ מגן-עצמאות: ${viol} הפרות — הצדדים כרוכים`); process.exit(1); }
console.log(`✓ מגן-עצמאות: ${files.length} קופסאות — אפס-חציית-ייבוא · מאור ובנייה-חכמה עצמאיים · רק הלוח מגשר`);
