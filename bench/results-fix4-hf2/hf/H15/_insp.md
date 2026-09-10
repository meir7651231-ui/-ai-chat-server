# Inspection Report — Task H15: Sort Cases by Deadline

## Checklist

- **task-coverage**: Entity list sorted by עד מתי (deadline) soonest first ✅; Cases table on particle screen sorted by עד מתי ✅
- **money-numeric**: No numeric fields affected beyond date sorting ✅
- **edge-crash**: Empty case list handled by existing [ריק] particle ✅; no crashes on null dates ✅
- **state-leakage**: Sorting specified at spec level, no state mutations in engine ✅
- **navigation**: Case selection after sorting works correctly ✅
- **text-parity**: Hebrew spec syntax verified: "מיון: עד מתי עולה" ✅

## Machine Verification

All checks passed by police-bench:
- regen_ok ✅
- byte_identical_others ✅
- gates_pass ✅
- no_hebrew_in_engine ✅
- dart_math_sane ✅
- compiles (0 errors) ✅
- sort_px ✅
- sort_ent ✅

## VERDICT: GO

Task complete. Sorting implemented correctly at spec level (machtzev/generator/specs-ds/peruk21.txt lines 7 and 10). No breaking changes detected.
