# ADR — Task M08 Opening Question

## Context
peruk08.txt defines a case entity with a free-text field `האם כבר פנו למוכר` ("Did we already contact the seller?"). Task is to convert it to a closed choice and add a counter particle.

## Opening Question (ג.1)
**מה:** Convert free-text field to enum + add counter particle  
**מקור:** peruk08.txt line 6  
**תרגום ל-dial:** "Screen shows a single-select field (כן/לא/לא יודע) + new counter tile showing count of cases where value=לא"  
**helper נדרש:** Counter logic that filters cases by field value and counts them  
**מחרוזות verbatim:** "כן", "לא", "לא יודע", "לא פנו" (new particle label)  
**חסום:** None — this is pure spec + particle definition, no backend needed  

## Assumed Answer
The task requires modifying only `machtzev/generator/specs-ds/peruk08.txt`:
1. Change field definition from free-text to enum with 3 values
2. Add a particle definition to count cases where the field equals "לא"
3. No new helpers needed — just filtering + counting existing data
4. No UI changes beyond what the generator produces

## Decision
Follow protocol: edit spec → regenerate → verify bytes → run machine report.

## Rationale
- Enum fields and counter particles are established patterns in this system (see סיווג in peruk08)
- Generator handles all rendering and wiring automatically
- No hand-edits of generated code
