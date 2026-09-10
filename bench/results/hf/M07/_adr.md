# ADR: Add Dashboard Counter and Particle for Unsent Findings

## Context
The sechirut.txt spec defines a finding entity (ממצא) with a yes/no field `נשלח` (sent).
Currently, the dashboard has counters for red findings, yellow findings, and unpaid payments,
but no counter for findings that have not been sent yet.

## Opening Question
Should the "לא נשלחו" (not sent) counter:
1. Appear on the main dashboard (לוח בקרה)?
2. Appear as a particle on the findings screen?
3. Both?

**Assumed Answer:** Both. Following the existing pattern of payment counters (לא שולם),
I will add a dashboard counter AND a findings-screen particle named "לא נשלחו".

## Decision
Add two items to sechirut.txt:
1. Line 11 (dashboard): Add `מונה(ממצא: נשלח=לא)` to count findings not sent
2. New particle line (after line 20): `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)`

## Rationale
- The pattern exists for payments (line 20: `חלקיק תשלום: לא שולם = מונה(שולם=לא)`)
- Findings with `נשלח=לא` are a key workflow state (similar to unpaid payments)
- The field exists in the entity definition (line 9: `נשלח{כן|לא}`)
- No new logic engine required; uses existing `מונה` counter mechanism
- Follows existing naming convention (Hebrew, "not X" = "לא X")

## Alternatives Rejected
- Add only to dashboard: Less useful; users need per-screen view
- Add only to particle: Dashboard visibility is valuable KPI
- Different naming: Consistency with "לא שולם" pattern is important

## Consequences
- Dashboard will show real-time count of unsent findings
- Findings screen will have a particle counter for quick scan
- No schema changes needed; uses existing `נשלח` field
- No code changes in engine; spec-only modification

## Verification
- Machine police.mjs runs the generator and checks byte-identity of all generated files
- Manual inspection: dashboard renders new counter, findings particle appears
- Confirm no generation errors in new/dart-gen-bs, new/dart-data-bs, new/dart-forge-bs
