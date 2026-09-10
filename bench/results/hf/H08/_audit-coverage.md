new/dart-gen-bs/gen_app_panuy_ent1.dart:49 · Computed field מרחק אבסולוטי uses undefined _v[8] during save(); should compute directly as ((num.tryParse(_v[2]??'')??0)-(num.tryParse(_v[4]??'')??0)).abs() · P1 · Replace _v[8] reference with inline computation matching הפרש רוחב formula

**Verified coverage:**
- ✅ Spec updated: panuy.txt line 4 contains field definition "מרחק אבסולוטי = (הפרש רוחב).abs()"
- ✅ Content constants: gen_app_panuy_ent1_content.dart line 26 defines label "מרחק אבסולוטי" (c24)
- ✅ Entity form screen: field included in _labelsAll (line 30), displayed in DsRecordCard (line 90), rendered in grid (line 187)
- ✅ CSV export: included in export headers and data (lines 96-98)
- ✅ Live calculation: field rendered with _calc() callback (line 173)
- ⚠️ Computation logic defect: save() method line 49 references _v[8] which is not populated when creating new records, causing field to always compute as 0 instead of abs(latitude_difference)
- ✅ Police checks pass: regen_ok, gates_pass, calc, abs (2× .abs() calls found, but logic is incorrect)
- ✅ All surfaces covered with field (except computation is broken): entity detail, list view, table/grid, record card, CSV export
