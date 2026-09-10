# Audit: Calendar Task (E05) — Coverage & Defects

## Task Requirements
1. Add `משתתפים` (participants) field to the `פגישה` (meeting) entity
2. Show empty-state text `אין פגישות השבוע` when there are no meetings
3. Don't break anything

## Findings

**new/dart-gen-bs/gen_app_calendar_px1.dart:14** · EmptyState displays wrong constant (c0 instead of c1) · P1 wrong result · Use `gen_app_calendar_px1_c1` instead of `gen_app_calendar_px1_c0`. Currently displays "ריק אין פגישות השבוע" (particle name) instead of "אין פגישות השבוע" (spec text). The spec defines `חלקיק פגישה: [ריק] אין פגישות השבוע` where the bracket-delimited shape is parsed separately from the text; generated content file proves c1='אין פגישות השבוע' is available but px1 uses c0='ריק אין פגישות השבוע'.

## Verified Correct

✅ **Entity definition**: `משתתפים` field correctly added to `ישות פגישה` in specs-ds/calendar.txt (line 6). Field appears in apps/calendar.json at correct position (index 4 of 6 fields, after "מקום", before "הערה"), correct type (text), correct required flag (false).

✅ **Field rendering**: All 6 fields (מה, מועד, שעה, מקום, משתתפים, הערה) properly indexed as c9–c14 in dart-data-bs/auto/gen_app_calendar_ent1_content.dart and correctly rendered in form at gen_app_calendar_ent1.dart lines 143–148 with ForgeDsField/ForgeDsDateFieldInput widgets.

✅ **Particle definition**: Empty-state particle correctly parsed in particle-plan-calendar.json: name="ריק אין פגישות השבוע", expr="[ריק] אין פגישות השבוע", shape="empty", wired to EmptyState@premium/feedback.

✅ **Content generation**: Both c0 and c1 correctly generated in gen_app_calendar_px1_content.dart; c0='ריק אין פגישות השבוע' (name), c1='אין פגישות השבוע' (text).

✅ **Empty state wired**: px1.dart correctly imports EmptyState from dart-ui-bs/auto/empty_state.dart and conditionally renders it when appStore.records('app_calendar_ent1').isEmpty (line 14).

✅ **No compile breaks**: Police report confirms compiles ✅, analyzer errors=0. All other apps remain byte-identical (byte_identical_others ✅). No orphan files or wiring defects (no_orphans ✅, gates_pass ✅).

✅ **Field in list/board/table views**: All display views (lines 158–160 in ent1.dart) correctly loop over all 6 fields.

---

**Coverage**: Checked entity definition, field addition, content generation, empty-state particle wiring, render-time text selection, form fields in all views. Did NOT run flutter build/test (tools unavailable to auditor), so cannot verify final runtime rendering pixel-perfect. Task surface coverage: entity ✅, empty-state particle added ✅, empty-state display has wrong constant ❌.
