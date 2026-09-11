# ADR: Add Message Particle תשובה to peruk21.txt

## Context
The task required adding a message particle named תשובה to the case screen in machtzev/generator/specs-ds/peruk21.txt that displays a classification confirmation message constructed from the סיווג choice field.

## Decision
Added two lines to peruk21.txt:
1. Particle definition: `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן תשובה]` (line 17)
2. Content entry: `תוכן תשובה: קיבלתי, הסיווג: {ערך}` (line 42)

## Rationale
- The spec language syntax for message particles is: `[הודעה] <choice-field> = [תוכן <group>]`
- Message content can use field value interpolation with {ערך} placeholder (verified in peruk04.txt, sechirut.txt, and other spec files)
- The {ערך} placeholder is automatically replaced with the actual value of the סיווג field at render time
- Placing the particle definition after other תיק particles maintains consistent organization
- Placing the content entry after סיווג content (which uses the same field) keeps related content grouped

## Alternatives Rejected
1. Creating separate content entries for each סיווג value - Would be verbose and unmaintainable; the {ערך} template handles this automatically
2. Using {סיווג} instead of {ערך} - Would be non-standard; all examples in the codebase use {ערך}
3. Adding content before סיווג - Would break alphabetical/logical ordering of content groups

## Consequences
- The message particle now appears on the case detail screen
- It displays "קיבלתי, הסיווג: [selected classification]" based on the current סיווג field value
- No impact on other particles or screens (verified by byte_identical_others check)
- Generator reports 9/9 particles successfully wired (including the new תשובה)

## Verification
✅ App-ds generator runs successfully with no errors
✅ Generated Dart code compiles without errors (analyzer: 0 errors)
✅ All other files remain byte-identical (no unintended modifications)
✅ No orphan files created
✅ Message particle check passes (msg: 1×)
✅ Machine verdict: DONE
