# ✅ VALIDATOR FINDINGS — E05 (calendar)

## CONFIRMED Findings (ranked by severity)

**E05-SCOPE-CREEP** · CONFIRMED · new/dart-gen-bs/gen_balagan_moments.dart:17 · BalaganModule calendar entry updated with new TF-IDF scores ('משתתפימ': 2.74) and participants field added to field list, changing file outside task scope · regenerate with --only calendar flag or accept cascading change as required behavior; _police.md shows byte_identical_others: ❌ blocking task

**E05-SHELL-WRONG-EMPTY** · CONFIRMED · new/dart-gen-bs/gen_app_calendar_shell.dart:46 · `if (rs.isEmpty) EmptyState(label: gen_app_calendar_shell_c6)` renders 'פגישה' (field label) instead of required 'אין פגישות השבוע' · add `gen_app_calendar_shell_c20 = 'אין פגישות השבוע'` to shell_content.dart and change label reference to c20, or hardcode the string

**E05-PX1-WRONG-EMPTY** · CONFIRMED · new/dart-gen-bs/gen_app_calendar_px1.dart:14 · `EmptyState(label: gen_app_calendar_px1_c0)` renders 'ריק אין פגישות השבוע' (with ריק prefix) instead of required 'אין פגישות השבוע' · change `gen_app_calendar_px1_c0` to `gen_app_calendar_px1_c1` in the EmptyState call

## FALSE-POSITIVES

(none — all reported issues verified as real)

## Verified Correct

✓ Participants field (משתתפים) correctly added to calendar.txt spec line 6
✓ Participants field correctly added to apps/calendar.json with type: text, required: false
✓ Field mapped in all 6 locations in gen_app_calendar_ent1.dart: _labelsAll, _save, _edit, _card, _csv, form
✓ Null-safety is sound: all field references use ?? fallback pattern
✓ gen_app_calendar_ent1_content.dart correctly defines c13='משתתפים' and c14='הערה'
✓ DsField and DsRecordCard argument counts all correct for 6 fields
✓ Empty-state constants defined: c0='ריק אין פגישות השבוע', c1='אין פגישות השבוע' both exist and differ only in ריק prefix

## Summary

**Task Status:** NOT DONE (byte_identical_others gate failed due to scope creep in gen_balagan_moments.dart)

**Dart/Null-Safety:** All sound; no compilation errors detected in type signature inference

**Text/Label Issues:** 2 confirmed bugs (px1 and shell use wrong constants for empty state), both are P1 wrong-result defects

---

FIX-LIST: E05-SCOPE-CREEP, E05-SHELL-WRONG-EMPTY, E05-PX1-WRONG-EMPTY
