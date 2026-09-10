# Audit: Edge-Crash + Compile (peruk08 counter particle)

## Findings

new/dart-gen-bs/gen_app_peruk08_px1.dart:35 · `Iterable.where().length` calls `.length` on `Iterable<Map<String, String>>`, which does not have a `.length` property (only `List` has it) · P0 compile-break · wrap with `.toList()`: `.where(...).toList().length.toDouble()...`

## Coverage

✓ Verified enum field conversion: "האם כבר פנו למוכר" correctly converted to `DsEnumField` with options [כן, לא, לא יודע] in gen_app_peruk08_ent1.dart:146
✓ Verified enum values stored correctly: gen_app_peruk08_ent1_c15-c17 = [כן, לא, לא יודע]
✓ Verified counter particle added to screen: gen_app_peruk08_px1.dart:35 displays counter with KvLine
✓ Verified counter field/value mapping: gen_app_peruk08_px1_c123='האם כבר פנו למוכר', gen_app_peruk08_px1_c124='לא'
✓ Verified null-safety in counter filter: `(r[...] ?? '')` handles missing values
✓ Verified counter wiring: animates with appStore, correctly labeled 'לא פנו'
✗ Could not verify: actual Flutter compilation (Dart tools not available); counters run with `.toList()` workaround elsewhere (gen_app_peruk08_ent1.dart:152 shows `.where(...).toList()` pattern)
