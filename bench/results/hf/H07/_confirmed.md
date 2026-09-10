# Validation Report: sechirut תקרה מחייבת (H07)

## Field Mapping (verified)
- _v[6] = c21 (תקרה לפי 3 חודשים)
- _v[7] = c23 (תקרה לפי שליש)
- _v[8] = c24 (תקרה מחייבת — should be max(_v[6], _v[7]))

## Verified Findings (ranked by severity)

1. CONFIRMED · P1 TASK-NOT-DONE · new/dart-gen-bs/gen_app_sechirut_ent2.dart:178 · `ForgeDsField(...control: DsField(label: gen_app_sechirut_ent2_c24, value: _v[8] ?? '', onChanged: (v) => setState(() => _v[8] = v))` · Replace ForgeDsField line with `_calc(gen_app_sechirut_ent2_c24, ((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0) ? (num.tryParse(_v[6] ?? '') ?? 0) : (num.tryParse(_v[7] ?? '') ?? 0)))`

2. CONFIRMED · P1 WRONG-RESULT · new/dart-gen-bs/gen_app_sechirut_ent2.dart:50 · `gen_app_sechirut_ent2_c24: _v[8] ?? ''` · Replace with `gen_app_sechirut_ent2_c24: ((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0) ? (num.tryParse(_v[6] ?? '') ?? 0) : (num.tryParse(_v[7] ?? '') ?? 0)).toStringAsFixed(2)`

3. CONFIRMED · P1 WRONG-RESULT · new/dart-gen-bs/gen_app_sechirut_ent2.dart:91 · `values: [..., r[gen_app_sechirut_ent2_c24] ?? '', (((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c28 : gen_app_sechirut_ent2_c29)]` · Replace c24 value with `((num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0) > (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0) ? (num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0) : (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0)).toStringAsFixed(2)` and fix c27 ternary to use r[c20] and r[c23] instead of _v[5] and _v[7]

4. CONFIRMED · P1 WRONG-RESULT · new/dart-gen-bs/gen_app_sechirut_ent2.dart:99 · CSV export in loop over `appStore.records()` uses form state `_v[5], _v[7]` instead of record `r` values in ternary · Replace ternary with `((num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0) > (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0) ? (num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0) : (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0)).toStringAsFixed(2)` or use r[c20]/r[c23] if displaying c27

5. CONFIRMED · P1 WRONG-RESULT · new/dart-gen-bs/gen_app_sechirut_ent2.dart:181 · `_live(gen_app_sechirut_ent2_c27, (((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c28 : gen_app_sechirut_ent2_c29))` · Should display c24 computed value as `_calc(gen_app_sechirut_ent2_c24, ((num.tryParse(_v[6] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0) ? (num.tryParse(_v[6] ?? '') ?? 0) : (num.tryParse(_v[7] ?? '') ?? 0)))`

6. CONFIRMED · P1 WRONG-RESULT · new/dart-gen-bs/gen_app_sechirut_ent2.dart:191 · DataGrid items in `rs.map((r) => [..., (((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? ...)])` uses form state _v instead of record r · Replace ternary with r-based computation: `((num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0) > (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0) ? (num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0) : (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0)).toStringAsFixed(2)` or use r[c20]/r[c23]

FIX-LIST: 1·2·3·4·5·6
