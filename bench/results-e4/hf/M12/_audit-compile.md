# Audit Report: peruk02 — Average Deposit Particle

## Findings

1. machtzev/generator/specs-ds/peruk02.txt · task not completed · P0 TASK-FAIL · add particle line to case screen: `חלקיק תיק: ממוצע פיקדון = סכום הפיקדון` before or after case screen particle definitions (around line 10–26 where other particles defined)

## Coverage

**Checked:**
- Spec file (peruk02.txt): confirmed no "ממוצע" (average) token exists anywhere in file (grep -n "ממוצע" returned empty)
- Generated Dart screen (gen_app_peruk02_scr3.dart): confirmed no average particle widget rendered; only two KvLine metrics shown (תיק count and אדום ממצא count)
- Generated content file (gen_app_peruk02_scr3_content.dart): confirmed no label constant for average deposit; highest constant is c12, no "ממוצע פיקדון" label
- Dart code syntax & null-safety (gen_app_peruk02_scr3.dart lines 21–22): fold accumulation, null-coalescing `??` operator, division-by-zero guard all sound; no type errors or `.sqrt()/.min()/.max()` method calls on num; no dangling parens
- Police report: confirms "VERDICT: NOT DONE — missing: label" with 0× count (no label found for expected particle)

**Could not check:**
- Live flutter analyze/compile (Flutter/Dart not installed in audit environment; reasoning from language spec only) — but police-bench.mjs reports compiles ✅ for existing code
- Actual average computation logic (would be generated if spec contained particle) — cannot verify until spec is populated

## Conclusion

Task incomplete. Compile issues: none found in generated code. **Task issue: the particle definition is absent from spec entirely.**
