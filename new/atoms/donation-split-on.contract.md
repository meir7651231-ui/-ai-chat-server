# חוזה · חוט donation-split-on
**תפקיד:** האם פיצול-התרומות (מסלול-B) פעיל לארגון — **off-by-default** (opt-in
מפורש, הפוך מחוזה-הדגלים): רק `donationSplit:true` מילולי מדליק; כל ערך אחר ⇒ כבוי.
הכרעת-בעלים 15.8: גם לקוח-שורש (cloudRoot) רשאי להדליק — הדגל לבדו מכריע.
**קלט:** ‏cfg (אובייקט-קונפיג עם `donationSplit?`). **פלט:** בוליאני.
**דוגמאות מחייבות:**
1. ‏donationSplitOn({donationSplit: true}) ⇒ true.
2. ‏donationSplitOn({}) ⇒ false — מפתח חסר = כבוי (הפוך מדגלי-פיצ'ר!).
3. ‏donationSplitOn({donationSplit: false}) ⇒ false.
4. ‏donationSplitOn({donationSplit: 'true'}) ⇒ false — השוואה קשיחה, מחרוזת לא מדליקה.
5. ‏donationSplitOn({donationSplit: 1}) ⇒ false — רק בוליאני-true מילולי.
**מוצא:** maor/src/lib/config.ts:63-65. ללא שקעים — טהור לחלוטין.
