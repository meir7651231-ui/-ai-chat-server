# Audit Report: panuy.txt compute field task

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:51 · Wrong index in computed field: `_m_abs((num.tryParse(_v[8] ?? '') ?? 0))` always evaluates to 0 for new records because _v[8] (the intermediate הפרש רוחב value) is never populated in the initial _v map. When _save() creates a new record, _v only has indices {4,5,7} set; computed fields _v[8+] don't exist, so _v[8] returns null, becomes '', num.tryParse('') returns null, becomes 0, abs(0)=0. Field מרחק אבסולוטי will always save as 0. Should compute directly from base inputs: `_m_abs((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0))` to match the spec `abs(קו רוחב - קו רוחב שלי)`. · P1 wrong result · Line 51: replace `(_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` with `(_m_abs( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ))`.

new/dart-gen-bs/gen_app_panuy_ent1.dart:175 · Display also uses wrong index: _calc(..., _m_abs((num.tryParse(_v[8] ?? '') ?? 0))) will show 0 for new records being added (before save). When editing existing records, it works because _v is populated from the database. Same fix applies: use direct computation from _v[2] and _v[4]. · P1 wrong result · Line 175: replace `_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )` with `_m_abs( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) )`.

## Verified Correct

✅ **Spec compliance**: The new field `מרחק אבסולוטי = abs(הפרש רוחב)` is correctly added to panuy.txt line 4 and properly appears in content constants (c24) and all field lists.

✅ **Helper function**: `_m_abs(num x) => x.abs()` is correctly defined (line 17) and uses the valid Dart num method `.abs()` — sound null safety (takes `num`, returns `num`).

✅ **Generator chain**: All 14 files generated (gen_app_panuy_*.dart + gen_app_panuy_*_content.dart) exist and compile. Police report confirms `compiles: ✅` and `abs: ✅ 1×` (the helper is called once).

✅ **Other computed fields**: Lines 173–174, 176–177 compute הפרש רוחב, הפרש אורך, מרחק בריבוע, מרחק בקמ directly from base inputs (_v[2], _v[3], _v[4], _v[5]) — those are correct.

✅ **Index mapping**: The _v array structure is sound: indices 0–7 for user inputs + defaults, 8–14 for computed fields. The problem is not the structure, only that line 51/175 try to use _v[8] before it's computed.

**Coverage**: Dart sound null safety ✓ · method validation ✓ · computation semantics ✓ · field registration ✓ · index access (found defects) ✓. Did not run Flutter analyze (tool unavailable) but compilation passed per ./_police.md report.
