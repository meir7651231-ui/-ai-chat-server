# חוזה · חוט col-path
**תפקיד:** נתיב אוסף בענן פר-ארגון: ‏cloudRoot=true ⇒ האוסף בשורש הפרויקט —
**ביט-זהה להיום** (הגנה על הלקוח החי maor-hachesed); אחרת ⇒ `orgs/{slug}/{col}`
(ארגון-פלטפורמה, CLOUD2 ענן 1).
**קלט:** ‏slug (מחרוזת) · ‏cloudRoot (בוליאני) · ‏col (שם-אוסף). **פלט:** מחרוזת-נתיב.
**דוגמאות מחייבות:**
1. ‏colPath('demo', true, 'families') ⇒ 'families' — שורש, ה-slug מתעלם.
2. ‏colPath('demo', false, 'families') ⇒ 'orgs/demo/families'.
3. ‏colPath('kehila', false, 'supporters') ⇒ 'orgs/kehila/supporters'.
4. ‏colPath('x', true, 'donations') ⇒ 'donations'.
5. קצה: ‏colPath('', false, 'meta') ⇒ 'orgs//meta' — שרשור-מחרוזות טהור,
   אין ולידציית-slug (הוולידציה בקופסה).
**מוצא:** maor/src/lib/cloud-diff.ts:45-49 (5 שורות). אחיו metaPath כבר אטום
(‏meta-path). ללא שקעים — טהור לחלוטין.
