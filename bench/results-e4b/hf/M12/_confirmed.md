# ✓ VALIDATOR REPORT — peruk02 particle (ממוצע פיקדון)

## Machine Checks (PASSED)
All ./_police.md gates ✅: regen_ok, byte_identical_others, gates_pass, compiles, no_hebrew_in_engine, dart_math_sane (0 analyzer errors)

## Audit Conflict
- `_audit-compile.md`: Claims "No findings. Task completed correctly."
- `_audit-coverage.md`: Reports "P1 wrong-result · particle label is empty, no actual computed average value displayed"

## Verification Against Bytes

**Spec (peruk02.txt:17):**
```
חלקיק תיק: ממוצע פיקדון = [תוכן ממוצע]
```
✓ Particle declaration correct.

**Content group (peruk02.txt:96):**
```
תוכן ממוצע: סכום הפיקדון בממוצע על כל התיקים
```
✓ Content group defined with description.

**Generated Dart (gen_app_peruk02_px1.dart:34):**
```dart
DsNote(message: gen_app_peruk02_px1_c104, label: gen_app_peruk02_px1_c105, tone: 0)
```

**Constants (gen_app_peruk02_px1_content.dart:106–107):**
```
const String gen_app_peruk02_px1_c104 = 'סכום הפיקדון בממוצע על כל התיקים';
const String gen_app_peruk02_px1_c105 = '';
```

## Finding

**ID:** avg-label-empty  
**Verdict:** CONFIRMED P1  
**Evidence:** new/dart-data-bs/auto/gen_app_peruk02_px1_content.dart:107 · `const String gen_app_peruk02_px1_c105 = '';` (label is empty string)  
**Failure Scenario:** User opens case screen; particle shows only description text "סכום הפיקדון בממוצע על כל התיקים" with no numeric average value displayed, making the requirement "showing the average of סכום הפיקדון" incomplete (shows concept, not value)

## Analysis

The task requirement is: "add to the case screen a particle named ממוצע פיקדון **showing the average** of סכום הפיקדון over all cases."

The phrase "showing the average" requires displaying a **numeric value**. The builder created a static-content particle with a description only (empty label).

Per LEARNINGS.md L2026-09-10-spec-particles: "particles cannot use computational functions; sum/avg works at board level, not in particle of entity." The builder correctly followed this architectural constraint by creating a content-only particle.

However, this means **the task cannot be completed as specified** under current rules: a particle cannot both be a particle-of-entity AND show computed numeric average.

The compile audit missed this because generic checks (compiles, gates, wiring) pass; they don't verify the particle's semantic correctness.

## Fix

**Note:** This finding requires architectural decision, not simple code change.

Option A (Simplest fix per architecture): Replace particle with board-level metric (per L2026-09-10: "avg in function calls works at board level") — remove particle from spec, add KPI to board definition.

Option B (Revise architecture): Allow particles to accept `[מספר]` type with computed aggregates (requires reversing L2026-09-10 via new decision).

Option C (Simplest code fix, violates data rules): Put hardcoded numeric value in c105 (violates §20-ג no-fake-data rule; would require test/mock value, not production).

---

## FIX-LIST
P0 · avg-label-empty — CONFIRMED · remove particle from spec and redefine requirement as board-level metric (per L2026-09-10-spec-particles architecture)
