# 🔴 AUDIT: State-Leakage & Regression · E05 (calendar task)

## CRITICAL FINDINGS

**machtzev/generator/ship.mjs:1** · Entire file replaced with blocking message; infrastructure script destroyed; breaks deployment pipeline (ship, regen, gh-pages, commit/push workflow). Severity: **P0 compile-break** · Fix: Restore from HEAD; spec tasks must never modify shared engine infrastructure.

**machtzev/generator/tighten-types.mjs:1** · Entire file replaced with blocking message; infrastructure script destroyed; breaks type-tightening pipeline for all Dart atoms. Severity: **P0 compile-break** · Fix: Restore from HEAD; spec tasks must never modify shared engine infrastructure.

**machtzev/one.mjs:1** · Entire file replaced with blocking message; master engine orchestrator destroyed; breaks all multi-stage orchestration (census, decomp, dedup, manifest, assembly, boards, design, purity, police, etc.). Severity: **P0 compile-break** · Fix: Restore from HEAD; spec tasks must never modify shared engine infrastructure.

## REGRESSION ANALYSIS

**Scope of damage:** These three files are SHARED INFRASTRUCTURE used by ALL applications (calendar, panuy, tasks, peruk, sechirut, balagan) and by every build/deployment workflow in the system. Modifying them in a calendar spec task causes state-leakage: changes intended for one app break all apps.

**What the police report missed:** The police-bench.mjs validated only:
- `regen_ok` (calendar app regenerated)
- `byte_identical_others` (panuy/tasks/peruk/sechirut app files unchanged)
- `no_orphans`, `gates_pass`, `field`, `empty_text` (spec surface checks)

The police report has NO GATE to detect "did the builder modify machtzev/ infrastructure files that should never be touched by a spec task". This is a gap in the audit.

**Expected vs actual:**
- **Expected:** calendar.txt and calendar.json modified; new/ files regenerated; zero changes to machtzev/ engine
- **Actual:** ship.mjs, tighten-types.mjs, one.mjs replaced with blockers; other changes correct

## VERIFIED CORRECT

✅ **Spec-level changes legitimate:**
- `machtzev/generator/specs-ds/calendar.txt` line 6: משתתפים field added correctly (between מקום and הערה)
- `machtzev/generator/specs-ds/calendar.txt` line 7: [ריק] particle declared correctly with text "אין פגישות השבוע"
- `machtzev/generator/apps/calendar.json`: Field object structure correct (label "משתתפים", type "text", required false, enumVals [])
- `machtzev/generator/particle-plan-calendar.json`: Particle plan correct (entity פגישה, shape empty, op empty, wired EmptyState@premium/feedback)
- `machtzev/LEARNINGS.md`: Learning L2026-09-10-spec-first documents the pattern; cites byte_identical_others ✅ and field ✅ and empty_text ✅ police checks (all legitimate)

✅ **Other apps untouched by spec:** police-bench `byte_identical_others` gate passed means panuy, tasks, peruk*, sechirut remain byte-identical; new/ files for calendar only; calendar screens (6 screens per police report px1 count) regenerated only from calendar spec.

✅ **Dart compile & type:** The calendar app Dart compiles (flutter analyze 0 errors per police), and field is text type (correct inference from no type marker in spec).

## COVERAGE

**Audited (regression lens):**
- State-leakage: Shared infrastructure files modified ← **CRITICAL DEFECT FOUND**
- Generated output files: Scanned for orphans; none flagged by police
- Spec-to-app wiring: spec lang (field syntax, particle syntax) correct; generated JSON structure correct
- Regression vector: Cross-app impact via byte_identical check; one.mjs/ship.mjs/tighten-types.mjs shared across ALL apps

**Not audited (Dart runtime, logic, UI rendering):**
- Dart static analysis passed per police report; assume sound
- Flutter rendering of empty-state card: police flagged as px1 (one pixel location) — assume correct per police
- Field UI display in meetings screen: not audited (would require running app)

## SUMMARY

**Task completion:** Spec-level task (add field + empty-state) completed correctly. All legitimate changes in place.

**System impact:** CRITICAL — three irreplaceable shared infrastructure scripts destroyed. This blocks:
1. Any `ship` deployment (entire pipeline)
2. Any type-tightening of Dart atoms
3. Any execution of master orchestrator (`one`)

All other apps (panuy, tasks, peruk, sechirut, balagan, schoolos, etc.) are now broken until these three files are restored from HEAD.
