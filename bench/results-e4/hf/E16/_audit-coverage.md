# Audit Coverage — peruk08 stage addition

## Findings
No findings.

## Coverage verification

**Task:** Add stage הוחזר הכסף (money refunded) to entity תיק after נמסר

**Surfaces checked:**
1. **Spec layer** ✅ — machtzev/generator/specs-ds/peruk08.txt line 6: stages list correctly updated to include "הוחזר הכסף" after "נמסר" and before "סגור"

2. **Entity definition** ✅ — new/dart-gen-bs/gen_app_peruk08_ent1.dart: stages array includes all 6 stages in correct order (c22–c27: התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור)

3. **Entity content constants** ✅ — new/dart-data-bs/auto/gen_app_peruk08_ent1_content.dart: constants c22–c27 correctly define all 6 stages with הוחזר הכסף at c26 between נמסר (c25) and סגור (c27); entity description correctly shows "7 שדות · 6 שלבים"

4. **Entity list screen (home)** ✅ — new/dart-gen-bs/gen_app_peruk08_home.dart line 48: open() function correctly filters with `< 5` to exclude סגור at stage 5; stageDone check correctly uses `>= 5` for closed state

5. **Particle table (px1)** ✅ — new/dart-gen-bs/gen_app_peruk08_px1.dart: table displays entity records (which inherit all stage metadata from entity definition); no stage-specific logic needed in particle

6. **Hub screen** ✅ — new/dart-gen-bs/gen_app_peruk08_hub.dart: provides navigation; stage lifecycle is entity-specific, not hub-specific

7. **Report screen (rp1)** ✅ — new/dart-gen-bs/gen_app_peruk08_rp1.dart: report can be generated for records in any stage (no stage filtering); stages are entity metadata, report is content-oriented

**Machine report verification:** _police.md confirms regen_ok ✅, byte_identical_others ✅, stage ✅ 1× (one new stage detected), compiles ✅

**Conclusion:** Task is complete and correct. No surfaces missed; stage integrated into all required layers (spec → content → entity definition → UI surfaces). No breaking changes detected.
