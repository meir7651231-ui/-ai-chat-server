/** קופסת-חיבורים · מסך-הדוחות. חוזה: reports.contract.md
 *  מקור-אמת (L4): maor-system/src/components/reports/lib.ts — 13 חוטים.
 *  מייבאת אך-ורק אטומים (חוק-2). שכנים חוצי-מודול ו-new Date() = שקעים מוזרקים (חוק-3/6).
 *  ההכרעות (סדר-הקסקדה, מילון-התוויות, טיפול-הקצה של fmtDate) חיות כאן, לא באטומים. */
import { fmtDate as fmtDateCore } from '../atoms/fmt-date.mjs';
import { inRange as inRangeA } from '../atoms/in-range.mjs';
import { rangeLabel as __pure_rangeLabel } from '../atoms/range-label.mjs';
import { RANGE_LABEL_T as __d_rangeLabel_RANGE_LABEL_T } from '../atoms/range-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const rangeLabelA = (...a) => __pure_rangeLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rangeLabel_RANGE_LABEL_T);
import { paidOf as paidOfA } from '../atoms/paid-of.mjs';
import { round2 as round2A } from '../atoms/round2.mjs';
import { paidInRange as paidInRangeA } from '../atoms/paid-in-range.mjs';
import { balanceOf as balanceOfA } from '../atoms/balance-of.mjs';
import { monthKey as monthKeyA } from '../atoms/month-key.mjs';
import { monthLabel as monthLabelA } from '../atoms/month-label.mjs';
import { nameIndex as nameIndexA } from '../atoms/name-index.mjs';
import { STATUS_LABEL as STATUS_LABEL_A } from '../atoms/status-label.mjs';
import { countBy as countByA } from '../atoms/count-by.mjs';

// ── שקע-הזמן (חוק-6): "היום" = isoLocal(now); ה-now האמיתי מוזרק, לא new Date() באטום ──
export const isoToday = (isoLocal, now = new Date()) => isoLocal(now);

// ── הכרעת-מסך-הדוחות (מקור reports/lib.ts:18-23): ריק=>'' · שבור=>iso כמו-שהוא ──
//    (שונה מאטום fmt-date שמחזיר '—'; הליבה DD/MM/YYYY נלקחת מהאטום.)
export function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  if (!y || !m || !d) return iso;
  return fmtDateCore(iso);
}

// ── חיווט ישיר (האטום זהה-ביט למקור) ──
export const inRange = inRangeA;
export const paidOf = paidOfA;
export const round2 = round2A;
export const monthKey = monthKeyA;
export const monthLabel = monthLabelA;
export const STATUS_LABEL = STATUS_LABEL_A;
export const countBy = countByA;

// ── חיווט-שכנים (חוק-3): השכן מוזרק פנימה בקופסה ──
export const rangeLabel = (r) => rangeLabelA(r, fmtDate);
export const paidInRange = (e, r) => paidInRangeA(e, r, inRangeA);
export const balanceOf = (e) => balanceOfA(e, paidOfA);
export const nameIndex = (db, allMembers) => nameIndexA(db, allMembers);
