# ✔ VALIDATOR FINDINGS — panuy (H08)

## CONFIRMED Findings (Severity Rank)

**P1-001** · **CONFIRMED** · `new/dart-gen-bs/gen_app_panuy_ent1.dart:51` · `_v[8]` undefined for new records → abs(0) instead of correct value · For new records, _v only has {4,5,7}; line 51 tries `num.tryParse(_v[8] ?? '')` which returns '', then null, then 0; should compute directly from base: `(_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) )).toStringAsFixed(2)` to match base-field pattern used for c22, c23, c25.

**P1-002** · **CONFIRMED** · `new/dart-gen-bs/gen_app_panuy_ent1.dart:175` · Same _v[8] reference in display logic · Line 175 `_calc(gen_app_panuy_ent1_c24, _m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` shows 0 for new records; should be `_calc(gen_app_panuy_ent1_c24, _m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) ))` to match line 173–174 pattern.

**P1-003** · **CONFIRMED** · `new/dart-gen-bs/gen_app_panuy_ent1.dart:177` · Same pattern for mרחק בקמ: `_v[11]` undefined for new records → sqrt(0) instead of correct distance · Line 177 `_calc(gen_app_panuy_ent1_c26, sqrt( (num.tryParse(_v[11] ?? '') ?? 0) ))` should inline: `_calc(gen_app_panuy_ent1_c26, sqrt(((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) * ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) * 12321 + ((num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0)) * ((num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0)) * 8649))` — matches direct computation in line 176 for c25.

**P1-004** · **CONFIRMED** · `new/dart-gen-bs/gen_app_panuy_ent1.dart:51` · Same _v[11] issue in save: line 51 `gen_app_panuy_ent1_c26: (sqrt( (num.tryParse(_v[11] ?? '') ?? 0) )).toStringAsFixed(2)` saves 0 for new records instead of true distance · Should inline the same formula as the display fix: `gen_app_panuy_ent1_c26: (sqrt(((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) * ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) * 12321 + ((num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0)) * ((num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0)) * 8649)).toStringAsFixed(2)`

## Summary

All four findings are **real P1 bugs**: intermediate computed fields (_v[8], _v[11]) are referenced before being populated in the _v map for new records, causing abs(0) and sqrt(0) to be saved/displayed instead of correct values. Auditors correctly identified root cause: generator inlined field references rather than field expressions; sequential dependencies require fresh computation from base inputs for new records. Fixes are safe (no side effects, match established pattern from c22–c25), and the code compiles so police flags are correct but incomplete (compilation ≠ correctness).

---

FIX-LIST: P1-001, P1-002, P1-003, P1-004
