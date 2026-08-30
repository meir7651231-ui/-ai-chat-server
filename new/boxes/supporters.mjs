/** קופסת-חיבורים · תומכים (components-supporters). חוזה: supporters.contract.md
 *  מקור-האמת: maor/src/components/supporters/lib.ts (L4). זו הנקודה היחידה שבה
 *  41 חוטי-התומכים נפגשים (חוקי-החשמלאי, LAW.md) — הכרעות (סדר, ברירות-מחדל,
 *  מילון-תוויות) חיות כאן; שקעי-IO אמיתיים (שעון/מזהה/קונפיג) = פרמטרים מוזרקים. */

// ── חוטי-התומכים (new/atoms) ──
import { fmtDate } from '../atoms/fmt-date.mjs';
import { supporterPurposes } from '../atoms/supporter-purposes.mjs';
import { supporterVisibleForDesignations } from '../atoms/supporter-visible-for-designations.mjs';
import { allDonationPurposes as allDonationPurposesAtom } from '../atoms/all-donation-purposes.mjs';
import { supIls } from '../atoms/sup-ils.mjs';
import { supUsd } from '../atoms/sup-usd.mjs';
import { supCount } from '../atoms/sup-count.mjs';
import { supLast } from '../atoms/sup-last.mjs';
import { supLastInPeriod as supLastInPeriodAtom } from '../atoms/sup-last-in-period.mjs';
import { supTotalIls as supTotalIlsAtom } from '../atoms/sup-total-ils.mjs';
import { supScore as supScoreAtom } from '../atoms/sup-score.mjs';
import { supTier as __pure_supTier } from '../atoms/sup-tier.mjs';
import { SUP_TIER_T as __d_supTier_SUP_TIER_T } from '../atoms/sup-tier-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supTier = (...a) => __pure_supTier(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_supTier_SUP_TIER_T);
import { TIER_ORDER } from '../atoms/tier-order.mjs';
import { supScoreBins as supScoreBinsAtom } from '../atoms/sup-score-bins.mjs';
import { supAvgDon as supAvgDonAtom } from '../atoms/sup-avg-don.mjs';
import { sup12m as sup12mAtom } from '../atoms/sup12m.mjs';
import { chipStyle as __pure_chipStyle } from '../atoms/chip-style.mjs';
import { CHIP_STYLE_T as __d_chipStyle_CHIP_STYLE_T } from '../atoms/chip-style-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const chipStyle = (...a) => __pure_chipStyle(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_chipStyle_CHIP_STYLE_T);
import { fixPhone as fixPhoneAtom } from '../atoms/fix-phone.mjs';
import { totalLabel as totalLabelAtom } from '../atoms/total-label.mjs';
import { supDonEvents as __pure_supDonEvents } from '../atoms/sup-don-events.mjs';
import { SUP_DON_EVENTS_T as __d_supDonEvents_SUP_DON_EVENTS_T } from '../atoms/sup-don-events-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supDonEventsAtom = (...a) => __pure_supDonEvents(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_supDonEvents_SUP_DON_EVENTS_T);
import { personalCalEntries as __pure_personalCalEntries } from '../atoms/personal-cal-entries.mjs';
import { PERSONAL_CAL_ENTRIES_T as __d_personalCalEntries_PERSONAL_CAL_ENTRIES_T } from '../atoms/personal-cal-entries-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const personalCalEntriesAtom = (...a) => __pure_personalCalEntries(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_personalCalEntries_PERSONAL_CAL_ENTRIES_T);
import { orgCalEntries as __pure_orgCalEntries } from '../atoms/org-cal-entries.mjs';
import { ORG_CAL_ENTRIES_T as __d_orgCalEntries_ORG_CAL_ENTRIES_T } from '../atoms/org-cal-entries-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const orgCalEntriesAtom = (...a) => __pure_orgCalEntries(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_orgCalEntries_ORG_CAL_ENTRIES_T);
import { donCalMonthLine as __pure_donCalMonthLine } from '../atoms/don-cal-month-line.mjs';
import { DON_CAL_MONTH_LINE_T as __d_donCalMonthLine_DON_CAL_MONTH_LINE_T } from '../atoms/don-cal-month-line-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const donCalMonthLineAtom = (...a) => __pure_donCalMonthLine(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_donCalMonthLine_DON_CAL_MONTH_LINE_T);
import { normName as normNameAtom } from '../atoms/norm-name.mjs';
import { SUP_NAME_KEYS } from '../atoms/sup-name-keys.mjs';
import { excelSerialToIso } from '../atoms/excel-serial-to-iso.mjs';
import { parseSupporterGrid as __pure_parseSupporterGrid } from '../atoms/parse-supporter-grid.mjs';
import { PARSE_SUPPORTER_GRID_T as __d_parseSupporterGrid_PARSE_SUPPORTER_GRID_T } from '../atoms/parse-supporter-grid-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const parseSupporterGridAtom = (...a) => __pure_parseSupporterGrid(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_parseSupporterGrid_PARSE_SUPPORTER_GRID_T);
import { parseSupporterCsv as parseSupporterCsvAtom } from '../atoms/parse-supporter-csv.mjs';
import { applyAyinNames as applyAyinNamesAtom } from '../atoms/apply-ayin-names.mjs';
import { mergeHist } from '../atoms/merge-hist.mjs';
import { planSupporterImport as planSupporterImportAtom } from '../atoms/plan-supporter-import.mjs';
import { mergeSupporterRow as mergeSupporterRowAtom } from '../atoms/merge-supporter-row.mjs';
import { newSupporterFromRow as newSupporterFromRowAtom } from '../atoms/new-supporter-from-row.mjs';
import { HOK_CAT } from '../atoms/hok-cat.mjs';
import { hokEffectivelyActive as __pure_hokEffectivelyActive } from '../atoms/hok-effectively-active.mjs';
import { HOK_EFFECTIVELY_ACTIVE_T as __d_hokEffectivelyActive_HOK_EFFECTIVELY_ACTIVE_T } from '../atoms/hok-effectively-active-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hokEffectivelyActive = (...a) => __pure_hokEffectivelyActive(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_hokEffectivelyActive_HOK_EFFECTIVELY_ACTIVE_T);
import { hokRecordedThisMonth as __pure_hokRecordedThisMonth } from '../atoms/hok-recorded-this-month.mjs';
import { HOK_EFFECTIVELY_ACTIVE_T as __d_hokRecordedThisMonth_HOK_RECORDED_THIS_MONTH_T } from '../atoms/hok-effectively-active-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hokRecordedThisMonthAtom = (...a) => __pure_hokRecordedThisMonth(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_hokRecordedThisMonth_HOK_RECORDED_THIS_MONTH_T);
import { hokDue as hokDueAtom } from '../atoms/hok-due.mjs';
import { hokMonthlyTotal as hokMonthlyTotalAtom } from '../atoms/hok-monthly-total.mjs';
import { hokMethodLabel as __pure_hokMethodLabel } from '../atoms/hok-method-label.mjs';
import { HOK_METHOD_LABEL_T as __d_hokMethodLabel_HOK_METHOD_LABEL_T } from '../atoms/hok-method-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hokMethodLabel = (...a) => __pure_hokMethodLabel(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hokMethodLabel_HOK_METHOD_LABEL_T);

// ── חוטי-מודולים-אחרים (אטומים חיצוניים; קריאות-שכן ⇒ שקע, LAW חוק-1/3) ──
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
import { formatIsraeliPhone } from '../atoms/format-israeli-phone.mjs';
import { parseAnyDate } from '../atoms/parse-any-date.mjs';
import { parseCsv } from '../atoms/parse-csv.mjs';
import { planAddName as __pure_planAddName } from '../atoms/plan-add-name.mjs';
import { PLAN_ADD_NAME_T as __d_planAddName_PLAN_ADD_NAME_T } from '../atoms/plan-add-name-strings.mjs';
import { SUPPORTERS_TERMS } from '../atoms/supporters-terms.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const planAddNameAtom = (...a) => __pure_planAddName(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_planAddName_PLAN_ADD_NAME_T);

// ── שקעי-IO (מוזרקים, לא ממומשים כאן) ──────────────────────────────────────
// clockIso: () => 'YYYY-MM-DD' — שעון-מקומי. Date.now (בציון) — שעון-מערכת.
// שניהם IO אמיתי; ברירת-המחדל שומרת את התנהגות-המקור (isoTodayLocal/Date.now).

// ── מילון-החלטות (חי בקופסה) ────────────────────────────────────────────────
/** ברירת-מחדל: תיק-מעקב ריק — ביט-זהה ל-domain.emptyAyin (maor types/domain.ts:598-616).
 *  ברירת-מחדל = החלטת-קופסה (LAW: תיקון-בעלים לחוק-5), לא אטום. */
function emptyAyin() {
  return {
    stage: SUPPORTERS_TERMS.k1, note: '', answeredNote: '', answerPushed: false,
    nextTalk: '', nextTalkTime: '', lastTouch: '',
    names: [], answers: [], log: [], time: [], mat: [],
  };
}

/** מדיניות-מיזוג-שדות בייבוא (a גובר; b ממלא חוסרים; hist/ayinNames מצטרפים) —
 *  ‏verbatim מ-maor/src/components/supporters/lib.ts:522-531. helper-חיווט מקומי
 *  (אין אטום fill-empty; המדיניות שייכת לקופסה, כמו הקסקדה ב-search.mjs). */
function fillEmpty(a, b) {
  const out = { ...a };
  Object.keys(b).forEach((k) => {
    if (k === SUPPORTERS_TERMS.k2) return;
    if (!out[k] && b[k]) out[k] = b[k];
  });
  if (a.hist?.length || b.hist?.length) out.hist = [...(a.hist ?? []), ...(b.hist ?? [])];
  if (a.ayinNames?.length || b.ayinNames?.length) out.ayinNames = [...(a.ayinNames ?? []), ...(b.ayinNames ?? [])];
  return out;
}

// ── החיווט (קריאות-שכן ⇒ הזרקה מכאן) ───────────────────────────────────────
const normName = (s) => normNameAtom(s, normSearch);
const fixPhone = (p) => fixPhoneAtom(p, formatIsraeliPhone);
const allDonationPurposes = (supporters) => allDonationPurposesAtom(supporters, supporterPurposes);
const supTotalIls = (sp, rate = 3.7) => supTotalIlsAtom(sp, rate, supIls, supUsd);
const supScore = (sp, rate = 3.7) => supScoreAtom(sp, rate, undefined, supTotalIls, supLast, supCount);
const supScoreBins = (supporters, rate = 3.7) => supScoreBinsAtom(supporters, rate, supScore);
const supAvgDon = (supporters, rate = 3.7) => supAvgDonAtom(supporters, rate, supTotalIls, supCount);
const sup12m = (supporters, todayIso) => sup12mAtom(supporters, todayIso, supLast);
const supLastInPeriod = (sp, year, month) => supLastInPeriodAtom(sp, year, month, supLast);
const totalLabel = (sp) => totalLabelAtom(sp, supIls, supUsd);

/** אירועי-התרומה של תומך/ת — config אופציונלי מחווט ל-termOf (בורר-המונחים).
 *  בלי config ⇒ ה-fallback העברי, ביט-זהה למקור. */
const supDonEvents = (sp, config) =>
  supDonEventsAtom(sp, config ? (k, fb) => termOf(config, k, fb) : undefined);

const personalCalEntries = (sp) => personalCalEntriesAtom(sp, (s) => supDonEvents(s));
const orgCalEntries = (supporters) => orgCalEntriesAtom(supporters, (s) => supDonEvents(s));
const donCalMonthLine = (entries, inMonth, config) => donCalMonthLineAtom(entries, inMonth, config, termOf);

/** ראוּת-רשימה פר-ייעוד: מחווט מ-supporter-visible-for-designations + מדיניות-
 *  סינון-התרומות (verbatim מ-lib.ts:81-91). האטום visible-supporters-for-
 *  designations קרא לשכן supporterVisibleForDesignations בלי שקע — לכן החיווט
 *  (filter+map) חי כאן, מעל האטום-הבודד התקין. */
const visibleSupportersForDesignations = (supporters, allowed) => {
  if (!allowed || !allowed.length) return supporters;
  const set = new Set(allowed.map((s) => s.trim()));
  return supporters
    .filter((sup) => supporterVisibleForDesignations(sup, allowed))
    .map((sup) => ({
      ...sup,
      donations: (sup.donations ?? []).filter((d) => {
        const p = (d.purpose ?? '').trim();
        return !p || set.has(p);
      }),
    }));
};

const parseSupporterGrid = (rows) => parseSupporterGridAtom(rows, SUP_NAME_KEYS, parseAnyDate, excelSerialToIso);
const parseSupporterCsv = (text) => parseSupporterCsvAtom(text, parseCsv, parseSupporterGrid);
const planSupporterImport = (rows, existing) => planSupporterImportAtom(rows, existing, normName, fillEmpty);
const mergeSupporterRow = (sp, row) => mergeSupporterRowAtom(sp, row, mergeHist, fixPhone);
const newSupporterFromRow = (id, row) => newSupporterFromRowAtom(id, row, fixPhone, mergeHist);

/** שם-לטיפול מהייבוא ⇒ תיק-המעקב. planAddName מחווט עם normName + שקע-שעון
 *  (clockIso, מוזרק); בנתיב הזה eyes='' ⇒ isoToday לעולם לא נקרא (חוזה). */
const applyAyinNames = (sp, names, mkId, clockIso) =>
  applyAyinNamesAtom(sp, names, mkId, emptyAyin,
    (a, nm, eyes, id) => planAddNameAtom(a, nm, eyes, id, normName, clockIso));

const hokRecordedThisMonth = (sp, todayIso) => hokRecordedThisMonthAtom(sp, todayIso, HOK_CAT);
const hokDue = (supporters, todayIso) => hokDueAtom(supporters, todayIso, hokEffectivelyActive, hokRecordedThisMonth);
const hokMonthlyTotal = (supporters, usdRate, todayIso) => hokMonthlyTotalAtom(supporters, usdRate, todayIso, hokEffectivelyActive);

/** שקע-שעון (IO): ISO של היום. מוזרק — הקופסה לא מממשת שעון (task §3). */
const isoToday = (clockIso) => clockIso();

// ── החשיפה ──────────────────────────────────────────────────────────────────
export {
  fmtDate, isoToday,
  supporterPurposes, supporterVisibleForDesignations, visibleSupportersForDesignations, allDonationPurposes,
  supIls, supUsd, supCount, supLast, supLastInPeriod, supTotalIls,
  supScore, supTier, TIER_ORDER, supScoreBins, supAvgDon, sup12m,
  chipStyle, fixPhone, totalLabel,
  supDonEvents, personalCalEntries, orgCalEntries, donCalMonthLine,
  normName, SUP_NAME_KEYS, excelSerialToIso, parseSupporterGrid, parseSupporterCsv,
  applyAyinNames, mergeHist, planSupporterImport, mergeSupporterRow, newSupporterFromRow,
  HOK_CAT, hokEffectivelyActive, hokRecordedThisMonth, hokDue, hokMonthlyTotal, hokMethodLabel,
};
