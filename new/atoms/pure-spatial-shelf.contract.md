# חוזה · אטום spatial-shelf (פירוק משפחת-Pure "spatial")

**תפקיד:** רישום-האטומים המפורקים של משפחת-Pure **spatial** — כל אטום-תצוגה שהוצג בגלריה
(machtzev/pure/spatial-family.html) כדאטה טהורה שהמחולל מונה ולובש. **אפס ידע-מראה באטום** (חוק-5): כאן רק
שם + סוג (canonical/signature/inherit) + סוג-ה-seam; המראה מוזרק בקופסה דרך pure-look/pure-resolve (חוק-6).

**מבנה:** `{ family, source, count, atoms:[{name, note?, kind, seam?}] }`
- **קנוני/חתימה** — הגיעו מ-`.nm` (האטום המוצג + וריאנטיו).
- **יורש** — הגיעו מ-`.chip` (אותה תבנית, נבדל בדאטה — §3 canonical+inherit).

**התחייבויות:** 6 אטומים · שמות ייחודיים ולא-ריקים · kind מ-allowlist · אפס-import
(חוק-1) · אפס תוכן-דומיין/₪ (§0) · regen ביט-זהה ממקור-האמת (אחרת `--check` אדום).

**מוצא:** machtzev/pure/spatial-family.html · **מנוע:** machtzev/pure/pure-decompose.mjs · **שער:** pure-lint + police.
