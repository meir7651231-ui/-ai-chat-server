# AUDITOR LENS: edge-crash + compile (Dart numeric sort)

## Findings
**No defects found.**

---

## Coverage

**Verified Correct:**
- Sort column identification: `gen_app_peruk12_px1_c7` correctly maps to `'מחיר'` (price field) from spec line 7.
- Numeric comparison logic: `num.tryParse(x)` and `num.tryParse(y)` correctly parse price strings; both parse successfully → numeric comparison via `nx.compareTo(ny)` (lines: new/dart-gen-bs/gen_app_peruk12_px1.dart:25).
- Comparison semantics: `num.compareTo()` returns negative when first < second; negative return → first item sorts first; therefore `50.compareTo(100)` = -1 → item with price 50 comes before 100 → ascending order (cheapest first) ✓.
- Null-safety: All record values use null-coalesce to empty string `?? ''`; empty strings handled explicitly with `x.isEmpty != y.isEmpty` (returns 1 for x empty, -1 for y empty, putting empties last); `num.tryParse()` returns `num?`, checked with `!= null` before use.
- Fallback behavior: If either price fails to parse as `num`, falls back to lexical string comparison `x.compareTo(y)` (safe, doesn't break); does not attempt `.sqrt()` or other non-existent `num` methods.
- Syntax: All brackets balanced; lambda structure `(a, b) { { ... } return 0; }` is valid Dart (inner block contains declarations and early returns, outer return handles equal case).
- Task compliance: Spec `peruk12.txt` line 10 reads `"חלקיק תיק: [טבלה] | מיון: מחיר עולה"` (sort table by price ascending); generated code implements ascending numeric sort by price field—matches task requirement.

**Unchanged / Out of Scope:**
- Dart compiler availability: Flutter not installed; reasoning from Dart language spec (sound null-safety, std methods).
- Other app files: Only peruk12 particle and data files changed; police report confirms `byte_identical_others` ✅.
- No hand-edit marker found in generated files (line 1 headers show `🧩 חולל ע"י מפרק-החלקיקים`).

**Police machine validation (independent confirmation):**
- `sort` gate: ✅ px1 (sort implementation validated in px1 particle).
- `numeric` info: ✅ 2× (two numeric comparisons found and validated, likely in px1 and data layer).
- `regen_ok`: ✅ (generator pipeline executed without error).
- `dart_math_sane`: ✅ (Dart methods exist and used correctly).

