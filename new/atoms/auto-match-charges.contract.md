# חוזה · חוט auto-match-charges
**תפקיד:** שיוך אוטומטי של חיובי-סנכרון (נדרים-פלוס) לתומכים קיימים — טהור.
בונה אינדקס מפתח→supId מכל התומכים (התומך הראשון-במערך גובר על מפתח כפול),
ואז לכל חיוב עובר על מפתחות keysOf בסדר-החוזק (ext → id → ph → em) — המפתח
הראשון שנמצא באינדקס מכריע. חיוב בלי-התאמה לא מופיע בפלט (נשאר pending
לסנכרון-הידני). סדר-הפלט = סדר-החיובים.
**שקעים (חוק-1):** keysOf({extId?, idNum?, zeout?, phone?, email?})→string[] —
מפתחות-שיוך מנורמלים בסדר-חוזק יורד ('ext:…','id:…','ph:…','em:…'); עקבי עם
מנוע-הדדופ (id=ספרות-בלבד מ-idNum||zeout, טלפון≥7 ספרות, אימייל-lowercase).
**קלט:** charges[] ({toremId?, zeout?, phone?, email?, …}) ·
supporters[] ({id, extId?, idNum?, phone?, email?, …}) · שקע keysOf.
**פלט:** {supId, charge}[].
**דוגמאות מחייבות (supporters: s1{extId:'E1'} · s2{phone:'050-1234567'} ·
s3{email:'A@b.com'} · s4{phone:'050-1234567'} — טלפון-כפול):**
‏{toremId:'E1'}→s1 · ‏{phone:'0501234567'}→s2 (הראשון-במערך גובר, לא s4) ·
‏{email:'a@B.com'}→s3 (השוואה case-insensitive) · ‏{zeout:'999'}→לא-בפלט ·
‏{toremId:'E1', phone:'0501234567'}→s1 (‏ext חזק מ-ph) ⇒ אורך-הפלט=4.
**מוצא:** חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:427-448 (‏keysOf שוקע).
