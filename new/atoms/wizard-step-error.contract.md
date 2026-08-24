# חוזה · חוט wizard-step-error
**תפקיד:** ולידציית-שלב באשף-ההרשמה של אורביט (SIGNUP3, ‏5 שלבים 0-based:
תחום → גודל → צרכים → פרטי-קשר → חשבון). מחזיר הודעת-שגיאה בעברית, או
‏null = תקין להמשך. שלב-הצרכים (2) תמיד תקין (אופציונלי); שלב-החשבון (4)
מאציל לשקע ‏signUpError — שמחזיר '' בהצלחה, והאטום מנרמל ל-null לעקביות.
**שקעים (חוק-1 — שכן-הייבוא הוזרק כפרמטר):**
- ‏signUpError(orgName, contactName, phone, email, password, password2) ⇒ string
  ('' = תקין) — הוולידציה של הטופס-הרזה (במקור: import מ-lib/config).
**קלט:** ‏step (מספר 0-based) · ‏s (WizardState: industry·size·needs·orgName·
contactName·phone·email·password·password2) · השקע. **פלט:** string | null.
**דוגמאות מחייבות:**
1. שלב 0: ‏industry='' ⇒ 'בחרו את תחום העסק כדי להמשיך'; ‏industry='studio' ⇒ null.
2. שלב 1: ‏size='' ⇒ 'בחרו את גודל הארגון'; ‏size='small' ⇒ null.
3. שלב 2 ⇒ תמיד null (גם עם needs=[]).
4. שלב 3 — בסדר-הבדיקה: ‏orgName='  ' ⇒ 'שם הארגון חובה'; ‏orgName תקין אבל
   ‏contactName='' ⇒ 'שם איש קשר חובה'; ‏phone='' ⇒ 'טלפון חובה — נחזור אליכם לאישור';
   שלושתם מלאים ⇒ null.
5. שלב 4: השקע נקרא **בדיוק** עם ‏(orgName, contactName, phone, email, password,
   password2) בסדר הזה; מחזיר 'הסיסמאות אינן זהות' ⇒ מוחזר כלשונו.
6. שלב 4: השקע מחזיר '' ⇒ האטום מחזיר null (נרמול '' ⇒ null).
7. שלב לא-מוכר (9) ⇒ null.
**מוצא:** maor/src/lib/signupWizard.ts:66-85 (‏wizardStepError — SIGNUP3).
השכן signUpError (import מ-config) הפך לשקע (חוק-1).
