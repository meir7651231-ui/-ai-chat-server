# ADR M07: Add findings-not-sent counter

## Context
Task: Add a dashboard counter for findings (ממצא) not yet sent (נשלח=לא), and add a counter particle named "לא נשלחו" on the findings screen.

## Opening Question
Where should the new dashboard counter appear in the control panel line?

**Assumed Answer**: After the yellow findings count and before the securities count (maintaining logical grouping of finding-related counters together).

## Decision
Modify specs-ds/sechirut.txt to:
1. Add `מונה(ממצא: נשלח=לא)` to line 11 (dashboard) after the yellow finding counter
2. Add `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)` after line 24 (particles section)

Both use the spec language condition syntax `שדה=ערך` with the yes/no field "נשלח" set to "לא".

## Rationale
- The יודות (findings) entity has a `נשלח{כן|לא}` field (line 9)
- This mirrors existing pattern: line 16 for "אדומים = מונה(צבע=אדום)"
- Dashboard already uses count-with-condition syntax (line 11, "שולם=לא" example)
- No engine change needed; this is pure spec-language work

## Alternatives Rejected
- Adding a computed field instead: spec language's count syntax is simpler and avoids code generation
- Placing counter elsewhere on dashboard: grouping with other finding counts is clearer

## Consequences
- Regenerated Dart code will include a new counter widget on the dashboard
- Findings screen will show a "לא נשלחו" particle counting unsent findings
- No impact on other entities or apps (byte-identical check will verify)

## Verification
- Run machine report to verify: regen_ok, no_hand_edit, byte_identical_others, gates_pass, compiles
- Check generated code uses `count(finding where sent == false)`
