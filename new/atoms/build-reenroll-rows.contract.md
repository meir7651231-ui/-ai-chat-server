# חוזה · חוט build-reenroll-rows
**תפקיד:** בניית שורות מסך "רישום-לשנה-הבאה" (courses.reenroll) — לכל שיבוץ
מצורפים בן/בת-המשפחה, החוג, סיכום-העבר וההחלטה; מסונן לפי חוג/החלטה/חיפוש
רב-מילתי; ממויין לפי שם-תלמיד (localeCompare עברית). דטרמיניסטי, אפס store/DOM.
**שקעים (חוק-1 — קריאות-השכנים הוזרקו כאובייקט-שקעים, פרמטר שלישי):**
- ‏isRenewed(e)⇒boolean — האם השיבוץ כבר נרשם לשנה הבאה (במקור: ‏!!e.renewedToId).
- ‏renewOf(e)⇒'yes'|'no'|'hold'|'' — ההחלטה הנוכחית (במקור: ‏e.renew ?? '').
- ‏enrollSummary(e)⇒object — סיכום-העבר; מועבר כמו-שהוא לשדה ‏summary.
- ‏findMember(db, memberId)⇒{member, family} — איתור בן-משפחה + שם-המשפחה
  (‏member:null·family:'' כשלא נמצא).
**קלט:** ‏db ‏{enrollments, courses, families…} · ‏filter ‏{courseId?, decision?('undecided'=טרם הוחלט), q?, includeRenewed?(ברירת-מחדל true)} · שקעים.
**פלט:** מערך שורות ‏{e, member, memberName, familyName, course, courseName, summary, decision, renewed}.
**דוגמאות מחייבות** (db-הדוגמה: משפחת כהן — אבי m1 · גילה m2; משפחת לוי — בני m3;
חוגים ציור c1 · שחייה c2; שיבוצים e1=m1/c1/renew:'yes' · e2=m2/c1/renew:'' ·
e3=m3/c2/renew:'no'+renewedToId:'x9' · e4=m404/c2 — member לא-קיים):
1. בלי פילטר ⇒ 4 שורות, סדר-השמות: ‏'' (e4) · 'אבי' · 'בני' · 'גילה'.
2. ‏{courseId:'c1'} ⇒ 2 שורות (אבי · גילה).
3. ‏{decision:'undecided'} ⇒ 2 שורות (e4 בלי-renew ⇒ '' · e2) — 'yes'/'no' בחוץ.
4. ‏{includeRenewed:false} ⇒ 3 שורות — e3 (renewedToId) נשמט.
5. ‏{q:'אבי ציור'} ⇒ שורה 1 בלבד (כל מילה חייבת להימצא ב"שם משפחה חוג");
   ‏{q:'כהן'} ⇒ 2 שורות (חיפוש גם בשם-המשפחה).
6. שורת-e1: ‏memberName='אבי' · familyName='כהן' · courseName='ציור' ·
   ‏decision='yes' · renewed=false · summary===הפלט-של-שקע-enrollSummary.
**מוצא:** maor/src/components/courses/reenroll-lib.ts:134-183 (‏buildReenrollRows).
