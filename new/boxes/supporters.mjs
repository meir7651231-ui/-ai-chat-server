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
import { supTier } from '../atoms/sup-tier.mjs';
import { TIER_ORDER } from '../atoms/tier-order.mjs';
import { supScoreBins as supScoreBinsAtom } from '../atoms/sup-score-bins.mjs';
import { supAvgDon as supAvgDonAtom } from '../atoms/sup-avg-don.mjs';
import { sup12m as sup12mAtom } from '../atoms/sup12m.mjs';
import { chipStyle } from '../atoms/chip-style.mjs';
import { fixPhone as fixPhoneAtom } from '../atoms/fix-phone.mjs';
import { totalLabel as totalLabelAtom } from '../atoms/total-label.mjs';
import { supDonEvents as supDonEventsAtom } from '../atoms/sup-don-events.mjs';
import { personalCalEntries as personalCalEntriesAtom } from '../atoms/personal-cal-entries.mjs';
import { orgCalEntries as orgCalEntriesAtom } from '../atoms/org-cal-entries.mjs';
import { donCalMonthLine as donCalMonthLineAtom } from '../atoms/don-cal-month-line.mjs';
import { normName as normNameAtom } from '../atoms/norm-name.mjs';
import { SUP_NAME_KEYS } from '../atoms/sup-name-keys.mjs';
import { excelSerialToIso } from '../atoms/excel-serial-to-iso.mjs';
import { parseSupporterGrid as parseSupporterGridAtom } from '../atoms/parse-supporter-grid.mjs';
import { parseSupporterCsv as parseSupporterCsvAtom } from '../atoms/parse-supporter-csv.mjs';
import { applyAyinNames as applyAyinNamesAtom } from '../atoms/apply-ayin-names.mjs';
import { mergeHist } from '../atoms/merge-hist.mjs';
import { planSupporterImport as planSupporterImportAtom } from '../atoms/plan-supporter-import.mjs';
import { mergeSupporterRow as mergeSupporterRowAtom } from '../atoms/merge-supporter-row.mjs';
import { newSupporterFromRow as newSupporterFromRowAtom } from '../atoms/new-supporter-from-row.mjs';
import { HOK_CAT } from '../atoms/hok-cat.mjs';
import { hokEffectivelyActive } from '../atoms/hok-effectively-active.mjs';
import { hokRecordedThisMonth as hokRecordedThisMonthAtom } from '../atoms/hok-recorded-this-month.mjs';
import { hokDue as hokDueAtom } from '../atoms/hok-due.mjs';
import { hokMonthlyTotal as hokMonthlyTotalAtom } from '../atoms/hok-monthly-total.mjs';
import { hokMethodLabel } from '../atoms/hok-method-label.mjs';

// ── חוטי-מודולים-אחרים (אטומים חיצוניים; קריאות-שכן ⇒ שקע, LAW חוק-1/3) ──
import { termOf } from '../atoms/term-of.mjs';
import { normSearch } from '../atoms/norm-search.mjs';
import { formatIsraeliPhone } from '../atoms/format-israeli-phone.mjs';
import { parseAnyDate } from '../atoms/parse-any-date.mjs';
import { parseCsv } from '../atoms/parse-csv.mjs';
import { planAddName as planAddNameAtom } from '../atoms/plan-add-name.mjs';

// ── שקעי-IO (מוזרקים, לא ממומשים כאן) ──────────────────────────────────────
// clockIso: () => 'YYYY-MM-DD' — שעון-מקומי. Date.now (בציון) — שעון-מערכת.
// שניהם IO אמיתי; ברירת-המחדל שומרת את התנהגות-המקור (isoTodayLocal/Date.now).

// ── מילון-החלטות (חי בקופסה) ────────────────────────────────────────────────
/** ברירת-מחדל: תיק-מעקב ריק — ביט-זהה ל-domain.emptyAyin (maor types/domain.ts:598-616).
 *  ברירת-מחדל = החלטת-קופסה (LAW: תיקון-בעלים לחוק-5), לא אטום. */
function emptyAyin() {
  return {
    stage: 'new', note: '', answeredNote: '', answerPushed: false,
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
    if (k === 'hist') return;
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
