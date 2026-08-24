/** קופסת-חיבורים · ayin (מעקב-טיפול / העין). חוזה: ayin.contract.md
 *  זה המקום היחיד שבו 30 חוטי-העין נפגשים (חוקי-החשמלאי, LAW.md §2).
 *  מקור-האמת: maor/src/lib/ayin.ts — החיווט משקף את גרף-הקריאות שלו כלשונו (L4). */

// ── אטומי-העין ──
import { AYIN_STAGES }             from '../atoms/ayin-stages.mjs';
import { stageLabel as stageLabelA } from '../atoms/stage-label.mjs';
import { featLabel as featLabelA }   from '../atoms/feat-label.mjs';
import { itemLabel as itemLabelA }   from '../atoms/item-label.mjs';
import { unitLabel as unitLabelA }   from '../atoms/unit-label.mjs';
import { stageIndex as stageIndexA } from '../atoms/stage-index.mjs';
import { nextStage as nextStageA }   from '../atoms/next-stage.mjs';
import { revertPatch as revertPatchA } from '../atoms/revert-patch.mjs';
import { normName as normNameA }     from '../atoms/norm-name.mjs';
import { ayinActive as ayinActiveA } from '../atoms/ayin-active.mjs';
import { eyesTotal as eyesTotalA }   from '../atoms/eyes-total.mjs';
import { boqLineAmount as boqLineAmountA } from '../atoms/boq-line-amount.mjs';
import { boqTotal as boqTotalA }     from '../atoms/boq-total.mjs';
import { timeHoursTotal as timeHoursTotalA } from '../atoms/time-hours-total.mjs';
import { timeCostTotal as timeCostTotalA }   from '../atoms/time-cost-total.mjs';
import { matCostTotal as matCostTotalA }     from '../atoms/mat-cost-total.mjs';
import { namesToTemplateLines as namesToTemplateLinesA } from '../atoms/names-to-template-lines.mjs';
import { templateLinesToNames as templateLinesToNamesA } from '../atoms/template-lines-to-names.mjs';
import { ayinActionVisible as ayinActionVisibleA }       from '../atoms/ayin-action-visible.mjs';
import { ayinAdvanceLabel as ayinAdvanceLabelA }         from '../atoms/ayin-advance-label.mjs';
import { planAyinAdvance as planAyinAdvanceA }           from '../atoms/plan-ayin-advance.mjs';
import { planAddName as planAddNameA }                   from '../atoms/plan-add-name.mjs';
import { ayinDailyRows as ayinDailyRowsA }               from '../atoms/ayin-daily-rows.mjs';
import { ayinAllRows as ayinAllRowsA }                   from '../atoms/ayin-all-rows.mjs';
import { ayinBoardItems as ayinBoardItemsA }             from '../atoms/ayin-board-items.mjs';
import { filterAyinBoard as filterAyinBoardA }           from '../atoms/filter-ayin-board.mjs';
import { AYIN_SHEET_HEADER }                             from '../atoms/ayin-sheet-header.mjs';
import { ayinSheetRows as ayinSheetRowsA }               from '../atoms/ayin-sheet-rows.mjs';
import { parseAyinSheet as parseAyinSheetA }             from '../atoms/parse-ayin-sheet.mjs';
import { applyAyinSheet as applyAyinSheetA }             from '../atoms/apply-ayin-sheet.mjs';

// ── אטומי-שכן טהורים (מודולים אחרים; אטומים-על-המדף ⇒ מיובאים ומחווטים) ──
import { termOf }     from '../atoms/term-of.mjs';
import { normSearch } from '../atoms/norm-search.mjs';

// ── החיווט ──
// שקעי-IO (החלטת-הקופסה): isoToday · emptyAyin · nextId מוזרקים — לעולם לא ממומשים כאן.
// (שעון/דאטה/מזהה אינם אטומים; טוהר-הקופסה ⇒ אפס-IO נסתר בגוף.)

// תוויות-העין: termOf האטום מחווט לכל אחת (הפער בין תצוגה למפתח-קבוע חי כאן).
const stageLabel = (cfg, stage) => stageLabelA(cfg, stage, termOf);
const featLabel  = (cfg) => featLabelA(cfg, termOf);
const itemLabel  = (cfg) => itemLabelA(cfg, termOf);
const unitLabel  = (cfg) => unitLabelA(cfg, termOf);

// סדר-השלבים: nextStage מחווט ל-stageIndex+AYIN_STAGES; revertPatch ל-stageIndex.
const stageIndex = (stage) => stageIndexA(stage);
const nextStage  = (stage) => nextStageA(stage, stageIndexA, AYIN_STAGES);
const revertPatch = (stage) => revertPatchA(stage, stageIndexA);

// נרמול-שם: normSearch האטום שוקע לתוך normName; דרכו dedup+סינון-הלוח.
const normName = (s) => normNameA(s, normSearch);

// אגרגטים טהורים (אפס שקעים, פרט ל-boqTotal↔boqLineAmount).
const eyesTotal = (a) => eyesTotalA(a);
const boqLineAmount = (n) => boqLineAmountA(n);
const boqTotal = (a) => boqTotalA(a, boqLineAmountA);
const timeHoursTotal = (a) => timeHoursTotalA(a);
const timeCostTotal = (a) => timeCostTotalA(a);
const matCostTotal = (a) => matCostTotalA(a);
const namesToTemplateLines = (names) => namesToTemplateLinesA(names);
// nextId = שקע-מזהה מוזרק ע"י הקורא.
const templateLinesToNames = (lines, nextId) => templateLinesToNamesA(lines, nextId);

// הכפתור-החכם: התווית ל-stageLabel; התכנון לחבילת-6-השכנים.
const ayinActionVisible = (a) => ayinActionVisibleA(a);
const ayinAdvanceLabel = (cfg, a) => ayinAdvanceLabelA(cfg, a, stageLabel);
const planAyinAdvance = (cfg, name, a) =>
  planAyinAdvanceA(cfg, name, a, { ayinActionVisible, featLabel, itemLabel, unitLabel, stageLabel, eyesTotal });

// הוספת-פריט: normName המחווט + isoToday מוזרק (שעון = שקע-IO).
const planAddName = (a, rawName, eyes, id, isoToday) =>
  planAddNameA(a, rawName, eyes, id, normName, isoToday);

// דוחות-העין: emptyAyin מוזרק (מפעל-domain = שקע-דאטה); תוויות ואגרגטים מחווטים.
const ayinActive = (a) => ayinActiveA(a);
const ayinDailyRows = (cfg, supporters, todayIso, emptyAyin) =>
  ayinDailyRowsA(cfg, supporters, todayIso, unitLabel, itemLabel, emptyAyin, eyesTotal, stageLabel);
const ayinAllRows = (cfg, supporters, emptyAyin) =>
  ayinAllRowsA(cfg, supporters, unitLabel, emptyAyin, stageLabel);
const ayinBoardItems = (supporters, emptyAyin) => ayinBoardItemsA(supporters, emptyAyin);
const filterAyinBoard = (items, q, status, stage) => filterAyinBoardA(items, q, status, stage, normSearch);

// גיליון-העיניים (round-trip): normName המחווט לפענוח; ייצוא/החלה טהורים.
const ayinSheetRows = (supporters) => ayinSheetRowsA(supporters);
const parseAyinSheet = (rows, supporters) => parseAyinSheetA(rows, supporters, normName);
const applyAyinSheet = (supporters, upds, today) => applyAyinSheetA(supporters, upds, today);

// ── החשיפה ──
export {
  AYIN_STAGES, AYIN_SHEET_HEADER,
  stageLabel, featLabel, itemLabel, unitLabel,
  stageIndex, nextStage, revertPatch, normName,
  ayinActive, eyesTotal, boqLineAmount, boqTotal,
  timeHoursTotal, timeCostTotal, matCostTotal,
  namesToTemplateLines, templateLinesToNames,
  ayinActionVisible, ayinAdvanceLabel, planAyinAdvance, planAddName,
  ayinDailyRows, ayinAllRows, ayinBoardItems, filterAyinBoard,
  ayinSheetRows, parseAyinSheet, applyAyinSheet,
};
