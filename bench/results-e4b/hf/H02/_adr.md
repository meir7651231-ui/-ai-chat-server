# ADR — מיון תיקים לפי שכירות

## Context
The sechirut app displays rental cases (תיק) in a particle table. Currently the table has no sort order specified, so items appear in default (insertion) order. The requirement is to sort by rent (שכירות) descending (highest first).

## Decision
Add `| מיון: שכירות יורד` to the particle definition in sechirut.txt at line 22.

This leverages the built-in particle sort feature (§17 in SPEC-LANG.md) which:
- Supports sorting by one or more fields
- Recognizes `יורד` (descending) as a keyword from spec-lang.data.json
- Generates Dart code that sorts numerically when the field is numeric

## Rationale
1. **Spec language covers this**: No need to touch engine code; the sort feature is already in the parser (sort-cmp.mjs, parseSortKeys)
2. **Field is numeric**: שכירות is typed as "price" in the entity definition (line 7), so the generated Dart will numeric-sort properly
3. **Minimal change**: One line edit, zero impact on other apps (byte_identical_others ✅)
4. **Machine-verified**: All gates pass, compilation succeeds

## Alternatives rejected
- Touch the engine to add hardcoded sort: Would risk breaking other apps or the machine checks
- Add column selection with sort: Not needed; default table includes all fields anyway

## Consequences
- Cases table now displays highest rent first
- No breaking changes to the app logic or data structure
- Positive UX: users see most expensive cases at a glance

## Verification
- Machine report shows sort ✅ and desc ✅
- Dart compile produces 0 errors
- No hand edits detected (byte_identical_others ✅)
