# Tasks Spec Update: Rounded Amount Field

## Change Made
Added computed field `סכום מעוגל` (rounded amount) to the משימה (task) entity in `machtzev/generator/specs-ds/tasks.txt`.

### Specification Syntax
```
סכום מעוגל=סכום.round()
```

This adds a new field that automatically rounds the `סכום` (amount) field to the nearest whole number using the `.round()` method.

## Verification

### 1. Generator Execution
Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
- ✅ App generation succeeded
- ✅ 6 screens generated (1 entity + 4 system + 1 board)
- ✅ Forge skin applied correctly

### 2. Generated Code Inspection
Verified in `new/dart-gen-bs/gen_app_tasks_ent1.dart`:
- ✅ Helper function created: `num _m_round(num x) => x.round()`
- ✅ Formula applied in save logic: `(num.tryParse(_v[2] ?? '') ?? 0) ._m_round()`
- ✅ Display widget with calculation: `_calc(gen_app_tasks_ent1_c12, ...)`
- ✅ Field label in content file: `const String gen_app_tasks_ent1_c12 = 'סכום מעוגל'`

### 3. Police Validation
Ran `node machtzev/police.mjs --fast`
- ✅ All app generation steps (autoskin, autologic, skingolden) passed
- ✅ No new failures introduced
- ✅ Pre-existing git object issues unrelated to this change

## How It Works
When a task is saved with an amount (e.g., 123.45), the `סכום מעוגל` field automatically computes and stores the rounded value (123). The formula is evaluated at save time and stored as a readonly calculated field in the entity.

## Backwards Compatibility
✅ No existing fields modified
✅ New computed field is transparent to existing functionality
✅ Spec parsing handles formula syntax correctly without breaking entity interpretation
