# ADR: Field Rename in peruk02 Spec

**Date**: 2026-09-10  
**Status**: COMPLETE  
**Context**: Rename Hebrew field name `תיקונים` to `תיקונים שנדרשו` in peruk02.txt spec file

## Decision
Edit the spec file in place and regenerate the app using the correct pipeline.

## Rationale
1. **Spec-first approach**: Changes to entity structure should be expressed in the spec language, not hand-edited in generated code
2. **Pipeline consistency**: Using app-ds.mjs ensures the change flows through render-ds correctly and maintains byte-identity for other apps
3. **Atomic location**: The field name appears in exactly one structural location (the ישות declaration) plus one reference (the step status string)

## Implementation
- Changed line 6 in peruk02.txt:
  - Field declaration: `תיקונים*` → `תיקונים שנדרשו*`
  - Step status reference: `קבלות על תיקונים שהוא` → `קבלות על תיקונים שנדרשו שהוא`
- Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`

## Alternatives Rejected
- ~~Hand-edit generated Dart files~~ (violates "no_hand_edit" check)
- ~~Run one.mjs~~ (quarantined; would regenerate unrelated apps)
- ~~Partial rename~~ (would break step reference consistency)

## Consequences
- peruk02 app displays field as "תיקונים שנדרשו" everywhere
- Generated Dart constants updated: c15, c20
- All other peruk apps remain byte-identical
- No breaking changes (same field index, same type)

## Verification
✓ Spec file updated correctly  
✓ Generated content file reflects changes  
✓ Required marker (*) preserved  
✓ No orphan files generated  
✓ Other apps unaffected
