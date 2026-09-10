# Audit: תקרה מחייבת (max ceiling) computed field · H07 sechirut

## Coverage verification

**Task:** Add computed field `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` to בטוחה entity.

### Surfaces checked ✅

| Surface | Status | Details |
|---------|--------|---------|
| Spec definition | ✅ | Line 8: field added with correct max() formula |
| Form save logic | ✅ | Line 51 ent2.dart: `gen_app_sechirut_ent2_c24: max(c21, c23).toStringAsFixed(2)` |
| Form display | ✅ | Line 179 ent2.dart: displayed as read-only `_calc()` widget |
| Entity list card | ✅ | Line 92: field value retrieved from record `r[c24]` |
| Data grid (table) | ✅ | Line 191: column c24 included; values from `r[c24]` |
| CSV export | ✅ | Line 98/100: header and row include c24 |
| Database storage | ✅ | Field stored with computed value in save operation |
| Dart compilation | ✅ | Imports `dart:math`; max() call valid; compiles with 0 errors |
| Field metadata | ✅ | Content file: c24 = 'תקרה מחייבת' (correct label) |
| Police gates | ✅ | All gates pass; max() function check confirms `calc=true fn=true` |

### Implementation detail check

- **Computation:** `max((num.tryParse(_v[6] ?? '') ?? 0), (num.tryParse(_v[7] ?? '') ?? 0))` correctly computes max of two numeric fields with null-safe parsing
- **Storage:** Field saved in database as 2-decimal string via `toStringAsFixed(2)`
- **Display:** Correctly retrieved from database in list/table/CSV views
- **No hand-edit:** `no_hand_edit ✅` confirmed — fully generated
- **Cross-app impact:** `byte_identical_others ✅` — no breakage to other apps

## Findings

No findings. Implementation is complete and correct across all surfaces.

### Coverage confirmed

✅ Spec regenerated correctly with new field  
✅ Computation (max) properly emitted to Dart  
✅ Field present in entity form (display only)  
✅ Field present in entity list view  
✅ Field present in entity table view  
✅ Field present in CSV export  
✅ Field stored/retrieved from database correctly  
✅ No compilation errors or analyzer warnings  
✅ No other apps affected  
✅ All police checks (regen, gates, math, compile) pass  

The task "add computed max ceiling field" is done.
