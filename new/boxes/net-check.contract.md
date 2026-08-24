# חוזה · קופסת-חיבורים "net-check" (מאבחן-חסימות-רשת)

**תפקיד:** הקופסה של מאבחן-החסימות — בודקת מהדפדפן אילו נקודות-קצה נגישות
ומייצרת טקסט מדויק להקראה למוקד חברת-הסינון. מחווטת שלושה חוטים לפי גרף-הקריאות
של המקור: **בניית-יעדים ← הרצה-מקבילית ← טקסט-להקראה**.

**מוצא (עוגני-שורה, דיבר 11):** `maor-system/src/lib/netcheck.ts`
- `netCheckTargets` — שורות 41–82 (הכרעות: סדר/תוויות/תבניות-URL/ברירות-מחדל — חיות בקופסה, המקור לא-טהור בגלל cache-bust)
- `checkOne` (בדיקת-יעד-יחיד, ‏fetch+AbortController+setTimeout) — שורות 85–97 = **שקע-IO מוזרק**
- `runNetCheck` — שורות 100–102 (אטום `run-net-check`)
- `netCheckScript` — שורות 105–114 (אטום `net-check-script`)

**אטומים מיובאים (חוק-2):** `run-net-check` · `net-check-script`. שום ייבוא אחר.

## שקעי-IO מוזרקים (חוק-1/חוק-6 — לא ממומשים כאן, מתועדים)
- **randToken** — מחרוזת cache-bust אקראית (במקור `Math.random().toString(36).slice(2)`).
  אי-דטרמיניזם = IO; מוזרק. הקופסה מחזיקה רק את התחילית `netcheck=`.
- **checkOne(target, timeoutMs) ⇒ Promise<result>** — בדיקת-יעד-יחיד עם `fetch`.
  שקע-הרשת האמיתי; מוזרק ל-`run`/`diagnose`.

## הכרעות שחיות בקופסה (מילון + סדר + תבניות)
- ברירת-מחדל ניטרלית לבדיקה כשחסר projectId/apiKey: `netcheck` (התשובה עדיין נושאת CORS).
- תחילית-cache-bust: `netcheck=`.
- סדר-היעדים: `site` תמיד; ואם יש `firebase` — אז `auth`, `token`, `db` (בסדר הזה).
- תוויות: site=`האתר עצמו` · auth=`כניסה לחשבון (Auth)` · token=`חידוש-חיבור (Token)` · db=`סנכרון נתונים (Firestore)`.
- `token` הוא היחיד עם `method:'POST'` ו-`body:'grant_type=refresh_token&refresh_token=netcheck'` (securetoken מחזיר CORS רק על POST).
- URL-ים: site=`origin + '/version.json?' + bust`; auth=recaptchaParams; token=securetoken key=encodeURIComponent(apiKey); db=firestore documents `__netcheck__/__probe__` עם encodeURIComponent(projectId).
- domain פר-יעד = ה-host להקראה למוקד (site: `new URL(origin).host`).

## חשיפה
- `targets(origin, firebase, randToken)` ⇒ מערך-יעדים (1 בלי firebase, 4 עם).
- `run(targets, timeoutMs, checkOne)` ⇒ `Promise<results[]>` — עוטף את אטום `run-net-check` (מקבילי, בסדר-היעדים, ברירת-מחדל timeout 8000).
- `script(results)` ⇒ טקסט להקראה (רק על סמך `!ok`; אין חסום ⇒ מחרוזת ריקה).
- `diagnose({ origin, firebase, randToken, checkOne, timeoutMs=8000 })` ⇒ `Promise<{ targets, results, script }>` — הזרימה המלאה targets→run→script.

## דוגמאות מחייבות (מספריות)
1. `targets('https://a.co', null, 'X')` ⇒ יעד יחיד: `{key:'site', label:'האתר עצמו', url:'https://a.co/version.json?netcheck=X', domain:'a.co'}`.
2. `targets('https://a.co', {projectId:'p1', apiKey:'k1'}, 'X')` ⇒ 4 יעדים; token.url כולל `key=k1`, db.url כולל `/projects/p1/`, token.method==='POST'.
3. `firebase={}` (חסר projectId/apiKey) ⇒ 4 יעדים, apiKey/projectId=`netcheck`: token `key=netcheck`, db `/projects/netcheck/`.
4. apiKey עם תו-מיוחד `k&x` ⇒ `key=k%26x` (encodeURIComponent).
5. `script([{ok:true},{ok:true}])` ⇒ `''` (אין חסום).
6. `script([{ok:false,domain:'firestore.googleapis.com'}])` ⇒ טקסט הפתיחה + `• firestore.googleapis.com` + `תודה רבה!`.
7. `run([a,b,c], undefined, fakeCheckOne)` ⇒ `fakeCheckOne` נקרא 3 פעמים (timeoutMs=8000), תוצאות בסדר a,b,c.
8. `diagnose({origin:'https://a.co', firebase:null, randToken:'Z', checkOne:fake, timeoutMs:500})` ⇒ מריץ יעד-אחד ב-checkOne עם 500, ומחזיר script נגזר.

## מגן-הכרעה
הבדיקה קוראת את מקור-הקופסה עם `fs` ומאשרת verbatim: התוויות, תחילית `netcheck=`,
ברירת-המחדל `netcheck`, ו-`method:'POST'` על token — כדי שסידור-החיווט יישאר חתום.

## רתמת-זהב
`maor-system/machtzev/parity/net-check.parity.mjs` — טרנספילציה-חיה של `netcheck.ts`,
קורפוס-LCG seed=20260824, `Math.random` מוזרק-קבוע ⇒ אפס-סטייה ישן≡חדש על
`netCheckTargets` (תו-בתו) ו-`netCheckScript`. השקע `checkOne`=גבול-IO — מחוץ לרתמה.
