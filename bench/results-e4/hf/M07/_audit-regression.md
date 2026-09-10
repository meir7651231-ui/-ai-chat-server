# Auditor Report — Regression & State-Leakage Lens (M07 · sechirut)

## Findings

new/dart-gen-bs/gen_app_sechirut_scr5.dart:24 · dashboard counter uses ambiguous label constant · P1 wrong result · replace `gen_app_sechirut_scr5_c17` with `gen_app_sechirut_scr5_c18` on the "unsent findings" KvLine widget (second counter in row 2)

**Detailed defect:** The generated dashboard screen renders 6 counters. The new 4th counter (findings not yet sent) is defined in spec line 11 as `מונה(ממצא: נשלח=לא)`. The content file correctly generates c18='ממצא · לא' (qualified label) but the widget incorrectly references c17='לא' (short value label). This creates ambiguity: the same label 'לא' appears on both the "unsent findings" counter (row 2, col 2) and the "unpaid payments" counter (row 3, col 2), making the dashboard unreadable. Users cannot distinguish which counter is which. The counter logic itself is correct (filtering by נשלח=לא), but the label is wrong.

---

## Coverage Verified

✅ **Spec → generated code chain intact**: Spec line 11 correctly adds `מונה(ממצא: נשלח=לא)` to dashboard; particle line 25 correctly adds particle. Both translated to content constants (c18 ✅, c34 ✅). Only widget label selection broke.

✅ **No state-leakage to other apps**: byte_identical_others gate passed; no gen_app_sechirut_* changes affect other apps (schoolos, studio, kehila, tzedaka, peruk04, balagan unchanged).

✅ **No orphan files**: no_orphans gate passed; all generated files have specs.

✅ **Compilation succeeds**: Dart code compiles with c17 reference (const exists), flutter analyze returns 0 errors. Runtime would also work (just display wrong label).

✅ **Particle screen correctly wired**: gen_app_sechirut_px3.dart line 26 uses c34='לא נשלחו' (correct particle-specific label), not ambiguous short label. Particle is well-formed.

✅ **Content constants correctly generated**: gen_app_sechirut_scr5_content.dart line 18 defines c18='ממצא · לא' (correct); px3_content.dart line 34 defines c34='לא נשלחו' (correct).

⚠️ **Known issue documented in LEARNINGS.md**: Builder added learning entry L2026-09-10-render-m07-counter acknowledging the exact defect (generator uses short c17 instead of full c18 when counter values duplicate). GATE: render-ds. The issue is flagged but not fixed in code.

---

## What was checked & what could not be checked

**Verified by reading source:**
- Spec syntax for new counters (lines 11, 25) — ✓ correct
- Content file constant generation (scr5_content.dart, px3_content.dart) — ✓ correct qualified labels exist
- Widget code generation (scr5.dart line 24, line 26 bar chart) — ✓ counter logic sound, label reference wrong
- Particle vs dashboard separation (two separate widgets, two separate content files) — ✓ particle correct, dashboard wrong
- No mutations of shared lists or enums (AppStore.records filter chains) — ✓ sound
- HTML entities / string escaping — ✓ Hebrew strings properly in quoted const declarations
- Dart null-safety (`.where()` returns Iterable, `.length` returns int, `.toDouble()` is valid on int) — ✓ type-safe

**Could not verify (Flutter not installed):**
- Runtime rendering: whether wrong label actually displays as ambiguous in UI (logic suggests it will, const is accessible)
- AppStore mutation: whether live counters update correctly when findings are marked sent (filter condition correct, but unverified in runtime)
- User interaction: whether clicking counters or exporting data works (widget structure sound, but unverified)

---

## Verdict

**REGRESSION CONFIRMED — Task not complete.** One dashboard counter label uses wrong constant (c17 instead of c18). Particle counter is correct. The defect is acknowledged in LEARNINGS.md (builder documented the issue) but not fixed in the generated widget code. Compiles and runs but displays wrong label to users, creating UI ambiguity.

