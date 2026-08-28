# חוזה · חוט wa-href
**תפקיד:** בורר-סכמת-וואטסאפ: appScheme=true ⇒ קישור-אפליקציה (whatsapp://);
false ⇒ wa.me (ביט-זהה להתנהגות ההיסטורית). פלט {href,app} — app מלמד את הצרכן
שאין לפתוח טאב (target=_blank) בסכמת-אפליקציה. קישור-null ⇒ null.
**שקעים (חוק-1):** waAppLink(phone,text)→string|null · waLink(phone,text)→string|null.
**דוגמאות מחייבות:** ‏(1) true ⇒ whatsapp://…, app=true ‏(2) false ⇒ https://wa.me/…, app=false
‏(3+4) מספר לא-תקין ⇒ null בשני המצבים.
**מוצא:** maor/src/lib/wa.ts · waHref (חולץ כלשונו; שני הקישורים שוקעים).
