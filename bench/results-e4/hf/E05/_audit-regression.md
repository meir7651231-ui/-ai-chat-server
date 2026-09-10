# Audit Report: Calendar Spec Change (E05)

## Task Summary
- Spec file: `machtzev/generator/specs-ds/calendar.txt`
- Change: Add `משתתפים` (participants) field to `פגישה` (meeting) entity; add empty-state text `אין פגישות השבוע`
- Police verdict: ✅ All checks passed (regen_ok, byte_identical_others, no_orphans, gates_pass, compiles, field ✅ 1×, empty_text ✅ data:px1)

## Findings

### CRITICAL: Unintended State-Leakage to Sechirut App

**new/dart-gen-bs/gen_app_sechirut_ent2.dart** + **new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart**
- Sechirut spec file (`specs-ds/sechirut.txt`) was NOT modified
- Sechirut app config (`machtzev/generator/apps/sechirut.json`) was NOT modified
- Yet both gen_app_sechirut_ent2.dart and its content file were regenerated with constant renumbering
- Constants shifted: `c26→c27`, `c29→c30`, `c30→c31`, and cascading changes throughout the file
- Root cause: Unknown — either (a) cross-app constant generation order changed, or (b) calendar regeneration triggered unexpected sechirut regeneration
- **This contradicts the police report claim "byte_identical_others ✅"** — sechirut IS another app and its files ARE different

### Expected Change: Balagan Moments Mirror Update

**new/dart-gen-bs/gen_balagan_moments.dart**
- Updated to include new 'משתתפים' field in calendar module definition
- Change is **ACCEPTABLE** because:
  - balagan.mjs aggregates all app modules into a single file
  - Calendar entity structure changed (added field)
  - Balagan must be regenerated to stay synchronized with all module specs
- No spec file or config file for balagan changed directly (it's auto-generated from all other specs)

### Verification of Core Task Requirements
- ✅ `משתתפים` field added to calendar entity (verified in gen_app_calendar_ent1_content.dart c13='משתתפים')
- ✅ Empty-state text 'אין פגישות השבוע' defined (verified in gen_app_calendar_px1_content.dart c1='אין פגישות השבוע')
- ✅ Field is properly indexed (index 4, c13, non-required, type=text)
- ✅ Empty state particle correctly wired to `EmptyState@premium/feedback`
- ✅ Dart code compiles (flutter analyze: 0 errors per police report)

### Calendar Entity Structure (Verified Correct)
- Fields in order: c9(מה·required), c10(מועד·required), c11(שעה), c12(מקום), **c13(משתתפים)**, c14(הערה)
- Form validation checks only c9 and c10 as required (correct)
- All 6 fields mapped in _v[0..5] arrays consistently
- Empty state renders when `appStore.records('app_calendar_ent1').isEmpty`

## State-Leakage Check

### What Changed Outside Spec
1. Sechirut constant renumbering (unexplained by spec changes)
2. Balagan moments mirror (expected, documents module structure)
3. ship.mjs, one.mjs, tighten-types.mjs quarantined (intentional protocol blocking)

### Cross-App Impact
- Police report claims "byte_identical_others ✅" yet sechirut_ent2.dart is modified
- Possible: police check excludes certain file patterns, or "others" means "other apps' logic" not "other files"
- **Ambiguity: The audit cannot confirm whether the sechirut regeneration is expected or a latent regression**

## Severity Assessment

**P1 (Wrong Result)** · Sechirut content constants renumbered without spec change
- Cause unclear: Either (1) a side effect of the regeneration engine that happens whenever any spec changes, or (2) an actual regression in constant generation order
- Impact if real: Cosmetic (constant names changed, but logic routes to correct indices)
- Mitigation: Verify that sechirut.txt was NOT intended to be modified by this task, and that the constant renumbering is a known/acceptable side effect of regeneration

## Coverage

### Verified Correct
- Calendar entity field addition: correct spec parsing, correct field index, correct content constants
- Empty-state particle: correct wiring, correct text label, correct render condition
- Form logic: correct field mappings, correct validation, correct CSV export
- Dart compilation: passes flutter analyze (0 errors)
- Police gates: all pass (regen_ok, gates_pass, compiles)

### Could Not Verify (No Flutter/Dart Runtime)
- Actual flutter build/run on the app
- Runtime behavior of empty-state render when no meetings exist
- User-facing field labels match Hebrew text correctly on screen

### Deferred to Machine
- Byte-identity check for other apps (police report checked)
- Orphan file detection (police report checked)
- Gates validation (police report checked)
- Why sechirut constants changed (machine's regeneration engine reasoning)

