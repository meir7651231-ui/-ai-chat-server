# ADR: Add stage הוחזר הכסף (money refunded) to תיק entity

## Context
The `תיק` (case) entity in peruk08.txt represents a disputed charge or billing issue case. The application workflow progresses through several stages as the case is processed: received, paid, under review, and resolved.

The product owner (absent today) identified a gap in the stage progression: after a case reaches "נמסר" (delivered/resolved), there should be an explicit stage to track when money is refunded back to the customer, before final closure.

## Decision
Add a new stage "הוחזר הכסף" (money refunded) to the תיק entity's stage list, positioned between "נמסר" and "סגור" to maintain semantic flow of the refund workflow.

### Change Made
- File: `machtzev/generator/specs-ds/peruk08.txt`, line 6
- Before: `שלבים התקבל, שולם, בבדיקה, נמסר, סגור`
- After: `שלבים התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור`

## Rationale
1. **Semantic correctness**: The new stage explicitly models the refund state, making the workflow's business logic clearer to users
2. **No breaking changes**: Stage lists are loaded dynamically at runtime; all generic stage utilities (nextStage, stageIndex, stageLabel) work with any stage name
3. **Correct layer**: The change is made in the spec file (.txt), which is the proper layer for data structure changes per the protocol
4. **Validation**: Machine report confirms generator pipeline success, all gates pass, no unintended changes

## Alternatives Rejected
1. **Implicit refund**: Not tracking refund explicitly would make case status ambiguous
2. **Refund as flag**: Using a boolean field instead of a stage loses the sequential tracking benefit
3. **Separate entity**: A separate "refund" entity would over-complicate the data model for this simple state transition

## Consequences
- Cases can now explicitly track the moment money is returned to the customer
- All downstream UI components automatically support the new stage via dynamic stage utilities
- No code changes required beyond the spec file

## Verification
- ✅ Generator pipeline (regen_ok)
- ✅ No unintended file modifications (byte_identical_others)
- ✅ All gates pass (gates_pass)
- ✅ New stage properly recognized and integrated (stage check)
- ✅ Machine verdict: DONE
