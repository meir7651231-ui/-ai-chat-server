# חוזה · חוט default-prices
**תפקיד:** טבלת-מחירי-ברירת-המחדל של מנוע-התמחור — **placeholder עריך של
הבעלים** (כיול-שוק SaaS לניהול-עמותות בישראל, בקשת-בעלים 23.8 במקור;
הבעלים דורס דרך האשף — נשמר מקומית, לא בקונפיג-הלקוח). ערך בלבד (חוק-5):
הטבלה לא יודעת מי משלם/מה דולק — החישוב = קופסת-התמחור.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏integrationPrices — מילון מחירי-ההרחבות (במקור: הקבוע-השכן
  ‏DEFAULT_INTEGRATION_PRICES באותו קובץ, ‏12 מפתחות receipts…campaign).
  משובץ כמו-שהוא בשדה ‏integrations (אותה רפרנס — בלי העתקה).
**קלט:** השקע integrationPrices. **פלט:** אובייקט-PriceTable:
‏{ base, modules, integrations, sizeMult, setup, enterprise }.
**דוגמאות מחייבות (t = defaultPrices(ip)):**
1. ‏t.base→290 · ‏t.setup→1500.
2. ‏t.modules — ‏9 מפתחות; ‏families→0 ו-calendar→0 (כלולים בבסיס) ·
   ‏courses→120 · ‏diary→70 · ‏supporters→180 (הערך הגבוה ביותר) ·
   ‏reports→60 · ‏tzedaka→90 · ‏shop→90 · ‏shop7→80.
3. ‏t.sizeMult→{small:1, medium:1.6, large:2.4}.
4. ‏t.enterprise→{oneTime:55000, annualMaintenance:9000}.
5. ‏ip={ai:120} ⇒ ‏t.integrations===ip (אותה רפרנס — השקע משובץ, לא מועתק).
**מוצא:** maor/src/lib/pricing.ts:57-75 (‏DEFAULT_PRICES). הקבוע-השכן
DEFAULT_INTEGRATION_PRICES הפך לשקע ⇒ הקבוע הפך לפונקציית-מפעל (חוק-1).
