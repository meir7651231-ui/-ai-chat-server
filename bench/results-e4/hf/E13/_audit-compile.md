# Audit Report — peruk12 Task (E13)

## Findings

**new/dart-gen-bs/gen_app_peruk12_ent1.dart:48** · Division by zero on Infinity.toStringAsFixed(2) crash · P0 compile-break · Guard denominator: `final denom = num.tryParse(_v[4] ?? '') ?? 0; if (denom == 0) '0.00' else ((num.tryParse(_v[3] ?? '') ?? 0) / denom).toStringAsFixed(2)`

**new/dart-gen-bs/gen_app_peruk12_ent1.dart:174** · Same divide-by-zero crash in form display · P0 compile-break · Same fix: check denom != 0 before passing to _calc; return safe value (0.0) if denom is zero

## Coverage & Verification

✅ **Checked:**
- Generated Dart file structure (gen_app_peruk12_ent1.dart) — parsed correctly with valid syntax
- Formula placement in _save() method (line 48) and live calculation in form (line 174)
- Null-safety pattern: `num.tryParse(_v[3] ?? '') ?? 0` correctly handles empty/null input
- Field index mapping (_v[3]=מחיר, _v[4]=קילומטראז׳) — correct mapping to spec
- Content file gen_app_peruk12_ent1_content.dart — all 25 constants defined correctly

❌ **Could not verify:**
- Actual Flutter runtime behavior (Flutter/Dart not installed)
- Whether police tests actually ran the form render with empty denominator
- Data content files (auto/gen_app_peruk12_*.dart) — skipped due to scale

## Root Cause

The formula `((num.tryParse(_v[3] ?? '') ?? 0) / (num.tryParse(_v[4] ?? '') ?? 0)).toStringAsFixed(2)` does not guard against divide-by-zero. In Dart:
- Empty קילומטראז׳ → tryParse→null → ??0
- Any non-zero מחיר / 0 → Infinity (double)
- Infinity.toStringAsFixed(2) → **RangeError at runtime**

The crash occurs in two paths:
1. **Form rendering** (line 174): when user views the form without entering קילומטראז׳, _calc() is called with Infinity
2. **Save** (line 48): when user tries to save, toStringAsFixed crashes

Both are blocking bugs that will cause the app to crash when entering a price without a kilometer reading.
