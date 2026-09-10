# ADR: Add Message Particle to peruk21.txt

## Context
The peruk21.txt spec file represents a case management application for school/committee letter processing. It currently has a "סיווג" (classification) field with four enum values: בקשת מסמך, הזמנה לוועדה, דחיית סיוע, הילד מפריע בלי. The task is to add a message particle that displays a message when viewing a case, with the format: "קיבלתי, הסיווג: {ערך}" (I received, the classification: {value}).

## Opening Questions & Assumed Answers

**Q1: On which screen should the message particle appear?**
A: The task says "to the case screen" which means the screen that displays an individual case (תיק record). This is likely the detail/edit screen for a single case.

**Q2: Should the message be shown only in certain conditions?**
A: No explicit condition mentioned. Assume it's always shown when viewing/editing a case.

**Q3: Should {ערך} show the raw enum value or the display text?**
A: The spec-lang uses {ערך} for field values. The generator handles rendering choice field values appropriately. Assume {ערך} will show the selected value.

## Decision
Add two lines to peruk21.txt:
1. A message particle definition: `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן תשובה]`
2. A content group definition: `תוכן תשובה: קיבלתי, הסיווג: {ערך}`

## Rationale
- The pattern matches existing message particles in peruk03, peruk04, peruk05, and sechirut.txt
- The spec-lang documentation explicitly supports this syntax on line 20
- Message particles bind to an enum/choice field and reference a content group
- The {ערך} template variable will be replaced with the selected classification value
- Placement at end of file avoids interfering with existing particle/content group ordering

## Alternatives Rejected
1. Inline the message text without a content group - REJECTED: Spec-lang requires content group reference for messages
2. Use a [תוכן] particle instead - REJECTED: Task specifically asks for message particle [הודעה]
3. Use a [פעולה] particle - REJECTED: Task asks for message, not action button

## Consequences
- The generator will create a UI widget that displays the message on the case detail screen
- The message will show the selected classification value dynamically
- No database/logic changes - spec-layer only

## Verification
- Run machine report to ensure no byte changes to other apps (byte_identical_others gate)
- Verify the generated Dart code compiles (compiles gate)
- Verify the message particle renders correctly (visual inspection via web UI if possible)
