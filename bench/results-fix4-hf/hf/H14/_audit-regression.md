# Audit Report: Severity Sorting of ממצא Partition

## Finding 1
**File**: new/dart-gen-bs/gen_app_sechirut_rp1.dart · line ~2170
**Defect**: Partition bands rendered in order אדום, צהוב, ירוק (which IS correct), but `sortBandsBySeverity` function was added to particles.mjs and executed at code-generation time. The function correctly sorts by Hebrew first-character codes (aleph→0, tzade→1, yod→2), and the generated DsSection widgets show bands in correct severity order. However, the police check `sort_color` returns FALSE ("none"), indicating the test framework cannot verify the sorting property in the generated output or the test harness does not run verification.

**Severity**: P1 (task not done - police verification fails)

**Fix**: The implementation in particles.mjs (sortBandsBySeverity at lines 355-363 and 480-487) is syntactically correct and logically sound for sorting צבע{אדום|צהוב|ירוק} by severity. But the police report indicates "sort_color | ❌ none" — suggesting either (a) the police harness does not have a working implementation of the sort_color check, or (b) the check expects a different verification signature in the code. Confirm the police harness has a sort_color gate implementation or add one. The builder's sortBandsBySeverity function signature is correct but may not match what the police test expects to find.

## Verified Correct
✅ **Unicode sorting logic**: Character codes 0x05D0 (א=red), 0x05E6 (צ=yellow), 0x05D9 (י=green) map correctly to severity 0, 1, 2.
✅ **Generated widget order**: The three DsSection widgets for the partition appear in order: אדום (c24), צהוב (c29), ירוק (c34) in gen_app_sechirut_rp1.dart, which is severity-sorted.
✅ **Enum order in spec**: ממצא entity defines צבע{אדום|צהוב|ירוק} in spec line 9, already in correct severity order.
✅ **Code integration**: sortBandsBySeverity function is integrated into both particleWidgets (lines 355-363) and particleText (lines 480-487) branches of particles.mjs, and uses sortedBands in both cases (lines 366 and 487).
✅ **No breaking changes to other apps**: The sort only applies when bands.length === 3 AND all start with the color chars, so single-color or non-trilateral partitions pass through unsorted. No regression to other sechirut screens or other apps detected.
❌ **Police verification**: Despite correct logic and correct output order, police check returns "sort_color | ❌ none", meaning the verification is not passing. The gate does not exist or does not detect the sorting.

## Root Cause Analysis

The sorting logic IS implemented in machtzev/generator/particles.mjs (lines 355-363 and 480-487). The generated Dart code in gen_app_sechirut_rp1.dart shows DsSection widgets in the correct order: אדום (c25), צהוב (c30), ירוק (c35), which maps to severity red→yellow→green. 

However, the police benchmark (`_police.md`) reports:
- `sort_color | ❌ none` — meaning the check cannot find or verify the sorting

The missing piece: there is no `sort_color` gate implementation in the police harness itself (checked protocol/orchestrator/agents/auditor.md and machtzev/police.mjs). The harness checks claims from claims.json, but without a corresponding gate function that verifies the sorting property in the generated output, the check defaults to FALSE/"none". The builder added the implementation but not the verification gate.

## Conclusion
The builder correctly implemented the sorting logic and the generated code shows bands in the correct order (אדום, צהוב, ירוק). However, the task is not "done" per the police report because **the sort_color verification gate is missing from the police harness**. The fix requires adding a sort_color gate to the police framework that verifies partition bands appear in severity order in generated widget code.
