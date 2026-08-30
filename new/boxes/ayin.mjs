/** קופסת-חיבורים · ayin (מעקב-טיפול / העין). חוזה: ayin.contract.md
 *  זה המקום היחיד שבו 30 חוטי-העין נפגשים (חוקי-החשמלאי, LAW.md §2).
 *  מקור-האמת: maor/src/lib/ayin.ts — החיווט משקף את גרף-הקריאות שלו כלשונו (L4). */

// ── אטומי-העין ──
import { AYIN_STAGES }             from '../atoms/ayin-stages.mjs';
import { stageLabel as __pure_stageLabel } from '../atoms/stage-label.mjs';
import { STAGE_LABEL_T as __d_stageLabel_STAGE_LABEL_T } from '../atoms/stage-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const stageLabelA = (...a) => __pure_stageLabel(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_stageLabel_STAGE_LABEL_T);
import { featLabel as __pure_featLabel }   from '../atoms/feat-label.mjs';
import { FEAT_LABEL_T as __d_featLabel_FEAT_LABEL_T } from '../atoms/feat-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const featLabelA = (...a) => __pure_featLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_featLabel_FEAT_LABEL_T);
import { itemLabel as __pure_itemLabel }   from '../atoms/item-label.mjs';
import { ITEM_LABEL_T as __d_itemLabel_ITEM_LABEL_T } from '../atoms/item-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const itemLabelA = (...a) => __pure_itemLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_itemLabel_ITEM_LABEL_T);
import { unitLabel as __pure_unitLabel }   from '../atoms/unit-label.mjs';
import { UNIT_LABEL_T as __d_unitLabel_UNIT_LABEL_T } from '../atoms/unit-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const unitLabelA = (...a) => __pure_unitLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_unitLabel_UNIT_LABEL_T);
import { stageIndex as __pure_stageIndex } from '../atoms/stage-index.mjs';
import { AYIN_STAGES as __d_stageIndex_AYIN_STAGES } from '../atoms/ayin-stages.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const stageIndexA = (...a) => __pure_stageIndex(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_stageIndex_AYIN_STAGES);
import { nextStage as nextStageA }   from '../atoms/next-stage.mjs';
import { revertPatch as __pure_revertPatch } from '../atoms/revert-patch.mjs';
import { REVERT_PATCH_T as __d_revertPatch_REVERT_PATCH_T } from '../atoms/revert-patch-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const revertPatchA = (...a) => __pure_revertPatch(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_revertPatch_REVERT_PATCH_T);
import { normName as normNameA }     from '../atoms/norm-name.mjs';
import { ayinActive as __pure_ayinActive } from '../atoms/ayin-active.mjs';
import { AYIN_ACTIVE_T as __d_ayinActive_AYIN_ACTIVE_T } from '../atoms/ayin-active-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const ayinActiveA = (...a) => __pure_ayinActive(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_ayinActive_AYIN_ACTIVE_T);
import { eyesTotal as eyesTotalA }   from '../atoms/eyes-total.mjs';
import { boqLineAmount as boqLineAmountA } from '../atoms/boq-line-amount.mjs';
import { boqTotal as boqTotalA }     from '../atoms/boq-total.mjs';
import { timeHoursTotal as timeHoursTotalA } from '../atoms/time-hours-total.mjs';
import { timeCostTotal as timeCostTotalA }   from '../atoms/time-cost-total.mjs';
import { matCostTotal as matCostTotalA }     from '../atoms/mat-cost-total.mjs';
import { namesToTemplateLines as namesToTemplateLinesA } from '../atoms/names-to-template-lines.mjs';
import { templateLinesToNames as templateLinesToNamesA } from '../atoms/template-lines-to-names.mjs';
import { ayinActionVisible as __pure_ayinActionVisible }       from '../atoms/ayin-action-visible.mjs';
import { AYIN_ACTION_VISIBLE_T as __d_ayinActionVisible_AYIN_ACTION_VISIBLE_T } from '../atoms/ayin-action-visible-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const ayinActionVisibleA = (...a) => __pure_ayinActionVisible(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_ayinActionVisible_AYIN_ACTION_VISIBLE_T);
import { ayinAdvanceLabel as __pure_ayinAdvanceLabel }         from '../atoms/ayin-advance-label.mjs';
import { AYIN_ADVANCE_LABEL_T as __d_ayinAdvanceLabel_AYIN_ADVANCE_LABEL_T } from '../atoms/ayin-advance-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const ayinAdvanceLabelA = (...a) => __pure_ayinAdvanceLabel(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_ayinAdvanceLabel_AYIN_ADVANCE_LABEL_T);
import { planAyinAdvance as __pure_planAyinAdvance }           from '../atoms/plan-ayin-advance.mjs';
import { PLAN_AYIN_ADVANCE_T as __d_planAyinAdvance_PLAN_AYIN_ADVANCE_T } from '../atoms/plan-ayin-advance-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const planAyinAdvanceA = (...a) => __pure_planAyinAdvance(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_planAyinAdvance_PLAN_AYIN_ADVANCE_T);
import { planAddName as __pure_planAddName }                   from '../atoms/plan-add-name.mjs';
import { PLAN_ADD_NAME_T as __d_planAddName_PLAN_ADD_NAME_T } from '../atoms/plan-add-name-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const planAddNameA = (...a) => __pure_planAddName(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_planAddName_PLAN_ADD_NAME_T);
import { ayinDailyRows as __pure_ayinDailyRows }               from '../atoms/ayin-daily-rows.mjs';
import { AYIN_DAILY_ROWS_T as __d_ayinDailyRows_AYIN_DAILY_ROWS_T } from '../atoms/ayin-daily-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const ayinDailyRowsA = (...a) => __pure_ayinDailyRows(...a, ...Array(Math.max(0, 8 - a.length)).fill(undefined), __d_ayinDailyRows_AYIN_DAILY_ROWS_T);
import { ayinAllRows as __pure_ayinAllRows }                   from '../atoms/ayin-all-rows.mjs';
import { AYIN_ALL_ROWS_T as __d_ayinAllRows_AYIN_ALL_ROWS_T } from '../atoms/ayin-all-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const ayinAllRowsA = (...a) => __pure_ayinAllRows(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_ayinAllRows_AYIN_ALL_ROWS_T);
import { ayinBoardItems as ayinBoardItemsA }             from '../atoms/ayin-board-items.mjs';
import { filterAyinBoard as __pure_filterAyinBoard }           from '../atoms/filter-ayin-board.mjs';
import { FILTER_AYIN_BOARD_T as __d_filterAyinBoard_FILTER_AYIN_BOARD_T } from '../atoms/filter-ayin-board-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const filterAyinBoardA = (...a) => __pure_filterAyinBoard(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_filterAyinBoard_FILTER_AYIN_BOARD_T);
import { AYIN_SHEET_HEADER }                             from '../atoms/ayin-sheet-header.mjs';
import { ayinSheetRows as __pure_ayinSheetRows }               from '../atoms/ayin-sheet-rows.mjs';
import { AYIN_SHEET_ROWS_T as __d_ayin_sheet_rows_T } from '../atoms/ayin-sheet-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const ayinSheetRowsA = (...a) => __pure_ayinSheetRows(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_ayin_sheet_rows_T);
import { parseAyinSheet as __pure_parseAyinSheet }             from '../atoms/parse-ayin-sheet.mjs';
import { PARSE_AYIN_SHEET_T as __d_parseAyinSheet_PARSE_AYIN_SHEET_T } from '../atoms/parse-ayin-sheet-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const parseAyinSheetA = (...a) => __pure_parseAyinSheet(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_parseAyinSheet_PARSE_AYIN_SHEET_T);
import { applyAyinSheet as __pure_applyAyinSheet }             from '../atoms/apply-ayin-sheet.mjs';
import { APPLY_AYIN_SHEET_T as __d_applyAyinSheet_APPLY_AYIN_SHEET_T } from '../atoms/apply-ayin-sheet-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const applyAyinSheetA = (...a) => __pure_applyAyinSheet(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_applyAyinSheet_APPLY_AYIN_SHEET_T);

// ── אטומי-שכן טהורים (מודולים אחרים; אטומים-על-המדף ⇒ מיובאים ומחווטים) ──
import { termOf as __pure_termOf }     from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);

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
