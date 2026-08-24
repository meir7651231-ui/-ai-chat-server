# 🔎 סריקת-הפניות-חופשיות · 681 אטומי-מאור (24.8.2026)
> הסורק (free-ref-scan.mjs, מבוסס-AST) מצא אטומים שקוראים למזהה לא-מוגדר (לא פרמטר/
> מקומי/import/גלובל) = הפרת חוק-1 (שכן לא-הוזרק/לא-הוטמע, כמו HEX2). **הבדיקות שלהם
> עוברות ירוק** כי ה-Golden הקליט רק מסלולים שלא-הגיעו לקריאה — סכנה חבויה.

## 🔴 מאושר-קורס-על-קלט-תקין (חמור)
- **amount-in-words** — `integerInWords`, `agorotPhrase` לא-מוזרקים. `amountInWords(100)`
  זורק `integerInWords is not defined`. **קבלת-מס — סכום-במילים!** הבדיקה עברה (12 Golden
  על מסלולי-קצה בלבד). תיקון: להזריק/להטמיע את שני השכנים (מקור: hebrewNumber.ts).

## 🟡 הפניית-שכן לא-מוזרקת (סכנה-חבויה, מסלול-מותנה)
enroll-new-family (normSearch) · filter-deliveries (smartFilter, statusLabel) ·
filter-volunteers (smartFilter) · make-normalize-config (isSafeAccent) ·
manual-driver (telHref) · sort-support-threads (supportUnread) · strip-audit-meta (audit) ·
strip-sup-key (audit, skey) · visible-supporters-for-designations (supporterVisibleForDesignations)
→ כולם קוראים לשכן שאינו פרמטר. לתקן: הזרקת-שקע (חוק-3) או הטמעה, + פאזר-אימות.

## המסקנה
הזהב מוכיח דוגמאות; הפאזר תופס סטיות; **הסורק-הסטטי תופס חורי-חילוץ שהבדיקה עוקפת.**
שלושתם נחוצים. הסורק צריך להפוך לשער-משטרה: אפס-הפניה-חופשית לפני קידום.
