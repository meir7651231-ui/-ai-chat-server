# ADR-E14 — Add סוג field to פגישה entity

## Opening Question (ג.1 — MASTER_PROTOCOL)

**Context:**
The task is to add a closed-choice field `סוג` (type) to the meeting entity `פגישה` in the calendar spec with three predefined values: עבודה (work), אישי (personal), רפואי (medical).

**Decision:**
Modify `machtzev/generator/specs-ds/calendar.txt` to add the field definition in the entity declaration using the spec language's closed-choice syntax.

**Assumed Answer:**
The spec language supports closed-choice fields inline with `{value1|value2|value3}` syntax or similar. The field should be a simple choice with no additional logic, persisted like other fields, and rendered as a dropdown/chips selector in the UI (determined by the auto-skin logic).

**Verification Approach:**
1. Search the spec files to find the exact syntax for closed-choice fields
2. Examine existing choice fields in other specs (if any)
3. Add the field to the פגישה entity definition
4. Run the machine report to validate the entire pipeline
