# חוזה · חוט empty-diff
**תפקיד:** האם diff-הענן ריק — אין מה לדחוף לחוט. ריק ⇔ אפס sets, אפס
deletes, ו-meta הוא null בדיוק (לא undefined, לא אובייקט-ריק).
**קלט:** d — אובייקט-diff עם ‏sets (מערך) · deletes (מערך) · meta (אובייקט|null).
**פלט:** boolean.
**דוגמאות מחייבות:**
1. ‏{sets:[], deletes:[], meta:null} ⇒ ‏true.
2. ‏{sets:[{col:'families', id:'f1', data:{id:'f1'}}], deletes:[], meta:null} ⇒ ‏false.
3. ‏{sets:[], deletes:[{col:'events', id:'e9'}], meta:null} ⇒ ‏false.
4. ‏{sets:[], deletes:[], meta:{seq:12}} ⇒ ‏false (יש meta לדחוף).
5. ‏{sets:[], deletes:[], meta:undefined} ⇒ ‏false (‏null בדיוק — לא undefined).
**מוצא:** maor/src/lib/cloud-diff.ts:184-187 (‏emptyDiff — "האם ה-diff ריק —
אין מה לדחוף"). טהור לחלוטין, אפס שכנים ⇒ אפס שקעים.
