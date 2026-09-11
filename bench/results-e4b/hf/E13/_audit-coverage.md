# 🔍 Audit Coverage: peruk12 — קילומטראז׳ + מחיר לקמ

## Findings

`machtzev/generator/apps/peruk12.json:66` · קילומטראז׳ field type is "text" but should be "num" for numeric arithmetic · P1 task not done · change line 66 from `"type": "text"` to `"type": "num"`

## Coverage verified

**Entity list screen** (gen_app_peruk12_ent1.dart):
- Input field for קילומטראז׳: ✅ present (ForgeDsField at line 173, _v[4])
- Input field for מחיר: ✅ present (ForgeDsField at line 172, _v[3])
- Computed field display for מחיר לקמ: ✅ present (at line 174, formula: `(num.tryParse(_v[3] ?? '') ?? 0) / (num.tryParse(_v[4] ?? '') ?? 0)`)
- CSV export includes both fields: ✅ confirmed (lines 95–97, both in headers and values)
- Record card display: ✅ includes all 8 fields (line 88, all c9–c17)
- Edit flow: ✅ loads computed field from store (line 60, _v[5] = r[gen_app_peruk12_ent1_c15])

**Particle table** (gen_app_peruk12_px1.dart, gen_app_peruk12_px1_content.dart):
- Table columns include קילומטראז׳: ✅ c5 = 'קילומטראז׳' (content.dart:7)
- Table columns include מחיר לקמ: ✅ c6 = 'מחיר לקמ' (content.dart:8)
- Data grid renders both columns: ✅ line 25 renders [c1–c8] columns with all field values

**Report** (gen_app_peruk12_rp1.dart, spec line 16):
- Spec says report shows only מחיר, not computed field: ✅ confirmed (no ref to c15 in report)

**Hub** (gen_app_peruk12_hub.dart):
- Navigation only, field types not rendered: ✅ not applicable

**Machine report** (police.md) verification:
- Claims "Numeric field קילומטראז׳ added": ⚠️ field is marked "text" not "num" in app.json
- Claims "Computed field מחיר לקמ = מחיר / קילומטראז׳": ✅ formula correct
- Compiles & passes dart_math_sane: ✅ (num.tryParse defaults to 0 on parse failure; div-by-zero yields Infinity, not crash)

**Not verified** (Flutter/Dart not installed):
- Runtime UI rendering of computed field in form and table
- Order of fields in all four views (entity, particle, hub, report)
