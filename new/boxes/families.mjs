/** קופסת-חיבורים · מודול-המשפחות — מחווטת את 20 חוטי families/lib.ts. חוזה: families.contract.md
 *  זה המקום היחיד שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md). מייבאת אך-ורק אטומים.
 *
 *  מקור-האמת: /home/user/maor-system/src/components/families/lib.ts (גרף-הקריאות שבטיוטה).
 *
 *  שקעי-IO אמיתיים (מוזרקים, לא ממומשים כאן):
 *   · now  — שעון-המכונה (Date). ‏ageOf/isoToday מקבלים now מוזרק; ברירת-מחדל new Date()
 *            נאמנה למקור (families/lib.ts:19-21,30 → date-util.ts:10 · lib.ts:30).
 *  שקעים-חוצי-מודול שהפכו לאטומים (חוק-3 — לא ייבוא-קופסה): term-of (מילון-המונחים,
 *  config.ts:119) · iso-local (date-util.ts:13). מחווטים כאטומים, לא כפרמטרים. */
import { fmtDate } from '../atoms/fmt-date.mjs';
import { isoToday as isoTodayWire } from '../atoms/iso-today.mjs';
import { isoLocal } from '../atoms/iso-local.mjs';
import { ageOf as ageOfWire } from '../atoms/age-of.mjs';
import { STATUS_META } from '../atoms/status-meta.mjs';
import { CRED_RED_THRESHOLD } from '../atoms/cred-red-threshold.mjs';
import { CRED_HELP_TEXT } from '../atoms/cred-help-text.mjs';
import { tierOf as tierOfWire } from '../atoms/tier-of.mjs';
import { famEnrollments } from '../atoms/fam-enrollments.mjs';
import { famLiveEnrollments as famLiveWire } from '../atoms/fam-live-enrollments.mjs';
import { finderAxes as finderAxesWire } from '../atoms/finder-axes.mjs';
import { finderAxisValue as finderAxisValueWire } from '../atoms/finder-axis-value.mjs';
import { finderMatches as finderMatchesWire } from '../atoms/finder-matches.mjs';
import { numMatch } from '../atoms/num-match.mjs';
import { famHistoryOf as famHistoryWire } from '../atoms/fam-history-of.mjs';
import { MARITAL_OPTIONS } from '../atoms/marital-options.mjs';
import { LANGUAGE_OPTIONS } from '../atoms/language-options.mjs';
import { OTHER } from '../atoms/other.mjs';
import { OTHER_LABEL } from '../atoms/other-label.mjs';
import { chipStyle } from '../atoms/chip-style.mjs';
import { maritalChipStyle as maritalChipWire } from '../atoms/marital-chip-style.mjs';
import { termOf } from '../atoms/term-of.mjs';

// ── הכרעות-הקופסה (סדר/ברירות-מחדל/מילון) ──
// הקונפיג-הריק כברירת-מחדל ל-famHistoryOf. במקור זה DEFAULT_CONFIG (config.ts:404-410),
// שאין לו terms כלל ⇒ termOf תמיד נופל ל-fallback ⇒ {} ביט-זהה. הכרעה חיה כאן, לא באטום.
const DEFAULT_CONFIG = {};

// ── החיווט (חוק-1: שכן ⇒ שקע-מוזרק; אפס import פנימי בין-אטומי) ──
// tierOf במקור נקרא עם ארגומנט-יחיד ונשען על הקבוע-שכן CRED_RED_THRESHOLD (lib.ts:64).
// הקופסה מלחימה את הסף פנימה כך שהחשיפה תואמת-מקור: tierOf(score).
const wiredTierOf = (score) => tierOfWire(score, CRED_RED_THRESHOLD);
const wiredFamLive = (db, fam) => famLiveWire(db, fam, famEnrollments);
const wiredFinderAxisValue = (db, f, axis, config) =>
  finderAxisValueWire(db, f, axis, config, {
    termOf, tierOf: wiredTierOf, famLiveEnrollments: wiredFamLive, STATUS_META,
  });
// finderMatches במקור קורא finderAxisValue(db,f,k) בלי config (lib.ts:121) — המחדל undefined נשמר.
const wiredFinderMatches = (db, locks) => finderMatchesWire(db, locks, wiredFinderAxisValue);
const wiredFinderAxes = (config) => finderAxesWire(config, termOf);
const wiredFamHistory = (db, fam, config = DEFAULT_CONFIG) => famHistoryWire(db, fam, config, termOf);
const wiredMaritalChip = (status) => maritalChipWire(status, chipStyle);

// ── החשיפה: אותו חתך-API של families/lib.ts, עכשיו כחיווט גלוי ──
export const isoToday = (now = new Date()) => isoTodayWire(isoLocal, now);
export const ageOf = (birth, now = new Date()) => ageOfWire(birth, now);
export const tierOf = wiredTierOf;
export const famLiveEnrollments = wiredFamLive;
export const finderAxisValue = wiredFinderAxisValue;
export const finderMatches = wiredFinderMatches;
export const finderAxes = wiredFinderAxes;
export const famHistoryOf = wiredFamHistory;
export const maritalChipStyle = wiredMaritalChip;
// חוטים בלי-שקעים — נבחרים כמות-שהם (החיווט = בחירת-האטום בלבד):
export { fmtDate, famEnrollments, numMatch, chipStyle };
export { STATUS_META, CRED_RED_THRESHOLD, CRED_HELP_TEXT };
export { MARITAL_OPTIONS, LANGUAGE_OPTIONS, OTHER, OTHER_LABEL };
