# VALIDATOR REPORT — E06 (peruk17 action button)

## Verdict Summary
**TASK: Partially Complete with P0 Regression**
- ✅ peruk17 action button 'שלח תזכורת' correctly added to spec (line 12) and generated into px1 screen
- ✅ Dart compilation passes, null safety intact, button wiring correct
- ❌ **REGRESSION: sechirut_ent2 files regenerated unintentionally, constants renumbered, data corruption risk**
- ❌ **Police report `byte_identical_others ✅` is UNTRUSTWORTHY — git diff shows sechirut_ent2.dart and sechirut_ent2_content.dart modified**

---

## Confirmed Findings

### F1 · CONFIRMED P0 · byte_identical_others check FALSE — machine report contradicts git diff
**Evidence:** `_police.md line 22: "byte_identical_others ✅ CONFIRMED"` vs. `git diff HEAD -- new/dart-gen-bs/gen_app_sechirut_ent2.dart` (23 lines changed) and `git diff HEAD -- new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart` (13 lines changed)
**Detail:** sechirut.txt was not modified, yet sechirut_ent2 app files show non-trivial changes. Police check is incomplete or has a bug in cross-app constant tracking.
**Fix:** Police implementation must detect global constant renumbering across all app files when one app's spec is updated. Fixer should NOT ship this until byte_identical_others is genuinely true OR regression in sechirut is reverted.

### F2 · CONFIRMED P0 · Cross-app constant renumbering cascade (sechirut regression)
**Evidence:** `new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart` constants shifted:
- `c25` was `'מפתח חודש'` → now `'חורג'` (data loss)
- `c26` was `'חורג מול שליש'` → now `'תקין'` (data loss)
- `c27` was `'חורג'` → now `'חורג מול שליש'` (data loss)
- `c29, c30` validation error messages → `c30, c31` (old error text deleted)
- `c31` added new (was not there before)

**Evidence:** `new/dart-gen-bs/gen_app_sechirut_ent2.dart` line 29 `_labelsAll`: `c26` → `c27` (last element changed). Lines 47–52: validation refs `c29, c30` → `c30, c31`. Line 62: field lookup `c26` → `c27`. Line 91: conditional logic `c27/c28` → `c25/c26`. Line 99: CSV body conditional `c27/c28` → `c25/c26`.

**Root cause:** When peruk17 added a particle action, generator renumbered ALL constants globally. peruk17_px1_content.dart expanded (c16, c17 consumed by new action), shifting all sechirut constants down the list.

**Impact:** Data corruption. Existing app store records in sechirut_ent2 with old constant keys will load stale or null values. Error validation will show wrong messages. Conditionals in _card() and CSV export will use wrong constants.

**Fix:** Either (a) isolate constant numbering per-app file, OR (b) revert sechirut.txt to commit state and only run peruk17 generator, OR (c) accept that this is a breaking change and migrate all sechirut_ent2 records (multi-file effort, defer).

### F3 · CONFIRMED P0 · Untrustworthy machine report (police implementation gap)
**Evidence:** `_police.md` claims 6 checks passed including `byte_identical_others ✅ CONFIRMED`, but auditor regression report (independent verification) found sechirut_ent2 files changed.
**Detail:** Police report validation is incomplete. The "claims vs machine" table on lines 18–25 shows the builder's claim was verified, but the actual byte diff contradicts the check.
**Fix:** Fix police.mjs to detect and report cross-app constant renumbering before shipping. This check should NOT pass if any file outside the modified app's directory changed.

---

## FALSE-POSITIVES (Auditor claims verified correct)

**Auditors all agree:**
- ✅ peruk17.txt line 12 correctly adds `חלקיק תיק: [פעולה] שלח תזכורת`
- ✅ Generated peruk17 px1 screen correctly wires button with `DsChipButton(label: gen_app_peruk17_px1_c17='שלח תזכורת', onTap: ...)`
- ✅ No Hebrew in machtzev/generator/*.mjs (only in data constants)
- ✅ No invalid Dart math operations (DsChipButton is pure UI)
- ✅ Compiles with 0 analyzer errors
- ✅ peruk17 particle wiring correct

---

## Summary for Fixer

**The task to add 'שלח תזכורת' button to peruk17 is CORRECT.**
**BUT an unintended side effect broke sechirut_ent2 via global constant renumbering.**

The builder did NOT cause this directly (spec edit is sound). The regression is a **generator implementation issue** (constants should be namespaced per-app, not global).

**This CANNOT ship as-is.** The police report is untrustworthy (F1). The sechirut regression is data-destructive (F2).

---

FIX-LIST:
1. **F1** — Police byte_identical_others check gap: improve detection of cross-app constant renumbering. Quote `_police.md line 22` and show sechirut_ent2.dart/content.dart in detail line (non-trivial diffs detected in git).
2. **F2** — Sechirut constant renumbering: either fix generator to use per-app constant namespacing, OR revert sechirut_ent2 regeneration (git checkout HEAD -- new/dart-gen-bs/gen_app_sechirut_ent2.dart new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart).
3. **F3** — Police report untrustworthy: fix implementation so byte_identical_others check re-scans all app files and fails if any non-target app changed.
