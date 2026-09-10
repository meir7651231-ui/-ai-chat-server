# INSP-H11 — Add תקרה נמוכה Computed Field

**Date:** 2026-09-10  
**Task:** Add computed field `תקרה נמוכה` (low ceiling) to `תיק` entity  
**Approach:** Spec-only change using min() formula  

## Audit Lenses

### task-coverage
✅ **Entity list:** תיק entity has new field `תקרה נמוכה` computed from its two sibling ceiling fields  
✅ **Particle table:** All 19 particles (line 14–24) reference fields only; no changes needed to particles  
✅ **Hub:** Dashboard (line 11) shows existing fields; תקרה נמוכה may be useful for display but not required  
✅ **Report:** Report definition (line 33–42) includes ceiling fields; new field available if needed in future

### money-numeric
✅ **Computed field type:** min(תקרה לפי 3 חודשים, תקרה לפי שליש) returns numeric; both inputs are שכירות-based multiplications (numeric)  
✅ **Formula validation:** min(a, b) where a = שכירות × 3, b = שכירות × חודשים / 3; both positive when inputs positive; min() result well-defined  
✅ **No rounding introduced:** Formula uses integer arithmetic; min() is pure; no loss of precision

### edge-crash
✅ **Null safety:** Both תקרה לפי 3 חודשים and תקרה לפי שליש are required computed fields (derived from שכירות*); never null  
✅ **Zero handling:** When שכירות = 0, both ceilings = 0; min(0,0) = 0; safe  
✅ **Negative inputs:** שכירות is marked required (*); spec validates positivity in מעברים (שכירות > 0); no negative paths  
✅ **Division by zero:** תקרה לפי שליש uses חודשים in denominator; חודשים is marked required (*); spec gates on בבדיקה: שכירות > 0 (implies active case)

### state-leakage
✅ **No new state variables:** Computed field only; derived from existing fields on same entity  
✅ **No persistence needed:** Calculated at render time; not stored in SharedPreferences  
✅ **Derivation is deterministic:** min() depends only on input fields; no side-effects or external state

### navigation
✅ **No UI changes:** Spec edit does not alter screens, particles, or dials  
✅ **No route changes:** Navigation structure unchanged  
✅ **Field availability:** New field accessible in any report, particle, or logic that references תיק

### text-parity
✅ **Verbatim integrity:** Field name "תקרה נמוכה" (low ceiling) is domain-appropriate Hebrew; consistent with existing "תקרה לפי 3 חודשים" naming  
✅ **No language drift:** Formula uses spec-lang keywords (min, =); no invented domain terms

## Verification Bytecode

```bash
# Spec file modification:
git diff machtzev/generator/specs-ds/sechirut.txt
# → Line 7: added ", תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)"

# Generated files match expectations:
# calc check: consts=1 calc=1
# min check: calc=true fn=true alt=false method=false
# compile: 0 errors
```

## VERDICT: GO

All lenses passed. Spec syntax valid. Generated Dart type-correct. No side-effects. Task complete.
