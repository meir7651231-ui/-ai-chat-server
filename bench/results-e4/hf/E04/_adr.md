# ADR: Add בוטל (cancelled) Stage to משימה Entity

## Context
The `משימה` (task) entity in `machtzev/generator/specs-ds/tasks.txt` currently has two stages: `פתוח` (open) and `נעשה` (done). The requirement is to add a third stage `בוטל` (cancelled) to represent cancelled tasks, without breaking existing functionality.

## Decision
**Add בוטל as a third comma-separated stage in the tasks.txt spec.**

Changed line 6 from:
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה
```
to:
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה, בוטל
```

## Rationale
1. **Spec-first**: The spec language (SPEC-LANG.md) defines stages as comma-separated values and is the single source of truth. The system is data-driven; stage atoms (ForgeStagePill, nextStage, etc.) process stages from spec metadata.

2. **No code changes needed**: Stage-handling atoms automatically recognize new stages via data-driven spec processing. No Dart code modifications required.

3. **Precedent exists**: The `sechirut.txt` spec demonstrates the language supports arbitrary numbers of stages: `שלבים: התקבל, שולם, בבדיקה, נמסר, תיקון, סגור` (6 stages).

4. **Minimal risk**: Spec change is isolated to one line. The generator pipeline (app-ds.mjs) regenerates the app and validates compilation.

5. **Machine verified**: All checks pass:
   - byte_identical_others: No spillover to other apps
   - compiles: Zero Dart analyzer errors
   - gates_pass: stage_cancel gate confirms recognition
   - regen_ok: Clean regeneration

## Alternatives Considered and Rejected
1. **Adding בוטל hardcoded in an atom** — Rejected. Would violate data-driven design and require manual code changes that break the protocol.

2. **Adding בוטל to spec-lang.data.json enum** — Rejected. The spec language already treats stage names as free-form strings; no enum constraint exists.

3. **Adding stage-transition logic** — Rejected. The task only requires adding the stage, not implementing transitions. Future work can add gates (e.g., `מעברים: בוטל: ...`) if needed.

## Consequences
- ✅ The משימה entity now supports three states: open, done, cancelled
- ✅ All existing logic handling stages automatically recognizes בוטל
- ✅ No code churn; pure spec data change
- ✅ Fully verified by machine report; zero breakage
- ⚠️ Future uses of בוטל in this app require either explicit logic (e.g., filtering) or rely on default behavior (all stages shown)

## Verification
- Machine report (police-bench.mjs): **DONE** ✅
- All checks passed: regen_ok, byte_identical_others, compiles, gates_pass, stage_cancel
- Search-record documented: no new atoms needed
- Inspection audit: GO ✅
