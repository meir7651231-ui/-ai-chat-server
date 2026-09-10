# Audit Coverage Report: panuy task

## Findings

new/dart-gen-bs/gen_app_panuy_px1.dart:34 · Table columns in wrong order: [name, available, **price, distance**] instead of spec [name, available, **distance, price**] — columns should be [gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c4, gen_app_panuy_px1_c3] and items should map to [c6, c7, c9, c8] · P1 task-not-done · Reorder table columns to match spec line 6: [שם, זמין, מרחק בקמ, מחיר לשעה]

## Verified Correct

✅ Distance calculation (gen_app_panuy_ent1.dart:50, 175): sqrt(squared_distance) implemented with `sqrt( (num.tryParse(_v[10] ?? '') ?? 0) )` where _v[10] is mרחק בריבוע field — sqrt imported from dart:math (line 8), function-call syntax (not method) — complies with police sqrt check.

✅ Sort order (gen_app_panuy_px1.dart:34): Table sorted ascending by distance field (מרחק בקמ) using numeric comparison `nx.compareTo(ny)` — nearest-first ordering is correct per spec "מיון: מרחק בקמ עולה" (ascending = nearest first).

✅ Display surfaces covered: Entity form (ent1.dart) shows all 14 fields including distance-in-km calculated live (line 175); particle table (px1.dart) displays subset with sort; content constants verified in px1_content.dart and ent1_content.dart; police report confirms gates pass, compiles, no hand-edits, no orphans.

**Blocked from checking**: App shell, hub, root navigation, home screen rendering — read-only audit of generated Dart only; flutter build not available in this environment.

