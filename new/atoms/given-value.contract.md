# חוזה · חוט given-value
**תפקיד:** ‏Σ השווי שנמסר בפועל — סכימת ‏value על המימושים **החיים** בלבד של
כל השיוכים (מבוטלים מוחרגים דרך השקע); ‏value לא-מספרי נספר כ-0.
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏liveRedemptions(a) — מחזיר את המימושים החיים של שיוך (בקוד-המקור:
  ‏a.redemptions.filter(r => !r.voidedAt) — החרגת-מבוטלים, shop/lib.ts:25-27).
**קלט:** ‏assignments (מערך שיוכים) · שקע-liveRedemptions. **פלט:** מספר (Σ value).
**דוגמאות מחייבות** (בכולן ‏live=(a)=>a.redemptions.filter(r=>!r.voidedAt)):
1. שני שיוכים חיים: ‏[{redemptions:[{value:100},{value:40}]},{redemptions:[{value:60}]}]
   ⇒ 200.
2. מבוטל מוחרג: ‏[{redemptions:[{value:80},{value:500,voidedAt:'2026-08-01'}]}] ⇒ 80.
3. ‏value לא-מספרי נספר 0: ‏[{redemptions:[{value:undefined},{value:NaN},{value:25}]}] ⇒ 25.
4. אין שיוכים: ‏[] ⇒ 0.
5. שיוך שכל מימושיו בוטלו: ‏[{redemptions:[{value:70,voidedAt:'x'}]}] ⇒ 0.
6. ‏value=0 חוקי: ‏[{redemptions:[{value:0},{value:15}]}] ⇒ 15.
**מוצא:** maor/src/components/shop/lib.ts:432-438 (‏"Σ השווי שנמסר בפועל
(value של המימושים החיים — מבוטלים מוחרגים)" — מודול-החנות, תאום של
collected-paid על ציר value). השכן liveRedemptions הפך לשקע (חוק-1).
