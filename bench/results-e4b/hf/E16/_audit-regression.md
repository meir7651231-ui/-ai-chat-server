# 🔍 Regression Audit — peruk08 stage addition

## Findings

### new/dart-gen-bs/gen_app_peruk08_home.dart:66
**Stage index out of bounds when marking task as done**
- Line 66: `appStore.advance('app_peruk08_ent1', rid, 6);`
- **Issue:** With 6 stages total (indices 0–5), advancing to stage 6 exceeds the final stage (סגור = stage 5). Constants c6–c11 in content file show stages are indexed 0–5; line 201 clamps to `.clamp(0, 5)`.
- **Severity: P1** (wrong result — record saved to invalid state, clamped on display but corrupted in store)
- **Fix:** Change to `appStore.advance('app_peruk08_ent1', rid, 5);` to match final stage index

### new/dart-gen-bs/gen_app_peruk08_ent1.dart:90
**Same out-of-bounds stage in card advance action**
- Line 90: `onAdvance: () => appStore.advance('app_peruk08_ent1', rid, 6)`
- **Issue:** Callback to advance button passes stage 6, which is out of range (max 5).
- **Severity: P1** (wrong result — same as above)
- **Fix:** Change to `onAdvance: () => appStore.advance('app_peruk08_ent1', rid, 5)`

---

## Verified correct

✓ **Stage constant indexing:** peruk08.json, apps/peruk08.json, and gen_app_peruk08_ent1_content.dart all correctly define 6 stages with constants c22–c27 (ent1) and c6–c11 (home).

✓ **Stage count consistency:** New stage "הוחזר הכסף" properly inserted at position 4 (between נמסר and סגור); no off-by-one in content generation.

✓ **Other peruk specs untouched:** git diff confirms only peruk08.json, peruk08.txt, and generated peruk08_*.dart files changed; peruk01–07, peruk09–28 remain byte-identical.

✓ **Closure consistency:** Line 160 correctly auto-closes stale records to stage '5' (final stage), but lines 66/90 break by trying stage 6—state leakage if record stored but clamped on display.

✓ **Compilation:** Flutter analyzer passes (police report: ✅). Bug is semantic/logical, not syntactic.

---

## Coverage note

Could not verify: AppStore.advance() semantics (whether it sets stage directly or increments). Audit assumes it sets the stage to the given value, making 6 invalid for 6 stages (0–5). If AppStore has special handling for out-of-range values (silent clamp or rollback), bugs may be masked but remain latent.
