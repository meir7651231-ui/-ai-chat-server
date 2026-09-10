# Audit: Task Coverage — Sechirut Unsent Findings Counter

## Findings

new/dart-gen-bs/gen_app_sechirut_scr5.dart:24 · dashboard counter uses short label "לא" (c17) instead of qualified label "ממצא · לא" (c18) when rendering KvLine for unsent findings · P1 wrong label display · change KvLine(label: gen_app_sechirut_scr5_c17, ...) to use gen_app_sechirut_scr5_c18 instead

## Verified Correct

✅ **Particle counter on findings screen (px3)**: new/dart-gen-bs/gen_app_sechirut_px3.dart:24 correctly renders the "לא נשלחו" counter particle using label gen_app_sechirut_px3_c34='לא נשלחו' with proper KvLine widget displaying count of records where נשלח=לא. Content file (px3_content.dart:36) has correct label.

✅ **Dashboard counter rendering logic**: The counter IS present in scr5.dart:24 and correctly filters records('app_sechirut_ent3').where((r) => (r[gen_app_sechirut_scr5_c21] == gen_app_sechirut_scr5_c22) where c21='נשלח' and c22='לא', so the DATA logic is sound.

✅ **Content data constants**: scr5_content.dart has c17='לא', c18='ממצא · לא', c21='נשלח', c22='לא' all correctly defined. The generator correctly produced the content file with both short and qualified labels.

❌ **Label selection bug**: The render-ds generator selected c17 (short label) instead of c18 (qualified label) when choosing which constant to use for this 4th counter where the value "לא" appears in multiple counters (both unsent findings and unpaid payments). This creates label ambiguity: users see "לא" instead of the identifying prefix "ממצא ·". Documented in machtzev/LEARNINGS.md line 4-8 as L2026-09-10-render-m07-counter.

✅ **Task completion status**: One of two requirements done (particle counter ✅), one partial (dashboard counter exists but has display bug ❌).
