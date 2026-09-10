# Task Audit Report: Tasks Table Sort (H03)

## Finding Summary

**new/dart-gen-bs/gen_app_tasks_ent1.dart:159 · sort applied but shared-engine side effects broke scope · P1 wrong result · revert render-ds.mjs and particles.mjs changes; add sort only to gen_app_tasks_ent1.dart**

## Details

The builder was tasked with: "make the tasks table (the משימה particle screen) sorted by due date מועד, soonest first. Don't break anything."

### What Was Implemented
- **Entity table view (view 3)**: Line 158 in gen_app_tasks_ent1.dart correctly adds sort:
  ```dart
  items: rs.toList()..sort((a, b) => (a[gen_app_tasks_ent1_c10] ?? '').compareTo(b[gen_app_tasks_ent1_c10] ?? ''))
  ```
  Sort applies to gen_app_tasks_ent1_c10 (מועד/due date field), soonest first via lexicographic compareTo.

- **Shared engines modified**: render-ds.mjs (line 586) and particles.mjs (line 387) were changed to auto-sort all tables with date fields.

### Task Coverage Analysis

**Requested surfaces:**
1. **Entity list screen**: No sort detected in card view (view 0 - building the list of DsRecordCard). The list shows individual records as cards. Task says "tables table" which is view 3, not the card view. No defect on card view.
2. **Particle table (mishima/tasks)**: ✅ Table view (view 3) is sorted by מועד, soonest first.
3. **Hub/home screen**: Not present in this app (tasks app has no hub widget).
4. **Report**: CSV export (_csvBtn) exists but not a data-bound widget; no sort needed there.

**Scope breach (P1 severity):**
- Police report shows `byte_identical_others ❌` — 8 peruk files (peruk01-04, peruk19-21, sechirut) were regenerated unintentionally: `gen_app_peruk01_px1_content.dart`, `gen_app_peruk02_px1_content.dart`, `gen_app_peruk03_px1_content.dart`, `gen_app_peruk04_px1_content.dart`, `gen_app_peruk19_px1_content.dart`, `gen_app_peruk20_px1_content.dart`, `gen_app_peruk21_px1_content.dart`, `gen_app_sechirut_px1_content.dart`.
- LEARNINGS.md documents the rule (L2026-09-09-render-sort): "change in shared engine affects all creatures." Modifying render-ds.mjs and particles.mjs (shared across all apps) regenerates ALL table views in all apps, not just tasks.
- This violates the scope: the task was to fix tasks table, not rebuild peruk documents.
- Peruk files are generated from document breakdowns (פירוקים), not engine changes; they should remain byte-identical unless their source spec changes.

**Sort correctness:**
- String `.compareTo()` on dates works only for ISO-8601 format (YYYY-MM-DD). Empty strings (`?? ''`) sort before all dates lexicographically. If date values vary in format or are sometimes unset, sort order could be wrong. Not verified without seeing actual data.

**Police machine verdict:**
- `sort ❌ sortlines=0` — police check did not detect sort in expected form. Likely because:
  - Police check ran on the output before verifying it was rebuilt from modified engines.
  - Or police check looks for a specific pattern/gate that `render-ds.mjs` output doesn't satisfy (e.g., dedicated sort gate missing).
  - The claim `sort_applied` was UNVERIFIED, not confirmed.

## Verified Correct

✅ **Sort syntax and field selection**: gen_app_tasks_ent1.dart line 158 correctly applies sort by c10 (מועד) field using cascade and `.sort()`.

✅ **Gates pass**: police report confirms `gates_pass ✅` — all gates passed after generator changes.

✅ **Regen OK**: police report confirms `regen_ok ✅` — app was regenerated successfully.

❌ **Scope containment**: changes to render-ds.mjs and particles.mjs (shared engines) regenerated 8 unrelated files, violating the "don't break anything" requirement.

❌ **Sort verification by police machine**: `sort` check failed (`sortlines=0`), indicating the sort claim was not independently verified.

---

**Checked:**
- git diff HEAD -- new/dart-gen-bs/gen_app_tasks_ent1.dart: sort present at line 158 in table view
- git diff HEAD -- machtzev/generator/render-ds.mjs: shared engine modification
- git diff HEAD -- machtzev/generator/particles.mjs: shared engine modification
- police report: byte_identical_others ❌, sort ❌, gates_pass ✅, regen_ok ✅
- claims.json: sort_applied marked UNVERIFIED
- specs-ds/tasks.txt: entity definition with מועד field confirmed as c10

**Could not check:**
- Runtime behavior: whether string compareTo on actual date data sorts correctly (format unknown)
- Police machine's sort check logic: exact pattern/gate being verified
- Hub surfaces: no hub screen exists in tasks app to verify
- All peruk affected files: only sampled peruk01_px1.dart
