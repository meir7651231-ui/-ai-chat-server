# Audit Coverage Report: panuy.txt קרוב Field Task

## Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:49** · קרוב field saved as user input `gen_app_panuy_ent1_c26: _v[12] ?? ''` without computation · P0 task-not-done · Insert computation before save: `_v[12] = (num.tryParse(_v[10] ?? '') ?? 0) < 100 ? 'קרוב' : 'רחוק'` (index 10 = distance-squared, index 12 = קרוב)

**new/dart-gen-bs/gen_app_panuy_ent1.dart:175** · קרוב rendered as editable ForgeDsField input (read from _v[12]) not as computed/display-only field · P0 task-not-done · Replace with display using _calc() method or make field read-only after computation fills it

## Machine Report Alignment

Police failures explained:
- `calc` check: `consts=1 calc=0` — Label 'קרוב' exists in constants but performs zero arithmetic/conditional calculations
- `far` check: `0×` — String 'רחוק' (far) appears zero times in panuy Dart (only in other app specs like peruk20)

## Coverage Verified (what was done correctly)

✓ Spec correctly updated: line 4 adds `קרוב = distanceCategory(מרחק בריבוע)`  
✓ Entity form includes קרוב field (line 175: ForgeDsField with label c26, editing _v[12])  
✓ Particle table renders קרוב column (px1.dart line 35: grid shows c28=קרוב values from records; content.dart c13/c28)  
✓ Content labels exist: c25='מרחק בקמ', c26='קרוב' (ent1_content.dart:28)  
✓ 15 fields present in entity, nothing broken; all other gates pass  

## Coverage NOT verified (what was not done)

✗ **Logic missing**: distance-squared value (index 10 / c24 'מרחק בריבוע') never checked against threshold 100  
✗ **Conditional missing**: No ternary/if returning 'קרוב' or 'רחוק' based on distance < 100  
✗ **"Far" case unimplemented**: String 'רחוק' (the alternative result) does not exist in generated panuy code  
✗ **distanceCategory function**: Referenced in spec but never invoked or inlined in entity save (line 49) or display (line 175)

## Root Cause

Builder added the field to spec and generated all 15 fields with proper labels, but did not implement the computation logic in the Dart entity. The קרוב field remains a user-input field, not a computed text field as specified by the task.
