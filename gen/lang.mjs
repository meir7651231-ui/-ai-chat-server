// gen/lang.mjs — ידע-השפה כדאטה (§19: אפס מילה-עברית במנוע). נקרא מאטומי-הדאטה של המחצב אם ישנם,
// ואם לא — מהצילום המקומי lang.data.json (שמתעדכן בכל טעינה מוצלחת). קריאת-קבצים בלבד, אפס import.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const KEYS_NL = ['leadins', 'fieldMarks', 'introMarks', 'listConj', 'pluralSuffixes', 'eachWords', 'impliedMark'];
const KEYS_SPEC = ['typeDate', 'typeNum', 'typePhone', 'typePercent', 'typeMultiline', 'sectionMarkers', 'stagePrefixes'];
/** write=false — קריאה בלבד (הדלת: מנוע 2/mavin-gen מייבאים את הידע בלי לעדכן את הצילום; ה-CLI/סטודיו ממשיכים לעדכן כמו קודם). */
export function loadLang({ write = true } = {}) {
  const nl = path.join(ROOT, 'machtzev/generator/nl-lang.data.json'), sp = path.join(ROOT, 'machtzev/generator/spec-lang.data.json');
  const snap = path.join(HERE, 'lang.data.json');
  if (fs.existsSync(nl) && fs.existsSync(sp)) {
    const a = JSON.parse(fs.readFileSync(nl, 'utf8')), b = JSON.parse(fs.readFileSync(sp, 'utf8'));
    const L = { _: 'צילום מ-machtzev/generator/{nl-lang,spec-lang}.data.json — מתעדכן אוטומטית ב-build/studio; לא לערוך ביד', extra: { leadins: ['להם', 'לה', 'לו', 'שלהם', 'שלה', 'שלו', 'שכולל', 'שכוללת', 'גם'], eachWords: ['כל'], dativeAfter: ['אפליקציה', 'אפליקציית', 'מערכת', 'אתר', 'תוכנה', 'תוכנת', 'כלי', 'פלטפורמה', 'מוצר'], countWords: ['כמות', 'מספר תלמידים', 'מיטות', 'ילדים', 'אחים במוסד', 'כישלונות ברצף', 'עותקים', 'כרטיסים', 'משתתפים', 'שעות', 'ימי לימוד', 'חזרה'], numWords: ['הנחה', 'שכר', 'יתרה', 'מלגה', 'עמלה', 'פיקדון', 'תקציב', 'מחיר כרטיס', 'דמי חבר', 'שכר דירה', 'קילומטראז'], formulaWords: { 'פחות': '-', 'ועוד': '+', 'פלוס': '+', 'כפול': '*', 'חלקי': '/' }, idWords: ['מספר', 'קוד', 'מזהה', 'מספר זהות', 'תעודת זהות', 'ת"ז', 'חפ', 'ח"פ'], expiryWords: ['תוקף'], expiryWarnDays: 30, guardPhrases: ['אפשר לעבור ל', 'מעבר ל', 'עוברים ל'], guardOnly: ['רק אם', 'רק כש', 'רק כאשר'], forbidVerbs: { 'למחוק': 'מחיקה', 'לשנות': 'שינוי', 'לשלוח': 'שליחת', 'להפקיד': 'הפקדת', 'לגבות': 'גביית', 'לחשוף': 'חשיפת' }, roleSee: ['רואה', 'רואים', 'עורך', 'עורכים'], singular: ['בעלים', 'מיטות', 'כמות', 'דחיפות', 'זכויות', 'איכות', 'כשרות', 'בריאות', 'נוכחות', 'עלות', 'זהות', 'אחריות', 'סודיות', 'ותק', 'חובות', 'ערבות', 'בטיחות', 'שירות', 'הרשאות', 'זמינות', 'רשות', 'מהות', 'משפחתיות', 'התנהגות', 'יהדות', 'חסידות'] } };
    for (const k of KEYS_NL) L[k] = a[k];
    for (const k of KEYS_SPEC) L[k] = b[k];
    if (write) fs.writeFileSync(snap, JSON.stringify(L, null, 1) + '\n');
    return L;
  }
  return JSON.parse(fs.readFileSync(snap, 'utf8'));
}
