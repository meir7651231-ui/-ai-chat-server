# 🔍 Audit Coverage: Calendar Table Sorting (H04)

## Findings

1. `new/dart-gen-bs/gen_app_calendar_ent1.dart:159` · Sorting implemented correctly for calendar table view by date (gen_app_calendar_ent1_c10 / מועד) then time (gen_app_calendar_ent1_c11 / שעה) using lexical compareTo; uses ForgeDataGrid not DsTable in generated code · **P0** · Task completed but check violation below blocks it

2. `machtzev/generator/render-ds.mjs:580-596` · Core engine modification causes collateral regeneration of all apps with table views (8 unrelated apps: peruk01-04, peruk19-21, sechirut) · Task required "Don't break anything" but modifying core engine violates isolation · **P0** · Sorting logic should be app-specific or scoped via spec parameter, not engine-wide

3. `machtzev/generator/render-ds.mjs:1-10` · Added `import fs0 from 'node:fs'` and `const SL = JSON.parse(fs0.readFileSync(...spec-lang.data.json))` but render-ds already loads spec-lang via entity.mjs schema parsing—adding file I/O here duplicates work and breaks read-only rendering engine contract · **P1** · Remove direct file I/O; pass SL through existing schema parameter

4. `./_police.md` · sort_both check returned ❌ sortlines=0; while sorting code IS present in gen_app_calendar_ent1.dart line 159, police check likely scans DsTable branch of render-ds template (not ForgeDataGrid); mismatch between intended render path and police pattern · **P1** · Clarify whether sort_both expected DsTable-specific code or whether check pattern needs update for Forge paths

## Task Coverage Verified

✓ **Calendar app table sorting:** Sorting by מועד (date) then שעה (time) is correctly implemented in generated code (line 159, using compareTo on field indices 10 and 11)

✓ **Sorting logic:** Dual-key sort (date first, time second) works correctly with lexical comparison; works if dates are ISO-8601 format

✓ **Entity identification:** Schema correctly identifies date field (type: 'date') and time field (label contains "שעה" from typeTime list)

✗ **Isolation/no-breaking constraint:** Violated—modifying render-ds.mjs regenerated 8 unrelated apps (peruk01-04, peruk19-21, sechirut) each with their own sorting applied

✗ **Police gate sort_both:** Returned 0 sortlines; code present but check may be looking for DsTable pattern not ForgeDataGrid pattern

## Coverage Summary

**Golden path implemented and works:** Calendar פגישה particle screen table now sorts by date then time, rendering correctly in ForgeDataGrid with lexical compareTo.

**Task constraint violated:** Core engine modification caused collateral changes outside calendar scope. Proper fix would scope sort logic to calendar-only via spec parameter or move sorting to a post-generation calendar-specific wrapper.

**Police coverage gap:** sort_both check finds 0 lines despite code being present—suggests check pattern scans render-ds.mjs template (looking for DsTable) not generated outputs, or needs update for Forge rendering paths.
