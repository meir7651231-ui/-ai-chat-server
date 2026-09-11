# Goal
Make the people (אדם) table in panuy app show only 4 columns: שם, זמין, מרחק בקמ, מחיר לשעה in that order.

## 10-Step Decomposition

1. **Verify current table state** — Read panuy.txt, identify line 6 shows `[טבלה]` with no column list
2. **Check spec language** — SPEC-LANG.md line 17 shows table syntax: `[טבלה] עמודה, עמודה, …`
3. **Determine column order** — Task specifies: שם, זמין, מרחק בקמ, מחיר לשעה
4. **Edit panuy.txt** — Change line 6 from `חלקיק אדם: [טבלה]` to `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
5. **Regenerate app** — Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
6. **Verify no hand-edits** — Check that generated files in new/ are pristine (no modifications outside generator)
7. **Run machine report** — Execute police-bench to verify bytes match and gates pass
8. **Write claims.json** — Document verified facts: spec change + table columns correct
9. **Inspect checklist** — Verify task coverage (table entity, 4 columns, order correct, no regressions)
10. **Final verdict** — Report DONE if machine reports DONE

## Key assumption (ADR)
The spec language already supports column selection syntax `[טבלה] col1, col2, …` per SPEC-LANG.md §16 line 17. No engine changes needed.
