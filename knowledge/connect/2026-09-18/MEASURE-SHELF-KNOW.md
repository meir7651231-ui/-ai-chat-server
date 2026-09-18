# שלב 2 · מדידה לפני בנייה — איפה המקום הנכון, ומה באמת יש שם

18.9.2026 · עובד `claude/w-shelf-know-260918b` · בסיס `506a3aa1`

כל מספר כאן נושא את הפקודה שהפיקה אותו. מה שלא נמדד כתוב «לא נמדד».

---

## 0 · הרצפה — אומתה בעצמי, לא הועתקה מהבריף

```
node machtzev/generator/behavior-plan.mjs --goal knowledge/connect/goals/liba.txt
  ⇒ 12 תביעות · 0 צרכים · 13 מתגי-בעלים · 0.9s
```

```
node -e 'import("./yeshiva/purpose.mjs").then(m=>{...})'
  הודעה ⇒ —      משימה ⇒ —     החלטה ⇒ —    סשן ⇒ —
  גלריה ⇒ —      זיכרון ⇒ —    שיחה ⇒ CallEntry
  ⇒ 6 מתוך 7 ריקות
```

שתי המדידות **מאושרות כלשונן**. הבריף צדק בהן.

---

## 1 · «איזה מהם המקום הנכון» — הפקודה עונה: **אף אחד משניהם**

הבריף ביקש לשדרג את `census/atom-index.mjs` ו/או `census/oracle.mjs`, ולמדוד איזה.
המדידה מחזירה תשובה שלישית.

### 1א · שרשרת-המקור של `classOf`, כפי שהיא בקוד

```
soleClassOf (tzinor.mjs:259)
  └ candidatesFor (tzinor.mjs:214)
      ├ VERTICAL_PACKS      new/atoms/vertical-packs.mjs        (102 מונחי entity.)
      ├ ALL_TERMS           machtzev/generator/entity-terms.data.json
      └ sentenceResolve     machtzev/generator/sentence.mjs
  └ keyToClass (tzinor.mjs:113) ⇒ FIELDS  new/atoms/schema-fields.mjs
```

### 1ב · האם השרשרת נוגעת באינדקסים — נמדד

```
grep -rn "atom-index\|atom-index-full\|oracle" \
  yeshiva/purpose.mjs machtzev/generator/tzinor.mjs \
  new/atoms/vertical-packs.mjs new/atoms/schema-fields.mjs \
  machtzev/generator/sentence.mjs machtzev/generator/entity-terms.data.json
  ⇒ 0 תוצאות
```

**אפס.** `atom-index.mjs` מאנדקס `class X extends StatelessWidget` (שכבת-תצוגה);
`oracle.mjs` ממזג אותו עם `logic-census.json` ⇒ `atom-index-full.json`. שניהם
אינדקסי-**אטומים** (Dart). `classOf` הוא שרשרת-**ישויות**. הן לא נפגשות.

**המסקנה המעשית:** סגירת `grep -c hamecholel ⇒ 0·0·0·0` בארבעת האינדקסים הייתה
מזיזה את המספר הזה ל-25 ו**את `classOf` באפס ישויות**. זה בדיוק «לכופף קוד כדי
שמספר ייראה טוב» שהגבולות אוסרים. לכן לא נגעתי בהם.

**רווח צדדי:** שלושת הקבצים הנעוצים שהבריף הזהיר מפניהם
(`census/atom-index.mjs` · `census/logic-census.mjs` · `census/atom-census.mjs`)
**אינם נדרשים**. אין בקשת `pins-write` בשלב הזה.

---

## 2 · מה באמת יש ב-`knowledge/assets/screens` — נמדד

### 2א · ספירת-המילים של הבריף מאושרת

```
הודעה: 5 קבצים / 58 מופעים     משימה: 1 / 4      החלטה: 4 / 19
סשן:   1 / 1                   גלריה: 3 / 4      שיחה:  6 / 24
נושא:  10 / 30                 זיכרון: 0 / 0
```

**«זיכרון» = 0 קבצים ו-0 מופעים.** הבריף לא כלל אותה בספירה, ומדד-היציאה כן. נרשם.

### 2ב · אבל מופע ≠ ישות. מה המופעים האלה בפועל

| מופע | מה זה באמת |
|---|---|
| `hamecholel.html:61` `/* ── מתגים בתוך ההודעה ── */` | הערת-CSS |
| `mahulal.html:122` `// הודעה = [הודעה] … = [תוכן]` | **דקדוק-החלקיקים של G29**, לא ישות |
| `mechollel-male.html:450` `[הודעה] אופציות אחרי השעון` | שורה בטבלת-דוח של המחולל |
| `siha-im-hamecholel.html:111` `שיחה עם <b>המחולל</b>` | כותרת-עמוד |

### 2גg · הישויות שכן מוגדרות שם — כולן כבר בשרשרת

`hamecholel.html:203-211` מגדיר `DOM` עם מונחי-ורטיקל אמיתיים. הרצתי את כולם
דרך `soleClassOf`:

```
מטופלים ⇒ Family        חדרי טיפול ⇒ מתג:Enrollment/Room
לקוחות ⇒ מתג:Family/Supporter    עמדות עבודה ⇒ Room
אורחים ⇒ מתג:Family/Supporter    יחידות אירוח ⇒ Room
מלווים ⇒ Member          רכבים ⇒ מתג:Member/Room
חבילות טיפול ⇒ Enrollment        מטופל ⇒ Family
  ⇒ 10 מתוך 10 כבר נפתרות היום
```

והמסמך אומר זאת על עצמו, `hamecholel.html:258`:

```
'מ<b>'+dom+'.terms["'+e.k+'"]</b> = "'+e.t+'" · שדות מ<b>schema-fields.mjs</b>'
```

**`knowledge/assets/screens` הוא במורד-הזרם של המדף, לא מקור שלו.** המוקאפים
נבנו *מתוך* `schema-fields.mjs` ומצטטים אותו בממשק. סריקה שלהם מוסיפה
**אפס ישויות חדשות** — לא כי הסורק חלש, אלא כי אין שם מה לחצוב.

---

## 3 · «אין» — עבר ורמינהו לפני שנכתב

הישיבה לא הייתה בקונטיינר. הובאה: `add_repo` ⇒ clone ⇒
`/home/user/yeshiva-engine` @ `598f0d82` (≡ הקומיט שרשום ב-CLAUDE.md).

```
PYTHONPATH=/home/user/yeshiva-engine python3 -m yeshiva.gate rminhu \
  --matter "שבע ישויות-הליבה כישות-עם-שקעים ב-knowledge/assets/screens" \
  --grep "הודעה|משימה|החלטה|סשן|גלריה|זיכרון|שיחה" </dev/null
  ⇒ 40 מקורות מדברים על זה
```

פסק על 40 המקורות: **אף אחד אינו הגדרת-ישות-עם-שקעים.** הם הערות-קוד,
פרוזה ב-CLAUDE.md/LAW.md, טיוטות-ארכיון, ומחרוזות-ממשק.

מקור אחד נבדק לעומק כי נראה מבטיח — `engine/knowledge/lexicon.json:14`
`"הודעה": "banner"`. זו מפת **תפקיד-תצוגה** (16 מפתחות, מסומן בעצמו
«לקסיקון-דוגמה … החלף באוצר-המילים שלך»), לא ישות ולא שקעים. **לא שייך.**

---

## 4 · מה כן נמצא — המקור שלא בשרשרת

החיפוש הרחב (מעבר ל-HTML) מצא שהישויות קיימות בריפו — בשכבה אחרת:

```
new/dart-boards-bs/screens__tasks_screen_board.dart:30
   approvalCardItems: const [] /* TODO-לוח: List<ApprovalCardItem> */
new/dart-screens-bs/tasks_screen.g.dart:27  class ProposalCardItem {
   :29 final int id · :30 final String name · :31 final String workerLabel · :32 final int days
```

זו **משימה עם שקעים ועם file:line**, בתוך הריפו, ואינה בשרשרת-המקור.

מדידה על כל `new/dart-screens-bs`:

```
83 קבצי-מסך · 29 מחלקות-שורה עם שדות · 79 שדות
```

29/79 — עם מוצא מדויק. זהו חומר-הגלם האמיתי לשלב 2.

**אבל הוא לא מכסה 7 מתוך 7.** `chats_screen.g.dart` · `notifications_screen.g.dart`
נמדדו: המחלקות שלהן הן פרמטרי-ווידג׳ט (`onTap` · `hintText` · `controller`),
לא שורות-דאטה. כלומר **משימה** יש; **הודעה · החלטה · סשן · גלריה · זיכרון**
אין — גם לא כאן.

וגם: `BUILDSMART=/tmp/wt-bs-gen/app_flutter` **אינו קיים בקונטיינר הזה**
(‏CLAUDE.md §ההיקף-תלוי-קונטיינר). מקור-המסכים המלא של בנייה-חכמה מחוץ להישג-יד כאן.

---

## 5 · הפסק לשלב 2

| הבריף אמר | המדידה מחזירה |
|---|---|
| שדרג `atom-index.mjs` / `oracle.mjs` | לא שם — 0 הפניות מהשרשרת |
| הישויות קיימות ב-`knowledge/assets/screens` | לא — 10/10 המונחים שם כבר פתורים |
| «הישויות קיימות בריפו והמדף לא סורק אותן» | **נכון, אבל במקום אחר** — `dart-screens-bs`, 29/79 |
| מדד-יציאה: `classOf` 7/7 | לא יושג ממקור קיים. «זיכרון» = 0 מופעים בריפו כולו |

**ליבה נשארת על 0 צרכים אם לא נוגעים בשום דבר — ולמה, נמדד:** 13 מתגי-הבעלים
מחולקים 10×`אין-ישות` · 2×`ישות-בלי-שקע` · 1×`אגרגציה-בלי-אות-סימן`. עשר
מתוך שלוש-עשרה חוסמות על ישות שאין לה מקור בשום מקום בריפו.
