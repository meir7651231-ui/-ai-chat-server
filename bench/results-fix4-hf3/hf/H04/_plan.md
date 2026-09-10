# Plan: Sort Meetings Table by Date then Time

## Goal
Make the meetings table (פגישה particle screen) in the calendar app sorted by מועד (date) then שעה (time).

## Opening Question
For the פגישה particle table sort order:
- Should meetings be sorted ascending (earliest first) or descending (latest first)?
- For meetings on the same date, should times be ascending (earliest first) or descending?
- **Assumed answer:** Both ascending (chronological order: earliest to latest)

## 10-Step Decomposition

1. **Read & Understand** — Read SPEC-LANG.md to understand how sorting is expressed in the spec language
2. **Find Generated App** — Locate the generated calendar app (likely in new/dart-gen-bs/calendar/)
3. **Identify Particle Screen** — Find the פגישה particle screen code and understand current data structure
4. **Search for Existing Sort** — Check if פגישה table already has sorting; document current behavior with `search-record.mjs`
5. **Locate Sort Logic** — Find where the list is rendered and what sorting (if any) is applied
6. **Design Sort Fix** — Decide: spec-level change (preferred) or engine-level change
7. **Implement Sort** — Add sort by מועד then שעה (as helper function or spec directive)
8. **Test Sorting** — Verify the table displays in correct order; write unit test if helper created
9. **Verify Bytes** — Run machine report to ensure byte-identical for other apps, no compilation errors
10. **Document & Commit** — Record findings in LEARNINGS.md, update claims.json, local commit (no push)

## Key Files to Check
- `machtzev/generator/specs-ds/SPEC-LANG.md` — spec language reference
- `new/dart-gen-bs/calendar/` — generated calendar app
- `machtzev/LEARNINGS.md` — where to record lessons learned
