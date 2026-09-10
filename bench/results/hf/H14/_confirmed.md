# VALIDATOR Report — H14 (sechirut findings table sort)

## Findings Verdicts

1. **machtzev/generator/ship.mjs:1–3** · CONFIRMED · P0 COMPILE-BREAK · `git diff HEAD -- machtzev/generator/ship.mjs | head -10` shows 138 lines of code deleted, replaced with blocking error stub. Entire release automation pipeline destroyed. · **Fix: Restore original ship.mjs from HEAD**

2. **machtzev/generator/tighten-types.mjs:1–3** · CONFIRMED · P0 COMPILE-BREAK · `git diff HEAD` shows 256 lines of code deleted, replaced with blocking error stub. G20 type-tightening pipeline disabled. · **Fix: Restore original tighten-types.mjs from HEAD**

3. **machtzev/one.mjs:1–3** · CONFIRMED · P0 COMPILE-BREAK · `git diff HEAD` shows 247 lines deleted, replaced with blocking error stub. Master pipeline coordinator (מנוע-האחד) destroyed. · **Fix: Restore original one.mjs from HEAD**

4. **machtzev/generator/particles.mjs:339** · CONFIRMED · P0 SCOPE-VIOLATION · Sorting logic `const sortedRecsByColor = ...` applied globally to ALL partition particles across all apps, not just sechirut. Evidence: gen_app_peruk01_px2.dart:16 contains identical sort logic; gen_app_peruk02_px2.dart:14, gen_app_peruk04_px2.dart:14, gen_app_peruk05_px2.dart:14, gen_app_peruk06_px2.dart:14, gen_app_peruk09_px2.dart:14 all modified; police report confirms `byte_identical_others ❌`. Task spec required "Don't break anything." · **Fix: Revert line 339–340 in particles.mjs to original code, OR condition sorting on sechirut app context (e.g., `if (entity.name === 'app_sechirut_ent3') { ... sortedRecsByColor = ... }`)**

5. **new/dart-data-bs/auto/** · CONFIRMED · P0 SCOPE-VIOLATION · Eight generated content files modified outside sechirut: gen_app_panuy_px1_content.dart, gen_app_peruk01_px2_content.dart, gen_app_peruk01_rp1_content.dart, gen_app_peruk02_px2_content.dart, gen_app_peruk04_px2_content.dart, gen_app_peruk05_px2_content.dart, gen_app_peruk06_px2_content.dart, gen_app_peruk09_px2_content.dart. Confirmed by police `byte_identical_others ❌`. Evidence: `git diff HEAD -- new/dart-data-bs/auto/gen_app_peruk01_px2_content.dart | head -80` shows constant re-indexing (c106–c133) due to sorting code injection. · **Fix: `git checkout HEAD -- new/dart-data-bs/auto/gen_app_peruk*.dart new/dart-data-bs/auto/gen_app_panuy_px1_content.dart`**

6. **new/dart-gen-bs/gen_app_sechirut_px3.dart:22** · CONFIRMED · P1 INEFFICIENCY · Sorting order (אדום=0, צהוב=1, ירוק=2) is correct and matches task requirement. However, the sort is **redundant**: each partition filters immediately after sorting (`.sort(...).where(...)`), which makes the sort ineffective within each filtered band since all records matching a color value have the same sort key. Evidence: line 22 `(appStore.records(...)\n..sort((a, b) => ...).where((r) => (r[...] ?? '') == band).toList()` — the `where()` restricts to one color, making the sort within that band a no-op. The partition order itself (red DsSection first, yellow second, green third) already provides the correct visual sort order. · **Fix: Remove the `.sort()` cascade from line 22 (and lines 22bis and 22ter for the other color bands). Keep only the `.where(...).toList()` part. Result: same visual order, zero wasted computation.**

---

## Summary

**TASK STATUS: NOT DONE — 4 P0 blockers, 1 P1 inefficiency**

- ✅ **Sechirut sorting spec correct**: אדום → צהוב → ירוק order verified in colors c11/c13/c15 (gen_app_sechirut_px3_content.dart)
- ❌ **System destroyed**: 3 critical pipeline files (ship.mjs, tighten-types.mjs, one.mjs) gutted with error stubs — BLOCKS ALL DEPLOYMENT
- ❌ **Scope violated**: Sorting logic injected globally into 7 unrelated apps (peruk01–09, panuy) — BREAKS CONSTRAINT "Don't break anything"
- ⚠️ **Inefficiency**: Redundant sort-then-filter pattern in sechirut's partition (works but wastes computation)

**FIX-LIST (in order):**
1. Restore machtzev/generator/ship.mjs from HEAD
2. Restore machtzev/generator/tighten-types.mjs from HEAD
3. Restore machtzev/one.mjs from HEAD
4. Revert machtzev/generator/particles.mjs lines 339–340 OR condition on sechirut app context
5. Revert all modified peruk/panuy content files: `git checkout HEAD -- new/dart-data-bs/auto/gen_app_peruk*.dart new/dart-data-bs/auto/gen_app_panuy_px1_content.dart`
6. Remove redundant `.sort()` from gen_app_sechirut_px3.dart line 22 (and duplicates on lines 22bis/22ter)
