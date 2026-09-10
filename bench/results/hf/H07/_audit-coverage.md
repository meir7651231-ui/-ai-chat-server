# Audit: Sechirut תקרה מחייבת (max-ceiling) Field · H07

## Findings

new/dart-gen-bs/gen_app_sechirut_ent2.dart:178 · תקרה מחייבת rendered as INPUT field instead of COMPUTED display · P1 wrong result · Remove ForgeDsField; replace with `_calc(gen_app_sechirut_ent2_c24, ((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0) ? (num.tryParse(_v[6] ?? '') ?? 0) : (num.tryParse(_v[7] ?? '') ?? 0)))`

new/dart-gen-bs/gen_app_sechirut_ent2.dart:50 · תקרה מחייבת saved as user input `_v[8]` instead of computed max · P1 wrong result · Change `gen_app_sechirut_ent2_c24: _v[8] ?? ''` to `gen_app_sechirut_ent2_c24: (((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? _v[6] : _v[7]) ?? ''`

new/dart-gen-bs/gen_app_sechirut_ent2.dart:91 · max-ceiling ternary compares wrong operands: `_v[5]` (סך בטוחות) > `_v[7]` (תקרה לפי שליש), returns status labels instead of max value · P1 wrong result · Should compare `_v[6]` > `_v[7]` and return max numeric value, not enum labels: `(((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? (num.tryParse(_v[6] ?? '') ?? 0) : (num.tryParse(_v[7] ?? '') ?? 0)).toStringAsFixed(2)`

new/dart-gen-bs/gen_app_sechirut_ent2.dart:99 · CSV export has same wrong ternary in last column as line 91 · P1 wrong result · Apply same fix to _csv() function's final ternary for c27 placeholder

new/dart-gen-bs/gen_app_sechirut_ent2.dart:181 · Live display of c27 uses wrong ternary with wrong operands/return values, should display computed c24 instead · P1 wrong result · Replace ternary with: `_calc(gen_app_sechirut_ent2_c24, ((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0) ? (num.tryParse(_v[6] ?? '') ?? 0) : (num.tryParse(_v[7] ?? '') ?? 0)))`

new/dart-gen-bs/gen_app_sechirut_ent2.dart:191 · Data grid (table view) has same wrong ternary in last column · P1 wrong result · Apply same max-value ternary fix to table render

## Coverage

**Checked (all entity screens, data persistence, display formats):**
- Entity ent2 (בטוחה) field definitions: c20 (סך בטוחות, computed correctly as sum), c21 (תקרה לפי 3 חודשים), c23 (תקרה לפי שליש), c24 (תקרה מחייבת, **not computed**)
- Form input generation (line 178): c24 mistakenly rendered as editable text field via ForgeDsField
- Save/persistence logic (line 50): c24 mapped to user input `_v[8]` instead of computed max formula
- Card display (line 91): Wrong ternary operands and return values (comparing _v[5] with _v[7], returning enum labels not values)
- CSV export (line 99): Same garbled ternary as card display
- Table view (line 191): Same garbled ternary as card display
- Live calculation display (line 181): Shows computation of wrong field (c27 status, not c24 value)
- Spec compliance: Spec line 8 defines `תקרה מחייבת = תקרה לפי 3 חודשים > תקרה לפי שליש ? תקרה לפי 3 חודשים : תקרה לפי שליש` (i.e., max of two ceilings). Generated code implements ternary but with wrong operands and wrong return type.

**Not checked (requires Flutter runtime):**
- Form validation (miss.add checks on lines 44–49): Validation for c24 not added; code allows any input or blank
- _edit() reconstruction (line 59–64): Loads c24 from record but doesn't recompute
- Display in record cards after save/edit cycle
- Undo/redo in appStore interaction
