# 🔍 AUDITOR REGRESSION REPORT — E06 (peruk17 action button)

## Findings

`new/dart-gen-bs/gen_app_sechirut_ent2.dart:29` · State leakage: constant references renumbered (c26→c27, c29→c30, c30→c31) despite sechirut.txt unchanged · P0 REGRESSION · **Verify why unrelated app (sechirut) regenerated when task specifies only peruk17.txt edit**

`new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart` · Content constant reordering: c25 'מפתח חודש'→deleted, c27='חורג'→c25, c26='חורג מול שליש'→c27; validation refs shifted c29→c30, c30→c31 · P0 REGRESSION · **Cross-app content namespace corruption**

`_police.md line 22` · Machine claim "byte_identical_others ✅ CONFIRMED" contradicts observed git diff: sechirut_ent2.dart and sechirut_ent2_content.dart both have non-trivial diffs · P1 UNTRUSTWORTHY-REPORT · **Check police implementation for completeness**

## Verified Correct

- ✅ peruk17.txt: line 12 added `חלקיק תיק: [פעולה] שלח תזכורת` (correct syntax)
- ✅ gen_app_peruk17_px1.dart:29 contains `DsChipButton(label: gen_app_peruk17_px1_c17, onTap: ...)` with c17='שלח תזכורת' (correct label, wired to existing screen nav)
- ✅ gen_app_peruk17_px1_content.dart contains c17 'שלח תזכורת' (task label present)
- ✅ No Hebrew in machtzev/generator/*.mjs files; spec-only insertion ✅
- ✅ DsChipButton is pure UI component; no invalid Dart math ops (DsChipButton, num.tryParse used correctly)
- ✅ No orphan gen_app_*.dart with missing spec entry (peruk17 px1 maps to spec line 12)

## Coverage

**Checked:** peruk17 spec edit (1 line), px1 screen Dart generation (DsChipButton), content constant wiring (c17), machine police report claims.

**Cannot Check:** why sechirut regenerated (not readable: need generator's decision tree or regen.mjs cross-reference logic); whether content renumbering is data-loss (need old app store schema to verify field indices stay intact).

**VERDICT:** Task partially complete (button added to peruk17 ✓) but **regression introduced to sechirut_ent2**. Police report is untrustworthy due to false-positive byte_identical_others claim.

