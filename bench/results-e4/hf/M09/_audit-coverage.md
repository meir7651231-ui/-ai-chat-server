# Auditor Coverage Report · M09 (tasks תזכורת entity)

## Findings

**Finding 1:**
`new/dart-gen-bs/gen_app_tasks_px1.dart:21` · EmptyState uses wrong label constant—displays 'ריק אין תזכורות' (with redundant shape prefix) instead of spec-required 'אין תזכורות' · P1 · Fix: change `gen_app_tasks_px1_c7` to `gen_app_tasks_px1_c8` on line 21

**Evidence:**
- Spec (tasks.txt:238): `חלקיק תזכורת: [ריק] אין תזכורות` — shape `[ריק]` governs atom type; text is `אין תזכורות`
- Generated px1.dart line 21: `EmptyState(label: gen_app_tasks_px1_c7)`
- px1_content.dart line 9: `const String gen_app_tasks_px1_c7 = 'ריק אין תזכורות';` (full name, includes shape)
- px1_content.dart line 10: `const String gen_app_tasks_px1_c8 = 'אין תזכורות';` (extracted text, correct)
- px1_content.dart c8 is never used in px1.dart, suggesting code path error

---

## Task Coverage Verified

✅ **Entity תזכורת (ent2) fully defined:**
- ent2.dart + ent2_content.dart: Title 'תזכורת', 3 fields, form UI with save/update logic

✅ **All three fields present and correctly typed:**
- Field 0 (משימה): DsSelect→app_tasks_ent1 link, required validation (line 46 ent2.dart)
- Field 1 (מועד): ForgeDsDateFieldInput, required validation (line 47 ent2.dart)
- Field 2 (נשלחה): ForgeDsField text, no validation (optional) ✓

✅ **Table screen (particle):**
- px1.dart line 20: ForgeDataGrid with 3 columns (משימה, מועד, נשלחה)
- Table data bound to `appStore.records('app_tasks_ent2')`

✅ **Empty-state particle:**
- px1.dart line 21: EmptyState rendered when list is empty
- Particle defined and wired (px1.dart lines 2-3 comment shows both particles: טבלה + ריק)

✅ **Cascade delete wired:**
- relations.dart line 6: `registerRelation('app_tasks_ent2', 'משימה'→'app_tasks_ent1', multi:false)`
- Matches spec: `מחיקה: משימה=מפל` (delete task → cascades to reminders)

✅ **Hub/navigation includes תזכורת:**
- hub.dart line 8: imports GenAppTasksEnt2Screen
- hub.dart line 26: DsNavTile for ent2 entity (title: 'תזכורת', subtitle: '3 שדות')
- hub.dart line 27: DsNavTile for px1 screen (title: 'תזכורת · חלקיקים')

✅ **No other apps broken:**
- Machine report byte_identical_others ✅
- Only gen_app_tasks_* files modified
- tasks.json: ent2 added, relations:true set ✓

✅ **Spec syntax correctly interpreted in derived artifacts:**
- tasks.txt entity line parsed with 3 fields + cascade rule
- particle-plan-tasks.json generated with both shapes: טבלה + ריק
- All required fields (משימה*, מועד*) validated; optional field (נשלחה) allowed empty

✅ **Dart compilation:**
- Machine report compiles ✅ (flutter analyze: 0 errors in app_tasks)

---

## Could Not Verify

- Runtime behavior: cascade delete actually fires when task is deleted (only type-checked, not tested)
- Display appearance of table/empty state in running app (code-only audit; Flutter not available)
- Exact user-facing text on EmptyState widget (blocked by finding #1 above)

**One actionable defect found; all other task surfaces verified present and correctly wired.**
