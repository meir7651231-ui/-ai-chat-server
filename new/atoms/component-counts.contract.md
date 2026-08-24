# חוזה · חוט component-counts
**תפקיד:** ספירת רכיבי מוצר-חנות לפי סוג — לתצוגת כרטיסי-הקטלוג. מחזיר תמיד
את ארבעת הסוגים ‏(meeting/coupon/gift/holidayGift), גם כשהספירה 0.
**שקעים:** אין — אטום עצמאי לחלוטין (אפס קריאות-חוץ).
**קלט:** p — מוצר עם ‏p.components, לכל רכיב ‏c.kind אחד מ-4 הסוגים.
**פלט:** ‏{meeting, coupon, gift, holidayGift} — מספרים.
**דוגמאות מחייבות:**
1. מוצר בלי רכיבים ‏(components:[]) ⇒
   ‏{meeting:0, coupon:0, gift:0, holidayGift:0}.
2. רכיב יחיד ‏kind:'meeting' ⇒ ‏{meeting:1, coupon:0, gift:0, holidayGift:0}.
3. ‏['coupon','coupon','gift'] ⇒ ‏{meeting:0, coupon:2, gift:1, holidayGift:0}.
4. ‏['meeting','coupon','gift','holidayGift'] ⇒ כל סוג = 1.
5. ‏['holidayGift','holidayGift','holidayGift'] ⇒ ‏holidayGift:3 והשאר 0.
**מוצא:** maor/src/components/shop/lib.ts:691-696 (‏componentCounts, מודול
החנות). חולץ כלשונו — בלי שכנים, בלי שקעים.
