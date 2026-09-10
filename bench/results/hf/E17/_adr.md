# ADR: E17 Empty-State Text Change

## Context
Task E17 requires changing the empty-state text in peruk21.txt from "אין תיקים עדיין" to "אין מכתבים פתוחים".

## Opening Question (§ג.1)
**Q:** Should this text change be propagated to other specs-ds files, or only peruk21.txt?

**Assumed Answer:** Only peruk21.txt. The file peruk21.txt (מכתב מבית ספר / ועדה / שילוב) represents a specific application context where "מכתבים" (letters) is the correct domain term, while other specs may use different terminology. The generator pipeline will compile each spec independently, so this change affects only peruk21.txt.

## Decision
Change line 12 in `machtzev/generator/specs-ds/peruk21.txt` from:
```
חלקיק תיק: [ריק] אין תיקים עדיין
```
to:
```
חלקיק תיק: [ריק] אין מכתבים פתוחים
```

## Rationale
- The text appears in a particle definition that controls the empty state of the "תיק" (folder) component
- The domain context is letters/documents from school, not generic folders
- "מכתבים פתוחים" (open letters/documents) is semantically more precise than "תיקים" (folders)
- The change is localized to a single file and does not affect the generator logic or other specs

## Verification Plan
1. Byte-verify the change in peruk21.txt
2. Run police-bench to ensure no hand-edits in generated outputs
3. Verify gates pass
4. Confirm no cascading changes needed in other files
