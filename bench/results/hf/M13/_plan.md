# Task: Add [מספר] particle to peruk12.txt

## Goal
Add a 'your number' particle ([מספר]) named "אגרת העברה" to the case screen with text "אגרת העברת בעלות משולמת לפני הרישום" without breaking anything.

## Decomposition (10 steps)
1. Read the current peruk12.txt to understand entity and particle structure
2. Find the case entity definition (line 7: ישות תיק)
3. Review example [מספר] particles in sechirut.txt to understand the format
4. Determine if "אגרת העברה" should be added as an entity field or just a particle
5. Run search-record.mjs to check if this field/concept exists elsewhere
6. Decide on the format based on the task constraints
7. Add the particle line to peruk12.txt in the correct position
8. Run police.mjs --fast to check for immediate issues
9. Document the change in a LEARNINGS entry
10. Run the full machine report to verify nothing broke

## Assumptions
- The particle format follows: `חלקיק תיק: <name> = [מספר] <field>: <description>`
- Based on sechirut.txt line 26 pattern
- "אגרת העברה" is the particle name and the field display name
- The description text should be "אגרת העברת בעלות משולמת לפני הרישום"
- The particle should be inserted among other case particles (after existing ones)
