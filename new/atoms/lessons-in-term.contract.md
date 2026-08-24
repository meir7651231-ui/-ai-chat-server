# חוזה · חוט lessons-in-term
**תפקיד:** מספר-השיעורים בתקופת-תמחור לפי תדירות. ‏freq=כמות,
‏unit='week' (פ/שבוע) או 'month' (פ/חודש); ההמרה דרך הקבוע
‏WEEKS_PER_MONTH = 52/12 (קבוע-שכן מאותו קובץ-מקור — הוגדר מקומית באטום,
ערך ולא import). ‏freq לא-סופי/שלילי ⇒ 0; ‏months<1 או חסר ⇒ 1.
**קלט:** ‏freq:number · ‏unit:'week'|'month' · ‏term:'once'|'weekly'|'biweekly'|
'monthly'|'months'|'half_year'|'year' · ‏months?:number (ברירת-מחדל 1).
**פלט:** מספר שיעורים (לא מעוגל — ייתכן שבר).
**דוגמאות מחייבות:**
1. ‏(2,'week','weekly') ⇒ 2 — פעמיים-בשבוע, תקופה שבועית
2. ‏(2,'week','biweekly') ⇒ 4 — perWeek×2
3. ‏(1,'week','monthly') ⇒ 52/12 ≈ 4.3333 — המרה שבוע→חודש
4. ‏(4,'month','months',3) ⇒ 12 — ‏4 פ/חודש × 3 חודשים
5. ‏(4,'month','year') ⇒ 48 · ‏(4,'month','half_year') ⇒ 24
6. ‏(99,'week','once') ⇒ 1 — חד-פעמי מתעלם מתדירות
7. ‏(NaN,'week','weekly') ⇒ 0 · ‏(-3,'week','weekly') ⇒ 0 · ‏term לא-מוכר ⇒ 0
**מוצא:** maor/src/components/courses/lib.ts:213 (‏WEEKS_PER_MONTH) +
237-260 (‏lessonsInTerm), חולץ כלשונו — אפס שקעים.
