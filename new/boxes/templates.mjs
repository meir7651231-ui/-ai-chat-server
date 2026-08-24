/** קופסת-חיבורים · תבניות-ההודעה (templates). חוזה: templates.contract.md
 *  ההלחמה-לשעבר מ-maor/src/lib/templates.ts — מילון-התבניות, גזירת-המפתחות
 *  והרינדור (דריסת-ארגון ⇒ ברירת-מחדל ⇒ החלפת-{משתנים}) — עכשיו חיווט גלוי אחד.
 *  הקופסה טהורה: הקונפיג (cfg.templates — דריסות-הארגון מהאשף) מגיע כפרמטר;
 *  טעינתו (localStorage/ענן) ושליחת-ההודעה (wa.me) = שקעי-IO של לוח-האם. */
import { TEMPLATE_DEFS } from '../atoms/template-defs.mjs';
import { templateKeys } from '../atoms/template-keys.mjs';
import { renderTemplate as renderTemplateAtom } from '../atoms/render-template.mjs';

// ── הכרעות-החיווט של הקופסה ──
// 1) מילון-התבניות היחיד = TEMPLATE_DEFS (הנוסחים ההיסטוריים ביט-זהה; המקור: templates.ts:19-52).
//    סדר-ההגדרה קובע את סדר-המפתחות ואת סדר-ההצגה באשף.
export { TEMPLATE_DEFS };

// 2) רשימת-המפתחות נגזרת מהמילון — לעולם לא מוקלדת-ידנית (המקור: templates.ts:54).
export const TEMPLATE_KEYS = templateKeys(TEMPLATE_DEFS);

/** 3) רינדור: אותו מילון מוזרק לשקע-defs של חוט-הרינדור (המקור: templates.ts:57-66).
 *  דריסת-הארגון (cfg.templates[key]) גוברת; ריק/רווחים ⇒ ברירת-המחדל;
 *  משתנה לא-מוכר נשאר {כפי-שהוא} (גלוי למנהל ⇒ מתקן באשף). */
export function renderTemplate(cfg, key, vars) {
  return renderTemplateAtom(cfg, key, vars, TEMPLATE_DEFS);
}
