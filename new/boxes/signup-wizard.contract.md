# חוזה · קופסת-חיבורים "אשף-ההרשמה" (lib-signupWizard)
**תפקיד:** הקופסה של אשף-ההרשמה 5-השלבים של אורביט (SIGNUP3): תחום → גודל →
צרכים → פרטי-קשר → חשבון. כל 9 חוטי `maor/src/lib/signupWizard.ts` מחווטים כאן
במקום אחד — האטומים עיוורים זה-לזה (חוק-2).
**אפס-IO:** המקור טהור לחלוטין (בלי store/DOM — `signupWizard.ts:3`) ⇒ אין שקעי
DOM/localStorage/fetch להזרקה.

## החיווט (עוגני-מקור — דיבר 11)
| חשיפה | אטום | הכרעת-החיווט | עוגן-מקור |
|---|---|---|---|
| `WIZARD_INDUSTRIES` | `wizard-industries` | השקע `packs` ⇐ אטום-הנתונים `vertical-packs` (13 חבילות — מקור-אמת יחיד) | `signupWizard.ts:10-15` |
| `ORG_SIZES` | `org-sizes` | קבוע כלשונו (3 גדלים: small/medium/large) | `signupWizard.ts:18-22` |
| `ORG_NEEDS` | `org-needs` | קבוע כלשונו (7 צרכים: crm…backup) | `signupWizard.ts:25-33` |
| `WIZARD_STEPS` | `wizard-steps` | קבוע `5` | `signupWizard.ts:35` |
| `EMPTY_WIZARD` | `empty-wizard` | מצב-אפס: 9 שדות ריקים (`needs:[]`) | `signupWizard.ts:50-60` |
| `wizardStepError(step, s)` | `wizard-step-error` | השקע `signUpError` ⇐ האטום `sign-up-error` (חוט-שכן מ-`config.ts:739-756`) — שלב 4 = אותה ולידציה כמו הטופס הרזה | `signupWizard.ts:66-85` + `:6` |
| `industryLabel(id)` | `industry-label` | השקע `industries` ⇐ `WIZARD_INDUSTRIES` של הקופסה | `signupWizard.ts:88-90` |
| `sizeLabel(id)` | `size-label` | השקע `sizes` ⇐ `ORG_SIZES` | `signupWizard.ts:91-93` |
| `needLabel(id)` | `need-label` | השקע `orgNeeds` ⇐ `ORG_NEEDS` | `signupWizard.ts:94-96` |

## התנהגות מחייבת (דוגמאות מספריות)
- `WIZARD_STEPS === 5` · `WIZARD_INDUSTRIES.length === 13` · הרשומה הראשונה
  `{ id:'chesed', emoji:'🕊️', label:'עמותת חסד', sub:'גמ"ח · קופת צדקה' }` —
  **בדיוק 4 מפתחות** (theme/terms/modules לא דולפים מהחבילה).
- `EMPTY_WIZARD` ≡ `{ industry:'', size:'', needs:[], orgName:'', contactName:'',
  phone:'', email:'', password:'', password2:'' }`.
- ולידציית-שלב (0-based; `null` = תקין להמשיך):
  - שלב 0 ריק ⇒ `'בחרו את תחום העסק כדי להמשיך'`; `industry:'clinic'` ⇒ `null`.
  - שלב 1 ריק ⇒ `'בחרו את גודל הארגון'`; `size:'small'` ⇒ `null`.
  - שלב 2 ⇒ `null` תמיד (צרכים אופציונליים — `signupWizard.ts:73`).
  - שלב 3: `orgName:'   '` ⇒ `'שם הארגון חובה'` (trim!); אחריו
    `'שם איש קשר חובה'` ⇒ `'טלפון חובה — נחזור אליכם לאישור'`; מלא ⇒ `null`.
  - שלב 4 דרך `signUpError`: תקין מלא (טלפון `'050-1234567'`, אימייל `'a@b.co'`,
    סיסמה `'123456'` פעמיים) ⇒ `null` — **לא `''`** (נרמול `|| null`,
    `signupWizard.ts:81`); טלפון `'12'` ⇒ `'מספר טלפון תקין הוא שדה חובה — נחזור
    אליכם לאישור'`; אימייל `'x'` ⇒ `'כתובת האימייל אינה תקינה'`; סיסמה `'12345'`
    ⇒ `'הסיסמה חייבת להיות לפחות 6 תווים'`; `password2` שונה ⇒ `'הסיסמאות אינן זהות'`.
  - שלב `5` / `-1` ⇒ `null` (default — `signupWizard.ts:82-83`).
- תוויות: `industryLabel('clinic')==='קליניקה'` · לא-מוכר `'zzz'` ⇒ `'zzz'` ·
  `undefined` ⇒ `'—'`; `sizeLabel('medium')==='בינוני'` · `undefined` ⇒ `'—'`;
  `needLabel('crm')==='ניהול לקוחות ואנשי קשר'` · לא-מוכר ⇒ ה-id עצמו (**בלי** `'—'`).

## DoD (דיבר 12 — נכתב לפני הקוד)
- `node new/boxes/signup-wizard.test.mjs` ⇒ exit 0 (`✓`)
- `node /home/user/maor-system/machtzev/parity/signup-wizard.parity.mjs` ⇒ exit 0
  (`🥇`, ישן≡חדש, אפס-סטייה על קורפוס-LCG seed=20260824)
