# Task: Add Message Particle to peruk21.txt

## Goal
Add a message particle named תשובה to the case screen in peruk21.txt, built from the סיווג field with template: קיבלתי, הסיווג: {ערך}

## 10-Step Decomposition
1. **Understand the task**: Message particle in peruk21 spec, using סיווג field, with specific template
2. **Search existing patterns**: Check how [הודעה] particles are defined in other peruk files ✅
3. **Identify syntax**: Message particle pattern = `חלקיק תיק: <name> = [הודעה] <name> = [תוכן <group>]`
4. **Add content line**: Create `תוכן הודעה [תשובה]: קיבלתי, הסיווג: {סיווג}`
5. **Add particle definition**: Create `חלקיק תיק: תשובה = [הודעה] תשובה = [תוכן הודעה [תשובה]]`
6. **Locate insertion point**: After existing particles and before content definitions
7. **Verify entity compatibility**: סיווג field exists in entity definition (line 7) ✅
8. **Run verification**: Use machine to check no breakage
9. **Update claims.json**: Document what was changed
10. **Run final police**: Ensure all gates pass

## Key Context
- Entity has field: סיווג{בקשת מסמך|הזמנה לוועדה|דחיית סיוע|הילד מפריע לבלי}
- Template uses {סיווג} syntax to reference field value
- Pattern from peruk03/04/05: particles reference content, content references templates
