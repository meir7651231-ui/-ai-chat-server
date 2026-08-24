# חוזה · חוט is-super-admin
**תפקיד:** האם מייל הוא מייל-על של הפלטפורמה — נורמליזציה (trim + lowercase)
ובדיקת-חברות ברשימת-מיילי-העל. ריק/null/undefined ⇒ false תמיד.
**שקעים (חוק-1 + חוק-6 — זהות היא קונפיגורציית-הצבה, לא חלק-מכונה):**
- ‏superAdminEmails — מערך-המיילים המורשים ‏(בקוד-המקור: הקבוע-השכן
  ‏SUPER_ADMIN_EMAILS). הרשימה האמיתית **אינה** נשמרת באטום (חוק-6:
  מיילים = חיווט-הצבה בלוח-האם); כאן מוזרקת כפרמטר. מוסכמת-המקור:
  הרשימה מאוחסנת ב-lowercase — האטום מנרמל רק את הקלט, לא את הרשימה.
**קלט:** email (מחרוזת | null | undefined) · השקע superAdminEmails. **פלט:** בוליאני.
**דוגמאות מחייבות (עם רשימת-דוגמה ‏['admin@example.org']):**
‏'admin@example.org'→true · ‏'  Admin@Example.ORG  '→true (trim+lowercase) ·
‏'other@example.org'→false · ‏''→false · ‏null→false · ‏undefined→false ·
עם רשימה ריקה ‏[] ⇒ ‏'admin@example.org'→false
**מוצא:** maor/src/lib/config.ts:729-733 (‏isSuperAdmin — "האם מייל-על
(case-insensitive)"). השכן SUPER_ADMIN_EMAILS הפך לשקע (חוק-1+חוק-6).
