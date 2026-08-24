# חוזה · חוט is-renewed
**תפקיד:** האם שיבוץ-חוג כבר נרשם לשנה הבאה — יש קישור לשיבוץ-היעד
(‏renewedToId לא-ריק). מסך "מה היה בעבר" של מסע-החידוש (reenroll).
**קלט:** ‏e — שיבוץ (‏{renewedToId?: string}). **פלט:** boolean.
**דוגמאות מחייבות:**
1. ‏{renewedToId:'enr_2027_15'} ⇒ true — קושר לשיבוץ-היעד.
2. ‏{} ⇒ false — טרם חודש (השדה חסר).
3. ‏{renewedToId:''} ⇒ false — מחרוזת-ריקה = אין קישור (‏!!).
4. ‏{renewedToId:undefined} ⇒ false — כמו חסר.
5. ‏{renewedToId:'x', status:'ended'} ⇒ true — שאר-השדות אינם משנים,
   רק הקישור קובע.
**מוצא:** maor/src/components/courses/reenroll-lib.ts:52-54 (‏isRenewed —
"האם השיבוץ כבר נרשם לשנה הבאה"). חולץ כלשונו, אפס שקעים.
