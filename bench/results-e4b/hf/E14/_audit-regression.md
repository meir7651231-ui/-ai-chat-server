# 🔴 Audit: Calendar Field Addition (E14)

## Task
Add to `machtzev/generator/specs-ds/calendar.txt` a closed-choice field `סוג` to entity `פגישה` with values עבודה, אישי, רפואי.

---

## Findings

**new/dart-data-bs/auto/gen_app_ent10_content.dart:1** · orphan generated file with no corresponding spec (no machtzev/generator/specs-ds/ent10.txt) · P0 · delete gen_app_ent10_content.dart through gen_app_ent28_content.dart

**new/dart-data-bs/auto/gen_app_audit_content.dart:1-5** · state leakage: audit app regenerated when only calendar should change (unrelated to task) · P1 · run only `node machtzev/generator/app-ds.mjs --name calendar` instead of full generator

**new/dart-data-bs/auto/gen_app_ent1_content.dart:1-28** · state leakage: ent1 (non-calendar entity) regenerated with 63 lines changed; specs/entity.txt not in scope of task · P1 · isolate calendar regeneration

**new/dart-data-bs/auto/gen_app_hub_content.dart:1-200** · state leakage: hub app content changed by 196 lines; unrelated apps (hub, entry, flags, settings, mission, quest1/2, shipping) all modified when only calendar needed regeneration · P1 · run calendar-only regen

**machtzev/generator/specs/entity.txt:1-28** · state leakage: entity.txt modified outside task scope (task scope = only calendar.txt) · P1 · verify entity.txt should not be re-generated from this change

**machtzev/generator/ship.mjs:1-139** · state leakage: ship.mjs heavily modified (139 lines deleted); task was field-add to calendar.txt, not refactoring the build script · P1 · confirm ship.mjs changes are intentional

---

## Coverage

✅ **Verified correct:** 
- calendar.txt line 6 correctly updated with `סוג{עבודה|אישי|רפואי}` field syntax
- machtzev/generator/apps/calendar.json lines 64-72 correctly show סוג field with enumVals: ["עבודה", "אישי", "רפואי"]
- calendar.txt is the ONLY spec file modified in machtzev/generator/specs-ds/ (confirmed: only calendar.txt changed, panuy.txt, peruk*.txt, sechirut.txt, tasks.txt unchanged)
- Field added to correct entity פגישה (slug: app_calendar_ent1)
- Field syntax uses closed-choice pattern (enumVals array populated)

⚠️ **Not checked (Flutter not installed):**
- Dart compilation of generated files
- Runtime behavior of סוג field dropdown in UI

⚠️ **Regression scope (full extent):**
- 24 generated data files changed outside calendar scope (gen_app_*.dart files for audit, ent1-6, flags, hub, sechirut, settings, business, capautodream, entry, improv, mission, quest1/2, shipping, showcase, team)
- 7+ orphan generated files created (gen_app_ent10_content.dart through gen_app_ent28_content.dart) with no corresponding specs
- 6 machtzev/ files modified outside calendar (LEARNINGS.md, atlas.json, atlas-data.json, particle-plan-*.json/*.md files for peruk03/04/05/sechirut, ship.mjs)

---

## Verdict

**Task portion: ✅ DONE** — Calendar field correctly added with valid syntax and parsed into calendar.json.

**Regressions: ❌ CRITICAL** — Full generator was run instead of calendar-only regen. 24 unrelated files changed; 7+ orphan files created with no backing specs. Per police report: `byte_identical_others ❌`, `no_orphans ❌`.

**Fix:** Delete orphan gen_app_ent10–ent28_content.dart files. Regenerate only calendar via scoped command to restore other apps to HEAD state.
