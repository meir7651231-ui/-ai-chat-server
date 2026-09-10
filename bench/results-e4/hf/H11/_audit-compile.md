# 🔍 Audit Report: sechirut תקרה נמוכה (min) Implementation

## Findings

new/dart-gen-bs/gen_app_sechirut_ent1.dart:54 · min() uses wrong source indices (_v[10], _v[11]) which don't exist when creating new record, causing incorrect 0 result · P0 compile-break · Use computed formulas directly: `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)` instead of `_v[10]` and `_v[11]`

new/dart-gen-bs/gen_app_sechirut_ent1.dart:208 · same issue in display logic: min() reads from _v[10], _v[11] which don't have fresh computed values after user edits, showing stale results · P0 wrong result · Use same formula-based computation as line 54

## Coverage

✅ **Verified correct:**
- dart:math import present (line 11) and min() is standard library function
- Null-safety: `(num.tryParse(...) ?? 0)` patterns are safe from null
- Field label c29 'תקרה נמוכה' correctly defined (gen_app_sechirut_ent1_content.dart:31)
- Spec correctly declares formula: `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`
- Base formulas for c27, c28 correctly computed on lines 205-207
- toStringAsFixed(2) correctly converts num to string with precision

❌ **Could not verify (Dart/Flutter runtime only):**
- Actual execution of min(0, 0) = 0 when creating new record (static analysis confirms indices won't exist)
- Display refresh behavior when user edits שכירות/חודשים fields
- appStore persistence and retrieval flow

## Root Cause

The generator treats computed fields as if their values are **stored in _v** (indices 9-12) after editing, but computes them fresh when saving. Line 54 incorrectly references cached indices instead of recomputing from source fields (_v[3], _v[4]). When creating (not editing), _v[10] and _v[11] don't exist, so both arguments default to 0, breaking the logic.

