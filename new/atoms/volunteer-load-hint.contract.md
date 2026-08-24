# חוזה · חוט volunteer-load-hint
**תפקיד:** רמז-קיבולת **לא-חוסם** למתנדב-חלוקה ביום נתון: כמה מסירות כבר עליו,
והאם הגיע/חרג מ-maxDeliveries. ‏maxDeliveries חסר (‎== null‎ — גם undefined) =
אין מגבלה ⇒ over תמיד false. הסף כולל: ‏count ≥ max ⇒ over (שוויון = כבר מלא).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏deliveriesOfVolunteer(db, volId, dayId) ⇒ ‏Delivery[] — המסירות של המתנדב
  ביום (‏shop7/lib.ts:29-31: ‏filter על volunteerId, ו-dayId ריק = כל הימים).
  האטום סופר רק ‎.length‎.
**קלט:** db · vol ‏{id, maxDeliveries?} · dayId · השקע deliveriesOfVolunteer.
**פלט:** ‏{count:number, over:boolean}.
**דוגמאות מחייבות (עם שקע-אמת: filter על volunteerId+dayId; ‏db של 3 מסירות
ל-v1 ביום d1 ומסירה אחת ל-v1 ביום d2):**
‏(v1 ‏max=undefined, d1)→{count:3, over:false} · ‏(v1 ‏max=3, d1)→{count:3, over:true} ·
‏(v1 ‏max=5, d1)→{count:3, over:false} · ‏(v1 ‏max=1, d2)→{count:1, over:true} ·
‏(v9 ‏max=0, d1)→{count:0, over:true} (‏0 ≥ 0 — מגבלת-אפס חוסמת מהמסירה הראשונה)
**מוצא:** maor/src/components/shop7/lib.ts:53-61 (‏volunteerLoadHint, "רמז-קיבולת
(לא-חוסם)… null = אין מגבלה מוגדרת"). הערה: חתימת-TS במקור מכריזה ‎| null‎
אך הקוד לעולם אינו מחזיר null — הקוד קדוש, החוזה מתעד את ההתנהגות בפועל.
