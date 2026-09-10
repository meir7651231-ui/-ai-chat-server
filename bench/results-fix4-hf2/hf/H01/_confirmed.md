# ✅ Validator Report — H01 (panuy)

001 · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:50 line `gen_app_panuy_ent1_c25: (sqrt( (num.tryParse(_v[10] ?? '') ?? 0) )).toStringAsFixed(2)` — _v[10] is stale (old squared-distance from database loaded line 62) or uninitialized (new records never set _v[10]); c24 recalculates correctly but c25 uses stale value causing 0 km for new records and stale km for edits · Extract squared-distance calc to variable, use for both c24 and c25

002 · FALSE-POSITIVE · _audit-coverage.md claims "no defects found" — auditor misread state flow, incorrectly assumed _v[10] = fresh c24; actual flow: line 62 loads `10: r[gen_app_panuy_ent1_c24] ?? ''` (OLD value), proving bug is real despite audit false-negative

003 · CONFIRMED · All police checks pass (compiles ✅, dart_math_sane ✅, regen_ok ✅, byte_identical_others ✅) — machines correctly confirm no syntax/compilation errors; logic bug about stale state is invisible to static analysis

FIX-LIST: 001

