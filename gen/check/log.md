# גבייה — יומן-בנייה

מדף: 1096 אטומים (569 פונקציות) · זמן: 12130ms · נבנה: 2026-09-14T23:24:59.968Z

## המשפט
```
גבייה: לכל צק יש משפחה, מספר, בנק, סכום, תאריך פירעון, מיקום (כספת, בבנק, אצל הגזבר), סיבת חזרה (אין כיסוי, חתימה, מוטב, חשבון מוגבל); שלבים: התקבל, מוחזק, הופקד, נפרע, חזר, הוצג שוב; אפשר לעבור ל-הופקד רק אם תאריך פירעון; אפשר לעבור ל-הוצג שוב רק אם סיבת חזרה; אסור למחוק צק; אסור לשנות סכום ב-צק; הרגע של צק: הורה מביא צקים דחויים ביום הרישום; צק במסך של גזבר; רק גזבר רואה צק
לכל חוב יש משפחה, סכום, תאריך יעד, הערה; שלבים: ממתין, תזכורת, שיחה, הסדר, נסגר
```

## ספק (נגזר מהמשפט)
```
אפליקציה: גבייה
ישות צק עם משפחה*, מספר[מזהה], בנק, סכום(0..1000000), תאריך פירעון[תאריך], מיקום{כספת|בבנק|אצל הגזבר}, סיבת חזרה{אין כיסוי|חתימה|מוטב|חשבון מוגבל} | שלבים: התקבל, מוחזק, הופקד, נפרע, חזר, הוצג שוב | מעברים: הופקד: תאריך פירעון, הוצג שוב: סיבת חזרה | אסור: מחיקה, שינוי סכום | הרגע: הורה מביא צקים דחויים ביום הרישום | מסך: גזבר
ישות חוב עם משפחה*, סכום(0..1000000), תאריך יעד[תאריך], הערה | שלבים: ממתין, תזכורת, שיחה, הסדר, נסגר
תפקיד גזבר: צק
לוח בקרה עם סכום(צק.סכום), מונה(צק.מיקום), מונה(צק.סיבת חזרה), סכום(חוב.סכום)
```

## הוכחות
- **norm-search** (נרמול טקסט לחיפוש (ניקוד, סופיות, גרשיים)) ⇐ צק.משפחה, צק.בנק, חוב.משפחה, חוב.הערה: נוסו 569 · הוכחו 1 · נבחר **norm-search** · נפלו: זריקה 356, פלט שונה 199, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **money** (מספר ⇒ תצוגת-שקלים עם מפרידי-אלפים) ⇐ צק.סכום, חוב.סכום: נוסו 569 · הוכחו 1 · נבחר **shekel** · נפלו: זריקה 396, פלט שונה 159, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 1 (f_money)
- **fmt-date** (תאריך-ISO ⇒ יום/חודש/שנה) ⇐ צק.תאריך פירעון, חוב.תאריך יעד: נוסו 569 · הוכחו 1 · נבחר **fmt-date** · נפלו: זריקה 360, פלט שונה 195, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **days-since** (ימים שעברו מתאריך עד היום (שלילי = עתיד)) ⇐ צק.תאריך פירעון, חוב.תאריך יעד: נוסו 569 · הוכחו 2 · נבחר **cockpit-days-since** · גם עברו: intel-day-diff · נפלו: זריקה 295, אורך-קריאה 158, פלט שונה 114 · Dart-בלבד: נוסו 394, עברו 0
- **sum** (סכום שדה-מספר על כל השורות) ⇐ סכום צק.סכום, סכום חוב.סכום: נוסו 569 · הוכחו 1 · נבחר **grand-total** · נפלו: זריקה 276, אורך-קריאה 158, פלט שונה 134 · Dart-בלבד: נוסו 394, עברו 0
- **count-by** (ספירה לפי ערך, מהגדול לקטן) ⇐ מונה צק.מיקום, מונה צק.סיבת חזרה: נוסו 569 · הוכחו 1 · נבחר **count-by** · נפלו: זריקה 274, אורך-קריאה 158, פלט שונה 136 · Dart-בלבד: נוסו 394, עברו 0

## אטומים שהוטבעו
- norm-search — מנרמל טקסט להשוואת-חיפוש עברית: אותיות-קטנות, הסרת ניקוד, אותיות · new/atoms/norm-search.mjs
- shekel — (ללא תפקיד בחוזה) · new/atoms/shekel.mjs
- fmt-date — תאריך-ISO ⇒ תצוגה ישראלית dd/mm/yyyy. ריק/שבור ⇒ "—". · new/atoms/fmt-date.mjs
- cockpit-days-since — ימים בין תאריך-ISO ליום-הייחוס (חיובי = בעבר, שלילי = עתיד). `Infinity` לתאריך ריק או לא-תקין. · new/atoms/cockpit-days-since.mjs
- grand-total — הסכום הכולל של כל הקופות — reduce מ-0 של סכום-כל-קופה דרך השקע. · new/atoms/grand-total.mjs
- count-by — ספירה לפי מפתח — עובר על פריטים, מחלץ מפתח-מחרוזת מכל פריט דרך · new/atoms/count-by.mjs

## מסלול-Flutter (אטומי-תצוגה)
- 14 קבצי-Dart ב-flutter/ · 35 אטומי-תצוגה: dart-data-bs/auto/gen_app_gencheck_audit_content.dart, dart-data-bs/auto/gen_app_gencheck_ent1_content.dart, dart-data-bs/auto/gen_app_gencheck_ent2_content.dart, dart-data-bs/auto/gen_app_gencheck_flags_content.dart, dart-data-bs/auto/gen_app_gencheck_hub_content.dart, dart-data-bs/auto/gen_app_gencheck_main_content.dart, dart-data-bs/auto/gen_app_gencheck_over1_content.dart, dart-data-bs/auto/gen_app_gencheck_over2_content.dart, dart-data-bs/auto/gen_app_gencheck_rec1_content.dart, dart-data-bs/auto/gen_app_gencheck_rec2_content.dart, dart-data-bs/auto/gen_app_gencheck_scr3_content.dart, dart-data-bs/auto/gen_app_gencheck_settings_content.dart, dart-screens-bs/ai_hub_screen.g.dart, dart-screens-bs/courier_certs_screen.g.dart, dart-ui-bs/auto/ai_bar.dart, dart-ui-bs/auto/bar.dart, dart-ui-bs/auto/callout.dart, dart-ui-bs/auto/worker_profile_stat.dart, dart-ui-bs/ds/ds.dart, dart-ui-bs/ds/ds_bars.dart, dart-ui-bs/ds/ds_board.dart, dart-ui-bs/ds/ds_calendar.dart, dart-ui-bs/ds/ds_date_field.dart, dart-ui-bs/ds/ds_enum_field.dart, dart-ui-bs/ds/ds_field.dart, dart-ui-bs/ds/ds_number_field.dart, dart-ui-bs/ds/ds_search.dart, dart-ui-bs/ds/ds_store.dart, dart-ui-bs/ds/ds_table.dart, dart-ui-bs/ds/ds_toggle_tile.dart, dart-ui-bs/premium/dataviz/kpi_tile.dart, dart-ui-bs/premium/dataviz/neon_bars.dart, dart-ui-bs/premium/lists/expandable_tile.dart, dart-ui-bs/premium/lists/glass_list_tile.dart, dart-ui-bs/premium/showcase/premium_stat.dart
- קומפילציה לאתר: --site (site.mjs; Flutter SDK + buildsmart)
