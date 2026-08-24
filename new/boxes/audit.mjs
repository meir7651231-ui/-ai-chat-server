/** קופסת-חיבורים · ביקורת-תקינות-הנתונים (lib-audit). חוזה: audit.contract.md
 *  חמשת חוטי maor/src/lib/audit.ts מחווטים לפי גרף-המקור
 *  (box-drafts/lib-audit.box-draft.md): runAudit ⇐ termOf · normName ·
 *  validIsraeliId · phoneIssue · ageOf · supporterAggregates (שקע-deps);
 *  normName ⇐ normSearch (תפר validate.ts:66); שאר החוטים עצמאיים.
 *  שקע-IO יחיד: שעון-המכונה — runAudit מקבל now מוזרק (ברירת-מחדל
 *  new Date(), נאמן-למקור families/lib.ts:30 שבו ageOf קורא לשעון בעצמו).
 *  todayIso נשאר פרמטר-מוזרק כלשון-המקור (audit.ts:78; הקורא AuditSection.tsx:32
 *  מזרים isoToday()). */
import { AUDIT_CAT_COLORS } from '../atoms/audit-cat-colors.mjs';
import { AUDIT_CATEGORIES } from '../atoms/audit-categories.mjs';
import { phoneIssue } from '../atoms/phone-issue.mjs';
import { runAudit as runAuditWire } from '../atoms/run-audit.mjs';
import { auditReportLines } from '../atoms/audit-report-lines.mjs';
import { termOf } from '../atoms/term-of.mjs';
import { normName as normNameWire } from '../atoms/norm-name.mjs';
import { normSearch } from '../atoms/norm-search.mjs';
import { validIsraeliId } from '../atoms/valid-israeli-id.mjs';
import { ageOf } from '../atoms/age-of.mjs';
import { supporterAggregates } from '../atoms/supporter-aggregates.mjs';

// ── החיווט ──
// תפר-הנרמול: normName של המקור = normSearch + הסרת-רווחים (validate.ts:65-67).
const wiredNormName = (t) => normNameWire(t, normSearch);

// הכרעות-ברירת-המחדל חיות כאן, כלשון חתימת-המקור (audit.ts:78):
// todayIso = '' (⇒ בדיקת יעד-הקשר מדולגת) · extra = true (הביקורת המורחבת דלוקה).
export function runAudit(db, todayIso = '', extra = true, config = undefined, now = new Date()) {
  return runAuditWire(db, todayIso, extra, config, {
    termOf,
    normName: wiredNormName,
    validIsraeliId,
    phoneIssue,
    ageOf: (birth) => ageOf(birth, now),
    supporterAggregates,
  });
}

// חוטים בלי-שקעים + קבועי-התצוגה — מוגשים כמות-שהם (החיווט: בחירת-האטום בלבד)
export { AUDIT_CAT_COLORS, AUDIT_CATEGORIES, phoneIssue, auditReportLines };
