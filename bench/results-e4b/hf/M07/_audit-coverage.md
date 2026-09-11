# Audit: sechirut.txt · Dashboard & Particle Counter

## Findings

**new/dart-gen-bs/gen_app_sechirut_hub.dart:21-46 · P1 dashboard counter not rendered · MISSING** — The hub screen has no rendering of the 7 dashboard counters specified in sechirut.txt line 11 (מונה(ממצא: נשלח=לא) and 6 others). The generated hub.dart contains only navigation tiles (_tiles method), no KvLine widgets displaying `appStore.records('app_sechirut_ent3').where(...nשלח==לא...)`. Fix: inject counter grid into hub.dart build output before navigation tiles, or render dashboard in a dedicated screen and add hub link.

## Coverage

**Verified correct:**
- Specification updated: sechirut.txt line 11 correctly adds dashboard counter `מונה(ממצא: נשלח=לא)` alongside 6 other metrics (7 total)
- Specification updated: sechirut.txt line 25 correctly adds findings particle `לא נשלחו = מונה(נשלח=לא)`
- Particle gallery rendered: gen_app_sechirut_px3.dart line 26 correctly renders counter with label "לא נשלחו" (gen_app_sechirut_px3_c34) and logic filtering app_sechirut_ent3 records where נשלח='לא', displaying count as KvLine
- Content constants generated: gen_app_sechirut_px3_content.dart line 34-39 correctly defines counter label and filter conditions
- Hub labels reflect updated count: hub_content.dart line 19 correctly labels dashboard as "7 מדדים" and line 29-31 correctly labels findings particles as "7 חלקיקים חיים"
- No compilation errors: analyzer passes, dart-gen-bs files compile cleanly
- Particle plan updated: particle-plan-sechirut.json includes new particle with entity=ממצא, expr=מונה(נשלח=לא), shape=count, picks=[KpiTile], wired=[KvLine]

**Could not check:** Whether dashboard counters should render on home screen vs. separate dashboard screen vs. embedded in hub (spec is ambiguous on rendering location; the "לוח בקרה" entity exists but no dedicated DashboardScreen generated). Police report hub_label:❌ suggests machine expected hub to display counters.

