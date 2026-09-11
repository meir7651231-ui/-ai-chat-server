# Plan: Add בדיקה Entity to peruk12

**Goal**: Add second entity `בדיקה` (inspection) to peruk12.txt with table screen and dashboard counter, without breaking existing app.

## 10-Step Decomposition

1. **Read existing peruk12.txt** — understand entity/particle/dashboard structure
2. **Add ישות בדיקה** — entity definition with required fields (תיק*, מה נבדק*, תקין{כן|לא})
3. **Add חלקיק בדיקה: [טבלה]** — table view showing inspections
4. **Add חלקיק בדיקה: [פעולה]** — button to add new inspection
5. **Add חלקיק בדיקה: [ריק]** — empty state when no inspections
6. **Update לוח בקרה** — add counter for inspections where תקין=לא
7. **Run app-ds.mjs** — regenerate app and verify compilation
8. **Verify no byte-changes to other apps** — check byte_identical_others gate
9. **Write learnings entry** — document pattern for linked entities
10. **Run police** — gate pass (regen_ok, byte_identical_others, compiles)

## Key Pattern

- Entity בדיקה is child of תיק (foreign key: תיק*)
- Uses same spec-language syntax as existing תיק entity
- No engine changes needed — spec-level only
- Dashboard counter: `count(בדיקה: תקין=לא)`
