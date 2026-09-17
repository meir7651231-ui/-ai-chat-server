# up-backward — "כל מנוע יכול לנוע קדימה ואחורה"

שדרוג `machtzev/generator/behavior-plan.mjs` (הבורר-קדימה) במצב `--backward <atomId>`:
בהינתן f:(A…)⇒B — מי בקטלוג מקבל B ומחזיר A (או חלק מ-A). מסונן ב-sigOk (עם אחדת-מספרים int/double/num),
מוכח-בריצה ב-`proveCandidates` כשיש דוגמאות (`--examples`). הריצה מכריעה, לא הדירוג (הכרעה-30: הוכחה קודמת לתיאור).

**הכרעה — למה behavior-plan ולא search-record:** search-record הוא חיפוש-מילים מהאורקל (טוקנים⇒ניקוד-טקסט),
אין בו מושג של חתימה. הכיוון-ההפוך = היפוך-חתימה (עניין טיפוסים, לא מילים). behavior-plan כבר מחזיק את
כל התשתית: `catalog()` (963 אטומי-לוגיקה עם params/ret/argc), `sigOk`, `chainCands`, `proveCandidates`, `isPure`.
תקדים: `combine-screens.mjs` = הכיוון-ההפוך של screen-decomp; כאן אותו עיקרון על חתימת-אטום.

**אפס-שינוי-בברירת-מחדל:** `behavior-plan.mjs --gate` — לפני: `✓ behavior: 43/43 · 43 מוכחים · 1 בשרשרת`;
אחרי: **זהה**. `node machtzev/police.mjs --fast` — לפני: `44 ran · 1 failed [learn]`; אחרי: `44 ran · 1 failed [learn]` (זהה;
`learn` = ref-blobs חסרים בקלון-טרי, קדם-לשינוי; `pins` עודכן ב-`pins-check.mjs --write` באותו commit).

## הרצה על 6 מנועים (`node machtzev/generator/behavior-plan.mjs --backward <atom> [--examples …]`)

| מנוע (קדימה) | חתימת f | צרכים-הפוכים | מועמדים-בחתימה | הוכחה-בריצה |
|---|---|---|---|---|
| `cockpitDaysSince` | (String,String)⇒num | (num)⇒String · (num,String)⇒String · (String,num)⇒String | 60 | **`addDaysIso` 3/3 ✓** (fMoney exact-sig אך 0/3) |
| `dayDiff` | (String,String)⇒num | (num)⇒String · (num,String)⇒String · (String,num)⇒String | 60 | **`addDaysIso` 3/3 ✓** |
| `taskOverdue` | (dynamic,dynamic)⇒bool | (bool)⇒dynamic · (bool,dynamic)⇒dynamic · (dynamic,bool)⇒dynamic | 95 | (בלי דוגמאות — היפוך-bool מ-dynamic אינו חד-ערכי; סוננו רק בחתימה) |
| `addDaysIso` | (String,int)⇒String | (String)⇒String · (String)⇒int · (String,int)⇒String · (String,String)⇒int | 108 | **`cockpitDaysSince` 3/3 ✓ + `dayDiff` 3/3 ✓** |
| `phoneKey` | (String?)⇒String | (String)⇒String? | 64 | **`formatIsraeliPhone` 1/1 ✓** |
| `normPhone` | (String?)⇒String | (String)⇒String? | 64 | **`formatIsraeliPhone` 1/1 ✓** |

**הרaund-trip מוכח:** `cockpitDaysSince ⇄ addDaysIso` — קדימה: (תאריך,תאריך)⇒ימים; אחורה: (תאריך,ימים)⇒תאריך.
כל אחד מוצא את השני בהוכחה-בריצה 3/3. זהו בדיוק "כל מנוע נע קדימה ואחורה".

### דוגמאות שהורצו
- ימים⇐תאריך (cockpitDaysSince/dayDiff): `[['2026-09-08', 7 ⇒ '2026-09-15'], ['2026-09-30', 1 ⇒ '2026-10-01'], ['2026-09-08', -8 ⇒ '2026-08-31']]` ⇒ נבחר `addDaysIso`.
- תאריך⇐ימים (addDaysIso): `[['2026-09-05','2026-09-08' ⇒ 3], ['2026-09-09','2026-09-08' ⇒ -1], ['2026-09-08','2026-09-08' ⇒ 0]]` ⇒ נבחרו `cockpitDaysSince`+`dayDiff`.
- טלפון (phoneKey/normPhone): `[['0501234567' ⇒ starts 050 & contains '-']]` ⇒ נבחר `formatIsraeliPhone` (ניפוח-נרמול).

### לקח
`exact` (התאמת-חתימה מדויקת) ≠ נכון: `fMoney` עבר את החתימה num⇒String על cockpitDaysSince אך נכשל 0/3;
`addDaysIso` (לא-exact, נכנס דרך אחדת-מספרים int~num) עבר 3/3. **החתימה מסננת, הריצה מכריעה.**
