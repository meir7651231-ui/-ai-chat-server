# Goal
Add a computed field "סכום מעוגל" (rounded amount) to the Task entity that rounds the "סכום" (amount) field to the nearest whole number.

## 10-Step Decomposition
1. Search existing computed fields in tasks.txt and other specs to understand the syntax for computed fields
2. Run search-record.mjs to check for existing rounded-amount atoms or similar patterns
3. Read the spec language grammar (spec-lang.mjs or similar) to understand how computed fields are declared
4. Identify the correct syntax for adding a computed field with Math.round() operation
5. Add the field declaration to tasks.txt following the existing field format
6. Verify the change doesn't duplicate any existing field or break syntax
7. Run the generator to ensure the new field is processed correctly
8. Audit the generated Dart output to confirm the computed field appears in the Task class
9. Run gates and police checks to verify correctness
10. Write lesson entry to LEARNINGS.md documenting the pattern

## Current State
- tasks.txt defines Task entity with: מה (what), מועד (due), סכום (amount), הערה (note)
- No visible computed fields in current spec
- Need to determine how computed fields are specified in this DSL
