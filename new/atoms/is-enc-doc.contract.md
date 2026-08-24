# חוזה · חוט is-enc-doc
**תפקיד:** האם ערך הוא מסמך-מוצפן-ענן (‏EncDoc) — אובייקט עם ‏enc (מחרוזת
base64 של ה-ciphertext) ו-‏iv (מחרוזת base64 של ה-IV). זה השער failure-safe
של קריאת-הענן: מסמך שאינו במבנה הזה נקרא כ-plaintext רגיל. הבדיקה מבנית
בלבד — לא מאמתת שהתוכן base64 תקין או שה-IV באורך 12 בייט.
**קלט:** ערך כלשהו (‏unknown). **פלט:** בוליאני.
**דוגמאות מחייבות:**
1. ‏{enc:'q1XZ', iv:'AAAAAAAAAAAAAAAA'} ⇒ ‏true.
2. ‏{enc:'q1XZ'} (בלי iv) ⇒ ‏false · ‏{iv:'AAAA'} (בלי enc) ⇒ ‏false.
3. ‏null ⇒ ‏false · ‏undefined ⇒ ‏false.
4. ‏'enc' (מחרוזת) ⇒ ‏false · ‏42 ⇒ ‏false.
5. ‏{enc:5, iv:'AAAA'} ⇒ ‏false — ‏enc חייב להיות מחרוזת.
6. ‏{enc:'q1XZ', iv:'AAAA', meta:{v:1}} ⇒ ‏true — שדות נוספים אינם פוסלים.
7. ‏{} ⇒ ‏false.
**מוצא:** maor/src/lib/cloudCrypto.ts:30-34 (‏isEncDoc על ‏interface EncDoc —
"enc: base64(ciphertext) · iv: base64(iv, 12 בייט)"). עצמאי — אפס שקעים.
