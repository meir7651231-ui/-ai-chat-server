# חוזה · חוט is-org-manager
**תפקיד:** האם המייל הוא מנהל-הארגון המואצל (‏org.manager) — השוואה מנורמלת
משני הצדדים: המנהל השמור עובר ‏trim+toLowerCase, המייל הנבדק עובר דרך
שקע-הנירמול. ארגון בלי מנהל (חסר/ריק) ⇒ תמיד false (המגן ‏!!m).
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏normEmail(email) — מנרמל-מייל (בקוד-המקור: ‏trim().toLowerCase(), זהה
  להשוואת ה-Rules).
**קלט:** ‏email (מחרוזת) · ‏org (‏{manager?: string}) · שקע-normEmail.
**פלט:** boolean.
**דוגמאות מחייבות** (בכולן ‏nrm=(e)=>e.trim().toLowerCase()):
1. ‏email=' A@b.com' · ‏org={manager:'a@B.com '} ⇒ true — נירמול דו-צדדי.
2. ‏email='a@b.com' · ‏org={manager:'a@b.com'} ⇒ true — התאמה ישירה.
3. ‏email='c@d.com' · ‏org={manager:'a@b.com'} ⇒ false — מייל אחר.
4. ‏email='a@b.com' · ‏org={} ⇒ false — אין מנהל (‏?? '').
5. ‏email='' · ‏org={manager:'  '} ⇒ false — מנהל-רווחים מתנרמל לריק,
   המגן ‏!!m חוסם גם כשהמייל הנבדק ריק.
**מוצא:** maor/src/components/platform/lib.ts:124-128 (‏isOrgManager,
היררכיית ORGADMIN — מייל-על → מנהל → עובדות). השכן normEmail הפך לשקע (חוק-1).
