# Audit: Computed Field Coverage (peruk12 · מחיר עם אגרה)

No findings.

**Verified Correct:**

- **Entity form (ent1)**: Computed field displays at line 173 of gen_app_peruk12_ent1.dart with _calc() helper. Formula `(num.tryParse(_v[3] ?? '') ?? 0) * 1.03` correctly multiplies price field (_v[3]) by 1.03, formatted to 2 decimals. User cannot edit this field—value is calculated on save (line 48).
- **Entity list cards (ent1)**: Field appears in _labelsAll (line 29), rendered in _card() labels/values (line 87), included in CSV export (lines 94–98).
- **Entity table view (ent1)**: Field in ForgeDataGrid columns (line 186), correctly retrieved from stored records.
- **Particle table (px1)**: Field c5='מחיר עם אגרה' appears in 7-column ForgeDataGrid (line 25 of px1.dart, line 5 of px1_content.dart). Values fetched from appStore.records with c12 mapping (stored field label).
- **Report (rp1)**: Spec says card displays only base price (מחיר), not computed fee—correctly implemented per `דוח תיק: כרטיס = מחיר`.
- **Config (apps/peruk12.json)**: Field registered as type "num" at position 4 in fields array, with required=false.
- **Null safety**: Formula uses `num.tryParse() ?? 0` to guard against empty/non-numeric input.
- **Machine checks pass**: regen_ok ✅, calc_fee ✅ (consts=1 calc=1), compiles ✅.

**Coverage: all surfaces verified**. Entity form (including live display), list screen (card+table+CSV), particle table, and report all show the field. Hub and home screens are navigation/summary—no data loss.
