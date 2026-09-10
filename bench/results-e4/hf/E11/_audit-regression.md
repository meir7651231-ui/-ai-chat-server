# Audit Report — peruk02 field rename task

## Findings

`new/dart-gen-bs/gen_app_sechirut_ent2.dart:26` · state leakage: constant reference changed from `gen_app_sechirut_ent2_c26` to `gen_app_sechirut_ent2_c27` in `_labelsAll` · P0 compile-break · rollback entire sechirut_ent2 file, verify task only regenerates peruk02 namespace

`new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:27-34` · state leakage: constants c24–c30 remapped, c31 added, causing duplicate strings ("חורג" and "תקין" appear twice) · P1 wrong result · verify that sechirut spec was not intended to change; if regression, restore from HEAD

## Coverage

**Verified correct:**
- `machtzev/generator/specs-ds/peruk02.txt`: field "תיקונים*" correctly renamed to "תיקונים שנדרשו*"
- `machtzev/generator/apps/peruk02.json`: field label at [6][74] updated from 'תיקונים' to 'תיקונים שנדרשו' ✓
- `new/dart-data-bs/auto/gen_app_peruk02_ent1_content.dart:c15` correctly changed from 'תיקונים' to 'תיקונים שנדרשו' ✓
- `new/dart-data-bs/auto/gen_app_peruk02_px1_content.dart:c7,c19` correctly updated ✓
- `new/dart-data-bs/auto/gen_app_peruk02_root_content.dart:c24,c25,c26,c54` correctly updated ✓
- No orphan files created for peruk02 ✓
- No other app spec files (machtzev/generator/specs-ds/{calendar,panuy,peruk01,peruk03}.txt etc) were modified ✓
- Police report compiles: analyzer errors = 0 ✓

**Could not verify (read-only audit):** exact business logic correctness of sechirut constant remapping (requires full semantic diff of sechirut.json and spec to detect if constants were legitimately reordered during a full regeneration, or if this is unintended drift).

