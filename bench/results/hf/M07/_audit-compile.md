# 🔍 Audit Report — M07 (sechirut) · Unsent Findings Counter

## Findings

new/dart-data-bs/auto/gen_app_sechirut_scr6_content.dart:2 · Dashboard title concatenated with particle label and description; should be 'לוח בקרה' alone · P1 wrong result · Delete "לא נשלחו תיקים שלא נשלחו" suffix from c0 value (gen_app_sechirut_scr6_c0 should = 'לוח בקרה' not 'לוח בקרה לא נשלחו תיקים שלא נשלחו')

new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart · Hub navigation label for dashboard incorrectly concatenates particle definition; gen_app_sechirut_hub_c19 should = 'לוח בקרה' (like hub_c16) not 'לוח בקרה לא נשלחו תיקים שלא נשלחו' · P1 wrong result · Match the correct value from scr5_content.dart:c0 or hub_content.dart:c16

## Verified Correct

✓ **Particle implementation (px3)**: Counter logic sound. Line 25 of gen_app_sechirut_px3.dart correctly filters findings by `(r[gen_app_sechirut_px3_c33] ?? '') == gen_app_sechirut_px3_c34` (where c33='נשלח', c34='לא'). Uses null-safe string comparison and safe `.length` → `.toDouble()` → `.toStringAsFixed(0)` chain. Label c31='לא נשלחו' correct.

✓ **Dashboard counter (scr5)**: Reference screen properly separates dashboard title (scr5_c0='לוח בקרה') from all counter metadata. All 6 dashboard counters present with correct field/value pairs (c30-c34 for "ממצא · לא נשלח" logic). Spec line 11 counters all present in scr5.

✓ **Spec compliance**: Spec line 22 particle defined correctly (לא נשלחו = מונה(נשלח=לא)). Spec line 12 label defined correctly ("תיקים שלא נשלחו" as description). Both implemented in px3_content.dart c31 and c36.

✓ **Null safety & type correctness**: All `.records()` calls guarded with `?? ''` or `?? 0`. `.length.toDouble()` avoids int/num comparison issues. No non-existent Dart methods (confirmed `String.isEmpty` / `.length` / `.toDouble()` / `.toStringAsFixed()` all valid). No nested-paren balance issues.

