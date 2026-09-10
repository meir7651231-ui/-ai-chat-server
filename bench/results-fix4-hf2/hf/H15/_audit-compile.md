# AUDITOR REPORT · peruk21 task · sort deadline "עד מתי" (soonest first)

## Findings

None detected in compile/safety scope.

## Verification Coverage

**Checked and sound:**

1. **Particle screen (px1.dart line 28) — sort implementation:**
   - Sort target: field `gen_app_peruk21_px1_c7` = string 'עד מתי' ✓
   - Source records: from `appStore.records('app_peruk21_ent1')` → `List<Map<String, String>>` ✓
   - Sort logic: Custom comparator with three branches:
     - Handles empty values safely (returns 1 if x empty, -1 if y empty) ✓
     - Tries numeric parse on both values (`num.tryParse(x)`, `num.tryParse(y)` → `num?`) ✓
     - Falls back to lexical comparison (`x.compareTo(y)`) if either parse fails ✓
   - Return type: comparator returns `int` (result of comparison or 0) ✓
   - Null safety: All `??` operators shield against null Map values; `.compareTo()` exists on both `num` and `String` ✓
   - Direction: ascending order (smaller values first) = soonest-first for YYYY-MM-DD dates ✓
   - Syntax: Inner brace block is valid—scopes variables, allows conditional early return with fallback return 0 ✓

2. **Entity list screen (ent1.dart line 155) — sort implementation:**
   - Sort target: field `gen_app_peruk21_ent1_c24` = string 'עד מתי' ✓
   - Source: `rs` list already filtered by search + scope (line 151, 154) ✓
   - Sort logic: **identical pattern** to px1 ✓
   - Return semantics: same as px1 ✓
   - Null safety: identical safety checks ✓

3. **Spec alignment (machtzev/generator/specs-ds/peruk21.txt):**
   - Entity-level sort: line 7 declares `| מיון: עד מתי עולה` ✓
   - Particle-level sort: line 10 declares `[טבלה] | מיון: עד מתי עולה` ✓
   - Learnings recorded: machtzev/LEARNINGS.md entry L2026-09-10-spec-sort-h15 confirms doctrine ✓

4. **Field identification:**
   - Both px1_c7 and ent1_c24 resolve to string 'עד מתי' ✓
   - 'עד מתי' is in `spec-lang.data.json` typeDate list (implies dateField semantics) ✓

5. **Table/list display columns (px1.dart):**
   - Column 5 is 'עד מתי' (px1_c12) — matches sort field value ✓
   - All six fields map correctly via ent1 record keys ✓

6. **Dart compile checklist:**
   - No undefined methods: `Map[String]` → `String?`, `.isEmpty`, `.compareTo()`, `num.tryParse()` all exist ✓
   - No shadowed/conflicting variable names in nested scope ✓
   - All branches return compatible types (`int` from comparators) ✓

**Not verifiable in this audit (requires runtime/data):**
- Whether stored deadline values are in sortable format (YYYY-MM-DD vs DD.MM.YYYY vs natural language)
- Whether appStore.records() correctly populates field keys matching spec
- Whether sort is observable on actual records (e.g., if all records have identical/empty 'עד מתי' values)

## Summary

The generated Dart code for sorting by deadline on both particle and entity screens is **syntactically sound, null-safe, and type-correct**. No compile breakage or safety violations detected. The implementation uses a safe, three-tier comparator (numeric-first, then lexical fallback) and applies soonest-first (ascending) ordering as specified.

*Audit scope: compile + null-safety + non-existent methods + edge cases (empty/missing values) + type compatibility.*
