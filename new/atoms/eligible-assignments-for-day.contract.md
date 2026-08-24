# חוזה · חוט eligible-assignments-for-day
**תפקיד:** שיוכי-חנות פעילים שטרם הפכו למסירה **ביום-החלוקה הזה** — הקלט
לבורר-השיוך במודול-החלוקה (SHOP7). מבוסס על השיוכים הקיימים (SHOP6) — לא
משכפל, רק מצביע. מסירה ביום **אחר** אינה חוסמת (השיוך זמין לכל יום בנפרד).
**קלט:** db {deliveries: [{dayId, assignmentId}], shopAssignments: [{id, status}]},
dayId (מחרוזת). **פלט:** מערך שיוכים (אובייקטי-המקור עצמם).
**דוגמאות מחייבות (shopAssignments: a1 active · a2 active · a3 done;
deliveries: {dayId:'d1', assignmentId:'a1'}):**
‏('d1')→['a2'] בלבד (a1 כבר-נמסר-ביום, a3 לא-active) ·
‏('d2')→['a1','a2'] (המסירה של d1 לא חוסמת יום אחר) ·
‏db בלי deliveries כלל ([])→['a1','a2'] · ‏shopAssignments ריק→[] ·
הפלט מצביע לאובייקטי-המקור (out[0]===db.shopAssignments[…], לא עותק)
**מוצא:** maor/src/components/shop7/lib.ts:38-41 (‏SHOP7 — "הקלט לבורר-השיוך";
חולץ כלשונו מטיוטת-המחצבה eligible-assignments-for-day@src_components_shop7_lib_ts).
