# Task M05: Add message particle תשובה to peruk21.txt

## Goal
Add a message particle named תשובה to the case screen in machtzev/generator/specs-ds/peruk21.txt that displays a classification confirmation message.

## 10-step decomposition

1. **Understand spec language syntax** - Read SPEC-LANG.md to understand [הודעה] message particle syntax
2. **Identify the pattern** - Message particles use format: `<שם> = [הודעה] <שדה-בחירה> = [תוכן <קבוצה>]`
3. **Identify the field** - סיווג is a choice field with 4 values: בקשת מסמך|הזמנה לוועדה|דחיית סיוע|הילד מפריע בלי
4. **Search for existing patterns** - Check how other message/content particles are defined in peruk21.txt
5. **Create content entries** - Define תוכן תשובה entries for each סיווג value with template "קיבלתי, הסיווג: {value}"
6. **Add particle line** - Add the message particle definition: `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן תשובה]`
7. **Verify syntax** - Ensure the format matches the spec language exactly
8. **Byte-verify** - Check that peruk21.txt changes are correct and other files unchanged
9. **Run machine checks** - Execute police checks to ensure no compilation errors
10. **Document findings** - Record claims and lessons learned

## Assumptions
- The message should appear on the individual case (תיק) screen
- Content values should substitute {ערך} with the actual classification value
- No other files should be modified
