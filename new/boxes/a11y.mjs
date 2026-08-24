/** קופסת-חיבורים · נגישות (a11y) — סולם-גופן 0.8–1.6 בצעדי 0.1 + 4 מתגי ה-FAB ♿.
 *  חוזה: a11y.contract.md
 *  מקור-האמת (L4): maor-system/src/lib/a11y.ts (P2 פער 31; legacy-main-script.js:3184-3194).
 *  הקופסה טהורה כמו המקור (a11y.ts:8-9) — ההחלה על DOM/localStorage
 *  (components/settings/a11yApply.ts) = שקעי-לוח-אם של הצרכן, לא כאן. */
import { SCALE_MIN } from '../atoms/scale-min.mjs';
import { SCALE_MAX } from '../atoms/scale-max.mjs';
import { SCALE_STEP } from '../atoms/scale-step.mjs';
import { A11Y_FAB_TOGGLES } from '../atoms/a11y-fab-toggles.mjs';
import { clampScale as clampScaleAtom } from '../atoms/clamp-scale.mjs';
import { stepScale as stepScaleAtom } from '../atoms/step-scale.mjs';
import { parseAcc as parseAccAtom } from '../atoms/parse-acc.mjs';

/** קבועי-הסולם והמילון — מיוצאים מהחוטים כלשונם (a11y.ts:13-15,27-32). */
export { SCALE_MIN, SCALE_MAX, SCALE_STEP, A11Y_FAB_TOGGLES };

/** הכרעה 1: גבולות-הזום של הלגאסי מוזרקים לחוט-ההצמדה (a11y.ts:35-38);
 *  לא-מספרי ⇒ 1 (ברירת-המחדל חיה בחוט). */
export function clampScale(v) {
  return clampScaleAtom(v, SCALE_MIN, SCALE_MAX);
}

/** הכרעה 2: צעד אחד למעלה/למטה — הצעד = SCALE_STEP וההצמדה דרך clampScale
 *  המחווט-כאן (a11y.ts:44-46); העיגול-לעשירית נגד שאריות float חי בחוט. */
export function stepScale(v, dir) {
  return stepScaleAtom(v, dir, clampScale, SCALE_STEP);
}

/** פענוח JSON ההעדפות — קלט פגום/חלקי ⇒ הכול-כבוי בשקט (a11y.ts:49-58). */
export function parseAcc(raw) {
  return parseAccAtom(raw);
}
