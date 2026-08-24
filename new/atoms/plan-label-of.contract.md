# חוזה · חוט plan-label-of
**תפקיד:** תווית-המסלול בשורת-תלמיד/ה בחוגים (כמו planLabel באב-הטיפוס) —
בסיס: plan='punch' ⇒ 'כרטיסייה · <purchased>', אחרת מילת-המסלול מהשקע planWord.
תוספות בסדר קבוע, מופרדות ' · ': status='paused' ⇒ 'מוקפא ⏸' ·
status='ended' ⇒ 'הסתיים' (רק אחד מהשניים; סטטוס אחר — כלום) ·
יש חיסורים ⇒ '<N> חיס׳' · יתרת-חוב מהשקע payBal גדולה מ-0 ⇒ '💳 ₪<bal>'.
**שקעים (חוק-1):** planWord(plan)→מילת-המסלול (בְּמאור: month='מנוי חודשי' ·
half_year='מנוי חצי-שנתי' · year='מנוי שנתי') · payBal(e)→יתרת-חוב במספר.
**קלט:** e ({plan, purchased, status, absences[]}) + שני השקעים. **פלט:** string.
**דוגמאות מחייבות (שקעים בהתנהגות-מאור):**
‏{plan:'punch',purchased:10,status:'active',absences:[]}, bal=0 ⇒ 'כרטיסייה · 10' ·
‏{plan:'month',status:'paused',absences:[]}, bal=0 ⇒ 'מנוי חודשי · מוקפא ⏸' ·
‏{plan:'year',status:'ended',absences:[2 חיסורים]}, bal=150 ⇒
'מנוי שנתי · הסתיים · 2 חיס׳ · 💳 ₪150' ·
‏{plan:'half_year',status:'active',absences:[חיסור אחד]}, bal=0 ⇒
'מנוי חצי-שנתי · 1 חיס׳' ·
‏{plan:'punch',purchased:4,status:'wait',absences:[]}, bal=80 ⇒
'כרטיסייה · 4 · 💳 ₪80' (סטטוס-המתנה לא מוסיף סיומת).
**מוצא:** חולץ כלשונו מ-maor/src/components/courses/lib.ts:421-431
(קריאות-השכן planWord/payBal שוקעו).
