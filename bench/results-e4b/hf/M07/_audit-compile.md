# Audit Report: Sechirut "לא נשלחו" Task

## Findings

gen_app_sechirut_scr5.dart:26 · Dashboard counter "לא נשלחו" (findings not sent) is missing from the dashboard grid · **P1 wrong result** · Add KvLine counter widget for `appStore.records('app_sechirut_ent3').where((r) => (r[gen_app_sechirut_scr5_c20] ?? '') == gen_app_sechirut_scr5_c22).length` after line 24, wrapped in AnimatedBuilder, with label `gen_app_sechirut_scr5_c17` (or create new row at line 26)

## Coverage

**Verified correct:**
- **Null-safety & compile:** gen_app_sechirut_scr5.dart lines 23–27 have correct AnimatedBuilder animation tracking and appStore.count/records/sum calls with null-coalescing operators (`??''`). All `.toDouble()`, `.toStringAsFixed()`, `.length` calls on proper types (no calling methods on null).
- **Particle added:** gen_app_sechirut_px3.dart line 26 correctly implements counter particle `KvLine(label: gen_app_sechirut_px3_c34, value: appStore.records(...).where(...).length.toDouble().toStringAsFixed(0))` for `נשלח=לא`.
- **Content strings:** gen_app_sechirut_scr5_content.dart defines all required strings (c17–c22) for the missing counter; subtitle on line 41 correctly states "7 מדדים" (7 metrics), confirming expectation.
- **Spec alignment:** machtzev/generator/specs-ds/sechirut.txt line 11 lists 7 counters; task spec & particle-plan JSON both show new counter defined.
- **Widget structure:** Existing counters in scr5.dart follow consistent pattern: Padding → AnimatedBuilder → KvLine with proper label/value binding.

**Could not check (Flutter/Dart not installed):**
- Live compilation/analyze pass (police report showed ✅ compiles, but secondary screen check failed)
- Runtime behavior of the KvLine widget with the new counter value

## Verdict

**Task incomplete.** Particle "לא נשלחו" added to findings screen (px3) ✅; dashboard counter wiring for same metric missing ❌. Police report hub_label check (0×) confirms zero dashboard labels for the counter — it exists in content/particle but not rendered on dashboard UI. One-line fix: insert missing Padding+AnimatedBuilder+KvLine in scr5.dart dashboard grid.
