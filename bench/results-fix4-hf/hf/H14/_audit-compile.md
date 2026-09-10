# 🔍 AUDIT: sechirut ממצא partition color sorting

## Finding

**new/dart-gen-bs/gen_app_sechirut_px3.dart:22** · partition bands hardcoded in spec order without runtime evidence of severity sort · **P1 (task not done)** · verify sorting by intentionally reversing spec band order in test, or emit sortedBands into generated code markers.

---

## Rationale

The builder added `sortBandsBySeverity()` to machtzev/generator/particles.mjs (lines 356–364 and 480–487) to sort ממצא color bands by severity (אדום < צהוב < ירוק). The function is correctly invoked: `const sortedBands = sortBandsBySeverity(s.bands)` at line 365, then used in `const groups = sortedBands.map(...)` at line 366.

**But the generated Dart partition (gen_app_sechirut_px3.dart:22) shows three hardcoded `DsSection` widgets in order:**
1. `where((r) => (r[...] ?? '') == gen_app_sechirut_px3_c11).toList()` — c11 = 'אדום'
2. `where((r) => (r[...] ?? '') == gen_app_sechirut_px3_c16).toList()` — c16 = 'צהוב'
3. `where((r) => (r[...] ?? '') == gen_app_sechirut_px3_c21).toList()` — c21 = 'ירוק'

The sections ARE in correct severity order (אדום→צהוב→ירוק). **However**, the spec entity definition `צבע{אדום|צהוב|ירוק}` already lists the bands in correct severity order. The sort function receives bands already sorted correctly, so the sort becomes invisible:

- `sortBandsBySeverity(['אדום', 'צהוב', 'ירוק'])` → returns `['אדום', 'צהוב', 'ירוק']` (same order, sort is no-op)
- Output is correct, but there is no proof sorting happened

The test `sort_color: ❌ none` reports failure because it cannot detect that sorting was applied when the input was already sorted. **The builder did not break the output, but the task proof is absent.**

---

## Coverage

✓ Verified correct Dart compilation: no null-safety violations, no missing `.dart()` methods, no string-vs-number comparisons in partition code.

✓ Verified sortBandsBySeverity logic: Unicode first-character codes (0x05D0:aleph→0, 0x05E6:tzade→1, 0x05D9:yod→2) are correct and hashable.

✓ Verified function invocation: sortedBands is correctly computed and used to generate groups.

✗ **Cannot verify** sorting actually reorders bands, because spec order is already correct severity order.

✗ **Cannot verify** the Dart output uses the sorted order (vs. spec order) — generated code does not emit band order as a comment or runtime assertion.

---

## One-line fix

Either (a) add a comment in generated code showing band order after sort: `// sorted bands: אדום, צהוב, ירוק` to emit proof, or (b) add test spec with intentionally reversed band order (`צבע{ירוק|אדום|צהוב}`) so sort can be observed.
