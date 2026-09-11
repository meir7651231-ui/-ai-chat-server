# VALIDATOR REPORT — M04 (peruk17)

## Summary
**3 CONFIRMED findings**: 1 P0 blocker (ship.mjs quarantined), 2 P1 correctness issues (field type + regression).

---

## FINDINGS

### F1 · CONFIRMED P0 · machtzev/generator/ship.mjs:2-3 · Blocker prevents pipeline
**Evidence:** `git diff HEAD -- machtzev/generator/ship.mjs` shows 138→3 lines; lines 2-3 contain `console.error("🔒 BLOCKED by protocol...") process.exit(2)` · original ship.mjs pipeline replaced with quarantine code.

**Verdict:** CONFIRMED. Ship.mjs is quarantined with protocol blocker that prevents execution. This is not a bug — it's intentional lockdown per the protocol. However, for the submission to be valid, this must be restored to the original functional code before ship/regen can run.

**Fix:** Restore machtzev/generator/ship.mjs from prior commit (undo the blocker injection).

---

### F2 · CONFIRMED P1 · machtzev/generator/apps/peruk17.json:81-85 · Field type mismatch
**Evidence:** `cat machtzev/generator/apps/peruk17.json | sed -n '75,90p'` shows field declared as `"type": "text"` · rendering code (new/dart-gen-bs/gen_app_peruk17_px1.dart:35) uses `num.tryParse(r[...] ?? '') ?? 0` · particle spec (machtzev/generator/specs-ds/peruk17.txt:17) defines `[מספר]` (number) type · mismatch between schema type (text) and particle intent (numeric).

**Verdict:** CONFIRMED. Field "ימים לתגובה" is stored as text but rendered as a number. While the code is safe (fallback to 0), it violates schema-particle contract. If a user enters non-numeric text, it will silently display as 0 instead of rejecting invalid input.

**Fix:** Change field type from `"text"` to `"num"` in apps/peruk17.json line 80–85 to align schema with particle semantics.

---

### F3 · CONFIRMED P1 · new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart + new/dart-gen-bs/gen_app_sechirut_ent2.dart · Regression into unrelated app
**Evidence:** `git diff HEAD -- new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart` shows content constants re-indexed (c25–c31 mapping shifted); `git diff HEAD -- new/dart-gen-bs/gen_app_sechirut_ent2.dart | head -80` shows semantic logic changes (references to `c26` changed to `c27`, `c29`/`c30` changed to `c30`/`c31`) · `git diff HEAD -- machtzev/generator/specs-ds/sechirut.txt` returns empty (no spec change) · claim "No other apps modified; only peruk17 app output changed" is violated.

**Verdict:** CONFIRMED. Sechirut app (separate from task target peruk17) was unintentionally regenerated. Content constant indices shifted and logic references were updated to match. Root cause: generator re-ran on sechirut when task scope was peruk17 only. Sechirut spec (sechirut.txt) was not modified, but its generated outputs changed—evidence of a generator ordering/filtering bug or unintended re-indexing pass.

**Fix:** Revert new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart and new/dart-gen-bs/gen_app_sechirut_ent2.dart to HEAD state (or re-run generator with `--name sechirut` alone to verify idempotency).

---

## FINAL VERDICT

**FIX-LIST:**
1. Restore machtzev/generator/ship.mjs (remove blocker, restore original 138-line pipeline)
2. Change field type in machtzev/generator/apps/peruk17.json line 80: `"type": "text"` → `"type": "num"`
3. Revert generated sechirut files to HEAD (new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart + new/dart-gen-bs/gen_app_sechirut_ent2.dart)
