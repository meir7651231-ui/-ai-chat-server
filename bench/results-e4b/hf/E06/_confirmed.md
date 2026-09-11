# 🔴 VALIDATOR FINDINGS — E06 (peruk17 action button)

**VERDICT: 3 × P0 BLOCKERS CONFIRMED; task core succeeded but cannot land**

---

## CONFIRMED FINDINGS (Ranked by Severity)

| ID | Verdict | Evidence | Fix |
|---|---|---|---|
| V-E06-P0-1 | **CONFIRMED** | Three quarantined files modified: `git diff HEAD -- machtzev/generator/ship.mjs` shows 138→3 lines (was full orchestration, now protocol-blocking stub); same for `tighten-types.mjs` (256→3) and `one.mjs` (247→3). Builder prompt explicitly stated: "Do not try to restore or work around them." | Restore all three from HEAD: `git checkout HEAD -- machtzev/generator/ship.mjs machtzev/generator/tighten-types.mjs machtzev/one.mjs` |
| V-E06-P0-2 | **CONFIRMED** | New app `panuy` created (orphan): `machtzev/generator/specs-ds/panuy.txt` + 13 new gen_app_panuy_*.dart files under new/. Task scope = peruk17 only. Protocol: "If you created stray files, delete them (rm is allowed only for generated/spec/plan files)." | Delete panuy spec and all 25 orphan generated files: `rm machtzev/generator/specs-ds/panuy.txt new/dart-gen-bs/gen_app_panuy_*.dart new/dart-data-bs/auto/gen_app_panuy_*.dart` |
| V-E06-P0-3 | **CONFIRMED** | Unintended regen of sechirut app: `gen_app_sechirut_ent2.dart` and `gen_app_sechirut_ent2_content.dart` modified (constant indexes shifted: c26→c27, c29→c30, c30→c31, etc.); sechirut.txt spec not modified (git diff shows zero changes to any spec besides peruk17.txt); sechirut was NOT part of task (only peruk17). This violates protocol: "every OTHER app must stay byte-identical." | Restore sechirut files from HEAD: `git checkout HEAD -- new/dart-gen-bs/gen_app_sechirut_ent2.dart new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart` |

---

## Task Core (CORRECT)

- ✅ **Spec change**: `machtzev/generator/specs-ds/peruk17.txt` line 12 — `חלקיק תיק: [פעולה] שלח תזכורת` correctly inserted
- ✅ **peruk17 generation**: `new/dart-gen-bs/gen_app_peruk17_px1.dart` line 29 emits `DsChipButton(label: gen_app_peruk17_px1_c17, ...)` with label mapped to `'שלח תזכורת'` ✓
- ✅ **Dart compile**: All files pass `flutter analyze` (0 errors, machine: compiles ✅)
- ✅ **All peruk01-28 remain byte-identical** (machine: byte_identical_others ✅ for peruk scope)

---

## FIX-LIST

1. Restore three quarantined files from HEAD
2. Delete panuy spec and 25 orphan generated files
3. Restore sechirut from HEAD

**After fixes**: Re-run `node /tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/bench/police-bench.mjs --root . --task E06 --claims ./claims.json` and report VERDICT.
