# ADR: Add מתווך Dashboard Counter

## Context
The sechirut.txt dashboard ("לוח בקרה") currently has 6 counters tracking תיק counts, findings by color, collateral violations, overdue payments, and payment sums. The תיק entity has a field: `מתווך{כן|לא}` (line 7).

## Opening Question
**Q:** Should the new מתווך counter use the syntax `מונה(תיק: מתווך=כן)` to count only תיק records where the mediator field is set to "כן"?

**A (assumed):** YES. This follows the existing counter pattern seen in line 11 (e.g., `מונה(ממצא: צבע=אדום)`) and is the most useful dashboard metric: showing how many cases involve a mediator.

## Decision
Add `מונה(תיק: מתווך=כן)` to the end of the לוח בקרה definition on line 11.

## Rationale
- **Consistency:** Uses existing counter pattern (`מונה(entity: field=value)`)
- **Utility:** Provides visibility into mediator involvement
- **Scope:** Single-line addition, no logic changes needed
- **Risk:** Low—only adds a new counter metric, doesn't affect existing ones

## Alternatives Rejected
1. `מונה(תיק: מתווך)` — Incomplete; unclear what to count
2. Separate dashboard entity — Over-engineered; counters belong in one place
3. Post-processing in logic engine — Wrong layer; specs are for declarative metrics

## Consequences
- Dashboard now shows mediator-case count as 7th metric
- No generator changes needed; spec-language is declarative
- Gate checks will verify no broken references

## Verification
Run machine report to confirm:
- No hand-edits in generated files
- Spec parses cleanly
- No gates fail
- No new atoms created

---

**Status:** ASSUMED ANSWER - PROCEEDING
