# 🔍 AUDITOR REPORT — Calendar Sorting Task (H10)

## Lens: Dart Compile Safety & Edge Cases

### Findings
**No defects found.** Both sorting implementations verified sound.

### Detailed Verification

#### 1. Entity List Sorting (gen_app_calendar_ent1.dart:157)
```dart
rs.sort((a, b) { { final x = a[gen_app_calendar_ent1_c16] ?? '', y = b[gen_app_calendar_ent1_c16] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; } return 0; });
```

**Checks:**
- ✅ `gen_app_calendar_ent1_c16` → `'שעה'` (confirmed in content file line 18)
- ✅ `a` is `Map<String, String>`, `a[key]` returns `String?`, `?? ''` narrows to `String` (non-null)
- ✅ `.isEmpty` valid on `String`
- ✅ `num.tryParse(String)` returns `num?` (standard Dart, safe for null-check)
- ✅ `num` implements `Comparable<num>` → `.compareTo(num)` exists and returns `int`
- ✅ `String.compareTo(String)` exists and returns `int` (fallback path)
- ✅ Null-check guard `(nx != null && ny != null)` narrows types before method call
- ✅ Empty values sorted to end (return 1 for empty a, -1 for empty b) — ascending order correct
- ✅ Nested block structure valid (inner block returns from comparator function)
- ✅ `return 0` at end for equal values — correct

#### 2. Particle Table Sorting (gen_app_calendar_px1.dart:18)
```dart
appStore.records('app_calendar_ent1').toList()..sort((a, b) { { final x = a[gen_app_calendar_px1_c6] ?? '', y = b[gen_app_calendar_px1_c6] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; } return 0; })
```

**Checks:**
- ✅ `appStore.records()` returns `List<Map<String, String>>`
- ✅ `.toList()` creates mutable list
- ✅ `..sort()` cascade operator calls sort in-place and returns list
- ✅ `gen_app_calendar_px1_c6` → `'שעה'` (confirmed in content file line 8)
- ✅ All type and null-safety checks identical to ent1
- ✅ For-in loop over sorted list: `[for (final r in (...)) ...]` — parentheses correctly balanced

#### 3. Field Mapping Verification
- **ent1**: c11='שעה' (form field), c16='שעה' (sort key) — same field ✅
- **px1**: c3='שעה' (column), c6='שעה' (sort key) — same field ✅
- **Storage**: Records created with `gen_app_calendar_ent1_c11: _v[2] ?? ''` where c11='שעה' — consistent ✅

#### 4. Sort Order
- Spec requires: "מיון: שעה עולה" (time ascending)
- Implementation: compareTo convention (a<b returns negative) → ascending ✅
- Empty values at end (correct for ascending) ✅

### Coverage Summary
**Checked:**
- Null-safety on all accessor paths (Map indexing, num.tryParse)
- Method existence on `String`, `num`, type narrowing in ternary
- Comparator logic (empty handling, numeric vs lexical fallback)
- Field constant references match content files
- Data flow from storage to display
- Parentheses balance and cascade operator semantics
- Both required sorting locations (ent1 entity list, px1 particle table)

**Not checked (N/A):**
- Runtime behavior on actual data (assume test-data in police.md covers)
- Time format validation (user input validation, outside compile scope)
- AppStore implementation (assumed correct)

### Verdict
**✅ PASS** — Both sorting implementations are compile-safe and correct. No P0/P1 defects.

