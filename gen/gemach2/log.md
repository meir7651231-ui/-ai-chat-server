# גמח — יומן-בנייה

מדף: 1096 אטומים (569 פונקציות) · זמן: 12888ms · נבנה: 2026-09-23T06:20:12.000Z

## המשפט
```
גמח: לכל הלוואה יש לווה, מספר, סכום, הנחה, יתרה = סכום פחות הנחה, תאריך, תוקף אישור, ערב ראשון, ערב שני; שלבים: בקשה, אושר, ניתן, נפרע; אפשר לעבור ל-ניתן רק אם ערב שני; אפשר לעבור ל-נפרע רק אם יתרה <= 0; רק גזבר רואה הלוואה
לכל החזר יש הלוואה, סכום, תאריך
```

## ספק (נגזר מהמשפט)
```
אפליקציה: גמח
ישות הלוואה עם לווה*, מספר[מזהה], סכום(0..1000000), הנחה(0..1000000), יתרה=סכום-הנחה, תאריך[תאריך], תוקף אישור[תאריך], ערב ראשון, ערב שני | שלבים: בקשה, אושר, ניתן, נפרע | מעברים: ניתן: ערב שני, נפרע: יתרה <= 0
ישות החזר עם הלוואה*, סכום(0..1000000), תאריך[תאריך]
תפקיד גזבר: הלוואה
לוח בקרה עם סכום(הלוואה.סכום), סכום(הלוואה.הנחה), סכום(הלוואה.יתרה), סכום(החזר.סכום)
```

## הוכחות
- **norm-search** (נרמול טקסט לחיפוש (ניקוד, סופיות, גרשיים)) ⇐ הלוואה.לווה, הלוואה.ערב ראשון, הלוואה.ערב שני, החזר.הלוואה: נוסו 569 · הוכחו 1 · נבחר **norm-search** · נפלו: זריקה 356, פלט שונה 199, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **money** (מספר ⇒ תצוגת-שקלים עם מפרידי-אלפים) ⇐ הלוואה.סכום, הלוואה.הנחה, הלוואה.יתרה, החזר.סכום: נוסו 569 · הוכחו 1 · נבחר **shekel** · נפלו: זריקה 396, פלט שונה 159, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 1 (f_money)
- **fmt-date** (תאריך-ISO ⇒ יום/חודש/שנה) ⇐ הלוואה.תאריך, הלוואה.תוקף אישור, החזר.תאריך: נוסו 569 · הוכחו 1 · נבחר **fmt-date** · נפלו: זריקה 360, פלט שונה 195, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **days-since** (ימים שעברו מתאריך עד היום (שלילי = עתיד)) ⇐ הלוואה.תאריך, הלוואה.תוקף אישור, החזר.תאריך: נוסו 569 · הוכחו 2 · נבחר **cockpit-days-since** · גם עברו: intel-day-diff · נפלו: זריקה 295, אורך-קריאה 158, פלט שונה 114 · Dart-בלבד: נוסו 394, עברו 0
- **csv-escape** (הגנת תא ל-CSV (פסיק · מרכאות · שורה · נוסחה)) ⇐ ייצוא · הגנת תא ל-CSV (פסיק · מרכאות · שורה · נוסחה): נוסו 569 · הוכחו 1 · נבחר **csv-escape** · נפלו: זריקה 354, פלט שונה 201, אורך-קריאה 13 · Dart-בלבד: נוסו 394, עברו 0
- **csv** (שורות ⇒ טקסט CSV עם BOM (אקסל פותח עברית תקין)) ⇐ ייצוא · שורות ⇒ טקסט CSV עם BOM (אקסל פותח עברית תקין): נוסו 569 · הוכחו 1 · נבחר **to-csv** · נפלו: זריקה 263, אורך-קריאה 158, פלט שונה 147 · Dart-בלבד: נוסו 394, עברו 0
- **sum** (סכום שדה-מספר על כל השורות) ⇐ סכום הלוואה.סכום, סכום הלוואה.הנחה, סכום הלוואה.יתרה, סכום החזר.סכום: נוסו 569 · הוכחו 1 · נבחר **grand-total** · נפלו: זריקה 276, אורך-קריאה 158, פלט שונה 134 · Dart-בלבד: נוסו 394, עברו 0

## אטומים שהוטבעו
- norm-search — מנרמל טקסט להשוואת-חיפוש עברית: אותיות-קטנות, הסרת ניקוד, אותיות · new/atoms/norm-search.mjs
- shekel — (ללא תפקיד בחוזה) · new/atoms/shekel.mjs
- fmt-date — תאריך-ISO ⇒ תצוגה ישראלית dd/mm/yyyy. ריק/שבור ⇒ "—". · new/atoms/fmt-date.mjs
- cockpit-days-since — ימים בין תאריך-ISO ליום-הייחוס (חיובי = בעבר, שלילי = עתיד). `Infinity` לתאריך ריק או לא-תקין. · new/atoms/cockpit-days-since.mjs
- csv-escape — מגן על תא-CSV: חוסם הזרקת-נוסחאות (תא שמתחיל ב-=+-@/טאב מקבל גרש · new/atoms/csv-escape.mjs
- to-csv — הופך שורות-תאים לטקסט CSV עם BOM (אקסל פותח עברית תקין). · new/atoms/to-csv.mjs
- grand-total — הסכום הכולל של כל הקופות — reduce מ-0 של סכום-כל-קופה דרך השקע. · new/atoms/grand-total.mjs

## מסלול-Flutter (אטומי-תצוגה)
- 17 קבצי-Dart ב-flutter/ · 54 אטומי-תצוגה: dart-data-bs/auto/gen_app_gengemach2_audit_content.dart, dart-data-bs/auto/gen_app_gengemach2_ent1_content.dart, dart-data-bs/auto/gen_app_gengemach2_ent2_content.dart, dart-data-bs/auto/gen_app_gengemach2_flags_content.dart, dart-data-bs/auto/gen_app_gengemach2_hub_content.dart, dart-data-bs/auto/gen_app_gengemach2_main_content.dart, dart-data-bs/auto/gen_app_gengemach2_over1_content.dart, dart-data-bs/auto/gen_app_gengemach2_over2_content.dart, dart-data-bs/auto/gen_app_gengemach2_rec1_content.dart, dart-data-bs/auto/gen_app_gengemach2_rec2_content.dart, dart-data-bs/auto/gen_app_gengemach2_root_content.dart, dart-data-bs/auto/gen_app_gengemach2_scr3_content.dart, dart-data-bs/auto/gen_app_gengemach2_settings_content.dart, dart-data-bs/auto/gen_app_gengemach2_shell_content.dart, dart-data-bs/auto/gen_app_gengemach2_wizard_content.dart, dart-data-maor/wizard-step-error-sockets.dart, dart-maor/empty-wizard.dart, dart-maor/fmt-date.dart, dart-maor/is-valid-pin.dart, dart-maor/phone-key.dart, dart-maor/phone-region.dart, dart-maor/round2.dart, dart-maor/valid-israeli-id.dart, dart-maor/vertical-packs.dart, dart-maor/wizard-industries.dart, dart-maor/wizard-step-error.dart, dart-maor/wizard-steps.dart, dart-screens-bs/ai_hub_screen.g.dart, dart-screens-bs/courier_certs_screen.g.dart, dart-ui-bs/auto/bar.dart, dart-ui-bs/auto/callout.dart, dart-ui-bs/auto/rewards_hub_fin_row.dart, dart-ui-bs/auto/sstat.dart, dart-ui-bs/auto/switch_row.dart, dart-ui-bs/auto/worker_equipment_checklist_sheet_primary_btn.dart, dart-ui-bs/ds/ds.dart, dart-ui-bs/ds/ds_bars.dart, dart-ui-bs/ds/ds_board.dart, dart-ui-bs/ds/ds_calendar.dart, dart-ui-bs/ds/ds_date_field.dart, dart-ui-bs/ds/ds_field.dart, dart-ui-bs/ds/ds_number_field.dart, dart-ui-bs/ds/ds_search.dart, dart-ui-bs/ds/ds_select.dart, dart-ui-bs/ds/ds_store.dart, dart-ui-bs/ds/ds_table.dart, dart-ui-bs/ds/ds_toggle_tile.dart, dart-ui-bs/premium/actions/segmented_switch.dart, dart-ui-bs/premium/dataviz/kpi_tile.dart, dart-ui-bs/premium/dataviz/neon_bars.dart, dart-ui-bs/premium/lists/expandable_tile.dart, dart-ui-bs/premium/lists/glass_list_tile.dart, dart-ui-bs/premium/showcase/premium_stat.dart, dart-ui-bs/premium/surfaces/stat_hero.dart
- קומפילציה לאתר: --site (site.mjs; Flutter SDK + buildsmart)
