# Audit: peruk08.txt task coverage

## Findings

new/dart-data-bs/auto/gen_app_peruk08_px1_content.dart:125 · counter particle field reference includes entity name prefix when it should not — gen_app_peruk08_px1_c123='תיק האם כבר פנו למוכר' but records store field as 'האם כבר פנו למוכר' · P1 wrong result · change c123 to 'האם כבר פנו למוכר' (remove 'תיק ' prefix)

## Coverage

✅ **Verified correct:**
- Spec file peruk08.txt modified: field "האם כבר פנו למוכר" changed from free-text to enum with values {כן|לא|לא יודע} (line 6)
- apps/peruk08.json: field enumVals populated with ["כן", "לא", "לא יודע"]
- ent1_content.dart: enum values defined as c15='כן', c16='לא', c17='לא יודע'
- ent1.dart line 145: DsEnumField renders with correct options [c15, c16, c17]
- ent1.dart line 157: table includes field c14='האם כבר פנו למוכר' for display
- ent1.dart line 48: saved record stores field as key 'האם כבר פנו למוכר' (c14)
- particle-plan-peruk08.json: counter particle created with expr="מונה(תיק: האם כבר פנו למוכר=לא)", shape="count", wired=["KvLine"]
- px1.dart line 9: comment correctly shows "לא פנו = מונה(תיק: האם כבר פנו למוכר=לא)"
- px1_content.dart: counter label c121='לא פנו', counter value c124='לא'
- px1.dart line 35: counter renders with KvLine widget showing count (via .length.toDouble().toStringAsFixed(0))
- Compile: 0 analyzer errors reported in ./_police.md
- Other apps: byte_identical_others = ✅ (no unintended changes)

❌ **Cannot verify without runtime testing:**
- Whether the counter particle actually displays non-zero when cases exist with "לא" value (logic is broken by field key mismatch, so will always show 0)
- Whether form field validation/display of enum options works at runtime
- Whether enum field persists and retrieves the correct values from appStore
- Integration across all surfaces (entity screen form, case listing screen table, counter display)
