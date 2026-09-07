# ✅ CLOSED · GENMAX · G26 — ניווט-מקשרים: אפליקציה, לא רשימת-מסכים (7.9.2026 · הכרעה-27)

> הבעלים: "למה זה לא נראה כמו אפליקציה נורמלית?" ⇒ "??" ⇒ נבנה.

## מה היה
- הרכזת = 23 אריחים זהים עם שמות-מנוע; אין מרכז-כובד; קשר בין ישויות רק דרך בורר-רשומה בדוח; "האפליקציה שלי" / "22 מסכים גלויים" / "3 חלקיקים חיים" על מסך-הלקוח.

## מה נבנה (אפס מילון — גרף-הקשרים בלבד)
| רכיב | שינוי |
|---|---|
| `generator/app-shell.mjs` (חדש) | `pickRoot` — השורש = הישות עם הכי-הרבה מצביעים-נכנסים (backRefs) · `renderShell` — סרגל-תחתון (חיפוש `switch` ⇒ SegmentedSwitch ⇒ עור forge) על IndexedStack: בית (לוח-בקרה) · שורש (רשימה + הוספה) · עוד (הרכזת הישנה, ביט-זהה) · `renderRootPage` — עמוד-רשומה: שלב · עובדות (חיפוש `magnitude` עם need label+value, `must:['value']`, k=12 ⇒ StatHero) · חלק-לכל-ישות-בת (`referencing` לפי הרשומה, שורות עם מתאר-לפי-צורה, "הוספת X" ⇒ מסך-הישות מסונן+ממולא) · "דוח" ⇒ דוח-הרשומה |
| `render-ds.renderEntity` | `scopeField/scopeId` (היקף-הורה): רשימה מסוננת + `_prefill` בטופס (initState + אחרי-שמירה); בלי היקף ביט-זהה |
| `particles.renderReport` | `initialId` (פתיחה מעמוד-השורש); `searchOp(op, goal, need, k)` · `wireAtom` ⇒ `filled` + `ctx.must` |
| `cover.mjs` | `k` — עומק-החלופות |
| `app-ds.mjs` | `אפליקציה: <שם>` (appWord) ⇒ כותרת-המוצר בהוב/main/שלד · זיהוי-שורש · `main ⇒ shell` כשיש שורש · דירוג-מתאר לפי-צורה · own-file/skin: `shell|root` |
| `ds-forge.mjs` | פס-מחליק: FractionallySizedBox+AlignmentDirectional (בלי LayoutBuilder) + IntrinsicWidth על ה-Stack ⇒ הפס = תא-הפריט גם כשההורה רחב |
| chrome | shellHome/shellMore/rootFacts/rootAdd/rootReport/rootMissing… (בלי אמוג׳י — אין גופן-אמוג׳י בבנייה) |

## תקלות בדרך (L100)
1. `Center` בסרגל-התחתון בלי heightFactor ⇒ הגוף 0px ⇒ מסך שחור בלי שגיאה. 2. IntrinsicWidth + LayoutBuilder ⇒ intrinsics לא נתמכים ⇒ הוחלף. 3. need=ניקוד לא סינון ⇒ `must`. 4. מתאר="שדה ראשון"=מצביע-להורה ⇒ דירוג-צורה.

## אימות
`app-ds … --skin` ⇒ "🧭 ניווט-מקשרים (G26): שורש תיק · 3 ישויות-בנות · SegmentedSwitch" · `particles --gate` ✓ · ratchet ✓ · analyze 0 · אתר `sechirut`: בית=לוח-בקרה עם סרגל בית·תיק·עוד · רשימת-תיקים (דוד כהן / 0501234567) · עמוד-תיק (התקבל · 12 עובדות · בטוחה·1 · ממצא·4 עם "השוכר נושא בכל תיקון…" · תשלום·2 · דוח) · דוח נפתח על התיק · עוד = הרכזת בשם "בדיקת חוזה שכירות".

## נותר
- עובדות כ-StatHero (גדול) — ניקוד-לפי-הקשר (כרטיס-פרטים ≠ KPI) · עריכת-רשומת-השורש מעמוד-השורש · ה-"עוד" עדיין מציג טלמטריה (במכוון, מגירת-פיתוח).
