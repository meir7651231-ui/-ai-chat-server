/** קופסת-חיבורים · מודול קופות-הצדקה (tzedaka). חוזה: tzedaka.contract.md
 *  מקור-אמת (L4): maor-system/src/components/tzedaka/lib.ts — 19 חוטים.
 *  מייבאת אך-ורק אטומים (חוק-2). קריאות-שכן ⇒ שקעים מוזרקים בקופסה (חוק-3).
 *  ההכרעות (סדר-הבינדינג, ברירות-המחדל, הרכב-העזר coordinatorLastCollection,
 *  והכינוי isoOf=isoLocal) חיות כאן, לא באטומים.
 *
 *  שני שקעי-מנוע חוצי-קופסה (חוק-3, מוזרקים ע"י לוח-האם — לא נגזרים כאן כדי
 *  לא לשכפל את הכרעת-קופסה-אחרת):
 *    · smartFilter(q, items, getTerms) ⇒ פריטים מסוננים+ממוינים — מנוע קופסת-החיפוש.
 *    · buildMonthGrid(events, anchorIso, hebMode) ⇒ גריד — מנוע קופסת-הלוח-העברי.
 *  שאר החוטים חוצי-המודול (termOf · dateInRange · isoOf) הם אטומים עצמאיים ⇒ מחווטים כאן. */
import { TZ_SCORE_RULES as TZ_SCORE_RULES_A } from '../atoms/tz-score-rules.mjs';
import { TZ_STALE_DAYS as TZ_STALE_DAYS_A } from '../atoms/tz-stale-days.mjs';
import { lastCollectionIso as lastCollectionIsoA } from '../atoms/last-collection-iso.mjs';
import { collectionScoreDelta as collectionScoreDeltaA } from '../atoms/collection-score-delta.mjs';
import { boxTotal as boxTotalA } from '../atoms/box-total.mjs';
import { coordinatorBoxes as coordinatorBoxesA } from '../atoms/coordinator-boxes.mjs';
import { coordinatorTotal as coordinatorTotalA } from '../atoms/coordinator-total.mjs';
import { grandTotal as grandTotalA } from '../atoms/grand-total.mjs';
import { campaignTotal as campaignTotalA } from '../atoms/campaign-total.mjs';
import { staleBoxes as staleBoxesA } from '../atoms/stale-boxes.mjs';
import { needsCare as needsCareA } from '../atoms/needs-care-tzedaka.mjs';
import { leaderboard as leaderboardA } from '../atoms/leaderboard.mjs';
import { campaignProgress as campaignProgressA } from '../atoms/campaign-progress.mjs';
import { filterCoordinators as filterCoordinatorsA } from '../atoms/filter-coordinators.mjs';
import { boxesOverview as boxesOverviewA } from '../atoms/boxes-overview.mjs';
import { filterCollections as filterCollectionsA } from '../atoms/filter-collections.mjs';
import { coordinatorPrintLines as coordinatorPrintLinesA } from '../atoms/coordinator-print-lines.mjs';
import { collectionsCsvRows as collectionsCsvRowsA } from '../atoms/collections-csv-rows.mjs';
import { buildTzGrid as buildTzGridA } from '../atoms/build-tz-grid.mjs';
import { termOf } from '../atoms/term-of.mjs';
import { dateInRange } from '../atoms/date-in-range.mjs';
import { isoLocal } from '../atoms/iso-local.mjs';
import { DAY_NAMES as DAY_NAMES_A } from '../atoms/week-day-names.mjs';

// ── הכינוי (הכרעת-קופסה): isoOf של הלוח = isoLocal — מקור calLib.ts:30-32 מאציל ל-isoLocal ──
const isoOf = isoLocal;

// ── הרכב-העזר הפרטי coordinatorLastCollection (מקור lib.ts:161-168) —
//    היה פונקציה-פנימית שאינה מיוצאת; ההרכב (coordinatorBoxes⊕lastCollectionIso
//    + השוואת '>' על מחרוזות-ISO, '' ראשון) הוא הכרעת-חיווט של הקופסה. ──
const coordinatorLastCollection = (boxes, coordId) => {
  let last = '';
  for (const b of coordinatorBoxesA(boxes, coordId)) {
    const l = lastCollectionIsoA(b);
    if (l > last) last = l;
  }
  return last;
};

// ── חשיפה: חוטים זהי-ביט למקור (אפס שקעים) — חיווט ישיר ──
export const TZ_SCORE_RULES = TZ_SCORE_RULES_A;
export const TZ_STALE_DAYS = TZ_STALE_DAYS_A;
export const lastCollectionIso = lastCollectionIsoA;
export const boxTotal = boxTotalA;
export const coordinatorBoxes = coordinatorBoxesA;
export const campaignTotal = campaignTotalA;
export const DAY_NAMES = DAY_NAMES_A;

// ── חיווט-שכנים (חוק-3): השכן מוזרק פנימה בקופסה; חתימות-המקור נשמרות ──

/** מקור lib.ts:33-48 — ברירת-מחדל rules=TZ_SCORE_RULES (פיגמנט). */
export const collectionScoreDelta = (box, date, amount, rules = TZ_SCORE_RULES) =>
  collectionScoreDeltaA(box, date, amount, lastCollectionIsoA, rules);

/** מקור lib.ts:60-62. */
export const coordinatorTotal = (boxes, coordId) =>
  coordinatorTotalA(boxes, coordId, coordinatorBoxesA, boxTotalA);

/** מקור lib.ts:64-66. */
export const grandTotal = (boxes) => grandTotalA(boxes, boxTotalA);

/** מקור lib.ts:80-89 — ברירת-מחדל days=TZ_STALE_DAYS; isoOf+lastCollectionIso מוזרקים. */
export const staleBoxes = (boxes, todayIso, days = TZ_STALE_DAYS) =>
  staleBoxesA(boxes, todayIso, days, isoOf, lastCollectionIsoA);

/** מקור lib.ts:101-131 — סדר סוגי-הטיפול (ישנות→אבודות→רכזים→מבצעים) חי באטום;
 *  הקופסה מזריקה את חמשת השכנים כאובייקט-שקעים. */
export const needsCare = (db, todayIso, config) =>
  needsCareA(db, todayIso, config, {
    termOf,
    staleBoxes,
    lastCollectionIso: lastCollectionIsoA,
    coordinatorBoxes: coordinatorBoxesA,
    isoOf,
  });

/** מקור lib.ts:142-147. */
export const leaderboard = (coordinators, boxes) =>
  leaderboardA(coordinators, boxes, coordinatorTotal, coordinatorBoxesA);

/** מקור lib.ts:149-154. */
export const campaignProgress = (campaign, boxes) =>
  campaignProgressA(campaign, boxes, campaignTotalA);

/** מקור lib.ts:174-192 — smartFilter (מנוע-החיפוש) מוזרק מלוח-האם;
 *  coordinatorTotal + העזר-הפרטי coordinatorLastCollection מחווטים בקופסה. */
export const filterCoordinators = (coords, boxes, q, onlyActive, sort, smartFilter) =>
  filterCoordinatorsA(coords, boxes, q, onlyActive, sort, smartFilter, coordinatorTotal, coordinatorLastCollection);

/** מקור lib.ts:203-230 — smartFilter מוזרק; lastCollectionIso+boxTotal מחווטים. */
export const boxesOverview = (db, q, status, sort, smartFilter) =>
  boxesOverviewA(db, q, status, sort, lastCollectionIsoA, boxTotalA, smartFilter);

/** מקור lib.ts:233-242. */
export const filterCollections = (box, fromIso, toIso, campaignId) =>
  filterCollectionsA(box, fromIso, toIso, campaignId, dateInRange);

/** מקור lib.ts:250-275. */
export const coordinatorPrintLines = (db, coordinatorId, config) =>
  coordinatorPrintLinesA(db, coordinatorId, config, termOf, coordinatorBoxesA, lastCollectionIsoA);

/** מקור lib.ts:281-293. */
export const collectionsCsvRows = (db, config) => collectionsCsvRowsA(db, config, termOf);

/** מקור lib.ts:302-304 — buildMonthGrid (מנוע-הלוח) מוזרק מלוח-האם. */
export const buildTzGrid = (tzEvents, anchorIso, hebMode, buildMonthGrid) =>
  buildTzGridA(tzEvents, anchorIso, hebMode, buildMonthGrid);
