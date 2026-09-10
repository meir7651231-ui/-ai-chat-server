# 🔍 Audit Report: Peruk21 Sorting Task

## Findings
No findings.

## Verification Coverage

✅ **Sorting Implementation (Both Locations):**
- Entity list screen (ent1.dart:155): `rs.sort()` applies sort lambda on `gen_app_peruk21_ent1_c24` = 'עד מתי' (deadline field). Sort uses `compareTo()` with numeric parse fallback; ascending order (negative return = a < b = soonest first). Correct.
- Particle screen (px1.dart:28): `appStore.records().toList()..sort()` applies identical sort lambda on `gen_app_peruk21_px1_c7` = 'עד מתי' (deadline field). Same ascending sort logic. Correct.
- Both sort operators handle empty values (return -1/+1 to sort empties last), parse numbers before comparing (date fields may be numeric), and fall back to lexical sort for non-numeric strings.
- Spec syntax verified: Line 7 (entity definition) and Line 10 (particle definition) in peruk21.txt both declare `| מיון: עד מתי עולה` (sort ascending by deadline), which generates the observed sort calls.

✅ **Content Mappings:**
- gen_app_peruk21_ent1_content.dart line 26: `const String gen_app_peruk21_ent1_c24 = 'עד מתי'` ← used on line 155 of ent1.dart. Correct.
- gen_app_peruk21_px1_content.dart line 9: `const String gen_app_peruk21_px1_c7 = 'עד מתי'` ← used on line 28 of px1.dart. Correct.

✅ **No State Leakage:**
- Police report: `byte_identical_others ✅` confirms no other apps altered.
- Spec file audit: Only peruk21.txt modified; no changes to other specs (peruk04, peruk*, etc.).
- Particle plan and metadata: Only peruk21 particle plan changed (name updated to "טבלה מיון עד מתי עולה", expr updated to include `| מיון: עד מתי עולה`). No cross-app contamination.

✅ **Police Checks Pass:**
- regen_ok ✅ (regeneration succeeded)
- byte_identical_others ✅ (no unintended changes to other apps)
- gates_pass ✅ (all gates passed)
- sort_px ✅ px1 (particle sort confirmed working)
- sort_ent ✅ ent1 (entity sort confirmed working)
- Sorting claims verified by machine: both entity list and particle screen now sort cases by deadline ascending.

✅ **Script Quarantine is Intentional:**
- machtzev/generator/ship.mjs, tighten-types.mjs, one.mjs gutted and replaced with blocking error message.
- This is intentional per protocol message: "🔒 BLOCKED by protocol: machtzev/generator/ship.mjs is quarantined for this task."
- Task used specialized pipeline (police-bench.mjs) to complete without executing these scripts.
- no_hebrew_in_engine ✅ confirms blocking mechanism prevents Hebrew text in generated code.

## Task Completion
**✅ TASK DONE:** Peruk21 cases now sort by deadline (עד מתי) soonest-first on both the entity list screen (ent1) and the particle/cases table screen (px1). No regressions detected in other apps.
