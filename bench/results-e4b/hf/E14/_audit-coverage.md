# Audit: calendar.txt סוג field addition (task E14)

## Findings

machtzev/generator/specs/entity.txt · replaced entire file content with פגישה entity spec (was ליד entity) · P0 compile-break · revert to HEAD version
machtzev/generator/specs/entry.txt · added 30+ navigation entries for app_ent10–29, app_audit, app_hub, app_flags, app_settings (only calendar touched expected) · P0 task not done · revert unrelated changes
new/dart-data-bs/auto/gen_app_ent10_content.dart through gen_app_ent16_content.dart · orphan files: no specs-ds/ spec corresponding to calendar app references these entities (app_calendar has only פגישה entity) · P0 task not done · delete orphans, regenerate calendar only

---

## What was verified correct

**calendar.txt spec line 6:** ✅ Valid closed-choice syntax `סוג{עבודה|אישי|רפואי}` added correctly to פגישה entity (changed from 5 to 6 fields).

**Generated calendar entity file:** ✅ gen_app_calendar_ent1.dart (lines 32, 52, 62–65, 91, 99–101, 149): סוג field wired as DsEnumField with const options [עבודה, אישי, רפואי]. Stored as _v[5] in form state. Persisted to appStore as gen_app_calendar_ent1_c14 key.

**Field in all surfaces:**
  - Content file gen_app_calendar_ent1_content.dart: c14="סוג", c15="עבודה", c16="אישי", c17="רפואי" ✅
  - Home/list screen (gen_app_calendar_home_content.dart): no display references (expected; only ent1 shows these strings) ✅
  - CSV export line 99–101: column included ✅
  - Card display line 91: field in labels and values arrays ✅
  - Kanban board line 159: no enum-specific logic needed (uses kT title extraction) ✅
  - Calendar grid line 160: no enum-specific logic needed ✅
  - Data grid line 161: column included ✅

**Police report machine checks:** regen_ok ✅, gates_pass ✅, compiles ✅.

---

## Coverage
- ✅ spec file syntax valid
- ✅ all generated calendar screens include field (home, hub, root, audit, shell, settings)
- ✅ all UI surfaces display correctly (form, card, table, grid, kanban, calendar)
- ✅ enum options properly rendered as closed-choice picker (DsEnumField)
- ❌ **collateral file corruption:** unrelated specs/entity.txt and specs/entry.txt were modified; orphan generated files remain
- ❌ **not ready to merge:** byte_identical_others and no_orphans checks fail
