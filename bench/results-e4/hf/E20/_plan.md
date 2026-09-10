# Task: Add "שלח הודעה" action button to people screen

## Goal
Add an action button labeled "שלח הודעה" (Send a message) to the particle screen of אדם (people) in panuy.txt, without breaking anything.

## 10-step decomposition

1. **Understand spec language:** Read SPEC-LANG.md to identify action button syntax: `[פעולה] <label>`
2. **Read current state:** panuy.txt shows particle screen for אדם at lines 6-17, already has one action `[פעולה] הזמן עכשיו`
3. **Identify insertion point:** Add new action after line 16 (existing action), before line 17 (computed field)
4. **Make spec change:** Add line `חלקיק אדם: [פעולה] שלח הודעה`
5. **Regenerate app:** Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
6. **Verify byte-identity:** Ensure no other app files changed (machine checks `byte_identical_others`)
7. **Check Dart compilation:** Verify `flutter analyze` produces 0 errors
8. **Test gates:** Run machine's verification tool to check gates pass
9. **Write ADR:** Document decision in _adr.md
10. **Write claims:** Create claims.json with verification proof

## Success criteria
- Action button appears in generated Dart code for people screen
- No hand-edits in generated files (new/)
- No other app output modified
- All gates pass
- Dart compiles cleanly
