# חוזה · חוט telephony-on
**תפקיד:** האם מודול-הטלפוניה פעיל — **opt-in הפוך-מדגלים**: חסר/false=כבוי,
רק ‏enabled:true (boolean מחמיר ‏===) מדליק. מגדיר את הופעת כפתורי-החיוג (📞)
במסכי-הקשר.
**קלט:** ‏cfg (‏{telephony?:{enabled?}}). **פלט:** boolean.
**דוגמאות מחייבות:**
1. ‏{telephony:{enabled:true}} ⇒ ‏true.
2. ‏{telephony:{enabled:false}} ⇒ ‏false.
3. ‏{} (אין ‏telephony כלל) ⇒ ‏false (opt-in — חסר=כבוי).
4. ‏{telephony:{}} (בלי ‏enabled) ⇒ ‏false.
5. ‏{telephony:{enabled:'true'}} (מחרוזת, לא boolean) ⇒ ‏false (‏=== מחמיר).
**מוצא:** maor/src/lib/config.ts:90-92 (‏telephonyOn). שימו-לב: הפוך מחוזה-
הדגלים הרגיל (featureOn: חסר=דלוק) — כמו הרחבה נמכרת.
