# 🔍 AUDITOR: compile + edge-crash lens — H04 (calendar)

## Findings
No findings.

## Coverage verified
**gen_app_calendar_px1.dart line 18 — two-level sort comparator:**
- Null safety: `a[key] ?? ''` provides safe default string; `num.tryParse()` returns `num?` with null-check before `.compareTo()`; all field access guarded with `??`
- Dart method validity: `num.tryParse(String)` ✓ (core library static method), `num.compareTo(num)` ✓, `String.compareTo(String)` ✓, `.isEmpty` ✓ (String property)
- Sort structure: first block handles c6 ('מועד'/date), second block handles c7 ('שעה'/time), correct two-level ordering with return cascade
- Empty handling: `x.isEmpty != y.isEmpty ? (x.isEmpty ? 1 : -1) : ...` correctly places nulls/empties at end for ascending sort
- Nested block scopes valid Dart; return statements exit entire comparator function
- gen_app_calendar_px1_content.dart: c6='מועד', c7='שעה' correctly mapped as sort keys; c8-c12 correctly mapped as display columns

**Police report cross-check:**
- `sort_both ✅ px1` — machine verified both sort keys present in generated code
- `compiles ✅` — analyzer errors = 0
- `regen_ok ✅` — calendar app regenerated from spec correctly
- `byte_identical_others ✅` — no unintended changes to other apps

**Spec compliance:**
- machtzev/generator/specs-ds/calendar.txt line 7: `חלקיק פגישה: [טבלה] מה, מועד, שעה, מקום, הערה | מיון: מועד עולה, שעה עולה` ✓
- Task: meetings sorted by date then time — implemented correctly
- LEARNING entry L2026-09-10-particle-sort-a7c3f1 documents the rule for future particle sorts

**NOT CHECKED** (outside read-only audit scope):
- Runtime behavior with actual מועד/שעה values (unit tests covered by police)
- Comparison correctness for date/time string formats (assumed format consistent, verified by sort_both gate)
- UI rendering of sorted table (visual testing)
