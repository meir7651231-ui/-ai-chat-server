# INSP-H04 — Calendar Meetings Sort

**תאריך:** 2026-09-10
**שלב:** FND (data layer · spec language)
**diff-scope:** calendar.txt (spec modified), gen_app_calendar_px1.dart (generated)

## ממצאים

| מזהה | תיאור | חומרה | סטטוס |
|---|---|---|---|
| FND-S1 | Particle table definition added to calendar.txt with sort clause | MAJOR | FIXED |
| FND-S2 | Sort specification parsed correctly: 2-level comparator (date asc, time asc) | CRITICAL | ✅ |
| FND-S3 | Generated Dart passes flutter analyze (0 errors) | CRITICAL | ✅ |
| FND-S4 | No hand-edits to generated files | CRITICAL | ✅ |
| FND-S5 | Other apps byte-identical to baseline | CRITICAL | ✅ |

## בדיקת-לולאה

No prior findings to compare (first-time feature). Machine detected `sort_both` gate automatically.

## Task Coverage Audit

| Scope | Verification |
|---|---|
| Entity list | ✅ פגישה entity with מועד*, שעה fields present |
| Particle table | ✅ [טבלה] particle defined with 4 columns: מה, מועד, שעה, מקום |
| Sort order | ✅ Two-level: date (עולה), time (עולה) — chronological |
| Generated output | ✅ ForgeDataGrid with nested comparators; empty values sorted last |
| Compilation | ✅ 0 errors in dart:math operations (compareTo valid for dates) |

## Edge Cases

- **Empty dates:** Handled correctly (empty-check pushes to end, valid for sparse calendars)
- **Same date, different times:** Time acts as tiebreaker (spec verified in c6)
- **String vs numeric:** Date fields are stored as strings (YYYY-MM-DD format); comparator uses lexicographic order (correct for ISO dates) then numeric for times

## VERDICT: GO

**Rationale:**
- Spec-language approach avoids hand-coded sort logic (DRY principle).
- Two-level comparator correctly generated from `| מיון: מועד עולה, שעה עולה` clause.
- No breaking changes; other apps unaffected.
- Machine validation passed all 8 checks including new `sort_both` gate.
- Code is maintainable: future sort changes go through specs-ds only.

---

**Sign-off:** 2026-09-10 · machine-VERDICT: DONE
