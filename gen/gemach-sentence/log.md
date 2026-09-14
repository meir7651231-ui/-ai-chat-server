# גמ"ח הלוואות — יומן-בנייה

מדף: 1096 אטומים (569 פונקציות) · זמן: 14368ms · נבנה: 2026-09-14T23:26:34.858Z

## המשפט
```
גמ"ח הלוואות: לכל לווה יש שם, נייד, סכום, תאריך הלוואה וסטטוס (פעיל/נפרע/באיחור); לכל החזר יש לווה, סכום ותאריך
```

## ספק (נגזר מהמשפט)
```
אפליקציה: גמ"ח הלוואות
ישות לווה עם שם*, נייד[טלפון], סכום(0..1000000), תאריך הלוואה[תאריך], סטטוס{פעיל|נפרע|באיחור}
ישות החזר עם לווה*, סכום(0..1000000), תאריך[תאריך]
לוח בקרה עם סכום(לווה.סכום), מונה(לווה.סטטוס), סכום(החזר.סכום)
```

## הוכחות
- **norm-search** (נרמול טקסט לחיפוש (ניקוד, סופיות, גרשיים)) ⇐ לווה.שם, החזר.לווה: נוסו 569 · הוכחו 1 · נבחר **norm-search** · נפלו: זריקה 356, פלט שונה 199, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **phone-format** (טלפון ⇒ תצוגה ישראלית עם מקף) ⇐ לווה.נייד: נוסו 569 · הוכחו 1 · נבחר **format-israeli-phone** · נפלו: זריקה 355, פלט שונה 200, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **money** (מספר ⇒ תצוגת-שקלים עם מפרידי-אלפים) ⇐ לווה.סכום, החזר.סכום: נוסו 569 · הוכחו 1 · נבחר **shekel** · נפלו: זריקה 396, פלט שונה 159, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 1 (f_money)
- **fmt-date** (תאריך-ISO ⇒ יום/חודש/שנה) ⇐ לווה.תאריך הלוואה, החזר.תאריך: נוסו 569 · הוכחו 1 · נבחר **fmt-date** · נפלו: זריקה 360, פלט שונה 195, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **days-since** (ימים שעברו מתאריך עד היום (שלילי = עתיד)) ⇐ לווה.תאריך הלוואה, החזר.תאריך: נוסו 569 · הוכחו 2 · נבחר **cockpit-days-since** · גם עברו: intel-day-diff · נפלו: זריקה 295, אורך-קריאה 158, פלט שונה 114 · Dart-בלבד: נוסו 394, עברו 0
- **sum** (סכום שדה-מספר על כל השורות) ⇐ סכום לווה.סכום, סכום החזר.סכום: נוסו 569 · הוכחו 1 · נבחר **grand-total** · נפלו: זריקה 276, אורך-קריאה 158, פלט שונה 134 · Dart-בלבד: נוסו 394, עברו 0
- **count-by** (ספירה לפי ערך, מהגדול לקטן) ⇐ מונה לווה.סטטוס: נוסו 569 · הוכחו 1 · נבחר **count-by** · נפלו: זריקה 274, אורך-קריאה 158, פלט שונה 136 · Dart-בלבד: נוסו 394, עברו 0

## אטומים שהוטבעו
- norm-search — מנרמל טקסט להשוואת-חיפוש עברית: אותיות-קטנות, הסרת ניקוד, אותיות · new/atoms/norm-search.mjs
- format-israeli-phone — (ללא תפקיד בחוזה) · new/atoms/format-israeli-phone.mjs
- shekel — (ללא תפקיד בחוזה) · new/atoms/shekel.mjs
- fmt-date — תאריך-ISO ⇒ תצוגה ישראלית dd/mm/yyyy. ריק/שבור ⇒ "—". · new/atoms/fmt-date.mjs
- cockpit-days-since — ימים בין תאריך-ISO ליום-הייחוס (חיובי = בעבר, שלילי = עתיד). `Infinity` לתאריך ריק או לא-תקין. · new/atoms/cockpit-days-since.mjs
- grand-total — הסכום הכולל של כל הקופות — reduce מ-0 של סכום-כל-קופה דרך השקע. · new/atoms/grand-total.mjs
- count-by — ספירה לפי מפתח — עובר על פריטים, מחלץ מפתח-מחרוזת מכל פריט דרך · new/atoms/count-by.mjs

## מסלול-Flutter (אטומי-תצוגה)
- 16 קבצי-Dart ב-flutter/ · 39 אטומי-תצוגה: dart-data-bs/auto/gen_app_gengemachsentence_audit_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_ent1_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_ent2_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_flags_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_hub_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_main_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_over1_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_over2_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_rec1_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_rec2_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_root_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_scr3_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_settings_content.dart, dart-data-bs/auto/gen_app_gengemachsentence_shell_content.dart, dart-screens-bs/ai_hub_screen.g.dart, dart-screens-bs/courier_certs_screen.g.dart, dart-ui-bs/auto/ai_primary.dart, dart-ui-bs/auto/big_button.dart, dart-ui-bs/auto/callout.dart, dart-ui-bs/auto/store_summary_line.dart, dart-ui-bs/ds/ds.dart, dart-ui-bs/ds/ds_bars.dart, dart-ui-bs/ds/ds_calendar.dart, dart-ui-bs/ds/ds_date_field.dart, dart-ui-bs/ds/ds_enum_field.dart, dart-ui-bs/ds/ds_field.dart, dart-ui-bs/ds/ds_number_field.dart, dart-ui-bs/ds/ds_search.dart, dart-ui-bs/ds/ds_select.dart, dart-ui-bs/ds/ds_store.dart, dart-ui-bs/ds/ds_table.dart, dart-ui-bs/ds/ds_toggle_tile.dart, dart-ui-bs/premium/actions/segmented_switch.dart, dart-ui-bs/premium/dataviz/kpi_tile.dart, dart-ui-bs/premium/dataviz/neon_bars.dart, dart-ui-bs/premium/lists/expandable_tile.dart, dart-ui-bs/premium/lists/glass_list_tile.dart, dart-ui-bs/premium/showcase/premium_stat.dart, dart-ui-bs/premium/surfaces/stat_hero.dart
- קומפילציה לאתר: --site (site.mjs; Flutter SDK + buildsmart)
