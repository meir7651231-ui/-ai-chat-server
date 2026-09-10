new/dart-gen-bs/gen_app_sechirut_ent2.dart:181 · תקרה מחייבת computation uses _v[5] (סך בטוחות) instead of _v[6] (תקרה לפי חודשים); should compare (num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0) · P1 compile-break or task not done · Fix: change (((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c28 : gen_app_sechirut_ent2_c29) to ((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0) ? (num.tryParse(_v[6] ?? '') ?? 0) : (num.tryParse(_v[7] ?? '') ?? 0)).toStringAsFixed(2)

new/dart-gen-bs/gen_app_sechirut_ent2.dart:181 · תקרה מחייבת display shows c27 (חורג מול שליש) label and returns status string instead of numeric value; should be c24 (תקרה מחייבת) with numeric max · P1 wrong result · Fix: change gen_app_sechirut_ent2_c27 to gen_app_sechirut_ent2_c24 and return numeric value

new/dart-gen-bs/gen_app_sechirut_ent2.dart:91 · _card method has same formula bug: (((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? ...) should compare _v[6] and _v[7] and return numeric max · P1 wrong result · Fix: apply same formula correction as line 181

new/dart-gen-bs/gen_app_sechirut_ent2.dart:99 · _csv method has same formula bug in export; return value mismatch with display · P1 wrong result · Fix: apply same formula correction as line 181

new/dart-gen-bs/gen_app_sechirut_ent2.dart:178 · תקרה מחייבת (c24) shown as editable input field with _v[8], but spec requires it to be computed; user should not input this value · P2 minor · Fix: remove ForgeDsField for c24 and replace with _calc display like line 174 for סך בטוחות

new/dart-gen-bs/gen_app_sechirut_ent2.dart:50 · Save method stores _v[8] as c24, but c24 should be computed from _v[6] and _v[7], not user input · P2 minor · Fix: compute c24 value instead of reading from _v[8]; store: gen_app_sechirut_ent2_c24: ((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0) ? (num.tryParse(_v[6] ?? '') ?? 0) : (num.tryParse(_v[7] ?? '') ?? 0)).toStringAsFixed(2)

new/dart-gen-bs/gen_app_sechirut_ent2.dart:191 · DataGrid display has same formula bug as _card · P1 wrong result · Fix: apply same formula correction

## Coverage

Checked:
- Formula correctness: תקרה מחייבת should be max(_v[6], _v[7]) in Dart (using ternary operator since max() not available in spec parser); currently using wrong field (_v[5] instead of _v[6])
- Return type: formula should emit numeric value via toStringAsFixed(2), not enum status strings (c28='חורג'/c29='תקין')
- Display consistency: label mismatch (c27 vs c24) across form display, record card, CSV export, and data grid
- Editable field correctness: computed fields must be read-only via _calc() widget, not ForgeDsField with user input
- State leakage: sechirut app only (20 files), no cross-app contamination detected
- Spec update: sechirut.txt was correctly updated with ternary operator; generator failed to implement it correctly

Could not check:
- Runtime behavior of the application (Dart/Flutter not installed)
- Whether police-bench's calc/max checks would pass with corrected formula
- Whether existing records in storage are affected or need migration
