# up-examples — חיישן-דוגמאות-חלשות: המנוע יודע מתי הוא לא יודע

הכרעת-הבעלים: "דוגמה חלשה = חיובי-שווא" (up-values, לקחים) · "צא לדרך ותעבוד בלולאה" (בועה 09:30). ענף: claude/up-converter-260917 (אחרי up-converter).
כל מספר עם פקודה; DART=/root/dart-sdk/bin/dart.

## הבעיה (נמדדה)
כשכמה עצים עוברים את **כל** הדוגמאות של הצורך, הבחירה ביניהם נופלת לסדר-המבני (צמתים ⇒ עלות ⇒ id). כך `psak.noOwner` בחר `λexportAllowed` במקום `λfalsy` (שניהם שקולים על הדוגמאות), ו-`t6.guard` החליף בין `addDyn` ל-`termOf` בין ריצות. הדוגמאות לא הכריעו — והמנוע לא ידע להגיד את זה.

## מה שודרג (מנועים קיימים)
1. **logic-proof.mjs — הרתמה-המקומפלת, מצב `--probe`**: אותו `.dill` (אפס קומפילציה נוספת). `_mut(v)` מייצר מוטציות מבניות של ערך (null · '' · 0 · false · 'x' · מחרוזת+x · רשימה בלי הראשון · מפה בלי מפתח / עם ערך מוחלף), `_probes()` מחליף ארגומנט-אחד-בכל-פעם בדוגמה הראשונה (עד 80 קלטים). `evalInterp(interp, trees, 0, {probe:true})` ⇒ `{__probes, [id]: {vals}}`.
2. **behavior-plan.mjs — `valueSearch`**: כשיש תיקו (`wins.length > 1`) — עד 8 הזוכים הראשונים מוערכים על הקלטים-המבחינים; קלט שעליו הפלטים שונים ⇒ `discriminators[{args, outputs}]` (עד 5). הפלט לצורך: `ties`, `weakExamples`, `discriminators`. הבחירה (`pick`) לא משתנה — הדיווח משתנה: הבעלים רואה בדיוק על איזה קלט הזוכים חולקים ומכריע (שקע-אדם), במקום שהסדר-המבני יכריע בשקט.

## מדידות
`node generator/behavior-plan.mjs --needs /tmp/fn-needs2.json` (73s, היה 75s — אפס עלות נראית):
| צורך | pick | ties | weak | קלט-מבחין (דוגמה) |
|---|---|---|---|---|
| psak.noOwner | whereList(p0,λfieldPred(_,'owner',λexportAllowed(_))) | 2 | false | — (הזוכים מסכימים על כל 80 המוטציות) |
| psak.countNoOwner | lengthList(whereList(…λexportAllowed…)) | 1 | false | — |
| psak.noOwnerNull | whereList(p0,λfieldIsNull(_,'owner')) | **4** | **true** | `[{id:a, owner:""}, …]` ⇒ fieldIsNull: `[b, c]` · fieldPred(λexportAllowed): `[a, b, c]` (וכך גם owner=0 / owner=false) |
| psak.countNoOwnerNull | lengthList(whereList(p0,λfieldIsNull(_,'owner'))) | 1 | false | — |

כלומר: הצורך "בלי אחראי (null)" לא אמר מה קורה כשהשדה ריק/0/false — ארבעה עצים שונים עוברים, והקלט-המבחין מראה את ההבדל. זו השאלה שצריכה לחזור לבעלים.

`node generator/behavior-plan.mjs --needs /tmp/sock-needs.json` (99s, היה 98s):
| צורך | pick | ties | weak | קלט-מבחין |
|---|---|---|---|---|
| t1.reuse.square | mulDyn(p0,p0) | 2 | false | — |
| t3.clock.daysSince | cockpitDaysSince(p0,now) | 2 | **true** | `"2026-09-01x"` ⇒ Infinity מול 7 — תאריך פגום: זוכה אחד זורק/∞, השני סופר |
| t5.world.record | addTo(w,addDyn(p0,p1)) | 4 | **true** | על הדוגמה עצמה `("a","2026-09-08")`: `a2026-09-08` מול `2026-09-08a` — הבדיקה `contains('a')` רופפת מכדי להבחין בסדר השרשור |
| t6.guard.recordIf | if(p2){addTo(w,addDyn(p0,p1))} | 3 | **true** | `a2026-09-08` · `2026-09-08a` · `a-org` (termOf) — אותה חולשה, ועוד זוכה מתחום זר |
| t2 · t4 · t7 | — | 1 / 0 / 0 | false | — |

הלקח נמדד: ההבדל בין `addDyn` ל-`termOf` ב-t6 (שהתחלף בין ריצות קודמות) אינו באג-מנוע — הדוגמאות לא הכריעו, ועכשיו המנוע אומר זאת ומראה על מה.

## מה לא נעשה
- שאלה אוטומטית לבעלים דרך הבועה (kind=ask עם הקלט-המבחין) — הפלט מוכן (`discriminators`), החיווט לערוץ הוא של מנהל-הסשנים, לא של המנוע.
- מוטציות עמוקות (ערכים בתוך רשימה-בתוך-מפה) — רק רמה אחת.
