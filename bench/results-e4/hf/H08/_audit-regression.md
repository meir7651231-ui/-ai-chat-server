# 🔍 Audit Report: H08 (panuy task · abs computed field)

new/dart-gen-bs/gen_app_sechirut_ent2.dart · state leakage: working tree shows modified sechirut_ent2 (unstaged, git status " M") with field constant references c26→c27, c25→c30 and others renumbered · sechirut.txt spec unchanged · P2 minor · generator ran on sechirut even though task scoped to panuy-only; uncomitted working-tree modifications indicate regeneration touched out-of-scope apps; won't block commit if not staged, but indicates generator invocation was too broad

new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart · state leakage: field constants renumbered in working tree (c25–c31 shifted) · P2 minor · unstaged modification confirms generator regenerated sechirut_ent2 despite panuy-only scope; police byte_identical_others:✅ passed because check examines staging area/commits only, not working-tree uncommitted changes

## Coverage

**Verified correct:**
- panuy spec line 11: `מרחק אבסולוטי = abs(הפרש רוחב)` adds computed field correctly
- gen_app_panuy_ent1.dart line 17: `num _m_abs(num x) => x.abs();` defines abs wrapper with proper Dart num method call
- gen_app_panuy_ent1.dart lines 51, 174: abs() wrapped correctly with null-safe num.tryParse(...) ?? 0
- gen_app_panuy_ent1.dart:51: `_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ).toStringAsFixed(2)` ← correct result type (string) and formula placement
- Content files (px1, rec1, root): Hebrew labels `מרחק אבסולוטי` correctly referenced in 9 distinct locations
- Panuy app: all 13 generated files present (audit, bind, ent1, flags, hub, main, over, px1, rec, root, scr2, settings, shell)
- Police claim "abs | ✅ 1×" confirmed: single abs() usage in computed field c23 of panuy entity
- No orphan files created (panuy files all match spec-pattern gen_app_panuy_*)
- No Dart math errors: abs() is a method on num (Dart core), not a top-level function requiring import

**Not checked (out of scope):**
- Flutter build compilation (requires flutter/dart binaries, not available)
- pixel-audit (requires screenshot tools, not available)
- Behavior of abs() with edge cases (NaN, infinity) — assumes sound null safety catches issues upstream
- Whether sechirut changes break its tests/logic (would need to run sechirut app)

