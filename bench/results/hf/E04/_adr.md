# ADR-E04 — Add Task Cancellation Stage

**Status:** Accepted
**Date:** 2026-09-09
**Related:** machtzev/generator/specs-ds/tasks.txt, entity.mjs:108-110

## Context

The task entity `משימה` in tasks.txt currently has two workflow stages: `פתוח` (open) and `נעשה` (done). The system needs to support cancelled tasks as a third stage to handle the lifecycle case where tasks may be cancelled rather than completed.

## Decision

Add `בוטל` (cancelled) as a third stage to the task entity stages list, appended to the existing list.

**Line 6 change:**
```
FROM: ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה
TO:   ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה, בוטל
```

## Rationale

1. **Engine is generic:** The stage parser in entity.mjs (lines 108-110) is completely generic and parses stages by splitting on commas/newlines. It does not hardcode stage names or assume a fixed count.

2. **No hidden assumptions:** Verified via grep that no engine code has hardcoded references to "exactly 2 stages" or specific stage names for the task entity.

3. **Semantic ordering:** Order `פתוח, נעשה, בוטל` represents the natural task lifecycle: open → done, with cancellation as an alternative exit.

4. **Auto-indexed:** The data generation pipeline (render-ds.mjs, balagan.mjs) automatically indexes all stages from the spec. No manual changes needed to generation logic.

## Alternatives rejected

- **Alphabetic order:** `בוטל, נעשה, פתוח` — breaks user mental model of workflow progression.
- **Insert in middle:** Between open/done — confuses the completion flow.

## Consequences

- Stage count increases from 2 to 3.
- All generated stage atoms (BreadcrumbTrail, stage buttons, progress tracking) will automatically include the new stage.
- Tests must cover the 3-stage workflow.
- No API/schema changes needed; purely data-driven.

## Verification

1. Machine report (police.mjs) gates ensure:
   - `regen_ok` — generator pipeline completes without errors
   - `no_hebrew_in_engine` — spec parser handles Hebrew correctly
   - `byte_identical_others` — no accidental changes to unrelated files

2. Visual gate: new stage appears in BreadcrumbTrail and stage selection UI.

3. Stage count in atom-index reflects 3 stages.
