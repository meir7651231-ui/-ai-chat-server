/** קופסת-חיבורים · דו"ח מותאם. חוזה: custom-export.contract.md
 *  ההלחמות-לשעבר מ-customExport.ts (config·ayin·hebrew·eventMeta·courses/lib·
 *  supporters/lib) — עכשיו חיווט גלוי אחד מאטומים בלבד (חוק-2/3).
 *  שקע-IO יחיד: nowMs (טריות-supScore) — מוזרק אופציונלי; חסר ⇒ Date.now()
 *  בתוך האטום, ביט-זהה למקור. */
import { expFieldDefs as expFieldDefsAtom } from '../atoms/exp-field-defs.mjs';
import { overrideColumn as overrideColumnAtom } from '../atoms/override-column.mjs';
import { buildCustomExport as buildCustomExportAtom } from '../atoms/build-custom-export.mjs';
import { featureOn as featureOnAtom } from '../atoms/feature-on.mjs';
import { moduleOn } from '../atoms/module-on.mjs';
import { termOf } from '../atoms/term-of.mjs';
import { featLabel as featLabelAtom } from '../atoms/feat-label.mjs';
import { itemLabel as itemLabelAtom } from '../atoms/item-label.mjs';
import { unitLabel as unitLabelAtom } from '../atoms/unit-label.mjs';
import { stageLabel as stageLabelAtom } from '../atoms/stage-label.mjs';
import { sessionsOf } from '../atoms/sessions-of.mjs';
import { enrollCount } from '../atoms/enroll-count.mjs';
import { hebParts } from '../atoms/heb-parts.mjs';
import { hebAnnualEq as hebAnnualEqAtom } from '../atoms/heb-annual-eq.mjs';
import { hebDateFull as hebDateFullAtom } from '../atoms/heb-date-full.mjs';
import { gem as __pure_gem } from '../atoms/gematria.mjs';
import { U, T, H } from '../atoms/gematria-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gem = (...a) => __pure_gem(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H);
import { gemYear as gemYearAtom } from '../atoms/gem-year.mjs';
import { supCount } from '../atoms/sup-count.mjs';
import { supIls } from '../atoms/sup-ils.mjs';
import { supUsd } from '../atoms/sup-usd.mjs';
import { supLast } from '../atoms/sup-last.mjs';
import { supTotalIls as supTotalIlsAtom } from '../atoms/sup-total-ils.mjs';
import { supScore as supScoreAtom } from '../atoms/sup-score.mjs';
import { supTier } from '../atoms/sup-tier.mjs';
import { EV_META } from '../atoms/ev-meta.mjs';
import { DAY_NAMES } from '../atoms/day-names.mjs';

// ── הכרעות-הקופסה (חיווט-הצבה, verbatim מהמקור) ──
// תשעת מודולי-הניווט הניתנים-לכיבוי — maor/src/lib/config.ts:20-30
const NAV_MODULE_KEYS = [
  'families',
  'courses',
  'calendar',
  'diary',
  'supporters',
  'reports',
  'tzedaka',
  'shop',
  'shop7',
];
// אירועים החוזרים שנתית לפי התאריך העברי — maor/src/types/domain.ts:363-367
const HEBREW_RECURRING = new Set(['memorial', 'anniversary', 'bday']);

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
  const gy = hebYear - 3761; // 1 באוגוסט של השנה הזו קודם תמיד לא' תשרי של hebYear
  for (let i = 0; i < 440; i++) {
    const p = hebParts(new Date(gy, 7, 1 + i, 12));
    if (p.year !== hebYear) continue;
    if (!seq.includes(p.month)) seq.push(p.month);
    if (p.day === 30) has30.add(p.month);
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
