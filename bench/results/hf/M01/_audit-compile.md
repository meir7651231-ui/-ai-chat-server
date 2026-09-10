# AUDIT: Compile & Edge Cases — peruk02 ent3 (תשלום) Task

## Findings

`new/dart-gen-bs/gen_app_peruk02_px3.dart:22` · תיק column in particle table displays raw case ID instead of case name · P1 wrong result · wrap first item with `appStore.displayOf('app_peruk02_ent1', r[gen_app_peruk02_px3_c4] ?? '')` to match ent3.dart line 152 pattern

## Verified Correct

**Null safety & method calls:**
- `ent3.dart`: All `.trim()` calls guarded (Map<int,String> values are non-null) ✓
- `ent3.dart` lines 35, 90, 98, 152: Safe null-coalescing with `??` operator ✓
- `relations.dart`: registerRelation calls with correct entities and field names ✓
- `px3.dart` lines 23–25: DsChipButton, MaterialPageRoute, EmptyState imports and calls valid ✓

**Cascade deletion wiring:**
- `relations.dart` line 7 correctly registers ent3→ent1 relation with cascade: `registerRelation('app_peruk02_ent3', gen_app_peruk02_relations_c1, 'app_peruk02_ent1', 1, multi: false)` ✓
- `ent1.dart` line 99 footer correctly uses `appStore.referencing('app_peruk02_ent3', gen_app_peruk02_ent1_c29, rid)` to count child payments for delete confirmation ✓
- `ent1.dart` content c29='תיק' and c28='תשלום' labels are wired (inboundRefs check present) ✓

**Field validation:**
- `ent3.dart` lines 44–48: Correctly validates only required fields (תיק*, סכום*); שולם is optional per spec ✓
- `ent3.dart` line 49: Saves all 3 fields to appStore with correct constant keys (c9, c10, c11) ✓

**Required field wiring:**
- Spec line 8: `תיק*, סכום*, שולם{כן|לא}` — both required fields validated ✓
- `ent3.dart` line 141–142: DsNumberField + DsEnumField created for סכום and שולם with bare:true ✓

**Particle definitions:**
- 3 particles created for תשלום: table (line 19), add action (line 20), empty state (line 21) ✓
- All 3 matched particle-plan JSON entries ✓
- Constants c1–c15 all defined in px3_content.dart (c4='תיק', c5='סכום', c6='שולם') ✓

**Other compile checks:**
- No non-existent methods on num (no `.sqrt()`, `.min()`, `.max()`) ✓
- No string-vs-number comparisons without parsing ✓
- Imports in px3.dart all exist (ForgeDataGrid, appStore, EmptyState) ✓
- ForgeDataGrid(columns:[...], items: [[...], ...]) type matches ✓

## Summary

**No compile-break errors.** Task mostly complete: entity ent3 created with 3 fields, cascade deletion wired, table+action+empty particles generated, validation logic correct. One **functional bug**: px3 particle table column 1 shows case ID instead of case name—fixable with one-line wrap of displayOf() call, consistent with ent3.dart pattern.
