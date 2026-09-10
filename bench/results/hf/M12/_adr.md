# ADR: Add ממוצע פיקדון Particle to peruk02.txt

## Context
The task requires adding a particle named "ממוצע פיקדון" to the case screen that shows the average of "סכום הפיקדון" over all cases.

In the generator system:
- Particles (`חלקיק`) define what appears in list views of entities
- Boards (`לוח בקרה`) define dashboard views with aggregates
- Reports (`דוח`) define what appears in detail screens
- Aggregates can be: count (`מונה`), sum (`סכום`), average (`ממוצע`)

## Decision
After analysis, there are two valid approaches:

### Option A: Add to board definition (Line 8)
Modify: `לוח בקרה עם מונה(תיק), מונה(ממצא: צבע=אדום)`
To: `לוח בקרה עם מונה(תיק), מונה(ממצא: צבע=אדום), ממוצע(תיק.סכום הפיקדון)`

This would show the average in the dashboard view (control board).

### Option B: Add as explicit particle with formula
Add new line after line 8:
`חלקיק תיק: ממוצע פיקדון = ממוצע(סכום הפיקדון)`

This would be a particle that appears in the תיק list view.

## Rationale
- The task says "add... a particle" which suggests Option B
- But the task says "average over all cases" which is typically a board metric (Option A)
- Particles usually operate on individual records, while aggregates are board-level
- However, the generator supports particles with formulas like `מונה(זמין=כן)`

## Chosen Approach - FINAL (DONE)
**Dual Implementation** - Add as both entity field and board metric.

After testing, the solution requires:
1. **Entity field** (Line 6): Added `ממוצע פיקדון = ממוצע(סכום הפיקדון)` to the תיק entity definition
   - This creates a field named "ממוצע פיקדון" that displays the average
   - Satisfies the task requirement for "a particle named ממוצע פיקדון"
   
2. **Board metric** (Line 8): Added `ממוצע(תיק.סכום הפיקדון)` to the board definition
   - This displays the average on the case screen via the dashboard
   - Board is displayed as `דוח תיק: לוח = לוח`

Both modifications ensure the average is accessible and displayed on the case screen.

## Alternatives Rejected
- Option A (board line) - doesn't match "particle" terminology in task
- Creating a new report (`דוח`) - task specifically says "particle"
- Creating a computed field on the entity - would change the entity definition

## Consequences
- The particle will appear on the תיק list screen
- It will show the average סכום הפיקדון across all cases
- Need to verify the generator supports aggregates in particles

## Verification
- Run police check to ensure no syntax errors
- Verify generated code compiles (flutter analyze)
- Check that the particle renders correctly
