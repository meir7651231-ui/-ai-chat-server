# חוזה · חוט donations-path
**תפקיד:** נתיב אוסף-התרומות-הנפרד (מסלול-B, doc-per-donation) — אותה חוקיות-נתיב
כשאר האוספים: שורש ⇒ שם-האוסף לבדו; פלטפורמה ⇒ `orgs/{slug}/{col}`.
**שקעים (חוק-1 — במקור קריאות-שכן, כאן מוזרקים):**
- ‏colPath — פונקציית-נתיב `(slug, cloudRoot, col) ⇒ string` (האטום col-path).
- ‏donationsCol — שם-האוסף (האטום donations-col; במקור הקבוע `'donations'`).
**קלט:** ‏slug · ‏cloudRoot · ‏colPath · ‏donationsCol. **פלט:** מחרוזת-נתיב.
**דוגמאות מחייבות (בהזרקת colPath החוזי ו-'donations'):**
1. ‏donationsPath('demo', true, colPath, 'donations') ⇒ 'donations' — שורש, ה-slug מתעלם.
2. ‏donationsPath('demo', false, colPath, 'donations') ⇒ 'orgs/demo/donations'.
3. ‏donationsPath('kehila', false, colPath, 'donations') ⇒ 'orgs/kehila/donations'.
4. שקילות-שקע: הפלט זהה ביט-ביט ל-‏colPath(slug, cloudRoot, 'donations') לכל קלט.
**מוצא:** maor/src/lib/cloud-diff.ts:67-69 (+הקבוע בשורה 64). האחים col-path /
meta-path / env-path / donations-col כבר אטומים.
