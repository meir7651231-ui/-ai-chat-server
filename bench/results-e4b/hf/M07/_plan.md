# PLAN M07: Add findings-not-sent counter to sechirut

## Goal
Add a dashboard counter of unsent findings and a counter particle named "לא נשלחו" without breaking anything.

## 10-Step Decomposition

1. **Search for related atoms**: Run search-record to find existing counting patterns for ממצא entity
2. **Read spec language**: Confirm condition syntax for count with `שדה=ערך` in SPEC-LANG.md ✓
3. **Analyze current dashboard**: Understand existing counters on line 11 and their ordering
4. **Analyze particles section**: Understand existing ממצא particles (lines 16-24)
5. **Plan placement**: Decide where to insert new counter in dashboard line (after yellow, before securities)
6. **Plan particle placement**: Decide where to insert new particle (after line 24, with other ממצא particles)
7. **Edit spec**: Add two lines to sechirut.txt (one in dashboard, one in particles)
8. **Regenerate**: Run app-ds.mjs with --name sechirut to generate new Dart code
9. **Verify**: Run machine report to check regen_ok, byte_identical_others, compiles
10. **Document findings**: Record lesson in LEARNINGS.md about spec-driven counter patterns

## Implementation Checklist

### FND (Find) — ✓
- Spec file at: machtzev/generator/specs-ds/sechirut.txt
- Entity "ממצא" has field "נשלח{כן|לא}" on line 9
- Dashboard on line 11, particles on lines 16-24

### FRM (Form) — Pending
- Add counter to dashboard: `מונה(ממצא: נשלח=לא)` on line 11
- Add particle: `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)` after line 24

### WIR (Wire) — Will verify
- Existing count patterns use condition syntax from SPEC-LANG
- No new atoms/functions needed

### VRB (Verify) — Will run
- Machine report checks byte_identical_others
- Machine report checks compiles (Dart syntax)
- Machine report checks gates_pass

### OPS (Output) — Will produce
- Updated sechirut.txt
- Regenerated Dart code in new/dart-gen-bs/, new/dart-data-bs/, new/dart-forge-bs/
- Machine verdict: DONE or list of failed checks
