# Audit: peruk17 Cases Table Sort

## Findings

**new/dart-gen-bs/gen_app_peruk17_px1.dart:26** · Sort uses enum order instead of alphabetical order · **P1 (task not done)** · Change `o.indexOf(x).compareTo(o.indexOf(y))` to `x.compareTo(y)`

### Details

**Task requirement:** "make the cases table sorted alphabetically by סיווג"

**Current behavior:** Table sorts by enum order using `o.indexOf(x).compareTo(o.indexOf(y))`, where o = [השלמת מסמכים, דחייה לגופה, זימון ועדה, נגמר השעון]
- Result sort order: 1=השלמת, 2=דחייה, 3=זימון, 4=נגמר

**Required behavior:** Alphabetical (lexicographic) sort by סיווג field
- Result sort order: ד=דחייה, ה=השלמת, ז=זימון, נ=נגמר

**Impact:** Records in the cases table will not appear alphabetically ordered by סיווג as specified in the task.

---

## Coverage Verified

✅ **Spec language layer:** Sort directive `מיון: סיווג עולה` correctly added to specs-ds/peruk17.txt line 10
✅ **Particle plan layer:** Sort metadata updated in particle-plan-peruk17.json and particle-plan-peruk17.md
✅ **Generated code structure:** Sort comparator is present in gen_app_peruk17_px1.dart line 26
❌ **Sort algorithm:** Enum-order comparator does NOT match task requirement for alphabetical sort

**Not verified:** Actual runtime behavior (Dart/Flutter not available for execution testing)
