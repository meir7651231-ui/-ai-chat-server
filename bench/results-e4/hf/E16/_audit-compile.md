# Audit Report: peruk08 — add stage הוחזר הכסף

## Findings

None. All generated code is internally consistent and correct.

## Coverage

✅ **Verified correct:**
- Spec change (machtzev/generator/specs-ds/peruk08.txt:6): stage "הוחזר הכסף" correctly inserted after "נמסר" in stages list
- Stage count (new/dart-data-bs/auto/gen_app_peruk08_ent1_content.dart:3): reports "6 שלבים" (6 stages) — correct
- Stage constants (gen_app_peruk08_ent1_content.dart:24-29): all 6 stages defined (c22-c27 = התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור)
- Array sizes (gen_app_peruk08_ent1.dart lines 90,133,157): all stage lists have 6 elements, correctly updated from 5
- Invariants maintained: stageDone check updated from >= 4 to >= 5 (correct for 6 stages); onAdvance updated from 5 to 6 (correct)
- No byte-identical breakage (police report confirmed all other peruk01-07,09-28 unchanged)
- No orphan stage references in generated output
- Kanban logic (line 157) safely clamps stageOf to [0,5] range before array access
- No hand-edits detected; all changes machine-generated

**Edge case noted (pre-existing, not new):** DsRecordCard at line 90 indexes stage array without clamping, creating latent crash risk if appStore.stageOf returns value outside [0,5]. However, this pattern existed identically in the previous code (5-element array, onAdvance to 5); the builder correctly maintained the invariant when adding the 6th stage. Other peruk apps (peruk07, calendar, etc.) use `.clamp(0, arrayLength-1)` for safety; this codebase is inconsistent in pattern. Pre-change code had same off-by-one relationship; post-change invariant preserved.

