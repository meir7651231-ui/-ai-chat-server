# Audit Coverage: Task E08 Dashboard Counter

## Findings

**new/dart-data-bs/auto/gen_app_sechirut_scr5_content.dart:31–32** · Dashboard shows counter label 'כן' instead of 'עם מתווך' · P1 wrong result · Relabel c29 to 'עם מתווך' (or regenerate with correct particle binding)

## Coverage Verified

**✓ Spec-layer changes (input):**
- sechirut.txt line 11: Counter `מונה(תיק: מתווך=כן)` added to לוח בקרה dashboard entity definition
- sechirut.txt line 22: Particle `חלקיק תיק: עם מתווך = מונה(תיק: מתווך=כן)` added to תיק entity particles

**✓ Intermediate generation (particle planning):**
- particle-plan-sechirut.json: Particle entry with name='עם מתווך', expr='מונה(תיק: מתווך=כן)', shape='count', rendered as KvLine
- particle-plan-sechirut.md: Particle row documenting shape as count/headline/KvLine

**✓ Content generation (px1 screen):**
- gen_app_sechirut_px1_content.dart line 8: Label constant c6='עם מתווך' correctly generated
- gen_app_sechirut_px1_content.dart line 11: Counter expression c11='מונה(תיק: מתווך=כן)' stored
- gen_app_sechirut_px1.dart line 35: KvLine widget renders with correct label=c6

**✗ Dashboard display (scr5 screen) — DEFECTIVE:**
- gen_app_sechirut_scr5_content.dart line 31: Dashboard counter label c29='כן' (should be 'עם מתווך')
- gen_app_sechirut_scr5.dart line 25: Dashboard KvLine references c29 for label, pulls wrong text
- gen_app_sechirut_scr5_content.dart line 39: Subtitle correctly reports '7 מדדים' (7 metrics), confirming counter present but labeled incorrectly
- gen_app_sechirut_hub_content.dart line 17: Hub navigation tile references dashboard as '7 מדדים' (count updated correctly)

**✗ Task coverage gap:**
The counter WAS added to the dashboard and IS rendered on scr5 screen, but the human-facing label is wrong. The task named the counter 'עם מתווך' (with broker) to distinguish cases where a broker was involved. The dashboard instead shows the value 'כן' (yes), which is cryptic without field context. End-user cannot identify what this metric counts without reading code.

**Note:** Police report flags `hub_label` and `hub_where` as failed (0×), likely checking for:
- hub_label: Label constant should reference particle name, not enum value (c29 should pull 'עם מתווך')
- hub_where: Dashboard should display counter in hub summary or the label should be semantic (not 'כן')
