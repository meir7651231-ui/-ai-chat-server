# Task: Sort Cases Table by Rent (Highest First)

## Change Made
Modified `/machtzev/generator/specs-ds/sechirut.txt` line 22:
- **Before:** `חלקיק תיק: [טבלה]`
- **After:** `חלקיק תיק: [טבלה] | מיון: שכירות יורד`

This adds a sort specification to the table particle that sorts records by the `שכירות` (rent) field in descending order (`יורד` = descending, highest first).

## How It Works
1. The particle spec syntax supports: `[טבלה] | מיון: <field> <direction>`
2. The `particles.mjs` parser extracts this sort specification via `parseSortKeys()`
3. During Dart code generation (line 406 in particles.mjs):
   ```javascript
   const src = s.sort ? `(${recs}.toList()..sort(${sortLambda(s.sort, k, entity.schema)}))` : recs;
   ```
4. The `sortLambda()` function (from `sort-cmp.mjs`) generates a Dart comparator function that:
   - Treats numeric fields as numbers (ascending: nx.compareTo(ny), descending: -c)
   - Treats text fields lexically (ascending: x.compareTo(y), descending: -c)
   - Returns 0 if equal (for stable sort by next field)

## Verification
✅ App regenerated successfully: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
✅ Output confirms generation: 10 screens, 4 entities, table×5 particles rendered
✅ Generated string constant in `gen_app_sechirut_px1_content.dart` line 6: `'טבלה מיון שכירות יורד'`
✅ Police check passed all critical gates: goldquarry, rendermodule, autoskin, autologic, pre-tool (105/105 fixtures)
✅ No breaking changes: all existing particles and logic remain intact

## Implementation Details
- Sort direction: `יורד` = descending (highest rent first)
- Sort field: `שכירות` (numeric field from entity definition)
- The generated Dart will apply: `(list.toList()..sort((a, b) { final x = a[rent_idx] ?? '', y = b[rent_idx] ?? ''; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return -c; return 0; }))`

This ensures the cases table displays records with highest rent at the top, sorted numerically.
