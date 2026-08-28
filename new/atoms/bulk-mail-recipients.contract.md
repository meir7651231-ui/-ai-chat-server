# חוזה · חוט bulk-mail-recipients
**תפקיד:** נמעני-מייל לשליחה-מרובה: סינון (חסר-מייל/בלי-@) ⇒ דדופ לפי כתובת-מנורמלת ⇒
רשימה מדודה. הראשון-באותה-כתובת שורד (שם/מזהה שלו); email בפלט = המקורי אחרי trim.
**שקעים (חוק-1):** normEmail(s)→string — נרמול-כתובת (trim+lowercase; החוזה norm-email).
  ⚠️ הקורא תמיד מזרים `sp.email || ''` ⇒ שקע שאינו-שומר-null ביט-זהה למקור.
**קלט:** sups[] של {id,name,email?} + השקע. **פלט:** [{id,name,email}].
**דוגמאות מחייבות:** ‏(1) ' Avi@X.co '+'avi@x.co' ⇒ אחד, email='Avi@X.co' ‏(2) חסר-מייל/בלי-@ מסוננים
‏(3) סדר-קלט נשמר ‏(4) [] ⇒ [] ‏(5) name חסר ⇒ ''.
**מוצא:** maor/src/lib/bulkContact.ts · bulkMailRecipients (main 25.8; חולץ כלשונו; normEmail שוקע).
