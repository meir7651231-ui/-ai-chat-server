# 10-Step Decomposition for Adding תזכורת Entity

## Goal (one line)
Add a `תזכורת` (reminder) entity to tasks.txt spec that belongs to `משימה` with cascade delete, rendering as a table screen with empty state "אין תזכורות".

## Steps

1. **Read and analyze current state**
   - Current tasks.txt has 1 entity (משימה) with fields and stages
   - Understand spec format: ישות <name> עם <fields> | <options>
   - Identify where to add the new entity in the file

2. **Search for existing patterns**
   - Run `node machtzev/search-record.mjs "תזכורת reminder alarm notification"` to verify no duplication
   - Check peruk01.txt for cascade delete syntax pattern
   - Verify boolean enum field syntax from other specs

3. **Verify field types**
   - משימה: Required link field (asterisk notation משימה*)
   - מועד: Required date field (asterisk notation מועד*)
   - נשלחה: Boolean enum field (brace notation {כן|לא})
   - These field types already exist in the codebase

4. **Add entity definition line**
   - Append to tasks.txt: `ישות תזכורת עם משימה*, מועד*, נשלחה{כן|לא} | מחיקה: משימה=מפל`
   - Verify syntax matches peruk01.txt line 8 pattern

5. **Add table screen particle**
   - Append: `חלקיק תזכורת: [טבלה]`
   - Creates auto-generated table view for reminders

6. **Add empty state particle**
   - Append: `חלקיק תזכורת: [ריק] אין תזכורות`
   - Defines empty state message when no reminders exist

7. **Byte-verify changes**
   - Confirm all new lines are properly formatted
   - Check no extra whitespace or encoding issues
   - Compare against peruk01.txt syntax exactly

8. **Run generator check**
   - Execute police-bench.mjs to validate spec parsing
   - Confirm generator accepts the new entity definition
   - Verify no syntax errors in spec grammar

9. **Verify no regressions**
   - Confirm משימה entity still works correctly
   - Check generated code compiles
   - Verify all gates pass

10. **Inspect and report**
    - Document findings in _insp.md
    - Write final verdict GO/NO-GO in claims.json
    - Record any learnings in LEARNINGS.md format
