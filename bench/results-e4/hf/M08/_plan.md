# Task Plan: Convert Field to Enum + Add Counter Particle

**Goal:** Convert "האם כבר פנו למוכר" from free-text to enum(כן, לא, לא יודע) and add a counter particle "לא פנו" on the case screen.

## 10-Step Decomposition

1. **Read current spec**: machtzev/generator/specs-ds/peruk08.txt — locate the free-text field definition
2. **Read spec-lang reference**: machtzev/generator/specs-ds/SPEC-LANG.md — understand enum/choice syntax
3. **Search patterns**: Run search-record.mjs to check for "קיים" and "particle" patterns
4. **Modify field definition**: Change from free-text to enum(כן|לא|לא יודע)
5. **Define counter particle**: Add "לא פנו" particle with condition: count cases where field == "לא"
6. **Validate syntax**: Ensure spec parse succeeds (no errors in field/particle definitions)
7. **Regenerate app**: Run app-ds.mjs with the modified spec
8. **Verify byte-identity**: Ensure all other apps are unchanged
9. **Check compilation**: Ensure generated Dart passes flutter analyze
10. **Document finding**: Record lesson in machtzev/LEARNINGS.md

## Success Criteria
- peruk08.txt modified (field is enum, particle added)
- Machine report: DONE (all checks pass)
- claims.json documents all verified changes
