# ADR: Dashboard Counter for Intermediary Cases

## Context
The sechirut.txt spec defines a dashboard (לוח בקרה) with multiple counters that track different aspects of lease contract reviews. The spec language supports counter syntax: `מונה(<entity>: <field>=<value>)` for filtered counts.

## Decision
Add a new dashboard counter to display the number of cases where an intermediary (מתווך) is involved. This directly corresponds to a yes/no field on the case (תיק) entity.

## Rationale
1. **Existing pattern**: The dashboard already has `מונה(תיק)` (all cases) and multiple filtered counters on other entities
2. **Field exists**: Line 7 defines the תיק entity with a מתווך{כן|לא} field
3. **Spec language support**: The counter syntax matches documented patterns like `מונה(ממצא: צבע=אדום)` and `מונה(תשלום: שולם=לא)`
4. **Logical placement**: Adding the counter after the basic case counter makes sense as a case-level metric
5. **Business value**: Tracking cases with intermediaries is useful for the reviewing lawyer

## Alternatives Rejected
- Adding in a particle (חלקיק) instead: Dashboard is the right place for a summary metric
- Creating a computed field: Not needed; simple counter is sufficient
- Modifying engine code: Spec-only change is cleaner and doesn't affect other apps

## Consequences
- Dashboard will display one additional counter showing cases where מתווך=כן
- No changes to entities, logic, or other UI elements
- Only affects the sechirut app; byte-identical for all other apps

## Verification
- Spec syntax verified against SPEC-LANG.md line 6
- Pattern matches existing counters in the dashboard
- Counter references existing field from תיק entity
