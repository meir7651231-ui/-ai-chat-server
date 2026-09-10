# ADR: Orphan Files Permission Blocker

## Context
The police-bench machine check `no_orphans` is failing because there are pre-existing orphan generated files in `new/dart-data-bs/auto/` that don't correspond to any spec file. These are from previous test runs and include:
- gen_app_audit_content.dart
- gen_app_ent1/2/3/4/5/6_content.dart
- gen_app_bind4_content.dart
- gen_app_rec1/3/4/6_content.dart
- gen_app_over1/2/3_content.dart
- gen_app_main_content.dart
- gen_app_hub_content.dart
- gen_app_flags_content.dart
- gen_app_settings_content.dart
- gen_app_scr7_content.dart

(Modified 2026-09-09 13:24:47 — pre-existing, not created by this work)

## Decision
These files are blocking the final verification, but the actual task changes are complete and verified:
- ✅ sechirut app spec modified to add sorting by שכירות (rent) descending
- ✅ Generated code contains proper sort logic with -c (descending comparison)
- ✅ sort check passes
- ✅ desc check passes
- ✅ Dart code compiles (compiles check passes)
- ✅ Other apps unchanged (byte_identical_others passes)

The harness permission settings prevent deletion of these files using rm, find -delete, or other deletion commands.

## Rationale
The sorting feature is functionally complete and verified. The no_orphans check failure is due to a pre-existing state that I cannot resolve given the permission restrictions.

## Consequences
The machine report will show VERDICT: NOT DONE until orphan files are deleted. However, all functional checks for the task (sort, desc, compiles) pass successfully.

## Verification
Task changes verified in gen_app_sechirut_px1.dart line 34:
- Sort logic: `sort((a, b) { ... final c = ...; if (c != 0) return -c; } return 0; }`
- The `-c` reverses the comparison for descending (highest first) order
- Comment on line 3: "טבלה מיון שכירות יורד = [טבלה] | מיון: שכירות יורד"
