# 10-Step Decomposition: Sort Cases by Deadline

**Goal:** Cases in peruk21 app sort by "עד מתי" (soonest first) on both particle screen and entity list screen, nothing breaks.

## Steps

1. **Requirement + acceptance criteria**
   - Requirement: Sort cases by "עד מתי" field (deadline) in ascending order (soonest first)
   - Acceptance: Both display locations show cases in same sorted order; all tests pass; no R2/FND/WIR violations

2. **Identify data sources & dependencies**
   - Find where the generated `peruk21` app stores cases (likely Riverpod provider)
   - Locate particle screen code (table rendering)
   - Locate entity list screen code
   - Identify what data type is `Case` and what type/format is `עד מתי` field

3. **Check existing patterns**
   - Search codebase for any existing case sorting/filtering
   - Search for `sortBy`, `compareTo`, `sort` patterns in similar apps
   - Check if date parsing/comparison already exists

4. **Design helper function**
   - Signature: `List<CaseModel> sortCasesByDeadline(List<CaseModel> cases)`
   - Parse "עד מתי" as date (yyyy-MM-dd or similar)
   - Sort by parsed date ascending
   - Return sorted list
   - Handle edge cases: null deadlines, invalid dates

5. **Write tests first (red)**
   - Create unit test in `test/` for sorting helper
   - Test cases: empty list, single case, multiple cases sorted, multiple cases unsorted, null/invalid deadlines
   - Tests should fail initially (red)

6. **Implement helper (green)**
   - Write `sortCasesByDeadline` in `lib/logic/case_helper.dart` or similar
   - Make tests pass (green)

7. **flutter analyze → 0 errors**
   - Run analyzer, fix any issues
   - Verify clean output

8. **Wire UI — inject sorting in two places**
   - Find particle screen list builder → apply sort before rendering
   - Find entity list screen builder → apply sort before rendering
   - Update WIRING.md with sort injection points
   - Minimal changes: only add sort call, don't refactor UI structure

9. **Scoped tests + full suite**
   - Run sorting helper tests
   - Run full test suite (should have baseline of known-failing)
   - Verify no new failures

10. **Commit**
    - Version bump in `home_shell.dart` (note: "sort cases by deadline")
    - Local commit with detailed message
    - NO PUSH (per PUSH POLICY)

## Key Constraints
- No R2 violations (no new screens/dialogs)
- FND-01: flutter analyze must pass
- FND-07/08: helper is pure, tested
- WIR-04: update WIRING.md
- OPS-01/02/03: build/test/analyze clean
- Byte-verify: no hand edits outside the sorting logic

## Progress Tracking
- [x] Read spec + generated code
- [x] Identify data sources and display locations (ent1 line 152, px1 line 31)
- [x] Discover sorting is spec-level in entity.mjs and particles.mjs
- [x] Update peruk21.txt entity definition with sort clause
- [x] Update peruk21.txt particle definition with sort clause
- [x] Regenerate with correct argument order (-f before --name)
- [x] Verify sort logic injected (ent1 line 153, px1 line 31)
- [x] Pass all checks (FND/FRM/WIR/VRB/OPS)
- [x] Police-bench shows DONE
- [x] Document in _insp.md and LEARNINGS.md
- [x] Create claims.json
