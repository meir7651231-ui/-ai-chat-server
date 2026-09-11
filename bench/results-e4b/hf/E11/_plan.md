# Goal
Rename the field `תיקונים` to `תיקונים שנדרשו` in peruk02.txt spec and verify the generated app works correctly.

## Decomposition (10 steps)

1. Read the spec language reference (SPEC-LANG.md) to understand field renaming
2. Search for `תיקונים` in the codebase to find all occurrences and understand context
3. Record the search with --choose/--none
4. Read the current peruk02.txt spec to identify all field references
5. Rename `תיקונים` to `תיקונים שנדרשו` in the ישות definition
6. Update any content references that mention `תיקונים`
7. Regenerate the app using app-ds.mjs with the updated spec
8. Verify the generated Dart passes flutter analyze
9. Run police checks to ensure byte-identity of other apps and no regressions
10. Document findings and claims in claims.json
