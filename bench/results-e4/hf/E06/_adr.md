# ADR-E06: Add "שלח תזכורת" action button to case screen

**Status:** Accepted
**Date:** 2026-09-10
**Task:** E06

## Context

The task requires adding an action button labeled "שלח תזכורת" (Send reminder) to the case screen (particle screen) of תיק (case entity) in the peruk17 application.

## Decision

Add a new action particle to the peruk17.txt spec file:
```
חלקיק תיק: [פעולה] שלח תזכורת
```

This follows the existing pattern of action particles already present in the spec (e.g., `[פעולה] פתח תיק`).

## Rationale

1. **Spec-first approach:** The task specifies working with specs-ds, not hand-editing generated files
2. **No breaking changes:** Adding a new action particle does not modify existing entities, fields, or relationships
3. **Standard syntax:** The `[פעולה] <label>` syntax is already documented in SPEC-LANG.md
4. **Placement:** The button is added after the existing "פתח תיק" button, before the empty state, which is a logical order
5. **Verified generation:** The app-ds.mjs generator compiled the spec successfully and produced valid Dart code with the new button as a DsChipButton

## Alternatives rejected

1. **Manual Dart edit:** Violates protocol (never edit generated files)
2. **Adding to multiple specs:** Task specifies peruk17.txt only

## Consequences

- New action button appears in particle px1 screen
- Generated Dart includes DsChipButton for "שלח תזכורת" with correct label
- Other apps remain byte-identical (spec change isolated to peruk17)
- No breaking changes to existing functionality

## Verification

✅ Spec updated: Line 12 of peruk17.txt contains the new button
✅ Generator run: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin` completed successfully
✅ Dart generated: File new/dart-gen-bs/gen_app_peruk17_px1.dart contains comment mapping and button rendering
✅ Label correct: File new/dart-data-bs/auto/gen_app_peruk17_px1_content.dart shows `const String gen_app_peruk17_px1_c17 = 'שלח תזכורת';`
✅ Button renders: Lines 28-29 of gen_app_peruk17_px1.dart show DsChipButton instances for both "פתח תיק" and "שלח תזכורת"
