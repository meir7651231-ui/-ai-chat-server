# 🔴 Audit Report — M09 (tasks) — Empty State Label Defect

## Findings

`new/dart-gen-bs/gen_app_tasks_px1.dart:21` · EmptyState label uses wrong constant ('ריק אין תזכורות' instead of 'אין תזכורות') · P1 wrong-result · Change `gen_app_tasks_px1_c7` to `gen_app_tasks_px1_c8`: `EmptyState(label: gen_app_tasks_px1_c8)`

## Verification

**Defect confirmed:**
- Spec: `חלקיק תזכורת: [ריק] אין תזכורות` — particle shape=[ריק] empty, text='אין תזכורות'
- Content: c7='ריק אין תזכורות' (full DSL expression, including shape marker), c8='אין תזכורות' (display text only)
- Generated code (px1.dart:21): `EmptyState(label: gen_app_tasks_px1_c7)` 
- Issue: Displays "ריק אין תזכורות" as label, should display "אין תזכורות"
- Root cause: Generator produced both constants but wired wrong one to the widget

**Code safety checked:**
- All field accesses use null coalesce (e.g., `_v[0] ?? ''`, `r[field] ?? ''`) — null-safe ✓
- Date field inputs: `DsDateField(value: _v[1] ?? '', ...)` — null-safe ✓  
- Link field display: `appStore.displayOf('app_tasks_ent1', r[...] ?? '')` — null-safe ✓
- Cascade delete: relation registered (app_tasks_ent2→app_tasks_ent1), `removeById` called with proper ID ✓
- No Dart syntax errors detected in wiring or widget construction

**Particle plan verified:**
- Both particles defined in particle-plan-tasks.json and wired correctly (DsTable, EmptyState@premium/feedback)
- Both constants generated in px1_content.dart (c7 full expr, c8 text)
- **Task incomplete:** empty-state message wired to wrong constant in px1.dart

## Coverage

✓ Checked: null-safety on all field accesses (Maps, entity links, date/enum values)
✓ Checked: cascade delete relation registration  
✓ Checked: constants generated and correctly exported to content files
✓ Checked: px1 particle wiring (table + empty state)
✓ Checked: ent2 entity screen structure (form, list, calendar, table views)
✗ Could not check: Flutter compilation (Dart compiler not available), runtime behavior of AppStore methods, whether EmptyState@premium/feedback widget exists
