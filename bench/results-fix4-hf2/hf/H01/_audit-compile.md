# Audit Report: panuy app distance and sort

## FINDINGS

`new/dart-gen-bs/gen_app_panuy_ent1.dart:50` · Distance in km always 0 for new records; _v[10] (squared distance) is never populated during new-record creation, only during editing. Line 50 tries `sqrt( (num.tryParse(_v[10] ?? '') ?? 0) )`, which parses to sqrt(0)=0 for new records. When sorted in px1, all new entries will show 0 km and sort incorrectly to top regardless of actual coordinates. · **P0 compile-break** · Extract squared distance calculation into variable, use for both c24 and c25: `final sqDist = (( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ) * ( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ) * 12321 + ( (num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0) ) * ( (num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0) ) * 8649); gen_app_panuy_ent1_c25: (sqrt(sqDist)).toStringAsFixed(2),`

## Coverage

**Checked & Sound:**
- Dart import of `dart:math` present (line 8) ✅
- `sqrt()` correctly used as top-level function, not method ✅  
- Null-safety: `num.tryParse(_v[10] ?? '') ?? 0` chain is type-safe ✅
- Sort logic in px1.dart line 34 correctly does ascending numeric sort on 'מרחק בקמ' field (nearest first) ✅
- Editing existing records works: _v[10] correctly populated from database record at line 62 ✅
- All generated Dart passes flutter analyze (per police report) ✅

**Could Not Check:**
- Runtime behavior on actual coordinate data (Dart not installed; auditing from source only)
