/** 📦 קופסת-זיהוי-השיחה (callerId) — "מי מתקשר": התאמת-מספר טהורה על אנשי-הקשר
 *  השמורים (משפחה→בן-משפחה→תורם→מתנדב→רכז) + תווית-סוג דרך מילון-המונחים +
 *  הקשר-משפחה לכרטיס-השיחה. ‏downstream טהור: המספר מגיע מ-#call=/הקלדה — אין API-ספק.
 *  חוקי-הקופסה (חוק-2): כאן ורק כאן נפגשים החוטים. */
import { phoneKey } from '../atoms/phone-key.mjs';
import { findCaller as __pure_findCaller } from '../atoms/find-caller.mjs';
import { FIND_CALLER_T as __d_findCaller_FIND_CALLER_T } from '../atoms/find-caller-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const findCaller = (...a) => __pure_findCaller(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_findCaller_FIND_CALLER_T);
import { callerKindLabel as __pure_callerKindLabel } from '../atoms/caller-kind-label.mjs';
import { CALLER_KIND_LABEL_T as __d_callerKindLabel_CALLER_KIND_LABEL_T } from '../atoms/caller-kind-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const callerKindLabel = (...a) => __pure_callerKindLabel(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_callerKindLabel_CALLER_KIND_LABEL_T);
import { familyContext as __pure_familyContext } from '../atoms/family-context.mjs';
import { FAMILY_CONTEXT_T as __d_familyContext_FAMILY_CONTEXT_T } from '../atoms/family-context-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const familyContext = (...a) => __pure_familyContext(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_familyContext_FAMILY_CONTEXT_T);
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);

export { phoneKey, familyContext };

/** הכרעת-החיווט: שקע-הנירמול של המאתר = phone-key (ניכוי 972/0, ספרות-בלבד). */
export const identifyCaller = (db, rawNumber) => findCaller(db, rawNumber, phoneKey);

/** תווית-הסוג דרך מילון-המונחים של הארגון (white-label — ‏termOf האמיתי מחווט). */
export const kindLabel = (cfg, kind) => callerKindLabel(cfg, kind, termOf);

/** כרטיס-שיחה שלם: מתקשר + תווית + הקשר-משפחה (כשזה משפחה/בן-משפחה). */
export function screenPop(db, cfg, rawNumber) {
  const caller = identifyCaller(db, rawNumber);
  if (!caller) return null;
  const label = kindLabel(cfg, caller.kind);
  const famId = caller.kind === 'family' ? caller.id : caller.kind === 'member' ? caller.famId : null;
  return { ...caller, label, context: famId ? familyContext(db, famId) : null };
}
