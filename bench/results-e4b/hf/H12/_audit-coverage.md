# Audit Report: peruk17 — Cases Table Alphabetical Sort

## Task
Make the cases table sorted alphabetically by סיווג (classification) in the app generated from `machtzev/generator/specs-ds/peruk17.txt`. Don't break anything.

## Findings
**No defects found.**

## Coverage Verified

### Specification & Intent
✅ Spec line 10: `חלקיק תיק: [טבלה] | מיון: סיווג עולה` explicitly requests alphabetical sort on סיווג  
✅ Spec line 7: Entity defines סיווג enum with values: דחייה לגופה, השלמת מסמכים, זימון ועדה, נגמר השעון

### Implementation
✅ **gen_app_peruk17_px1.dart:26** — Table particle implements sort:
```dart
.sort((a, b) { 
  final x = a[gen_app_peruk17_px1_c7] ?? '', y = b[gen_app_peruk17_px1_c7] ?? ''; 
  if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
  final o = [gen_app_peruk17_px1_c8, gen_app_peruk17_px1_c9, gen_app_peruk17_px1_c10, gen_app_peruk17_px1_c11]; 
  final c = o.indexOf(x).compareTo(o.indexOf(y)); 
  if (c != 0) return c; 
  return 0; 
})
```
Sorts by enum order; enum values in gen_app_peruk17_px1_content.dart are:
- c8 = 'דחייה לגופה' (ד)
- c9 = 'השלמת מסמכים' (ה)
- c10 = 'זימון ועדה' (ז)
- c11 = 'נגמר השעון' (נ)

Alphabetically ordered ✓ (Hebrew: ד < ה < ז < נ)

### Surface Coverage
✅ **px1 (cases table particle)** — Has sort on סיווג field, alphabetical  
✅ **ent1 (entity form)** — Table view (view==2) displays records without sort requirement (base form, not "cases table")  
✅ **rp1 (report)** — No table, inapplicable  
✅ **hub (navigation)** — Navigation only, inapplicable  

### Correctness
✅ Police report: all checks pass (`regen_ok`, `byte_identical_others`, `gates_pass`, **`sort ✅ px1`**, `compiles`, `no_hand_edit`)  
✅ Dart compilation: analyzer errors = 0 (in-app = 0)  
✅ No cross-app breakage: `byte_identical_others ✅`

### Builder's Approach
Changes observed in git diff:
1. ✅ Updated spec particle: `[טבלה]` → `[טבלה] | מיון: סיווג עולה`
2. ✅ Reordered enum values in `machtzev/generator/apps/peruk17.json` to alphabetical order
3. ✅ Generator applied sort by enum-order, producing correct alphabetical result
4. ✅ Documented as learning L2026-09-10-sort-alpha in LEARNINGS.md

---

**Verdict:** Task fully complete. Sorting is correct, all surfaces covered, nothing broken.
