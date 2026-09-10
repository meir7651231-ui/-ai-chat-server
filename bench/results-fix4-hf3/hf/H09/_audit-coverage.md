new/dart-gen-bs/gen_app_tasks_ent1.dart:52 · computed field סכום מעוגל stored with incorrect format `.toStringAsFixed(2)` resulting in "123.00" instead of "123"; task specifies `round(סכום)` which produces whole numbers, not decimal strings · P1 wrong result · change line 52 from `(_m_round( (num.tryParse(_v[2] ?? '') ?? 0) )).toStringAsFixed(2)` to `(_m_round( (num.tryParse(_v[2] ?? '') ?? 0) )).toString()`

## Coverage

**Verified present and working:**
- Entity screen (ent1): form input for סכום, computed display via `_calc` widget (line 161), save to storage (line 52), load on edit (line 64)
- Entity list/records: field displayed in card (line 93), list view (line 179), and particle table (line 174)
- Hub/root screen: facts section with KvLine display (gen_app_tasks_root.dart line 28 with _fmtNum formatting)
- CSV export: field included in header and data rows (lines 99-101)
- Content constants: all three surfaces have correct label definitions (gen_app_tasks_ent1_c12, gen_app_tasks_home_c6, gen_app_tasks_root_c12-c13)
- Function wrapper: `_m_round(num x) => x.round()` defined (line 18)
- JSON schema: field added to tasks.json with type "num" and required: false
- Home screen: field registered in _nums list for money formatting context (gen_app_tasks_home.dart:21)

**Could not verify without runtime:**
- Actual round() computation correctness with edge cases (e.g., 123.5 should round to 124, not 123)
- Display formatting in production (toStringAsFixed(2) in _calc widget shows "123.00" to user, which may be acceptable for UI even if storage is wrong)
- Data migration or interaction with existing سكum values
