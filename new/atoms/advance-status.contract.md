# חוזה · חוט advance-status
**תפקיד:** מכונת-מצבים לינארית של מסירת-חלוקה (SHOP7) — הסטטוס הבא, **קדימה
בלבד**: ‏pickup→enroute→delivered. ‏delivered סופי (מחזיר את עצמו); סטטוס
לא-מוכר ⇒ ‏'delivered' (נפילה-בטוחה לסוף-המסלול). הסדר הקבוע הוא חלק
מהערך של החוט עצמו (לא ידע-הקשר): ‏['pickup','enroute','delivered'].
**קלט:** status (מחרוזת). **פלט:** מחרוזת-הסטטוס הבא.
**דוגמאות מחייבות:** ‏'pickup'→'enroute' · ‏'enroute'→'delivered' ·
‏'delivered'→'delivered' (סופי) · ‏'שטויות'→'delivered' · ‏''→'delivered'
**מוצא:** maor/src/components/shop7/lib.ts:12-18 (‏advanceStatus — "הסטטוס
הבא — קדימה; delivered הוא סופי" + הקבוע ORDER "סדר המכונה הלינארית —
קדימה בלבד", פרטי לאותו קובץ — נכלל בגוף-האטום).
