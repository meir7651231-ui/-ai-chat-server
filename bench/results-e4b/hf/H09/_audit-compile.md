# 🔍 Audit: Computed Field `סכום מעוגל = round(סכום)` in tasks.txt

## Findings

`new/dart-gen-bs/gen_app_tasks_ent1.dart:37` · computed field can be prefilled from widget.initial but value is silently dropped on save, violating spec "הנוסחה היא המקור-היחיד" · **P1** · exclude computed field from prefill loop: `if (i >= 0 && !_labelsAll[i].contains('מעוגל') && v.trim().isNotEmpty) _v[i] = v;` or check against separate list of editable fields

## Coverage

✅ **Verified correct:**
- Line 18: `num _m_round(num x) => x.round();` — valid Dart (int is subtype of num, covariant assignment OK)
- Line 52: computed field calculated and stored with formula `(_m_round(...)).toStringAsFixed(2)` — formula is recalculated on save, not taken from input (correct)
- Line 161: computed field displayed read-only via `_calc()` with live recalculation from `_v[2]` (סכום) — correct
- Line 126: `_calc()` signature accepts `num`, .toStringAsFixed(2) valid on int — type-safe
- CSV export (lines 99–102) includes computed field from stored records — correct
- null-safety: `num.tryParse(...) ?? 0` is safe, no unchecked nulls
- flutter analyze passed with 0 errors (per police.md) ✅

⚠️ **Could not verify (read-only audit):**
- Whether widget.initial can actually receive the computed field label from "מה קרה?" fact extraction (G33) — requires tracing the feature, not directly in this file
- Runtime behavior of formulas under edge cases (empty input → 0 rounding, very large numbers, negative values) — no test file read

## Defect Detail

**Line 37** in `_prefill()` iterates `widget.initial` and prefills _v using `_labelsAll.indexOf(f)`. The computed field label "סכום מעוגל" (gen_app_tasks_ent1_c12) is in _labelsAll, so if widget.initial accidentally contains `{"סכום מעוגל": "150"}`, it would set `_v[3] = "150"`. Then:
- **Display** (line 161): ignores _v[3], recalculates from _v[2] → user sees correct formula result
- **Save** (line 52): overwrites _v[3] with recalculated value → the prefilled "150" is silently lost

This violates the learning rule: "computed field = formula only, never external values" (LEARNINGS.md: "הנוסחה היא המקור-היחיד").

Severity: **P1** — the computed field value would be silently discarded if prefilled, creating data loss or inconsistency if the fact extraction system (G33) ever extracts the computed field label.
