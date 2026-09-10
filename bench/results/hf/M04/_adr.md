# ADR: Add 'ימים לתגובה' particle to peruk17.txt case screen

## Context
Task M04 requires adding a 'your number' particle ([מספר]) to the case screen in peruk17.txt. The particle should be named "ימים לתגובה" with description text "30 ימים מקבלת המכתב".

## Opening Question
**Q: Is this a particle on the "תיק" (case) entity, and should it follow the format seen in sechirut.txt?**

**A (Assumed):** Yes. The existing example in sechirut.txt shows:
`חלקיק תיק: המספר שלך = [מספר] תקרה לפי 3 חודשים: הבטוחות לא יעלו על הסכום הזה במצטבר`

For peruk17.txt, the new particle should be:
`חלקיק תיק: ימים לתגובה = [מספר] 30 ימים מקבלת המכתב`

It should be added to the case/תיק entity particles section.

## Decision
Add the particle exactly as shown in the format above, placing it within the existing particles block of peruk17.txt.

## Rationale
- The task specifies: "add to the case screen a 'your number' particle ([מספר]) named ימים לתגובה whose text says: 30 ימים מקבלת המכתב"
- The format matches the existing [מספר] particle in sechirut.txt
- Adding to the "תיק" entity is consistent with all other particles in peruk17.txt
- This preserves the case screen context mentioned in the task

## Verification Method
Run the machine's verification: `node /tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/bench/police-bench.mjs --root . --task M04 --claims ./claims.json`
