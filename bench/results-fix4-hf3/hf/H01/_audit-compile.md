# Audit Report: panuy (distance sorting + real distance in km)

## Findings

`new/dart-gen-bs/gen_app_panuy_ent1.dart:50` · Distance in km (c25) calculated from uninitialized _v[10]; creates sqrt(0)=0.0 for all new records · **P0 task not done** · Extract squared-distance calc to variable, reuse in both c24 and c25: `final sq = (...).toStringAsFixed(2); gen_app_panuy_ent1_c24: sq, gen_app_panuy_ent1_c25: (sqrt(num.tryParse(sq)??0)).toStringAsFixed(2)`

`new/dart-gen-bs/gen_app_panuy_ent1.dart:175` · Display calc for distance in km uses _v[10] (squared dist from storage), not form inputs; shows 0 km during data entry before save · **P0 wrong result** · Duplicate squared-distance expr or extract to variable and reuse

`new/dart-gen-bs/gen_app_panuy_px1.dart:34` · Table column order (name, available, price, distance) does not match spec order (name, available, distance, price); spec line 6: "[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה" · **P1 spec mismatch** · Reorder columns and items in ForgeDataGrid: columns [c1,c2,c4,c3], items [c6,c7,c9,c8]

**Severity: P0 BLOCKS TASK** — new records save distance=0 instead of calculated km; sorting fails for new entries.

## Verified Correct

✅ sqrt() imported as function (dart:math, line 8 ent1.dart), not called as method  
✅ Sorting logic in px1.dart:34 sorts by distance (c5='מרחק בקמ') in ascending order (nearest first), numeric compareTo used  
✅ No compile errors; analyzer passes; null safety sound (num.tryParse guards, ?? 0 fallbacks)  
✅ Squared-distance formula in save (c24) calculates correctly from form coordinates _v[2..5]  
✅ sqrt applied only to positive values (worst case sqrt(0)=0, type-safe)

**Could not verify at read-only audit level:** actual distance values in running app; whether sqrt(0) persists after data save; whether new records actually get distance=0 in appStore (would require runtime trace).

