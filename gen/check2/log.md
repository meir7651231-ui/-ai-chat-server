# גבייה — יומן-בנייה

מדף: 1096 אטומים (569 פונקציות) · זמן: 10518ms · נבנה: 2026-09-14T23:39:22.356Z

## המשפט
```
גבייה: לכל צק יש משפחה, מספר, סכום, תאריך פירעון; שלבים: התקבל, הופקד, נפרע; אסור למחוק צק; תיקון ב-צק: גזבר עד 30 ימים; רק גזבר רואה צק
```

## ספק (נגזר מהמשפט)
```
אפליקציה: גבייה
ישות צק עם משפחה*, מספר[מזהה], סכום(0..1000000), תאריך פירעון[תאריך] | שלבים: התקבל, הופקד, נפרע | אסור: מחיקה | תיקון: גזבר עד 30 ימים
תפקיד גזבר: צק
לוח בקרה עם סכום(צק.סכום)
```

## הוכחות
- **norm-search** (נרמול טקסט לחיפוש (ניקוד, סופיות, גרשיים)) ⇐ צק.משפחה: נוסו 569 · הוכחו 1 · נבחר **norm-search** · נפלו: זריקה 356, פלט שונה 199, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **money** (מספר ⇒ תצוגת-שקלים עם מפרידי-אלפים) ⇐ צק.סכום: נוסו 569 · הוכחו 1 · נבחר **shekel** · נפלו: זריקה 396, פלט שונה 159, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 1 (f_money)
- **fmt-date** (תאריך-ISO ⇒ יום/חודש/שנה) ⇐ צק.תאריך פירעון: נוסו 569 · הוכחו 1 · נבחר **fmt-date** · נפלו: זריקה 360, פלט שונה 195, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **days-since** (ימים שעברו מתאריך עד היום (שלילי = עתיד)) ⇐ צק.תאריך פירעון: נוסו 569 · הוכחו 2 · נבחר **cockpit-days-since** · גם עברו: intel-day-diff · נפלו: זריקה 295, אורך-קריאה 158, פלט שונה 114 · Dart-בלבד: נוסו 394, עברו 0
- **sum** (סכום שדה-מספר על כל השורות) ⇐ סכום צק.סכום: נוסו 569 · הוכחו 1 · נבחר **grand-total** · נפלו: זריקה 276, אורך-קריאה 158, פלט שונה 134 · Dart-בלבד: נוסו 394, עברו 0

## אטומים שהוטבעו
- norm-search — מנרמל טקסט להשוואת-חיפוש עברית: אותיות-קטנות, הסרת ניקוד, אותיות · new/atoms/norm-search.mjs
- shekel — (ללא תפקיד בחוזה) · new/atoms/shekel.mjs
- fmt-date — תאריך-ISO ⇒ תצוגה ישראלית dd/mm/yyyy. ריק/שבור ⇒ "—". · new/atoms/fmt-date.mjs
- cockpit-days-since — ימים בין תאריך-ISO ליום-הייחוס (חיובי = בעבר, שלילי = עתיד). `Infinity` לתאריך ריק או לא-תקין. · new/atoms/cockpit-days-since.mjs
- grand-total — הסכום הכולל של כל הקופות — reduce מ-0 של סכום-כל-קופה דרך השקע. · new/atoms/grand-total.mjs

## מסלול-Flutter (אטומי-תצוגה)
- 12 קבצי-Dart ב-flutter/ · 30 אטומי-תצוגה: dart-data-bs/auto/gen_app_gencheck2_audit_content.dart, dart-data-bs/auto/gen_app_gencheck2_ent1_content.dart, dart-data-bs/auto/gen_app_gencheck2_flags_content.dart, dart-data-bs/auto/gen_app_gencheck2_hub_content.dart, dart-data-bs/auto/gen_app_gencheck2_main_content.dart, dart-data-bs/auto/gen_app_gencheck2_over1_content.dart, dart-data-bs/auto/gen_app_gencheck2_rec1_content.dart, dart-data-bs/auto/gen_app_gencheck2_root_content.dart, dart-data-bs/auto/gen_app_gencheck2_scr2_content.dart, dart-data-bs/auto/gen_app_gencheck2_settings_content.dart, dart-data-bs/auto/gen_app_gencheck2_shell_content.dart, dart-screens-bs/ai_hub_screen.g.dart, dart-ui-bs/auto/ai_bar.dart, dart-ui-bs/auto/callout.dart, dart-ui-bs/ds/ds.dart, dart-ui-bs/ds/ds_board.dart, dart-ui-bs/ds/ds_calendar.dart, dart-ui-bs/ds/ds_date_field.dart, dart-ui-bs/ds/ds_field.dart, dart-ui-bs/ds/ds_number_field.dart, dart-ui-bs/ds/ds_search.dart, dart-ui-bs/ds/ds_store.dart, dart-ui-bs/ds/ds_table.dart, dart-ui-bs/ds/ds_toggle_tile.dart, dart-ui-bs/premium/actions/segmented_switch.dart, dart-ui-bs/premium/dataviz/kpi_tile.dart, dart-ui-bs/premium/dataviz/neon_bars.dart, dart-ui-bs/premium/lists/glass_list_tile.dart, dart-ui-bs/premium/showcase/premium_stat.dart, dart-ui-bs/premium/surfaces/stat_hero.dart
- קומפילציה לאתר: --site (site.mjs; Flutter SDK + buildsmart)
