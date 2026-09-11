# 🔍 Audit Report — H06 (peruk12 sort)

## Findings

**new/dart-gen-bs/gen_app_sechirut_ent2.dart · multiple lines · P2 state-leakage · regenerate only if intentional**

State-leakage: sechirut_ent2 was regenerated (constants c25–c31 reordered/renumbered) when only peruk12 was supposed to be modified. Specifically:
- Constant c25 ('מפתח חודש') was removed and replaced with shifted values
- Constants c26–c30 shifted indices
- New constant c31 was added
- All code references updated accordingly (e.g. lines 29, 45, 62, 88, 90, 99, 189), so compilation succeeds and logic is functionally equivalent

The police report claims `byte_identical_others ✅ CONFIRMED`, but sechirut_ent2.dart and gen_app_sechirut_ent2_content.dart are byte-different from HEAD. This contradicts the claim unless "others" has a narrower definition (e.g., only OTHER peruk apps, not other app-ds apps).

**Task completion verified**: Peruk12 table sort is correctly implemented:
- Sort field: gen_app_peruk12_px1_c4 = 'מחיר' ✓
- Numeric comparison: `(nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y)` ✓  
- Ascending order (cheapest first): `nx.compareTo(ny)` returns negative when nx < ny, placing smaller values first ✓
- Fallback to text sort for non-numeric values (safety) ✓
- Empty values sorted last: `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1` ✓

The sort spec in peruk12.txt line 10 is correct: `[טבלה] לקוח, טלפון, מחיר | מיון: מחיר מהנמוך` (table with sort by price from lowest). Generated output matches spec.

---

## Coverage

**Verified correct**:
- Sort logic in gen_app_peruk12_px1.dart line 25: numeric comparison before text fallback, ascending order enforced
- Constant mapping: c4='מחיר' (price), columns c1,c2,c3 (client,phone,price), data fields c5,c6,c7
- Spec compliance: peruk12.txt line 10 `| מיון: מחיר מהנמוך` → ascending numeric sort ✓
- Compilation: 0 analyzer errors (verified by police report)
- No orphans, all gates pass (police report)
- Task requirement "don't break anything" appears met: peruk12 generates and compiles without errors

**Could not verify**:
- Runtime behavior (cannot run Flutter app to visually confirm sort order with actual data)
- Whether sechirut constant reordering was expected side-effect of generator (no generator source code available to audit)
- Definition of "byte_identical_others" check (police-bench.mjs source not audited)

