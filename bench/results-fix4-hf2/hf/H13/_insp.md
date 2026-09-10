# INSP-H13 — Table Column Selection for panuy App

**Date:** 2026-09-10  
**Verdict:** GO  

## Task Coverage

- **Entity list:** ✅ panuy.txt defines 1 entity (אדם) with 4 required columns
- **Particle table:** ✅ Line 6 specifies which 4 columns to display (שם, זמין, מרחק בקמ, מחיר לשעה)
- **Hub/list view:** ✅ ForgeDataGrid renders exactly 4 columns
- **Report:** ✅ No report particle required for this task

## Numeric/Money Handling

- ✅ Column "מחיר לשעה" (price per hour) is numeric
- ✅ Column "מרחק בקמ" (distance in km) is numeric
- ✅ No arithmetic operations needed; columns are just displayed as-is

## Edge/Crash Prevention

- ✅ Spec syntax `[טבלה] col1, col2, col3, col4` is valid per SPEC-LANG.md
- ✅ All 4 column names exist in entity definition (line 4)
- ✅ No calculated fields; all are base or computed fields

## State/Data Leakage

- ✅ No new state added
- ✅ No new providers or persistence needed
- ✅ Table data reads from appStore.records('app_panuy_ent1') — existing mechanism

## Navigation

- ✅ Table UI is read-only (list display, no deep links)
- ✅ No new routes or FABs added
- ✅ Single-screen app: panuy has only 1 screen (px1)

## Text Parity

- ✅ Column headers: שם, זמין, מחיר לשעה, מרחק בקמ (all verbatim from spec)
- ✅ No Hebrew text added to engine (no_hebrew_in_engine ✅)
- ✅ All text is spec-defined, no hardcoded strings

## Machine Verification

| Check | Result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ✅ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ✅ |
| dart_math_sane | ✅ |
| compiles (flutter analyze) | ✅ |
| four_columns | ✅ columns=4 |

**Verdict: GO** — All checklist items pass. Task complete.
