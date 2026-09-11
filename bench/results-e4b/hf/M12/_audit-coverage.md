# Audit Report: peruk02 Particle Task (ממוצע פיקדון)

## Findings

new/dart-data-bs/auto/gen_app_peruk02_px1_content.dart:107 · particle label is empty string, no actual computed average value displayed · P1 wrong-result · gen_app_peruk02_px1_c105 must contain calculated average of סכום הפיקדון field across all records, or DsNote must be wrapped in AnimatedBuilder with computation logic

## Coverage Verified

✅ Particle structure: `ממוצע פיקדון` defined in spec (peruk02.txt:17) and content group defined (line 96)  
✅ Particle wired: gen_app_peruk02_px1.dart:34 renders DsNote with correct message string (c104 = "סכום הפיקדון בממוצע על כל התיקים")  
✅ Compilation: Dart analyzer passes, no syntax errors, gates pass 10/10 particles  
✅ Placement: Particle appears in particle screen (px1) alongside other content particles (מסגרת, בלוקים, אסור)

## Not Verified (Architecture Constraint)

⚠️ Actual average computation: The spec requires "average of סכום הפיקדון over all cases" but per LEARNINGS.md L2026-09-10-spec-particles, particles cannot use computational functions. The builder followed this rule and created a content-only particle with empty label (c105=''), resulting in a displayed note with description but no numeric value. Task requirement is structurally unsatisfiable under current architecture rules: either (a) reverse the rule to allow particle math, or (b) redefine requirement to use board-level metrics instead.

## Task Done Status: **NO** — particle exists but does not show the average value (P1 defect). The label field rendered by DsNote(label: gen_app_peruk02_px1_c105) is an empty string, displaying nothing where the user expects to see "₪ X" or similar computed average.
