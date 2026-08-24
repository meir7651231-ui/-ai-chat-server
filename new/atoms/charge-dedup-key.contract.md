# חוזה · חוט charge-dedup-key
**תפקיד:** מפתח-דדופ לעסקת-סליקה: ‏txnId ראשון, נפילה ל-**אסמכתא** (reference) —
כך CallBack-כפול בלי TransactionId (ספק-אחר/CallBack-חלקי) לא משכפל שורת-hist.
שני השדות נגזמים (trim). ריק ⇒ '' = אין-דדופ.
**קלט:** charge — אובייקט עם ‏txnId? ו-reference? (מחרוזות, אופציונליות).
**פלט:** מחרוזת — ‏'txn:<txnId>' או ‏'ref:<reference>' או ‏''.
**דוגמאות מחייבות:**
1. ‏{txnId:'T123'} ⇒ ‏'txn:T123'.
2. ‏{txnId:'  T123  '} ⇒ ‏'txn:T123' (גזום).
3. ‏{txnId:'T123', reference:'R9'} ⇒ ‏'txn:T123' — txn קודם לאסמכתא.
4. ‏{txnId:'', reference:'R9'} ⇒ ‏'ref:R9' (נפילה לאסמכתא).
5. ‏{txnId:'   ', reference:'  R9 '} ⇒ ‏'ref:R9' — txn רווחים-בלבד = ריק; ref נגזם.
6. ‏{} ⇒ ‏'' (אין-דדופ; גם ‏{reference:'   '} ⇒ '').
**מוצא:** maor/src/lib/nedarimSync.ts:146-152 (‏chargeDedupKey). חולץ כלשונו —
טהור, אפס שקעים.
