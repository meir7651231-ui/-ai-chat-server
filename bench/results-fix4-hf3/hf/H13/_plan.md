# Goal
Show only 4 columns (שם, זמין, מרחק בקמ, מחיר לשעה) in the people table in panuy.txt app, using spec syntax.

## 10-Step Decomposition

1. **Verify spec language supports column selection** — Read SPEC-LANG.md line 17: `[טבלה] עמודה, עמודה, …` is the syntax
2. **Locate the current table particle** — panuy.txt line 6: `חלקיק אדם: [טבלה]`
3. **Identify required columns** — שם, זמין, מרחק בקמ, מחיר לשעה (exact order and names per task)
4. **Verify column names exist in entity** — Check panuy.txt ישות אדם line 4 for all 4 field names
5. **Plan the spec change** — Replace line 6 with new syntax specifying columns
6. **Edit the spec file** — Modify panuy.txt line 6 to add column list
7. **Regenerate the app** — Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
8. **Validate with machine report** — Run the bench police report to check for errors
9. **Write claims.json** — Document what was changed and verified
10. **Create inspection report** — _insp.md with verdict GO/NO-GO

## Key Protocol Points
- No engine changes (only spec change)
- Other apps must stay byte-identical
- Generated Dart must pass flutter analyze
- Claim every change with byte verification
