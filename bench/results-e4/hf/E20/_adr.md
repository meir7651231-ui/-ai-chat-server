# ADR — Opening question for panuy action button

## Context
Task requires adding an action button labeled "שלח הודעה" (Send a message) to the people screen (particle screen of אדם entity).

## Opening question (§ג.1 of MASTER_PROTOCOL)
**What:** Add action button to people/אדם particle screen  
**Source:** panuy.txt, lines 6-17 define particle screen with one existing action `[פעולה] הזמן עכשיו` at line 16  
**Translation:** Action button = inline chip-button in particle row (no new dialog/sheet/modal — R2 compliance)  
**Helper needed:** None (pure spec line, engine generates wiring)  
**Hebrew strings:** "שלח הודעה" (Send a message) — new label, appears in particle screen UI  
**Blocked:** None  

## Assumed answer (for proceeding without owner input)
- Button is a simple UI element added to the particle screen spec via `[פעולה] שלח הודעה` syntax
- No backend action wiring required at this stage (engine generates placeholder/unimplemented)
- No dialog/sheet/modal required (R2 compliant — dial-pattern only for new interactions)
- Label "שלח הודעה" is Hebrew UI text, stored in spec, injected by engine into generated Dart

## Decision
Add spec line: `חלקיק אדם: [פעולה] שלח הודעה` after existing action, before computed field line.

## Rationale
- Spec language supports multiple actions per particle via repeated `חלקיק <entity>: [פעולה]` lines
- Placement after line 16 preserves existing action, adds new one
- Engine will generate both action buttons in particle row
- No Dart hand-edits required (spec-driven generation)

## Alternatives rejected
- Place at start of particle definition (lines 7): would change action order unnecessarily
- Use different label: "שלח הודעה" is clearest, matches task requirement exactly
- Add backend wiring: task asks only to add button, not to wire behavior

## Consequences
- Generated panuy app will display "שלח הודעה" button in people particle screen
- Other apps (peruk, etc.) remain byte-identical (no shared spec)
- Dart compiles (engine validates action syntax)

## Verification
- Grep generated Dart code for "שלח הודעה" string appearance
- Verify machine reports byte_identical_others = TRUE
- flutter analyze returns 0 errors
- All gates pass
