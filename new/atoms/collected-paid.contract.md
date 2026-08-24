# חוזה · חוט collected-paid
**תפקיד:** ‏Σ מה ששולם בפועל במחיר הסמלי — סכימת ‏paid על המימושים **החיים**
בלבד של כל השיוכים (מבוטלים מוחרגים דרך השקע); ‏paid לא-מספרי נספר כ-0.
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏liveRedemptions(a) — מחזיר את המימושים החיים של שיוך (בקוד-המקור:
  ‏a.redemptions.filter(r => !r.voidedAt) — החרגת-מבוטלים, shop/lib.ts:25-27).
**קלט:** ‏assignments (מערך שיוכים) · שקע-liveRedemptions. **פלט:** מספר (Σ paid).
**דוגמאות מחייבות** (בכולן ‏live=(a)=>a.redemptions.filter(r=>!r.voidedAt)):
1. שני שיוכים חיים: ‏[{redemptions:[{paid:10},{paid:20}]},{redemptions:[{paid:5}]}]
   ⇒ 35.
2. מבוטל מוחרג: ‏[{redemptions:[{paid:10},{paid:50,voidedAt:'2026-08-01'}]}] ⇒ 10.
3. ‏paid לא-מספרי נספר 0: ‏[{redemptions:[{paid:undefined},{paid:NaN},{paid:7}]}] ⇒ 7.
4. אין שיוכים: ‏[] ⇒ 0.
5. שיוך בלי מימושים חיים: ‏[{redemptions:[{paid:9,voidedAt:'x'}]}] ⇒ 0.
6. ‏paid=0 חוקי (חלוקה המונית paid=0): ‏[{redemptions:[{paid:0},{paid:12}]}] ⇒ 12.
**מוצא:** maor/src/components/shop/lib.ts:440-446 (‏"Σ מה ששולם בפועל במחיר
הסמלי (מימושים חיים בלבד)" — מודול-החנות, כספי-תצוגה בלבד). השכן liveRedemptions
הפך לשקע (חוק-1).
