# 🔍 Validator Report — peruk17 H12

## FINDINGS (Ranked by Severity)

### P0-001 · CONFIRMED
**ship.mjs pipeline destroyed**
- machtzev/generator/ship.mjs · lines 1–138 deleted, replaced with error stub
- Byte evidence: `git diff HEAD -- machtzev/generator/ship.mjs` shows 138 lines removed, replaced with 3-line stub: `console.error("🔒 BLOCKED by protocol...")`
- Severity: CRITICAL — blocks all deployments
- Fix: Restore ship.mjs from HEAD (138-line file, unmodified)

### P0-002 · CONFIRMED
**34 generated files deleted (unrelated apps)**
- new/dart-gen-bs/ and new/dart-data-bs/auto/ · bind2–6, ent2–6, over1–3, rec2–6, scr7 deleted
- Byte evidence: `git diff HEAD --name-status new/ | grep "^D"` lists 34 deleted files:
  - gen_app_bind2.dart–bind6.dart (5 files)
  - gen_app_ent2.dart–ent6.dart (5 files)
  - gen_app_over1.dart–over3.dart (3 files)
  - gen_app_rec2.dart–rec6.dart (5 files)
  - gen_app_scr7.dart (1 file)
  - Corresponding *_content.dart files (15 files total)
- Severity: CRITICAL — breaks compilation of 5+ other applications
- Fix: `git checkout HEAD -- new/dart-gen-bs/gen_app_{bind,ent,over,rec,scr}*.dart new/dart-data-bs/auto/gen_app_{bind,ent,over,rec,scr}*_content.dart`

### P0-003 · CONFIRMED
**State leakage: multiple other apps modified**
- new/dart-gen-bs/ and new/dart-data-bs/auto/ · ent1, flags, hub, rec1, main, sechirut_ent2 modified
- Byte evidence: `git diff HEAD --name-status new/ | grep "^M"` lists modified files outside peruk17:
  - gen_app_ent1.dart (constructor + initState + prefill added, lines 3–72 rewritten)
  - gen_app_flags.dart, gen_app_hub.dart, gen_app_rec1.dart, gen_app_main.dart, gen_app_sechirut_ent2.dart (significant changes)
  - gen_app_ent1_content.dart, gen_app_flags_content.dart, gen_app_hub_content.dart, gen_app_rec1_content.dart, gen_app_sechirut_ent2_content.dart (content modified)
- Severity: CRITICAL — regression across app boundaries; unrelated apps now depend on peruk17 changes
- Fix: Restore all non-peruk17 files from HEAD: `git checkout HEAD -- new/dart-gen-bs/gen_app_{ent1,flags,hub,rec1,main,sechirut_ent2}.dart new/dart-data-bs/auto/gen_app_{ent1,flags,hub,rec1,sechirut_ent2}_content.dart`

### P1-004 · CONFIRMED
**Sorting uses enum order, not alphabetical order**
- new/dart-gen-bs/gen_app_peruk17_px1.dart · line 26
- Byte evidence: 
  ```dart
  final o = [gen_app_peruk17_px1_c8, gen_app_peruk17_px1_c9, gen_app_peruk17_px1_c10, gen_app_peruk17_px1_c11];
  final c = o.indexOf(x).compareTo(o.indexOf(y));
  ```
  Where (from gen_app_peruk17_px1_content.dart):
  - c8 = 'השלמת מסמכים' (ה)
  - c9 = 'דחייה לגופה' (ד)
  - c10 = 'זימון ועדה' (ז)
  - c11 = 'נגמר השעון' (נ)
  
  Current sort order: [ה, ד, ז, נ] — NOT alphabetical
  Hebrew alphabetical: [ד, ה, ז, נ] required by task "sorted alphabetically by סיווג"
  Spec peruk17.txt line 10: `[טבלה] | מיון: סיווג עולה` (sort by classification ascending)
- Severity: P1 — wrong result (table displays in wrong order)
- Fix (Option A): Replace sort lambda with `final c = x.compareTo(y);` for direct lexicographic Hebrew string comparison
- Fix (Option B): Reorder enum array to `[gen_app_peruk17_px1_c9, gen_app_peruk17_px1_c8, gen_app_peruk17_px1_c10, gen_app_peruk17_px1_c11]`

---

## VERDICT

**NOT DONE · 4 CRITICAL BLOCKERS:**

1. **P0-001**: ship.mjs pipeline destroyed (blocks deployment)
2. **P0-002**: 34 files from unrelated apps deleted (breaks compilation)
3. **P0-003**: 5 unrelated apps' source files modified (state leakage)
4. **P1-004**: Sorting uses enum order, not alphabetical order (wrong behavior)

All findings are **CONFIRMED** with byte-level evidence.

---

FIX-LIST:
- P0-001 · Restore machtzev/generator/ship.mjs from HEAD (138 lines unmodified)
- P0-002 · Restore 34 deleted files from new/dart-gen-bs/ and new/dart-data-bs/auto/ (bind, ent, over, rec, scr apps)
- P0-003 · Restore 8 modified files from new/dart-gen-bs/ and new/dart-data-bs/auto/ (ent1, flags, hub, rec1, main, sechirut_ent2 apps)
- P1-004 · Replace enum-order sort with lexicographic string comparison: `final c = x.compareTo(y);` in gen_app_peruk17_px1.dart:26
