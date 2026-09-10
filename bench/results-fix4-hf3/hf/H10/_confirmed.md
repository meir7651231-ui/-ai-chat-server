# ✅ VALIDATOR CONFIRMATION — H10 (calendar sorting)

## Machine Report (_police.md) — All Checks Pass
- ✅ regen_ok
- ✅ byte_identical_others
- ✅ no_orphans  
- ✅ gates_pass
- ✅ no_hebrew_in_engine
- ✅ dart_math_sane
- ✅ compiles (analyzer errors: 0)

**→ No P0 auto-CONFIRMED findings from failed generic checks.**

---

## Auditor Findings — Verification

### Finding 1: Missing ANTIPATTERN in LEARNINGS.md
**Source:** _audit-regression.md

**Verdict:** CONFIRMED

**Evidence:** machtzev/LEARNINGS.md:5-9. Structure is missing ANTIPATTERN field between GATE and RULE lines:
```
## L2026-09-10-sort-a7c2f3 · ...
GATE: none
RULE: spec-lang sorting `| מיון: <שדה> עולה` ...
```

Expected format (per L2026-09-05 and L2026-09-04 entries) is:
```
## L2026-09-10-sort-a7c2f3 · ...
GATE: none
ANTIPATTERN: [pattern]
RULE: ...
```

**Severity:** P2 (governance/documentation issue; does not affect sorting implementation correctness)

**Fix:** Add ANTIPATTERN line after GATE: `ANTIPATTERN: \| מיון: \w+ עולה` (regex describing the sort directive pattern added to resolve this learning)

---

## Implementation Verification

✅ **Entity list screen (gen_app_calendar_ent1.dart:157)**
- Sort field: c16 = 'שעה' (verified in ent1_content.dart:18)
- Sorting logic: numeric comparison with lexical fallback, empty values last
- Applied to all 4 views: board (158), calendar (159), table (160), list (164-165)
- Null-safe: uses `??` operator, `num.tryParse()` correctly handles num?

✅ **Particle table screen (gen_app_calendar_px1.dart:18)**
- Sort field: c5 = 'שעה' (verified in px1_content.dart:7)
- Sorting logic: identical to entity screen (numeric → lexical, empty last)
- Null-safe: same patterns as ent1

✅ **Spec changes verified**
- Line 6: Added `| מיון: שעה עולה` to entity declaration
- Line 7: New particle with sort declaration
- Generator correctly read both directives and emitted comparator code

✅ **No side effects**
- byte_identical_others: ✅ (7 other apps unchanged)
- no_hand_edit: ✅ (spec-lang only, no manual edits)
- Compilation: ✅ (0 analyzer errors)

---

## FIX-LIST:
1. CONFIRMED P2 · machtzev/LEARNINGS.md:5–9 · Missing ANTIPATTERN field after GATE · Add: `ANTIPATTERN: \| מיון: \w+ עולה`

