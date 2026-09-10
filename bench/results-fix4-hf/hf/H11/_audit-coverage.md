# Audit: תקרה נמוכה Computed Field

## Findings

**new/dart-gen-bs/gen_app_sechirut_ent1.dart:54** · Computed field תקרה נמוכה uses wrong indices: min(_v[10], _v[11]) references stored c27/c28 values instead of computing from current inputs. For new records, _v[10] and _v[11] are undefined → min(0,0)=0 (should compute from שכירות*3 and שכירות*חודשים/3). **P1 wrong result** · Replace with: `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)`

**new/dart-gen-bs/gen_app_sechirut_ent1.dart:208** · Display of תקרה נמוכה uses same wrong indices min(_v[10], _v[11]) instead of computing from current form input. Live calculation shows 0 instead of actual minimum. **P1 wrong result** · Replace with: `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)`

## Coverage verified

✓ Field תקרה נמוכה added to entity definition (_labelsAll line 33 includes c29)
✓ Field appears in entity list screen (DsRecordCard labels line 107)
✓ Field appears in table view (ForgeDataGrid columns line 220)
✓ Field appears in CSV export (line 123)
✓ Field appears in form display as live calculated value (line 208)
✓ Field is saved to database (map assignment line 54)
✓ Field is loaded from database (_edit populates _v[12] line 66)
✗ Field computation is mathematically wrong in both save and display paths (uses stale indices instead of current inputs)
✗ Dart null-safety properly handled with `num.tryParse(...) ?? 0` defaults
✗ min() function correctly imported from dart:math (line 11)

## Not checked

- Whether በተ functionality (stages/transitions) works with the computed field
- Report screen integration (rp1 file is minified, cannot inspect easily)
- Cross-entity references through computed field
- Persistence and roundtrip: save → load → display consistency
