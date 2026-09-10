new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:3-4 · columns out of spec order: c3='מחיר לשעה' should be 'מרחק בקמ', c4='מרחק בקמ' should be 'מחיר לשעה' — spec requires [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה in that order · P1 task not done · swap c3↔c4 and c7↔c8 in gen_app_panuy_px1_content.dart and corresponding values in gen_app_panuy_px1.dart line 34

## Coverage
✅ Verified correct:
- Spec syntax documented: SPEC-LANG.md line 17 documents [טבלה] עמודה, עמודה syntax for column selection
- Spec applied: panuy.txt line 6 has [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה
- Exactly 4 columns generated: gen_app_panuy_px1.dart line 34 shows ForceDataGrid with 4 columns
- Only panuy app changed: git diff shows only gen_app_panuy_* and gen_app_sechirut_ent2 (unrelated) modified
- Compiles: police report shows compiles ✅
- No other apps broken: byte_identical_others ✅

❌ Column order defect found:
- Generated c3 = 'מחיר לשעה' but spec order requires מרחק בקמ in position 3
- Generated c4 = 'מרחק בקמ' but spec order requires מחיר לשעה in position 4
- Same swap in item data values c7↔c8
