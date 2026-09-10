# 🔍 VALIDATOR REPORT — H02 (sechirut table sort)

| ID | Verdict | File:Line | Evidence | Fix |
|---|---|---|---|---|
| L2026-09-10-learnings-mismatch | **CONFIRMED** | machtzev/LEARNINGS.md:10 | "צריכה מיון לפי שכירות (rent) עולה" contradicts task (highest first=descending) and impl (return -c negates) | Change "עולה" → "יורד" |

## Finding details

**L2026-09-10-learnings-mismatch** (P1 — documentation mismatch)
- The new LEARNINGS entry documents the requirement as ascending ("עולה"), but the task explicitly says "sorted by rent שכירות, **highest first**" (descending). 
- The spec (sechirut.txt:22) correctly specifies `| מיון: שכירות יורד`.
- The generated code (gen_app_sechirut_px1.dart:34) correctly implements descending sort via `return -c;` (negating the compareTo result).
- The contradiction lives only in LEARNINGS.md line 10, which is an added learning from this task that documents future policy for table sort particles.
- **Fix is safe:** Changing one word "עולה" to "יורד" on that line aligns the documentation with the task requirement and actual implementation. No code changes needed.

## Coverage summary

**Verified correct:**
- Spec: sechirut.txt:22 correctly added `| מיון: שכירות יורד` ✓
- Generated Dart: sort lambda on field `gen_app_sechirut_px1_c19` (rent) with `return -c` → descending ✓
- Empty value handling: properly sorts non-empty first ✓
- Null safety: `num.tryParse()` checked before use ✓
- Police gates: all pass (regen_ok, byte_identical_others, gates_pass, sort, desc) ✓
- No state leakage to other apps ✓
- No regression in other entity screens or particles ✓

**Not checked:** Runtime rendering (Dart/Flutter not available); delegated to police golden tests.

---

**FIX-LIST:** 
1. L2026-09-10-learnings-mismatch · machtzev/LEARNINGS.md:10 · "עולה" → "יורד"
