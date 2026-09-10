# Inspection Report: ממוצע פיקדון Particle Addition

## Surface Coverage Check
- ✅ task-coverage: Entity list (תיק), particle name (ממוצע פיקדון), particle expression (ממוצע(סכום הפיקדון)) — all covered in spec line 26
- ✅ money-numeric: Field סכום הפיקדון is numeric (amount/price semantic), average calculation is valid
- ⚠️ edge-crash: Average calculation on empty record set (would result in 0/0) — handled by Dart fold with 0.0 default
- ⚠️ state-leakage: Aggregate computed reactively via appStore.avg() — correct isolation
- ✅ navigation: Particle screen (px1) navigation unchanged, doesn't affect app flow
- ⚠️ text-parity: Particle name "ממוצע פיקדון" is Hebrew only, no English alternative — matches documented syntax in SPEC-LANG.md

## Machine Validation Status
From initial run:
- ✅ regen_ok — spec parsed, generator executed
- ✅ byte_identical_others — no side effects on other apps
- ✅ no_orphans — all generated files registered
- ✅ no_hebrew_in_engine — no Hebrew in code logic
- ✅ dart_math_sane — Dart math functions used correctly (would be fold, not sqrt/min/max)
- ✅ compiles — flutter analyze zero errors
- ✅ avg_code 1× — average particle code WAS generated 
- ❌ gates_pass — "particles" gate failed (9/10 wired instead of 10/10)
- ❌ label 0× — particle label check failed  

## Investigation Summary
The particle line was:
1. ✅ Added to peruk02.txt (line 26)
2. ✅ Matches PARTICLE_RE regex (`^חלקיק `)
3. ✅ Parses correctly: entity=תיק, name=ממוצע פיקדון, expr=ממוצע(סכום הפיקדון)
4. ✅ Expression matches shapeOf regex for avg aggregates
5. ❌ NOT fully wired in particleWidgets rendering — marked as ok=false in plan

**Root cause identified**: The particleWidgets function (particles.mjs line 328-340) handles aggregates (count, sum, avg) specially, BUT only if they can wire to an atom that accepts numeric value output. The avg particle failed to find a matching wired atom for the 'magnitude' operation it requires. This is not a syntax error but a rendering failure — the machinery understands it's an avg particle but couldn't compose a display widget for it.

**Why avg_code passed**: The code generation phase (`opsOfKind`) recognized the 'avg' shape and emitted Dart code (`appStore.avg()` call), which passes syntax validation. However, the atom-wiring phase failed, so the particle doesn't appear in the final px1 particles screen.

## Verification Results
- **Proven**: Particle syntax is correct per SPEC-LANG.md
- **Proven**: Particle parsing works (10 particles found vs 9 previously)
- **Proven**: Code generation works (avg_code check passed)
- **Not proven**: Particle rendering complete (only 9/10 wired; avg particle not in generated px1.dart header comments)
- **Not proven**: No other apps affected (byte_identical_others still passing)

## VERDICT: NO-GO

The particle was syntactically added and recognized by the generator, but the rendering pipeline failed to fully wire it. The task requires the particle to "show the average of סכום הפיקדון over all cases" — currently it shows nothing because no widget was wired.

To fix would require either:
1. Debugging why atom-wiring fails for 'magnitude' operation with avg shape
2. Using a different particle form (if avg particles are experimental/incomplete)
3. Waiting for missing infrastructure in render-ds for avg particle support

**No changes committed. Particle syntax added to spec but not fully implemented in generated app.**
