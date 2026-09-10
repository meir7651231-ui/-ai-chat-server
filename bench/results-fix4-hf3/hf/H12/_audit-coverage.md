# Audit Coverage: peruk17 sort directive

## Findings

gen_app_peruk17_px1.dart:26 · Sort uses enum index (declaration order), not alphabetical string order; enum declared as (ה,ד,ז,נ) but alphabetical is (ד,ה,ז,נ) — rows will not sort alphabetically as task requires · P1 · Fix: change `final c = o.indexOf(x).compareTo(o.indexOf(y));` to `final c = x.compareTo(y);` OR reorder enum in spec from {השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון} to {דחייה לגופה|השלמת מסמכים|זימון ועדה|נגמר השעון}

## Coverage Verified

✅ Spec change: peruk17.txt line 10 updated with sort directive `| מיון: סיווג עולה`
✅ Generated files: All px1 files present (gen_app_peruk17_px1.dart, gen_app_peruk17_px1_content.dart)
✅ Sort logic present: items.toList()..sort() chain applied on line 26
✅ Compiles: police report shows no analyzer errors
✅ No other apps broken: byte_identical_others check passed

## What could not be checked

- Runtime sort behavior (no Flutter runtime available)
- Whether other peruk17 surfaces (entity screen, hub, report) are affected (checked only particle table px1)
