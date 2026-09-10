# AUDIT: Stage Addition peruk08 (הוחזר הכסף)

## Findings
No findings. Task completed correctly across all surfaces.

## Coverage Verified

**Spec layer** (source of truth):
- machtzev/generator/specs-ds/peruk08.txt · line 6: Stage correctly inserted in order after נמסר
  ```
  שלבים התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור
  ```
- machtzev/generator/apps/peruk08.json · lines 29–36: App config updated with 6 stages (stages array), new stage in position [4]

**Entity screen (Particle table / Entity list)**:
- new/dart-gen-bs/gen_app_peruk08_ent1.dart · line 90:
  - Stages array updated from 5 to 6 constants (c22–c27)
  - stageDone threshold updated to >= 5 (was >= 4)
  - onAdvance target updated to 6 (was 5)
  - clamp max updated to 5 (was 4)
- new/dart-data-bs/auto/gen_app_peruk08_ent1_content.dart · lines 1–29:
  - c1 metadata: "7 שדות · 6 שלבים" (was 5)
  - c26: "הוחזר הכסף" (new)
  - c27: "סגור" (shifted from c26)

**Home screen (Today/Hero)**:
- new/dart-gen-bs/gen_app_peruk08_home.dart · lines 48, 198, 201:
  - open() filter: stageOf < 5 (correctly excludes stage 5=סגור)
  - done() filter: stageOf >= 5 (correctly includes only סגור)
  - Stage labels array: 6 constants (c6–c11), clamp(0,5)
- new/dart-data-bs/auto/gen_app_peruk08_home_content.dart · lines 8–13:
  - c10: "הוחזר הכסף" (new, all subsequent constants shifted by +1)
  - c11: "סגור"

**Root screen (Detail view)**:
- new/dart-gen-bs/gen_app_peruk08_root.dart · lines 28, 33:
  - Subtitle stages array: 6 constants (c51–c56), clamp(0,5)
  - Auto-complete threshold: >= 5 (marks stage=5 as done)
  - Stage advancement: sets stage to '5' (was '4')
- new/dart-data-bs/auto/gen_app_peruk08_root_content.dart · lines 53–58:
  - c51–c56 correctly labeled: התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור

**Report screen** (gen_app_peruk08_rp1.dart):
- No stage-specific logic in report; report displays entity data through appStore queries — dynamics handle new stage transparently

**Hub screen** (gen_app_peruk08_hub.dart):
- No stage-specific navigation; hub lists screens statically — unaffected

**Machine verification**:
- _police.md confirms:
  - regen_ok ✅: Generator pipeline completed
  - byte_identical_others ✅: No unintended changes outside spec layer
  - gates_pass ✅: All gate checks passed
  - stage ✅ 1×: New stage הוחזר הכסף recognized after נמסר

**Surfaces covered**: Entity (root screen detail), particle table (px1 screen), home screen (today section), hub (navigation), report (data display). All stage references in generated code updated from 5→6 stages, thresholds incremented by +1, array indices shifted, constants regenerated.

**No breaking changes**: All stage logic is dynamic (reads from appStore.stageOf, not hardcoded enum). Stage array expansion does not require contract changes. Backward compat implicit: stage indices persist in stored data; new stage label reads from updated constant.

