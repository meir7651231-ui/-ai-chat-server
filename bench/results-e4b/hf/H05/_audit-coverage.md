# Auditor Report: peruk02 Sorting Task

## Task Requirement
Make the cases table sorted by תאריך מסירת מפתח (key handover date), earliest first. Don't break anything.

## Coverage Analysis

### Surface 1: Particle Table (px1)
**File**: `new/dart-gen-bs/gen_app_peruk02_px1.dart`  
**Status**: ✅ CORRECT

- **Line 27**: Table sorts by `gen_app_peruk02_px1_c13` (תאריך מסירת מפתח)
- **Sort logic**: `appStore.records('app_peruk02_ent1').toList()..sort((a, b) { final x = a[gen_app_peruk02_px1_c13] ?? '', y = b[gen_app_peruk02_px1_c13] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; })`
- **Correctness**: ISO date format (YYYY-MM-DD) sorts correctly lexicographically; empty values sort last
- **Direction**: Ascending (earliest first) ✓

### Surface 2: Entity List Screen Table View (ent1)
**File**: `new/dart-gen-bs/gen_app_peruk02_ent1.dart`  
**Status**: ⚠️ MISSING SORT (optional view, not primary)

- **Line 179**: Table view (_view == 3) renders without sort: `ForgeDataGrid(..., items: rs.map((r) => [...]).toList())`
- **Issue**: `rs` (filtered records) passed directly to table without sorting by date
- **Should be**: `(rs.toList()..sort((a, b) { ... compare by gen_app_peruk02_ent1_c13 ... })).map(...)`
- **Impact**: Users selecting the table tab in ent1 see unsorted list; particle table in px1 is sorted correctly
- **Severity**: P1 (wrong result when user selects table view in entity screen, but primary particle table is correct)

### Surface 3: Hub
**File**: `new/dart-gen-bs/gen_app_peruk02_hub.dart`  
**Status**: ✅ NO TABLE (no sorting needed)

### Surface 4: Report (rp1)
**File**: `new/dart-gen-bs/gen_app_peruk02_rp1.dart`  
**Status**: ✅ NO TABLE (no sorting needed)

## Specification Compliance
- **peruk02.txt** (line 10): ✅ Updated with sort directive: `[טבלה] | מיון: תאריך מסירת מפתח עולה`
- **particle-plan-peruk02.json**: ✅ Updated with sort name in particle list
- **particle-plan-peruk02.md**: ✅ Updated particle name reflects sort directive

## Machine Report Verification
- Police gate `sort ✅ px1`: Confirmed particle table (px1) has correct sort implementation
- Compilation: ✅ No analyzer errors, all gates pass
- The machine validated px1 only, did not check ent1's optional table view

## Findings

### Finding 1
**File:Line**: `new/dart-gen-bs/gen_app_peruk02_ent1.dart:179`  
**Defect**: Entity screen's optional table view (view 3) renders unsorted; when user toggles to table tab they see cases in original order, not sorted by תאריך מסירת מפתח  
**Severity**: P1 (wrong result — task requirement is unsorted when used via ent1 table tab)  
**Fix**: Sort `rs` before mapping: `items: (rs.toList()..sort((a, b) { final x = a[gen_app_peruk02_ent1_c13] ?? '', y = b[gen_app_peruk02_ent1_c13] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; })).map((r) => [r[gen_app_peruk02_ent1_c9] ?? '', ...]).toList()`

## Coverage Confirmed

**Checked and found sound**:
- ✅ Particle table (px1): Sorts by date field in ascending order with correct ISO date comparison logic
- ✅ Spec file updated with sort directive correctly
- ✅ Particle plan and docs updated
- ✅ No compilation errors
- ✅ Empty values handled correctly (sorted last)
- ✅ sort gate passed (machine verified px1)

**Could not check** (read-only audit, Flutter/Dart not installed):
- Runtime sorting behavior with actual dates (requires app execution)
- Whether dates are always stored in ISO format (assumed from codebase patterns)
- User interaction with ent1 table view on actual device

**Coverage gap identified**:
- Entity screen optional table view (ent1, view 3) lacks sort despite px1 particle having it; affects task coverage if "entity list screen" includes the table view option

