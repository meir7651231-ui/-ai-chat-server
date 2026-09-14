// gen/lang.mjs — ידע-השפה כדאטה (§19: אפס מילה-עברית במנוע). נקרא מאטומי-הדאטה של המחצב אם ישנם,
// ואם לא — מהצילום המקומי lang.data.json (שמתעדכן בכל טעינה מוצלחת). קריאת-קבצים בלבד, אפס import.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const KEYS_NL = ['leadins', 'fieldMarks', 'introMarks', 'listConj', 'pluralSuffixes', 'eachWords', 'impliedMark'];
const KEYS_SPEC = ['typeDate', 'typeNum', 'typePhone', 'typePercent', 'typeMultiline', 'sectionMarkers', 'stagePrefixes'];
export function loadLang() {
  const nl = path.join(ROOT, 'machtzev/generator/nl-lang.data.json'), sp = path.join(ROOT, 'machtzev/generator/spec-lang.data.json');
  const snap = path.join(HERE, 'lang.data.json');
  if (fs.existsSync(nl) && fs.existsSync(sp)) {
    const a = JSON.parse(fs.readFileSync(nl, 'utf8')), b = JSON.parse(fs.readFileSync(sp, 'utf8'));
    const L = { _: 'צילום מ-machtzev/generator/{nl-lang,spec-lang}.data.json — מתעדכן אוטומטית ב-build/studio; לא לערוך ביד', extra: { leadins: ['להם', 'לה', 'לו', 'שלהם', 'שלה', 'שלו', 'שכולל', 'שכוללת'], eachWords: ['כל'], dativeAfter: ['אפליקציה', 'אפליקציית', 'מערכת', 'אתר', 'תוכנה', 'תוכנת', 'כלי', 'פלטפורמה', 'מוצר'] } };
    for (const k of KEYS_NL) L[k] = a[k];
    for (const k of KEYS_SPEC) L[k] = b[k];
    fs.writeFileSync(snap, JSON.stringify(L, null, 1) + '\n');
    return L;
  }
  return JSON.parse(fs.readFileSync(snap, 'utf8'));
}
