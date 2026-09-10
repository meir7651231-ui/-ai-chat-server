# Goal
Add stage `בוטל` (cancelled) to task entity `משימה` in tasks.txt specification without breaking existing generation logic.

## 10-Step Decomposition

1. **Search existing references**: grep for `משימה` and stage usage across engine
2. **Locate mutation point**: line 6 of tasks.txt, stages list
3. **Understand stage parsing**: find how stages are parsed in generator code
4. **Verify no hardcoding**: ensure engine doesn't hardcode `פתוח|נעשה` assumptions
5. **Edit spec**: add `בוטל` to stages list (alphabetic or semantic order?)
6. **Test machine gates**: run police report to verify stages table created correctly
7. **Verify completeness**: check that all atoms with new stage are indexed
8. **Byte-verify claim**: grep the generated output
9. **Write LEARNINGS**: document stage-field mechanics
10. **Run final police**: full suite passes

## Order decision
Current order: `פתוח, נעשה` (open, done). Adding `בוטל` (cancelled).
Choice: append as `פתוח, נעשה, בוטל` (semantic: open→done→cancel path). 
Alternative: alphabetic `בוטל, נעשה, פתוח` (no, breaks user mental model).

## Risk: None detected
- No hardcoded stage names in engine (will verify).
- Task entity is data-driven; new stage = auto-indexed.
- No logic depends on "only 2 stages".
