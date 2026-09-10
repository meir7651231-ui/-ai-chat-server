# AUDITOR REPORT · task H09 (tasks computed field)

## Lens: edge-crash + compile (null-safety, Dart method availability, formula correctness)

### Findings
No findings. Code compiles and handles edge cases correctly.

### Coverage: VERIFIED CORRECT

**Compilation & null-safety:**
- Spec parsed: `machtzev/generator/specs-ds/tasks.txt:6` correctly adds `סכום מעוגל = round(סכום)`
- Generated Dart: `gen_app_tasks_ent1.dart` has helper `num _m_round(num x) => x.round();` on line 18
- Call site: Line 52 computes as `(_m_round( (num.tryParse(_v[2] ?? '') ?? 0) )).toStringAsFixed(2)` — null-safe via `??` chaining
- Display: Line 162 uses `_calc()` widget which safely receives `num` result
- Analyzer result: `compiles ✅` with 0 errors reported

**Formula correctness:**
- Spec: `סכום מעוגל = round(סכום)`
- Impl: `round(num.tryParse(סכום) ?? 0)` — matches spec ✅
- Empty input: `'' → null → 0 → round(0) → 0 → "0.00"` ✓
- Valid input: `"12.7" → 12.7 → round() → 13 → "13.00"` ✓
- Negative: `"-5.4" → -5.4 → round() → -5 → "-5.00"` ✓

**Integration:**
- Field added to `tasks.json` fields array (line 58) with type "num" ✓
- Form input: None (computed, read-only display via `_calc()` widget) ✓
- Edit load: Loads from storage in `_edit()` line 64 ✓
- Storage save: Computed on write in `_save()` line 52 ✓
- CSV export: Included in `_csv()` line 99 ✓
- Table view: Included in grid columns line 174 ✓
- Card display: Included in `_card()` line 93 ✓

**Null-safety verification:**
- `_v[2]` map access: Protected by `?? ''` → `num.tryParse()` → `?? 0` ✓
- Result type: `num` (from `num.tryParse()` + `?? 0` coercion) ✓
- All string defaults use `?? ''`; all numeric defaults use `?? 0` ✓

**No edge-crashes detected:**
- No unchecked method calls on nullable types
- No missing null-coalescing operators
- No parenthesis mismatches or incomplete expressions
- No text-vs-number comparison errors
- round() exists in dart:core, returns int (subtype of num declaration) ✓

---

**Verdict:** Task implemented correctly. No compile-blocking defects. Formula matches spec. Null-safety holds across all paths (form input → parse → round → display → storage).
