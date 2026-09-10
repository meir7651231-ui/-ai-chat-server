# Plan: Add סך הכל particle to payments screen

**Goal:** Add a particle named `סך הכל` to the תשלום (payment) entity that displays the sum of all `סכום` (amount) fields.

## 10-Step Decomposition

1. **Search existing patterns** — Run `node machtzev/search-record.mjs` to find particles that use `סכום` aggregation, confirm pattern consistency.

2. **Identify spec layer fix** — Line 19 shows `חלקיק תשלום: הכנסה = סכום(סכום)`. The new particle must follow same syntax.

3. **Add particle definition** — Insert new line in sechirut.txt after line 19:
   - Format: `חלקיק תשלום: סך הכל = סכום(סכום)`
   - This creates a sum-type particle identical to "הכנסה" but with label "סך הכל".

4. **Verify spec syntax** — Grep the file to confirm no syntax errors (Hebrew label, entity name, aggregation function).

5. **Run generator** — Execute the machine to regenerate the app from the updated spec.

6. **Byte-check generated code** — Verify that the new particle appears in generated Dart/Flutter files (search for `סך הכל` in generated outputs).

7. **Validate no breakage** — Confirm all existing particles still render (run `flutter analyze` equivalent check via machine).

8. **Register any new gates** — If machine introduces new gates, add them to claims.json with check IDs.

9. **Audit integration** — Verify the particle is wired into the payments UI screen and displays correctly (via mutation test framework).

10. **Finalize claims** — Document all verified changes in claims.json with proven/not-proven split.

---

## Success Criteria
- New particle `סך הכל` appears in generated code
- Sums all `תשלום.סכום` values for each `תיק`
- No existing particles/features broken
- Machine report: DONE
