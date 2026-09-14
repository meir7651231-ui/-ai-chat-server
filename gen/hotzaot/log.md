# הוצאות — יומן-בנייה

מדף: 1096 אטומים (569 פונקציות) · זמן: 9858ms · נבנה: 2026-09-14T20:04:40.697Z

## המשפט
```
מעקב הוצאות: לכל הוצאה יש תיאור, סכום, תאריך וקטגוריה (אוכל, רכב, בית, אחר)
```

## ספק (נגזר מהמשפט)
```
אפליקציה: הוצאות
ישות הוצאה עם תיאור*, סכום(0..1000000), תאריך[תאריך], קטגוריה{אוכל|רכב|בית|אחר}
לוח בקרה עם סכום(הוצאה.סכום), מונה(הוצאה.קטגוריה)
```

## הוכחות
- **norm-search** (נרמול טקסט לחיפוש (ניקוד, סופיות, גרשיים)) ⇐ הוצאה.תיאור: נוסו 569 · הוכחו 1 · נבחר **norm-search** · נפלו: זריקה 356, פלט שונה 199, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **money** (מספר ⇒ תצוגת-שקלים עם מפרידי-אלפים) ⇐ הוצאה.סכום: נוסו 569 · הוכחו 1 · נבחר **shekel** · נפלו: זריקה 396, פלט שונה 159, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 1 (f_money)
- **fmt-date** (תאריך-ISO ⇒ יום/חודש/שנה) ⇐ הוצאה.תאריך: נוסו 569 · הוכחו 1 · נבחר **fmt-date** · נפלו: זריקה 360, פלט שונה 195, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **days-since** (ימים שעברו מתאריך עד היום (שלילי = עתיד)) ⇐ הוצאה.תאריך: נוסו 569 · הוכחו 2 · נבחר **cockpit-days-since** · גם עברו: intel-day-diff · נפלו: זריקה 295, אורך-קריאה 158, פלט שונה 114 · Dart-בלבד: נוסו 394, עברו 0
- **sum** (סכום שדה-מספר על כל השורות) ⇐ סכום הוצאה.סכום: נוסו 569 · הוכחו 1 · נבחר **grand-total** · נפלו: זריקה 276, אורך-קריאה 158, פלט שונה 134 · Dart-בלבד: נוסו 394, עברו 0
- **count-by** (ספירה לפי ערך, מהגדול לקטן) ⇐ מונה הוצאה.קטגוריה: נוסו 569 · הוכחו 1 · נבחר **count-by** · נפלו: זריקה 274, אורך-קריאה 158, פלט שונה 136 · Dart-בלבד: נוסו 394, עברו 0

## אטומים שהוטבעו
- norm-search — מנרמל טקסט להשוואת-חיפוש עברית: אותיות-קטנות, הסרת ניקוד, אותיות · new/atoms/norm-search.mjs
- shekel — (ללא תפקיד בחוזה) · new/atoms/shekel.mjs
- fmt-date — תאריך-ISO ⇒ תצוגה ישראלית dd/mm/yyyy. ריק/שבור ⇒ "—". · new/atoms/fmt-date.mjs
- cockpit-days-since — ימים בין תאריך-ISO ליום-הייחוס (חיובי = בעבר, שלילי = עתיד). `Infinity` לתאריך ריק או לא-תקין. · new/atoms/cockpit-days-since.mjs
- grand-total — הסכום הכולל של כל הקופות — reduce מ-0 של סכום-כל-קופה דרך השקע. · new/atoms/grand-total.mjs
- count-by — ספירה לפי מפתח — עובר על פריטים, מחלץ מפתח-מחרוזת מכל פריט דרך · new/atoms/count-by.mjs

## מסלול-Flutter (אטומי-תצוגה)
- 12 קבצי-Dart ב-flutter/ · 32 אטומי-תצוגה: dart-data-bs/auto/gen_app_genhotzaot_audit_content.dart, dart-data-bs/auto/gen_app_genhotzaot_ent1_content.dart, dart-data-bs/auto/gen_app_genhotzaot_flags_content.dart, dart-data-bs/auto/gen_app_genhotzaot_hub_content.dart, dart-data-bs/auto/gen_app_genhotzaot_main_content.dart, dart-data-bs/auto/gen_app_genhotzaot_over1_content.dart, dart-data-bs/auto/gen_app_genhotzaot_rec1_content.dart, dart-data-bs/auto/gen_app_genhotzaot_root_content.dart, dart-data-bs/auto/gen_app_genhotzaot_scr2_content.dart, dart-data-bs/auto/gen_app_genhotzaot_settings_content.dart, dart-data-bs/auto/gen_app_genhotzaot_shell_content.dart, dart-screens-bs/ai_hub_screen.g.dart, dart-ui-bs/auto/callout.dart, dart-ui-bs/auto/stat.dart, dart-ui-bs/ds/ds.dart, dart-ui-bs/ds/ds_bars.dart, dart-ui-bs/ds/ds_calendar.dart, dart-ui-bs/ds/ds_date_field.dart, dart-ui-bs/ds/ds_enum_field.dart, dart-ui-bs/ds/ds_field.dart, dart-ui-bs/ds/ds_number_field.dart, dart-ui-bs/ds/ds_search.dart, dart-ui-bs/ds/ds_store.dart, dart-ui-bs/ds/ds_table.dart, dart-ui-bs/ds/ds_toggle_tile.dart, dart-ui-bs/premium/actions/glass_button.dart, dart-ui-bs/premium/actions/segmented_switch.dart, dart-ui-bs/premium/dataviz/kpi_tile.dart, dart-ui-bs/premium/dataviz/neon_bars.dart, dart-ui-bs/premium/lists/expandable_tile.dart, dart-ui-bs/premium/showcase/premium_stat.dart, dart-ui-bs/premium/surfaces/stat_hero.dart
- קומפילציה לאתר: --site (site.mjs; Flutter SDK + buildsmart)
