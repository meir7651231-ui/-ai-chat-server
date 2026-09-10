# Task: Add בוטל Stage to משימה Entity

## Summary
Added a third stage `בוטל` (cancelled) to the task entity in `machtzev/generator/specs-ds/tasks.txt`.

## Changes Made
**File:** `machtzev/generator/specs-ds/tasks.txt`  
**Line 6 (before):**
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה
```

**Line 6 (after):**
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה, בוטל
```

## Verification

### 1. Spec File Updated ✓
The spec file now declares three stages: `פתוח` (open), `נעשה` (done), `בוטל` (cancelled).

### 2. App Regenerated Successfully ✓
Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`

Output: Generated 6 screens with 3 stages in the board layout.

### 3. Generated Code Contains New Stage ✓
Verified in generated Dart files (`./new/dart-data-bs/auto/`):

- `gen_app_tasks_ent1_content.dart`: c13='פתוח', c14='נעשה', c15='בוטל'
- `gen_app_tasks_home_content.dart`: c3='פתוח', c4='נעשה', c5='בוטל'  
- `gen_app_tasks_root_content.dart`: c34='פתוח', c35='נעשה', c36='בוטל'
- `gen_app_tasks_hub_content.dart`: Reports "4 שדות · 3 שלבים" (3 stages, up from 2)

### 4. Police Check Passed ✓
Core checks all pass:
- ✓ core: 49 entities · relationships resolved · workflows verified
- ✓ coredart: 8 core screens generated
- ✓ fragops: 557 fragments with ops
- ✓ autoskin: 27 skin roles selected
- ✓ autologic: 30 logic operations × 850 engines
- ✓ atom-count: 5293 atoms (no regressions)
- ✓ pre-tool: 105/105 fixtures pass

Pre-existing failures (index-complete, learn) are unrelated to this change.

## Conclusion
The `בוטל` stage was successfully added to the משימה entity with no breakage. All stages are properly reflected in generated code and the app regenerates correctly.
