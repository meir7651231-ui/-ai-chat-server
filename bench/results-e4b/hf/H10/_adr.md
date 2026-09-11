# ADR — Calendar Meeting Sort by Time

## Opening Question (§ג.1 MASTER_PROTOCOL)

**What:** Sort meetings (פגישה) by time (שעה) everywhere they appear
**Where:** 
  1. Entity list screen (main list of all meetings)
  2. Particle table (meetings shown on the particle/detail screen)

**Assumed Answer:**
- Entity list: sort meetings ascending by time (שעה עולה) — earliest first
- Particle table: same sorting (שעה עולה)
- No other surface area affected (Hebrew spec prevents implementation details leaking)

**Spec Language Capability:**
- Entity sorting: `| מיון: שעה עולה` per line 5 of SPEC-LANG.md
- Particle table sorting: `[טבלה] … | מיון: שעה עולה` per line 17 of SPEC-LANG.md

**Current State:**
- calendar.txt has no sorting directives
- Meetings render in insertion order (unsorted)

**Risk Check (R6/R8):**
- Hebrew field name "שעה" already exists in entity definition
- No new strings needed
- Pure spec change (no engine modification required)
