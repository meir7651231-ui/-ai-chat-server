// gen/lenses.mjs — 12 העדשות של המנוע הישיבתי על ישות: לכל עדשה בדיקה מכנית האם הספק/הדאטה עונים לשאלה. אם לא — השאלה פתוחה.
// המנוע שואל; הוא לא עונה. עדשה מסוג no-grammar פתוחה תמיד, כי אין דרך לכתוב את התשובה בספק — זה פער במחולל, לא בתוכנית.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LDATA = JSON.parse(fs.readFileSync(path.join(HERE, 'lenses.data.json'), 'utf8'));
export const LENSES = LDATA.lenses;
export const MONEY_WORDS = LDATA.moneyWords || [];
export const COMPUTED = LDATA.computedWords || { words: [], suffixes: [] };

// ישות-כסף: שדה מספרי/נוסחה ששמו מכיל מילת-כסף (מהדאטה) — התאמת-מילה שלמה, לא תת-מחרוזת («מוסך» ≠ «סך»)
const wordsOf = (name) => name.split(/[\s\-]+/).filter(Boolean);
export const isMoneyField = (f) => (f.shape === 'number' || f.shape === 'formula') && wordsOf(f.name).some((w) => MONEY_WORDS.includes(w) || MONEY_WORDS.includes(w.replace(/^[בלמהוכש]/, '')));
const isMoney = (e) => e.fields.some(isMoneyField);
// שדה-מחושב: מילה שלמה מרשימת-החישוב או סיומת «שנותרו»
export const isComputedName = (name) => wordsOf(name).some((w) => COMPUTED.words.includes(w)) || COMPUTED.suffixes.some((sfx) => name.endsWith(sfx));
const hasWordAny = (e, words) => hasWord(e, words) || (e.forbidden || []).some((x) => words.some((w) => x.includes(w)));
const hasWord = (e, words) => e.fields.some((f) => words.some((w) => f.name === w || f.name.split(' ').includes(w)));

/** e: ישות (fields[{name,shape}], stages[], guards[]) · ctx: { automations[], faces[{name,what}], roles[{name,all,ents}], kpiEntities:Set } ⇒ [{lens, open, why}] */
export function applyLenses(e, ctx) {
  return LENSES.map((L) => {
    let open = false, why = '';
    switch (L.kind) {
      case 'automation-mentions': open = !e.moment && !(ctx.automations || []).some((a) => a.includes(e.name)); why = open ? 'אף אוטומציה לא מזכירה את הישות — לא כתוב מה מדליק אותה' : ''; break;
      case 'stages-min': open = (e.stages || []).length < (L.min || 3); why = open ? `${(e.stages || []).length} שלבים — אין מחזור-חיים מלא (התחלה · אמצע · סוף · כישלון)` : ''; break;
      case 'has-field-word': open = !hasWord(e, L.words); why = open ? `אין שדה מהסוג: ${L.words.slice(0, 4).join(' / ')}` : ''; break;
      case 'face-mentions': open = !(e.screens || []).length && !(ctx.faces || []).some((f) => (f.name + ' ' + f.what).includes(e.name)); why = open ? 'אף מסך-תפקיד לא מזכיר את הישות' : ''; break;
      case 'no-grammar': open = true; why = L.gap; break;
      case 'fix-policy': open = !e.fix; why = open ? 'אין מדיניות-תיקון (מי מתקן, עד מתי)' : ''; break;
      case 'has-field-or-forbidden-word': open = !hasWordAny(e, L.words); why = open ? `לא שדה ולא איסור מהסוג: ${L.words.slice(0, 4).join(' / ')}` : ''; break;
      case 'forbidden-list': open = !(e.forbidden || []).length; why = open ? 'אין רשימת «אסור» לישות' : ''; break;
      case 'money-needs-ref': open = isMoney(e) && !hasWord(e, L.words); why = open ? 'ישות-כסף בלי אסמכתא/מזהה — אין מול מה להתאים' : ''; break;
      case 'money-needs-date': open = isMoney(e) && !e.fields.some((f) => f.shape === 'date'); why = open ? 'ישות-כסף בלי תאריך — לא ניתן לסגור תקופה' : ''; break;
      case 'money-visible-to': { const seen = (ctx.roles || []).filter((r) => !r.all && L.roles.includes(r.name) && r.ents.includes(e.name)).map((r) => r.name); open = isMoney(e) && seen.length > 0; why = open ? `ישות-כסף גלויה ל: ${seen.join(', ')}` : ''; break; }
      case 'has-enum-or-stages': open = !e.fields.some((f) => f.shape === 'enum') && !(e.stages || []).length; why = open ? 'אין ערך-מנוי ואין שלבים — אין הבחנה בין מקרים' : ''; break;
      case 'has-kpi': open = !(ctx.kpiEntities || new Set()).has(e.name) && !e.fields.some((f) => ['number', 'formula', 'enum', 'count'].includes(f.shape)); why = open ? 'אין שום דבר מדיד בישות (מספר / כמות / ערך-מנוי)' : ''; break;
      default: open = false;
    }
    return { lens: L.id, name: L.name, q: L.q, open, why, grammar: L.kind === 'no-grammar' };
  });
}
