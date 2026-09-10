# Task: Sort Cases by Deadline (עד מתי) in peruk21 App

## Goal
Sort cases by deadline (עד מתי field) in ascending order (soonest first) in two display locations:
1. Cases table on particle screen
2. Cases in entity list screen

## Decomposition (10 steps)
1. Read spec file peruk21.txt and understand the entity structure (תיק has עד מתי field)
2. Search for existing sorting patterns in the codebase
3. Find where peruk21 app is generated and how entities are displayed
4. Locate the table particle rendering for תיק entity
5. Locate the entity list screen rendering
6. Determine if sorting is done in spec language or engine code
7. Apply sorting either via spec or engine change
8. Verify no other apps are affected (byte-identical check)
9. Ensure generated Dart compiles (flutter analyze)
10. Run final machine report to verify all checks pass

## Current Status
Starting task.
