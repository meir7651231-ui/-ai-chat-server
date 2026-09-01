/** קופסת-חיבורים · דו"ח מותאם. חוזה: custom-export.contract.md
 *  ההלחמות-לשעבר מ-customExport.ts (config·ayin·hebrew·eventMeta·courses/lib·
 *  supporters/lib) — עכשיו חיווט גלוי אחד מאטומים בלבד (חוק-2/3).
 *  שקע-IO יחיד: nowMs (טריות-supScore) — מוזרק אופציונלי; חסר ⇒ Date.now()
 *  בתוך האטום, ביט-זהה למקור. */
import { expFieldDefs as __pure_expFieldDefs } from '../atoms/exp-field-defs.mjs';
import { EXP_FIELD_DEFS_T as __d_expFieldDefs_EXP_FIELD_DEFS_T } from '../atoms/exp-field-defs-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const expFieldDefsAtom = (...a) => __pure_expFieldDefs(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_expFieldDefs_EXP_FIELD_DEFS_T);
import { overrideColumn as overrideColumnAtom } from '../atoms/override-column.mjs';
import { buildCustomExport as __pure_buildCustomExport } from '../atoms/build-custom-export.mjs';
import { CAP_DAYS as __d_build_custom_export_CAP_DAYS } from '../atoms/build-custom-export-data.mjs';
import { BUILD_CUSTOM_EXPORT_T as __d_buildCustomExport_BUILD_CUSTOM_EXPORT_T } from '../atoms/build-custom-export-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const buildCustomExportAtom = (...a) => __pure_buildCustomExport(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_buildCustomExport_BUILD_CUSTOM_EXPORT_T, __d_build_custom_export_CAP_DAYS);
import { featureOn as featureOnAtom } from '../atoms/feature-on.mjs';
import { moduleOn } from '../atoms/module-on.mjs';
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);
import { featLabel as __pure_featLabel } from '../atoms/feat-label.mjs';
import { FEAT_LABEL_T as __d_featLabel_FEAT_LABEL_T } from '../atoms/feat-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const featLabelAtom = (...a) => __pure_featLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_featLabel_FEAT_LABEL_T);
import { itemLabel as __pure_itemLabel } from '../atoms/item-label.mjs';
import { ITEM_LABEL_T as __d_itemLabel_ITEM_LABEL_T } from '../atoms/item-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const itemLabelAtom = (...a) => __pure_itemLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_itemLabel_ITEM_LABEL_T);
import { unitLabel as __pure_unitLabel } from '../atoms/unit-label.mjs';
import { UNIT_LABEL_T as __d_unitLabel_UNIT_LABEL_T } from '../atoms/unit-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const unitLabelAtom = (...a) => __pure_unitLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_unitLabel_UNIT_LABEL_T);
import { stageLabel as __pure_stageLabel } from '../atoms/stage-label.mjs';
import { STAGE_LABEL_T as __d_stageLabel_STAGE_LABEL_T } from '../atoms/stage-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const stageLabelAtom = (...a) => __pure_stageLabel(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_stageLabel_STAGE_LABEL_T);
import { sessionsOf } from '../atoms/sessions-of.mjs';
import { enrollCount as __pure_enrollCount } from '../atoms/enroll-count.mjs';
import { ENROLL_COUNT_T as __d_enrollCount_ENROLL_COUNT_T } from '../atoms/enroll-count-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const enrollCount = (...a) => __pure_enrollCount(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_enrollCount_ENROLL_COUNT_T);
import { hebParts as __pure_hebParts } from '../atoms/heb-parts.mjs';
import { HEB_PARTS_T as __d_hebParts_HEB_PARTS_T } from '../atoms/heb-parts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebParts = (...a) => __pure_hebParts(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hebParts_HEB_PARTS_T);
import { hebAnnualEq as __pure_hebAnnualEq } from '../atoms/heb-annual-eq.mjs';
import { HEB_ANNUAL_EQ_T as __d_hebAnnualEq_HEB_ANNUAL_EQ_T } from '../atoms/heb-annual-eq-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebAnnualEqAtom = (...a) => __pure_hebAnnualEq(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_hebAnnualEq_HEB_ANNUAL_EQ_T);
import { hebDateFull as __pure_hebDateFull } from '../atoms/heb-date-full.mjs';
import { HEB_DATE_FULL_T as __d_hebDateFull_HEB_DATE_FULL_T } from '../atoms/heb-date-full-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebDateFullAtom = (...a) => __pure_hebDateFull(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_hebDateFull_HEB_DATE_FULL_T);
import { gem as __pure_gem } from '../atoms/gematria.mjs';
import { GEMATRIA_T as __d_gem_GEMATRIA_T } from '../atoms/gematria-strings.mjs';
import { U, T, H } from '../atoms/gematria-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gem = (...a) => __pure_gem(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H, __d_gem_GEMATRIA_T);
import { gemYear as __pure_gemYear } from '../atoms/gem-year.mjs';
import { GEM_YEAR_T as __d_gem_year_T } from '../atoms/gem-year-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gemYearAtom = (...a) => __pure_gemYear(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_gem_year_T);
import { supCount } from '../atoms/sup-count.mjs';
import { supIls } from '../atoms/sup-ils.mjs';
import { supUsd } from '../atoms/sup-usd.mjs';
import { supLast } from '../atoms/sup-last.mjs';
import { supTotalIls as supTotalIlsAtom } from '../atoms/sup-total-ils.mjs';
import { supScore as __pure_supScore } from '../atoms/sup-score.mjs';
import { SUP_SCORE_T as __d_sup_score_T } from '../atoms/sup-score-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const supScoreAtom = (...a) => __pure_supScore(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_sup_score_T);
import { supTier as __pure_supTier } from '../atoms/sup-tier.mjs';
import { SUP_TIER_T as __d_supTier_SUP_TIER_T } from '../atoms/sup-tier-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supTier = (...a) => __pure_supTier(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_supTier_SUP_TIER_T);
import { EV_META } from '../atoms/ev-meta.mjs';
import { DAY_NAMES } from '../atoms/day-names.mjs';
import { NAV_MODULE_KEYS } from '../atoms/nav-module-keys.mjs';
import { HEB_CAL } from '../atoms/heb-cal-data.mjs';
import { CUSTOM_EXPORT_TERMS } from '../atoms/custom-export-terms.mjs';

// ── הכרעות-הקופסה (חיווט-הצבה, verbatim מהמקור) ──
// תשעת מודולי-הניווט הניתנים-לכיבוי — maor/src/lib/config.ts:20-30
// אירועים החוזרים שנתית לפי התאריך העברי — maor/src/types/domain.ts:363-367
const HEBREW_RECURRING = new Set([CUSTOM_EXPORT_TERMS.k1, CUSTOM_EXPORT_TERMS.k2, CUSTOM_EXPORT_TERMS.k3]);

// ── חיווט-שכנים (השקעים של האטומים ⇐ אטומים אחרים) ──
const featureOn = (cfg, key) => featureOnAtom(cfg, key, NAV_MODULE_KEYS, moduleOn);
const featLabel = (cfg) => featLabelAtom(cfg, termOf);
const itemLabel = (cfg) => itemLabelAtom(cfg, termOf);
const unitLabel = (cfg) => unitLabelAtom(cfg, termOf);
const stageLabel = (cfg, stage) => stageLabelAtom(cfg, stage, termOf);
const gemYear = (y) => gemYearAtom(y, gem);
const hebDateFull = (iso) => hebDateFullAtom(iso, gem, gemYear, hebParts);
const supTotalIls = (sp, rate) => supTotalIlsAtom(sp, rate, supIls, supUsd);

// מטמון פר-שנה-עברית (רצף-חודשים + has30) — חיווט-השכן של hebAnnualEq,
// verbatim מ-maor/src/lib/hebrew.ts:60-77 על אטום-hebParts.
const hebYearScan = new Map();
function scanHebYear(hebYear) {
  const hit = hebYearScan.get(hebYear);
  if (hit) return hit;
  const seq = [];
  const has30 = new Set();
  const gy = hebYear - HEB_CAL.hebYearOffset; // 1 באוגוסט של השנה הזו קודם תמיד לא' תשרי של hebYear
  for (let i = 0; i < HEB_CAL.scanWindowDays; i++) {
    const p = hebParts(new Date(gy, 7, 1 + i, HEB_CAL.noonHour));
    if (p.year !== hebYear) continue;
    if (!seq.includes(p.month)) seq.push(p.month);
    if (p.day === HEB_CAL.longLen) has30.add(p.month);
  }
  const res = { seq, has30 };
  hebYearScan.set(hebYear, res);
  return res;
}
const hebAnnualEq = (anchor, query) => hebAnnualEqAtom(anchor, query, scanHebYear);

// ── החשיפה (חתימות-המקור) ──
export function expFieldDefs(cfg, target) {
  return expFieldDefsAtom(cfg, target, featureOn, termOf, featLabel, itemLabel, unitLabel);
}

export const overrideColumn = (rows, colIdx, overrides) => overrideColumnAtom(rows, colIdx, overrides);

export function buildCustomExport(cfg, db, target, range, selectedKeys, nowMs) {
  // supScore: המקור קורא supScore(sp, db.usdRate) עם Date.now() פנימי;
  // nowMs (שקע-IO) מוזרק רק כשהקורא מבקש דטרמיניזם — חסר ⇒ התנהגות-המקור.
  const supScore = (sp, rate) => supScoreAtom(sp, rate, nowMs, supTotalIls, supLast, supCount);
  return buildCustomExportAtom(cfg, db, target, range, selectedKeys, {
    expFieldDefs: (c, t) => expFieldDefs(c, t),
    featureOn,
    termOf,
    sessionsOf,
    enrollCount,
    hebParts,
    hebAnnualEq,
    hebDateFull,
    supCount,
    supIls,
    supUsd,
    supScore,
    supTier,
    stageLabel,
    EV_META,
    HEBREW_RECURRING,
    DAY_NAMES,
  });
}
