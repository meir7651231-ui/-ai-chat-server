# Auditor Report: sechirut color-sort regression

## Findings

**new/dart-gen-bs/gen_app_peruk01_px2.dart:14** · state-leakage: sort-color logic applied to unintended apps · P1 wrong result · Modify particles.mjs line 347 to apply sort-color only when entity is 'app_sechirut_ent1', not all partitions

**new/dart-gen-bs/gen_app_peruk02_px2.dart:14** · state-leakage: sort-color logic applied to peruk02 partition · P1 wrong result · Same fix as peruk01

**new/dart-gen-bs/gen_app_peruk04_px2.dart:14** · state-leakage: sort-color logic applied to peruk04 partition · P1 wrong result · Same fix as peruk01

**new/dart-gen-bs/gen_app_peruk05_px2.dart:14** · state-leakage: sort-color logic applied to peruk05 partition · P1 wrong result · Same fix as peruk01

**new/dart-gen-bs/gen_app_peruk06_px2.dart:14** · state-leakage: sort-color logic applied to peruk06 partition · P1 wrong result · Same fix as peruk01

**new/dart-gen-bs/gen_app_peruk09_px2.dart:14** · state-leakage: sort-color logic applied to peruk09 partition · P1 wrong result · Same fix as peruk01

**new/dart-gen-bs/gen_app_peruk01_rp1.dart** · state-leakage: same sorting affecting reports · P1 wrong result · Same root cause as px2 screens

## Coverage

**Verified correct:**
- Sechirut's sort-color logic is correctly implemented in gen_app_sechirut_px1.dart: partitions for ממצא by צבע now emit sort expressions with 3 bands (אדום=0, צהוב=1, ירוק=2)
- The Dart syntax of the sort comparator is sound: `..sort((a, b) => (ternary ? 0 : 1 : 2 : 999).compareTo(...))` is valid
- The sort order (red first) matches task requirement
- Content data files (gen_app_sechirut_*_content.dart) generated correctly with no unintended content shifts

**Could not check (Dart/Flutter not installed):**
- Whether the sort logic preserves referential stability when comparing records with missing/null color values
- Actual render behavior of sorted sections in apps; verify peruk0X apps do not display findings tables

**Root cause:** `machtzev/generator/particles.mjs` line 347 applies color-band sorting to ALL partition kinds when `s.kind === 'partition'`. The code should be gated to apply only to sechirut (or to partitions explicitly marked for color sorting in spec). Peruk01–09 all define a ממצא entity with צבע enum but do not intend color-ordered display. The builder applied a global engine change instead of app-specific logic.
