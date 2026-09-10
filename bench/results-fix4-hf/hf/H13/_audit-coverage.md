# AUDITOR REPORT — Task H13 (panuy)

## Findings

**new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:3-6** · Column order does not match spec declaration · P1 (wrong result) · Swap c3/c4 so columns read: gen_app_panuy_px1_c1='שם', c2='זמין', c3='מרחק בקמ', c4='מחיר לשעה' (not c3='מחיר לשעה', c4='מרחק בקמ')

## Verified Coverage

**Particle table (px1):**
- ✅ Table declares exactly 4 columns (gen_app_panuy_px1_c1, c2, c3, c4 in px1.dart:34)
- ✅ Table header strings exist in content file (c1-c4 map to שם, זמין, and two other fields)
- ✅ Table data bindings match header count (4 row fields: c5-c8 in px1.dart:34)
- ❌ **Column order is wrong:** spec line 6 declares `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` (in that order), but generated content has c3='מחיר לשעה' (should be c3='מרחק בקמ') and c4='מרחק בקמ' (should be c4='מחיר לשעה')

**Spec syntax compliance:**
- ✅ LEARNINGS.md line 8 documents rule: "עמודות מופצות בסדר-ההצהרה בספק" (columns distributed in declaration order)
- ✅ particles.mjs:124-138 correctly parses `[טבלה] field1, field2, field3` as comma-separated list
- ✅ spec file (panuy.txt line 6) has correct spec syntax with 4 columns named
- ✅ Police report confirms 4 columns exist and 'km' present 3× (spec, header, data reference)

**Could not verify:**
- ✅ Column order in rendered app UI (Flutter not installed; Dart analyzer only confirms syntax, not sort order in generated constants)
- ✅ Whether entity list screen (ent1) should also respect the column limit (spec line 4 defines entity; entity list ent1 shows 14 columns; task only requires particle table to show 4)
