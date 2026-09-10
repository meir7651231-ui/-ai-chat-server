# 10-Step Decomposition — Task H05

**Goal:** Sort cases table in peruk02 app by תאריך מסירת מפתח (earliest first).

## Steps

1. **Identify the engine** — Find the .mjs file that generates table particles. Likely: `machtzev/generator/particles.mjs` or related composer.

2. **Locate peruk02 table particle** — Search for where the `תיק: [טבלה]` particle is rendered. Trace the data flow from case entity to table rows.

3. **Extract date field** — Understand how the date field (תאריך מסירת מפתח) is stored in the case data. May be string (Hebrew date), ISO date, or numeric timestamp.

4. **Write date parser (if needed)** — If dates are not numeric, write a helper to parse Hebrew/ISO dates to comparable values (epochSeconds or numeric). Test with boundary cases: empty dates, malformed dates, future dates.

5. **Add sort comparator** — In the engine, add a `.sort((a, b) => compareDate(a.field, b.field))` that orders cases by date ascending.

6. **Apply before rendering** — Ensure sort happens in the engine BEFORE the generated Dart/Flutter code receives the data. This keeps generated output byte-deterministic.

7. **Test data integrity** — Verify that:
   - All cases are present (count unchanged)
   - No duplicates
   - Dates are in ascending order

8. **Run flutter analyze** — Generated code must have 0 errors.

9. **Run police-bench** — Verify byte-identity with allowed variance (table order only).

10. **Commit** — Small, focused commit with message referencing the sort logic.
