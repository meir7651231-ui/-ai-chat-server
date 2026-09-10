# Task: Add סך הכל (total sum) particle to payments screen

## Goal (one line)
Display the total sum of all payment amounts on the sechirut (rental contract) payments screen.

## 10-step decomposition

1. **Verify current state**: Confirm סכום field exists in תשלום entity (line 10 of sechirut.txt)
2. **Search for patterns**: Use search-record.mjs to find similar sum operations in existing specs
3. **Understand spec language**: Review SPEC-LANG.md syntax for sum particles (line 18: `סכום(<שדה>)`)
4. **Design particle**: Add new line to sechirut.txt following pattern `חלקיק תשלום: סך הכל = סכום(סכום)`
5. **Make the change**: Edit sechirut.txt to add the new particle after line 19
6. **Verify no syntax errors**: Check spec is valid and generates without errors
7. **Test rendering**: Ensure the particle displays correctly on payments screen
8. **Byte-verify changes**: Confirm only sechirut.txt was modified, no other files touched
9. **Audit work**: Check task coverage (entity list, particle table, hub, report) via lenses
10. **Police validation**: Run machine to confirm byte-identical on all other apps, gates pass

## Decision
Adding a simple sum aggregation particle (no engine changes needed; spec language supports it).
This follows the existing pattern already shown in line 19 for הכנסה.
