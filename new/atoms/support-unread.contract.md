# חוזה · חוט support-unread
**תפקיד:** מונה "לא-נקרא" בטוח-לתצוגה לתג של צ'אט-תמיכה: בוחר את שדה-הצד
(‏'admin' ⇒ ‏unreadAdmin, אחרת ⇒ ‏unreadUser) ומחזיר אותו רק אם הוא מספר חיובי;
כל שאר המקרים — thread חסר, שדה חסר, לא-מספר, אפס או שלילי — ‏0.
**קלט:** ‏thread: {unreadAdmin?, unreadUser?} | null | undefined‏ · ‏side: 'admin' | 'user'.
**פלט:** מספר ≥ 0.
**דוגמאות מחייבות:**
1. ‏null, 'admin' ⇒ ‏0 (אין שיחה — אין תג).
2. ‏{unreadAdmin:3, unreadUser:1}, 'admin' ⇒ ‏3.
3. ‏{unreadAdmin:3, unreadUser:1}, 'user' ⇒ ‏1.
4. ‏{unreadAdmin:-2}, 'admin' ⇒ ‏0 (שלילי נחסם).
5. ‏{}, 'admin' ⇒ ‏0 (שדה חסר).
6. ‏{unreadUser:'5'}, 'user' ⇒ ‏0 (מחרוזת אינה מספר — typeof נאכף).
7. ‏{unreadAdmin:0}, 'admin' ⇒ ‏0 (אפס ⇒ אין תג).
**מוצא:** maor/src/lib/supportChat.ts:82-86 (‏supportUnread) — חולץ כלשונו, אפס שקעים.
