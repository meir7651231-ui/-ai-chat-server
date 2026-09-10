# Plan: Sort פגישה (meetings) particle by מועד then שעה

## Goal (1 line)
Make the פגישה particle screen in the calendar app display meetings sorted first by date (מועד) and then by time (שעה).

## 10-step decomposition
1. ✅ Locate the calendar.txt spec and understand the פגישה entity definition
2. ✅ Search the codebase for how particles are currently generated and sorted
3. ✅ Find where פגישה particle items are collected/displayed (particles.mjs)
4. ✅ Identify the generator code that creates particle screens (particles.mjs + sort-cmp.mjs)
5. ✅ Locate the sorting/ordering logic in the particle rendering (sortLambda in sort-cmp.mjs)
6. ✅ Search for existing sort examples in the generator for date/time fields (grammar in spec-lang.data.json)
7. ✅ Implement sorting by מועד (ASC) then שעה (ASC) in the correct generator layer (spec file)
8. 🔄 Verify no hand-edits were made in generated code (new/)
9. 🔄 Run the machine report to validate all checks pass
10. 🔄 Document learnings in LEARNINGS.md and verify final state

## What Was Done
- Added particle definition to calendar.txt: `חלקיק פגישה: רשימה = [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה`
- This defines a table particle for the פגישה entity with columns: מה, מועד, שעה, מקום
- Sort order: מועד (date) ascending, then שעה (time) ascending

## Key questions
- What is the current sort order of particles? (All fields, reverse chronological, or unsorted?)
- Where is the particle item ordering defined? (spec-lang, generator logic, or data layer?)
- Is there existing date/time sort logic I can reuse/reference?
