# חוזה · חוט parse-join-full-code
**תפקיד:** פירוק "קוד מהבוס" (ORGADMIN — קוד-הזמנה מלא לעובד/ת) בצורת
‏`{slug}.{code}` ל-{slug, code}. הנקודה **הראשונה** מפרידה (הסלאג [a-z0-9-]
והקוד base36 ⇒ חד-משמעי); הסלאג עובר trim+lowercase; צורה לא-תקינה ⇒ null.
**שקע (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏isValidSlug(slug) ⇒ boolean — אימות-סלאג. במקור (platform/lib.ts:34):
  ‏/^[a-z0-9-]{2,40}$/. תקינות-הסלאג היא מדיניות-הקופסה (החוט is-valid-slug).
**קלט:** full מחרוזת, isValidSlug. **פלט:** {slug, code} או null.
**דוגמאות מחייבות (עם isValidSlug = ‏/^[a-z0-9-]{2,40}$/):**
1. ‏'maor.AB12' → {slug:'maor', code:'AB12'} (הקוד שומר-רישיות).
2. ‏' MAOR.k9 ' → {slug:'maor', code:'k9'} (‏trim חיצוני + lowercase לסלאג בלבד).
3. ‏'my-org.k.9' → {slug:'my-org', code:'k.9'} (הנקודה הראשונה מפרידה).
4. ‏'maor' → null (אין נקודה).
5. ‏'.abc' → null (נקודה בתחילה — dot<=0).
6. ‏'maor.' → null (קוד ריק).
7. ‏'a!.k99' → null (סלאג נפסל בשקע).
**מוצא:** maor/src/components/platform/lib.ts:113-123 (parseJoinFullCode);
השכן isValidSlug הפך לשקע (חוק-1).
