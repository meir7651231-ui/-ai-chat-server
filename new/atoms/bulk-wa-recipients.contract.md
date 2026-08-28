# חוזה · חוט bulk-wa-recipients
**תפקיד:** נמעני-וואטסאפ לשליחה-מרובה: waDigits על כל שורה ⇒ null מסונן ⇒ דדופ-לפי-ספרות
(שני-תורמים-אותו-טלפון = הודעה-אחת) ⇒ [{id,name,phone,digits}] — phone המקורי + digits בינ"ל.
**שקעים (חוק-1):** waDigits(phone)→string|null — החוזה wa-digits (מוזרק ע"י הקופסה).
**דוגמאות מחייבות:** ‏(1) '050-123-4567'+'0501234567' ⇒ אחד, digits='972501234567' ‏(2) phone
מקורי נשמר ‏(3) לא-תקין/חסר מסוננים ‏(4) סדר נשמר ‏(5) [] ⇒ [].
**מוצא:** maor/src/lib/bulkContact.ts · bulkWaRecipients (main 25.8; חולץ כלשונו; waDigits שוקע).
