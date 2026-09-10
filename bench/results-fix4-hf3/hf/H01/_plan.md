# Plan: Sort panuy list by distance (nearest first) with real km display

**Goal:** Make the generated panuy app show list sorted by distance nearest first, displaying real km distance instead of squared distance.

## 10-step decomposition

1. **Read current spec** → understand existing particles and fields (DONE: panuy.txt has `[טבלה]` with all fields, מרחק בקמ computed)

2. **Verify spec language supports sort** → check SPEC-LANG.md line 17 (DONE: `[טבלה] עמודה… | מיון: <שדה> עולה/יורד`)

3. **Design spec change** → decide which columns to show, sort order (ADR written: show מרחק בקמ, hide מרחק בריבוע, sort ascending)

4. **Edit panuy.txt** → replace line 6 `חלקיק אדם: [טבלה]` with `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה | מיון: מרחק בקמ עולה`

5. **Search for existing sort/distance patterns** → use search-record.mjs to check if similar patterns exist (before making more changes)

6. **Regenerate app** → `node machtzev/generator/app-ds.mjs -f specs-ds/panuy.txt --name panuy --skin`

7. **Verify Dart output** → check generated files have correct sort clause and display field

8. **Byte-verify other apps** → ensure no unintended changes to other app outputs

9. **Record in claims.json** → sort_by_distance, display_real_km checks with byte verification

10. **Police and audit** → write _insp.md, run full police, get VERDICT
