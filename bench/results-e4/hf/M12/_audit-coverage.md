# 🔍 Audit: peruk02 average deposit particle · M12

## Findings

**machtzev/generator/specs-ds/peruk02.txt** · No particle added · **P0 task-not-done** · Add `חלקיק תיק: ממוצע פיקדון = [לייבל]` to the case entity section (after line 16, before the דוח lines) to define the display particle; currently zero label particles exist in peruk02 spec.

**machtzev/generator/particles.mjs:175-184** · opsOf() function missing 'avg' case · **P1 infrastructure-incomplete** · Add `if (shape.kind === 'avg') return ['label'];` before line 182 to support average particle rendering; currently delegates to opsOfKind which fails for avg particles (confirmed by claims.json investigation showing particle marked ok=false with rendering failure).

**new/dart-gen-bs/gen_app_peruk02_scr3.dart** · Case screen missing average display widget · **P1 incomplete-rendering** · Screen currently shows 2 KPI counters (cases + red findings) but no average deposit particle rendering; verify wiring to px1 screen after adding opsOf case.

## Verification

**What was checked:**
- git diff HEAD (shows changes only to sechirut app, peruk02 unmodified)
- Police report (label ❌ 0×, avg_code ✅ 1× — average *code* generated but no display *label* found)
- claims.json (builder investigation: "Average particle feature...infrastructure incomplete. Particle not added to avoid breaking gates")
- Spec file peruk02.txt (no ממוצע פיקדון particle defined; line 8 dashboard definition contains only counters)
- particles.mjs opsOf function (lines 175-184: explicit cases for content/diff/number/message/dates/partition, no avg case)

**Confidence level:** HIGH — byte evidence (spec file, police checks, claims.json) all confirm: particle definition missing from spec, infrastructure lacks avg support, zero label particles rendered. avg_code ✅ indicates averaging *computation* was attempted, but no display element wired.

**Task coverage gaps:**
1. ❌ Spec does not define `חלקיק תיק: ממוצע פיקדון` particle
2. ❌ Render-ds opsOf() has no 'avg' case for average particles
3. ❌ Case screen scr3 has no average deposit display (only counters)
4. ✓ Dart compilation passes (0 errors) — infrastructure is type-safe even if incomplete
5. ✓ No existing tests/gates broken (builder protected gates per "don't break" constraint)

**Not checkable:** Runtime rendering behavior (Flutter/Dart not installed); actual visual output of average value on screen would require running the app.
