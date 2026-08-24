# חוזה · חוט family-context
**תפקיד:** הקשר-חסד של משפחה מתקשרת — מונים "פתוחים" לכרטיס-השיחה (screen-pop):
‏openDeliveries = מסירות המשפחה בסטטוס≠'delivered' (shop7) · ‏activeAssignments =
שיוכי-חבילות של המשפחה בסטטוס==='active' (shop). טהור, תצוגה-בלבד; הגידור
פר-מודול (moduleOn) אצל הצרכן, לא כאן. שים לב לשמות-השדה השונים כלשון-המקור:
במסירות המשפחה היא ‏familyId, בשיוכים היא ‏famId.
**קלט:** ‏db (עם ‏deliveries?/shopAssignments? — מערכים אופציונליים) · ‏famId.
**פלט:** ‏{openDeliveries: number, activeAssignments: number}.
**דוגמאות מחייבות:**
1. ‏deliveries=[{familyId:'f1',status:'pickup'},{familyId:'f1',status:'delivered'},
   {familyId:'f2',status:'pickup'}] · ‏famId='f1' ⇒ ‏openDeliveries=1
   — 'delivered' ומשפחה-אחרת לא נספרים.
2. ‏shopAssignments=[{famId:'f1',status:'active'},{famId:'f1',status:'redeemed'},
   {famId:'f2',status:'active'}] · ‏famId='f1' ⇒ ‏activeAssignments=1 — רק 'active'.
3. ‏db={} (בלי המערכים בכלל) ⇒ ‏{openDeliveries:0, activeAssignments:0} — ‏(x||[]).
4. מסירה בלי status (undefined≠'delivered') ⇒ נספרת כפתוחה; שיוך בלי status ⇒
   לא נספר (נדרש 'active' במפורש).
5. הצלבת-שדות: מסירה עם ‏famId (במקום familyId) לא נספרת, ושיוך עם ‏familyId
   (במקום famId) לא נספר — השמות אינם מתחלפים.
**מוצא:** maor/src/lib/callerId.ts:113-117 (‏familyContext — שילוב-טלפוני,
צ'יפי-הקשר-חסד בכרטיס-שיחה). חולץ כלשונו; טהור, אפס שקעים.
