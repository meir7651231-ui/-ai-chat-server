# ADR: Sort cases table by price numerically

## Context
The peruk12 app generates a table view for the "תיק" (cases/portfolio) entity. Currently, the table displays records without sorting. The task requires sorting by the "מחיר" (price) field numerically, with cheapest first (ascending order).

**Current behavior:** Table shows rows in order returned by appStore.records(), which may be insertion order.
**Required behavior:** Table rows should be sorted by price field numerically (not lexicographically), ascending.

## Decision
Modify `machtzev/generator/render-ds.mjs` to add sorting logic before the table rows are rendered.

**Key findings:**
- The price field is numeric (type 'num'), tracked in `numFields` array during schema processing
- The table is rendered at line 587: `boardBranch` variable generates the table widget code
- The price field label is stored in `numFields` array or can be identified from schema 
- Records are stored as Map<String, String> but the price field value can be parsed as double

**Approach:**
1. Find which field in `numFields` corresponds to "מחיר" (price)
2. Generate code that sorts `rs` by that field before passing to table widget
3. Use numeric comparison: `(num.tryParse(r[fieldName] ?? '') ?? 0)`

## Rationale
- The table already passes records via `rs` variable to ForgeDataGrid
- Sorting at the source (before table render) is cleaner than modifying the table widget
- Numeric parsing handles missing values gracefully with fallback to 0
- The spec doesn't indicate table column direction can be customized, so hardcoding ascending is correct

## Alternatives rejected
1. Modify DsTable/ForgeDataGrid widget itself - outside scope, affects other apps
2. Add sorting column to all numeric fields - over-engineered, task asks for price only
3. Hardcode field index - fragile across spec changes, better to track by label

## Consequences
- Generated entity screens will have tables pre-sorted by price field (when present)
- If multiple numeric fields exist, price is preferred for sorting (matched by label)
- Applies only when generating table view - list/board views unaffected
- Generated code will have `.sort()` call on records before ForgeDataGrid/DsTable rendering

## Verification
1. Regenerate peruk12 app
2. Verify gen_app_peruk12_ent1.dart has sort logic before ForgeDataGrid at line 171
3. Check that sort uses numeric comparison, not string comparison
4. Confirm other entities are unaffected (no unwanted sorts added)
5. Run machine police report for gates/pins validation
