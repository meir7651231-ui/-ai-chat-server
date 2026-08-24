# חוזה · חוט filter-items
**תפקיד:** סינון פריטי-הקטלוג העצמאיים של החנות — ‏q על השם; ‏stockState מסנן
לפי יתרת-מלאי: ‏'' = הכול · ‏'untracked' = ללא מעקב-מלאי (יתרה null) ·
‏'out' = אזל (יתרה 0) · ‏'low' = נמוך (0 < יתרה ≤ 2, רק כשיש מעקב).
**שקעים (חוק-1):**
- ‏itemRemaining(db, itemId) ⇒ ‏number|null — יתרת-הפריט (החוט item-remaining; ‏null=ללא-מעקב).
- ‏smartFilter(q, items, getTerms) — מנוע-החיפוש המשותף (החוט smart-filter).
**קלט:** ‏db (עם ‏shopItems: מערך ‏{id, name, …}) · ‏q · ‏stockState
('' | 'out' | 'low' | 'untracked') · ‏itemRemaining · ‏smartFilter.
**פלט:** מערך פריטים מסונן.
**דוגמאות מחייבות** (יתרות מזויפות: ‏A→null · ‏B→0 · ‏C→1 · ‏D→2 · ‏E→3;
‏smartFilter-מזויף מחזיר items):
1. ‏stockState='' ⇒ כל 5 הפריטים עוברים ל-smartFilter (‏[A,B,C,D,E]) — ובלי
   אף קריאה ל-itemRemaining.
2. ‏stockState='untracked' ⇒ ‏[A] (רק יתרה null).
3. ‏stockState='out' ⇒ ‏[B] (רק יתרה 0).
4. ‏stockState='low' ⇒ ‏[C, D] (יתרה 1 ו-2; ‏3 בחוץ, ‏null בחוץ, ‏0 בחוץ).
5. ‏getTerms על ‏{name:'נר שבת'} ⇒ ‏['נר שבת', 'נר', 'שבת'] (השם + פיצול-מילים).
**מוצא:** maor/src/components/shop/lib.ts:551-564 (‏filterItems — UX סינון גל B½).
שכני ‏itemRemaining·smartFilter הפכו לשקעים (חוק-1).
