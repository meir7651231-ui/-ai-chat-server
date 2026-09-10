# Validator Report — H11 (sechirut תקרה נמוכה)

## Findings

min_index_bug · CONFIRMED P0 · new/dart-gen-bs/gen_app_sechirut_ent1.dart:54 `gen_app_sechirut_ent1_c29: (min( (num.tryParse(_v[10] ?? '') ?? 0) , (num.tryParse(_v[11] ?? '') ?? 0) )).toStringAsFixed(2)` — When creating new record, _v[10] and _v[11] do not exist (only [0-8] populated), causing min(0,0)=0 instead of correct formula. · Replace with: `gen_app_sechirut_ent1_c29: (min( (num.tryParse(_v[3] ?? '') ?? 0) * 3 , (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3 )).toStringAsFixed(2)`

min_index_bug_display · CONFIRMED P0 · new/dart-gen-bs/gen_app_sechirut_ent1.dart:208 `_calc(gen_app_sechirut_ent1_c29, min( (num.tryParse(_v[10] ?? '') ?? 0) , (num.tryParse(_v[11] ?? '') ?? 0) ))` — Same issue: display uses stale cache instead of recomputing from source; user edits to rent/months show wrong תקרה נמוכה. · Replace with: `_calc(gen_app_sechirut_ent1_c29, min( (num.tryParse(_v[3] ?? '') ?? 0) * 3 , (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3 ))`

regression_shared_infrastructure · CONFIRMED P0 · machtzev/generator/ship.mjs machtzev/one.mjs machtzev/generator/tighten-types.mjs gutted to 3-line blocking stubs instead of 138/248/257 lines · `git diff HEAD` shows files replaced with console.error("🔒 BLOCKED by protocol:…"); process.exit(2); causing break to shared build pipeline used by all apps/teams. · Restore all three files from HEAD; only police-bench.mjs is permitted to run per protocol.

## Verdict

Task-specific min() field wiring: **BROKEN** (indices wrong; auditors 1–2 CORRECT, auditor 3 misanalyzed). Regression: **CONFIRMED** (shared infra gutted; auditor 3 CORRECT).

FIX-LIST: min_index_bug, min_index_bug_display, regression_shared_infrastructure
