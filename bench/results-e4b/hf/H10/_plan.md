# 10-Step Decomposition — Calendar Sort by Time

**Goal:** Add time-based sorting to meetings in calendar app (both entity list and particle table)

## 1. Verify current state
- [ ] Read calendar.txt fully
- [ ] Check for any existing sort directives
- [ ] Identify exactly where שעה field appears

## 2. Search for existing sort patterns
- [ ] Run search-record.mjs for "מיון שעה" (sort time) in other app specs
- [ ] Look for other apps using time-based sorting as reference

## 3. Understand particle usage in calendar
- [ ] Check if there's a particle definition for meetings
- [ ] Determine what table/list shows meetings on detail screen
- [ ] Verify all surfaces where meetings appear

## 4. Modify spec syntax for entity list
- [ ] Add `| מיון: שעה עולה` to ישות line (main meeting list)
- [ ] Preserve all other field specifications
- [ ] Validate syntax against SPEC-LANG.md

## 5. Add particle table sorting
- [ ] Locate particle definition for meetings (if exists)
- [ ] Add `| מיון: שעה עולה` to table specification
- [ ] Verify table columns remain correct

## 6. Regenerate app from spec
- [ ] Run: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
- [ ] Verify no orphan files created
- [ ] Check for generation errors

## 7. Verify byte-identity of other apps
- [ ] Run machine check to confirm other apps unchanged
- [ ] Verify only calendar app files modified
- [ ] No cross-contamination in generated code

## 8. Test generated output
- [ ] `flutter analyze` on generated Dart — must be 0 errors
- [ ] Check generated code includes sort logic
- [ ] Verify meeting order in generated test data (if present)

## 9. Audit changes
- [ ] Write _insp.md checklist: task-coverage, edge cases
- [ ] Check for navigation/state-leakage issues
- [ ] Verify no new Hebrew strings introduced

## 10. Machine report
- [ ] Run police-bench.mjs final report
- [ ] Confirm DONE and all checks pass
- [ ] Document any lessons in LEARNINGS.md
