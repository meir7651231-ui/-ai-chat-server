# חוזה · vertical-packs (אטום-נתונים)
**מהות:** ‏13 חבילות-ורטיקל — הזהות המלאה שהאשף מלביש בבחירת סוג-עסק:
`{ id, emoji, label, sub, terms, modules, features?, theme?, accent?, icon?, motion? }`.
**מוצא:** ‏maor/src/lib/verticalPacks.ts:54-466 (הוערך-במלואו: פרישות `...COMMERCIAL_OFF`
הוטמעו כערכים — האטום טהור ואפס-תלות; המקור נשאר מקור-האמת ההתנהגותי).

## ערבויות (ratchet)
1. בדיוק 13 חבילות; ‏ids ייחודיים: chesed,clinic,shop,services,rooms,fleet,garage,hospitality,gemach,tzedakot,digital,build,studio.
2. **‏chesed = הלקוח-החי:** ‏terms={} · modules={} · theme='or-rishon' · בלי accent/icon/motion/features — ביט-זהה.
3. כל חבילה מסחרית (יש לה features) נושאת את כל 8 מפתחות-הכיבוי המסחריים בערך false:
   core.taxreceipt · families.cred · home.goldbook · home.impactwall · home.community ·
   home.credmetrics · shell.privacy · supporters.hist.
4. לכל חבילה: emoji לא-ריק · label לא-ריק · terms/modules אובייקטים.
5. עמותתיות (בלי features) — רק or-rishon כ-theme (קלאסי).

## קלט/פלט
ייצוא יחיד: `VERTICAL_PACKS` — מערך קפוא-בערכיו (אין mutation ע"י צרכנים; האכיפה בקופסה).
