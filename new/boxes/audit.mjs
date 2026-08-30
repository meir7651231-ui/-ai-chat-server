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
import { phoneIssue as __pure_phoneIssue } from '../atoms/phone-issue.mjs';
import { PHONE_ISSUE_T as __d_phoneIssue_PHONE_ISSUE_T } from '../atoms/phone-issue-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const phoneIssue = (...a) => __pure_phoneIssue(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_phoneIssue_PHONE_ISSUE_T);
import { runAudit as __pure_runAudit } from '../atoms/run-audit.mjs';
import { RUN_AUDIT_T as __d_runAudit_RUN_AUDIT_T } from '../atoms/run-audit-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const runAuditWire = (...a) => __pure_runAudit(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_runAudit_RUN_AUDIT_T);
import { auditReportLines as __pure_auditReportLines } from '../atoms/audit-report-lines.mjs';
import { AUDIT_REPORT_LINES_T as __d_auditReportLines_AUDIT_REPORT_LINES_T } from '../atoms/audit-report-lines-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const auditReportLines = (...a) => __pure_auditReportLines(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_auditReportLines_AUDIT_REPORT_LINES_T);
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);
import { normName as normNameWire } from '../atoms/norm-name.mjs';
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
import { validIsraeliId as __pure_validIsraeliId } from '../atoms/valid-israeli-id.mjs';
import { VALID_ISRAELI_ID_T as __d_valid_israeli_id_T } from '../atoms/valid-israeli-id-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const validIsraeliId = (...a) => __pure_validIsraeliId(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_valid_israeli_id_T);
import { ageOf as __pure_ageOf } from '../atoms/age-of.mjs';
import { AGE_OF_T as __d_age_of_T } from '../atoms/age-of-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const ageOf = (...a) => __pure_ageOf(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_age_of_T);
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
