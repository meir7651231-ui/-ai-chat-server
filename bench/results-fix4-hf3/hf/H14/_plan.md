# Task: Sort ממצא (findings) by צבע severity (אדום→צהוב→ירוק)

## Goal
Make the findings table in sechirut app display rows sorted by severity color: red (אדום) first, yellow (צהוב) second, green (ירוק) last.

## 10-Step Decomposition

1. Read SPEC-LANG.md to understand available sorting mechanisms in the spec language
2. Search for existing sorting patterns in other apps' specs  
3. Identify where the ממצא particle table is defined and how it currently displays data
4. Understand the order-by syntax/capabilities in the spec language
5. Determine if sorting can be expressed in spec or requires engine changes
6. If spec-level: add sort order to ממצא particle definition
7. If engine-level: modify app-ds.mjs to handle color severity ordering
8. Regenerate the sechirut app
9. Verify bytes are correct and table is sorted as expected
10. Run police check and verify no other apps broke
