/** קופסת-חיבורים · עוזר-AI (lib-ai). חוזה: lib-ai.contract.md
 *  ההלחמה-לשעבר מ-maor/src/lib/ai.ts (הרחבת 🤖 ai, "עד-המפתח") — כספת-המפתח
 *  המקומית, בונה-פרומפט-התודה, והקריאה ל-Claude — עכשיו חיווט גלוי אחד.
 *  הקופסה מייבאת אטומים בלבד (חוק-2/3); שקעי-IO אמיתיים (nsLsKey, storage, doFetch)
 *  מוזרקים כפרמטרים ואינם ממומשים כאן. */
import { thanksPrompt as __pure_thanksPrompt } from '../atoms/thanks-prompt.mjs';
import { THANKS_PROMPT_T as __d_thanksPrompt_THANKS_PROMPT_T } from '../atoms/thanks-prompt-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const thanksPromptAtom = (...a) => __pure_thanksPrompt(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_thanksPrompt_THANKS_PROMPT_T);
import { askClaude as askClaudeAtom } from '../atoms/ask-claude.mjs';

// ── הכרעות-החיווט של הקופסה (מילון-הקבועים) ──
// בסיס-מפתח-הכספת. המפתח **מקומי-למכשיר בלבד** (בדיוק כמו נעילת-ה-PIN — לא בקונפיג,
// לא בענן, לא בגיבוי); ה-nsLsKey (ממרחב-השמות) עוטף אותו לתחום-הארגון בזמן-הצבה.
// חוק-6: זו קונפיגורציית-הצבה (שם-מפתח-אחסון), חיה בחיווט. המקור: ai.ts:13.
const KEY_BASE = 'maor_ai_key';

/** קריאת-מפתח-ה-API מהכספת המקומית. שקעים מוזרקים: nsLsKey (מרחב-שם) ·
 *  storage (localStorage-דמוי). חסר ⇒ '' (הכפתור לא מוצג — דורמנטי). storage
 *  שזורק (מצב-פרטי) ⇒ '' בשקט. המקור: ai.ts:15-21. */
export function readAiKey(nsLsKey, storage) {
  try {
    return storage.getItem(nsLsKey(KEY_BASE)) ?? '';
  } catch {
    return '';
  }
}

/** כתיבת-מפתח-ה-API לכספת המקומית. שקעים מוזרקים: nsLsKey · storage. הקלט נגזם;
 *  ריק-אחרי-גזימה ⇒ מחיקת-המפתח (כיבוי ההרחבה); אחרת שמירה. storage חסום
 *  (מצב-פרטי, זריקה) ⇒ נבלע בשקט. המקור: ai.ts:23-31. */
export function writeAiKey(nsLsKey, storage, key) {
  try {
    const t = key.trim();
    if (t) storage.setItem(nsLsKey(KEY_BASE), t);
    else storage.removeItem(nsLsKey(KEY_BASE));
  } catch {
    /* localStorage חסום */
  }
}

/** בונה-הפרומפט למכתב-תודה-לתורם — טהור, כלשונו מהחוט. המקור: ai.ts:46-55. */
export function thanksPrompt(inp) {
  return thanksPromptAtom(inp);
}

/** קריאה ל-Claude מהדפדפן — פרומפט ⇒ טקסט גזום או שגיאה בעברית. שכבת-הרשת
 *  (doFetch) = שקע-מוזרק; ברירת-מחדל fetch הגלובלי. חוק-6: apiKey מוזרק ואינו
 *  נשמר בקופסה. המקור: ai.ts:61-86. */
export function askClaude(apiKey, prompt, doFetch = fetch) {
  return askClaudeAtom(apiKey, prompt, doFetch);
}
