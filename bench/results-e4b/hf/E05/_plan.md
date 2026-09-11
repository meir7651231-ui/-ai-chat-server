# Task: Add משתתפים field to פגישה + empty-state text

## Goal (1 line)
Add a participants field משתתפים to the meeting entity פגישה in calendar.txt and display "אין פגישות השבוע" when the meetings screen has no meetings.

## 10-Step Decomposition

1. **Search for existing references** — run `node machtzev/search-record.mjs "משתתפים participants"` to check if the word is already used elsewhere
2. **Understand current spec structure** — review calendar.txt and understand how fields are defined in specs-ds language
3. **Add participants field to spec** — edit calendar.txt to add משתתפים as a new field in the פגישה entity; determine field type (likely רב-שורתי or text for a list of names)
4. **Add empty-state text to spec** — determine where empty-state message should be defined in the spec (likely as a particle with [ריק] directive)
5. **Regenerate app** — run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin` to generate the Dart code
6. **Verify Dart compilation** — ensure generated Dart passes `flutter analyze` with 0 errors
7. **Byte-verify other files** — confirm that no other apps' generated files were modified (only calendar app affected)
8. **Run police checks** — execute police-bench.mjs to verify all gates pass
9. **Document in claims.json** — record which checks passed and which failed
10. **Write INSP audit** — review through FND/FRM/WIR/VRB/OPS lenses and write VERDICT

## Key Questions (from §ג.1 of MASTER_PROTOCOL)

- **שם הפיצ׳ר:** Add participants field to meeting + empty-state message
- **מקור:** Task request (no proto reference; internal spec enhancement)
- **Helper נדרש:** No new helper—purely spec language change
- **חסום (⛔):** None known
