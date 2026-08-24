# חוזה · חוט requeue-outcomes
**תפקיד:** קבוע — רשימת-מחרוזות `['noanswer','skip']`. ערך בלבד (חוק-5):
הרשימה לא יודעת שהיא "תוצאות לא-סופיות שמחזירות מתקשר לסוף-התור" —
ההשוואה `REQUEUE_OUTCOMES.includes(outcome)` וסיבוב-התור הם חיווט-הקופסה
(מנוע-החייגן).
**קלט:** — (קבוע). **פלט:** מערך מחרוזות.
**דוגמאות מחייבות:** length=2 · [0]='noanswer' · [1]='skip' ·
includes('noanswer')→true · includes('skip')→true · includes('donated')→false
(תוצאה סופית — לא ברשימה; במקור היא ב-TERMINAL_OUTCOMES הנפרד).
**מוצא:** maor/src/lib/dialer.ts:9-10 (‏REQUEUE_OUTCOMES — "תוצאות לא-סופיות
— מחזירות את המתקשר לסוף-התור (עוד ניסיון)"; חולץ כלשונו. הערה: תיעוד
הטיוטה נשא בטעות את הערת TERMINAL_OUTCOMES — החוזה יושר למקור).
