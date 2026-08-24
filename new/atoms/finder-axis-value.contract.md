# חוזה · חוט finder-axis-value
**תפקיד:** ערך-המשפחה בציר-צלילה נתון — תוויות עבריות כמו במקור. ‏switch על
9 צירים: ‏city/comm/lang = השדה או '' · ‏marital = השדה או 'לא ידוע' ·
‏status = תווית-הסטטוס מ-STATUS_META · ‏cred = תווית-הדרגה של ‏tierOf
(ציון חסר ⇒ 700) · ‏kids = 'עם ילדים'/'בלי ילדים' (חבר-לא-הורה קיים?) ·
‏enrolled = 'משתתפות ב<מונח>'/'לא משתתפות' (לפי שיבוצים-חיים; המונח
‏nav.courses רק כש-config קיים, אחרת ה-fallback 'חוגים') · ‏sefach =
'קיים'/'חסר' · ציר לא-מוכר ⇒ ''.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כאובייקט-שקעים אחד):**
- ‏termOf(config, key, fallback) ⇒ מחרוזת (נקרא רק כש-config סופק).
- ‏tierOf(score) ⇒ ‏{label} — דרגת מדד-האמינות (במקור: 950/800/500).
- ‏famLiveEnrollments(db, f) ⇒ מערך השיבוצים-החיים של המשפחה.
- ‏STATUS_META — מילון ‏{[status]: {label}} (במקור: active='פעילה' ·
  pending='ממתינה' · inactive='לא פעילה').
**קלט:** ‏db · ‏f (משפחה) · ‏axis (מחרוזת) · ‏config? · אובייקט-השקעים.
**פלט:** מחרוזת-תווית.
**דוגמאות מחייבות (עם שקעי-הייחוס מ-maor):**
1. ‏axis='city', ‏f.city='צפת' ⇒ 'צפת'; ‏f.city חסר ⇒ ''.
2. ‏axis='marital', שדה חסר ⇒ 'לא ידוע'.
3. ‏axis='status', ‏f.status='active' ⇒ 'פעילה'.
4. ‏axis='cred', ‏f.cred חסר ⇒ ‏tierOf(700) ⇒ 'טעון שיפור'; ‏score=960 ⇒ 'טיטאן'.
5. ‏axis='kids': חבר עם ‏isParent=false ⇒ 'עם ילדים'; כולם הורים ⇒ 'בלי ילדים'.
6. ‏axis='enrolled': יש שיבוץ-חי ובלי config ⇒ 'משתתפות בחוגים'; עם config
   שממפה ‏nav.courses→'שיעורים' ⇒ 'משתתפות בשיעורים'; אין שיבוץ ⇒ 'לא משתתפות'.
7. ‏axis='foo' (לא-מוכר) ⇒ ''.
**מוצא:** maor/src/components/families/lib.ts:102-118 (‏finderAxisValue —
"ערך המשפחה בציר נתון"). ‏termOf/tierOf/famLiveEnrollments/STATUS_META
(שכני-המודול) הפכו לשקעים (חוק-1).
