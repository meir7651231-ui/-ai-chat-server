/** 📦 קופסת-זיהוי-השיחה (callerId) — "מי מתקשר": התאמת-מספר טהורה על אנשי-הקשר
 *  השמורים (משפחה→בן-משפחה→תורם→מתנדב→רכז) + תווית-סוג דרך מילון-המונחים +
 *  הקשר-משפחה לכרטיס-השיחה. ‏downstream טהור: המספר מגיע מ-#call=/הקלדה — אין API-ספק.
 *  חוקי-הקופסה (חוק-2): כאן ורק כאן נפגשים החוטים. */
import { phoneKey } from '../atoms/phone-key.mjs';
import { findCaller } from '../atoms/find-caller.mjs';
import { callerKindLabel } from '../atoms/caller-kind-label.mjs';
import { familyContext } from '../atoms/family-context.mjs';
import { termOf } from '../atoms/term-of.mjs';

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
