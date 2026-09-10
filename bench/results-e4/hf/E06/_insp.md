# INSP-E06: Add action button to case screen

**Date:** 2026-09-10
**Scope:** Single spec file change — machtzev/generator/specs-ds/peruk17.txt line 12
**Change:** Added `חלקיק תיק: [פעולה] שלח תזכורת`

## Audit by Protocol Lenses

### 1. Task Coverage
✅ **Entity particle added:** תיק entity now has new action button
✅ **Correct location:** Button added to particle screen (px1)
✅ **Screen type:** Particle screen confirmed via comment in gen_app_peruk17_px1.dart
✅ **No missing surfaces:** No additional screens, reports, or tables mentioned in task

### 2. Money-Numeric Edge Cases
⬜ **Not applicable:** No numeric fields, prices, or calculations in this change

### 3. Edge Crash Risk
✅ **No crashes identified:** Button is simple action particle with no conditional logic
✅ **Dart type correct:** DsChipButton is a standard forge component
✅ **No null-pointer risk:** Label is compile-time constant string

### 4. State Leakage Risk
✅ **No state added:** Button is stateless action (no provider, notifier, or persistence)
✅ **No cross-app bleed:** Spec change isolated to peruk17 only
✅ **Byte-identical others:** Generator did not modify files in other apps' specs

### 5. Navigation Safety
✅ **Dialog-free:** Action particle does not create new Scaffold/showDialog/Navigator.push (no R2 violation)
✅ **Dial-drill compliant:** Button is rendered as DsChipButton within existing px1 screen
✅ **No route added:** No new routes or navigation defined

### 6. Text Parity (Hebrew/Label Consistency)
✅ **Verbatim text:** "שלח תזכורת" (Send reminder) is user-provided task text
✅ **Label correct in Dart:** gen_app_peruk17_px1_content.dart shows exact Hebrew text
✅ **No encoding issues:** Hebrew text rendered correctly in generated code
✅ **Comment mapping correct:** gen_app_peruk17_px1.dart line 4 shows proper spec-to-Dart mapping

## Machine Check Results

### Police Gates Relevant to This Change
✅ **appgen:** TzedakaApp/StudioApp/YeshivaApp/KehilaApp all passed (peruk17 is independent app)
✅ **autoskin:** 27 roles selected, no regressions
✅ **autologic:** 30 actions × 850 engines, no new failures
✅ **goldquarry:** 9 modules bit-identical round-trip
✅ **rendermodule:** All 11 modules render deterministically

### No New Failures
- No new contract violations
- No new wiring errors
- No new data purity violations
- Peruk17 app compiles without errors

### Pre-existing Failures (Unrelated)
🔴 tighten-types: Quarantined by protocol (expected)
🔴 index-complete: Missing script entries (pre-existing, unrelated to spec)
🔴 learn: Blob reference errors (pre-existing git issue)

## VERDICT: ✅ GO

**Change is safe and correct:**
- Spec syntax valid per SPEC-LANG.md
- Generator produced valid Dart code
- Button renders correctly as DsChipButton with Hebrew label
- No impact on other applications
- No navigation violations (R2 compliant)
- No state leakage or edge crashes
- Text parity verified (Hebrew label exact match)

**Ready for acceptance.**
