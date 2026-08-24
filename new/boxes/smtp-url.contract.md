# חוזה · קופסת-חיבורים "חשבון-המייל" (smtp-url · מקידום lib-smtpUrl)
**תפקיד:** הלקוח מקליד כתובת-מייל + סיסמת-אפליקציה — הקופסה מרכיבה לבד את
כתובת-ה-SMTP המלאה שהשרת (mailOutbox) צורך. מה שהיה מולחם בשני קבצים במאור —
המנוע `src/lib/smtpUrl.ts` והחיווט בטופס `src/components/settings/OrgSecretsSection.tsx` —
מחווט כאן במקום אחד. שמירת-הענן/toast/DOM = לוח-האם; הקופסה טהורה.

## חוטים (אטומים בלבד)
- `smtp-hosts` ← smtpUrl.ts:11-18 (טבלת-הספקים)
- `smtp-host-for` ← smtpUrl.ts:21-26 (דומיין ⇒ host:port; '' = לא-מוכר)
- `compose-smtp-url` ← smtpUrl.ts:33-40 (‏:465 ⇒ smtps:// אחרת smtp://; ‏encodeURIComponent)

## הכרעות שחיות בקופסה (עוגני-מקור — דיבר 11)
1. **שער-הדילוג:** שני השדות ריקים ⇒ `{state:'empty'}` (אין רשומת-מייל) — OrgSecretsSection.tsx:61
2. **קדימות-שרת:** ספק-מוכר גובר על שדה-ידני — `knownHost || manualHost` — OrgSecretsSection.tsx:62
3. **מילון-השגיאות (verbatim):** יש-שרת-אך-חסר-שדה ⇒ ‏'מייל: מלאו גם כתובת וגם סיסמת-אפליקציה' (שורה 66) · אין-שרת-בכלל ⇒ ‏'מייל: הספק לא מוכר — מלאו את שדה שרת-היציאה (host:port)' (שורה 67); ההכרעה ביניהן על `knownHost || manualHost` **לא-מקוצץ** (שורה 65 — ' ' נחשב "יש-שרת", כמו במקור)
4. **זיהוי-חי:** `detectSmtpHost(email)` לרמז-בזמן-הקלדה (שורה 45 — knownHost)

## חשיפה
- `KNOWN_SMTP_DOMAINS` — דומייני-הספקים המוכרים (מ-smtp-hosts)
- `detectSmtpHost(email) ⇒ 'host:port' | ''`
- `buildSmtpAccount({ email, password, manualHost }) ⇒`
  `{state:'empty'} | {state:'error', message} | {state:'ok', url, host, known}`

## דוגמאות מחייבות (מבדיקת-המקור smtpUrl.test.ts:11-45 + החיווט)
- `detectSmtpHost('receipts@gmail.com')` = `'smtp.gmail.com:465'` · `'a@GMAIL.com'` = אותו-דבר · `'x@shem-haamuta.org'` = `''` · `'בלי-שטרודל'` = `''`
- `buildSmtpAccount({email:'a@gmail.com', password:'p'})` ⇒ ok, ‏url `'smtps://a%40gmail.com:p@smtp.gmail.com:465'`
- `{email:'a@outlook.com', password:'p'}` ⇒ ‏`'smtp://a%40outlook.com:p@smtp-mail.outlook.com:587'` (‏587 ⇒ STARTTLS)
- סיסמה `'p@ss:w/rd'` ⇒ בתוך-ה-URL ‏`'p%40ss%3Aw%2Frd'` — תווים מיוחדים לא שוברים
- `{email:'', password:''}` ⇒ ‏empty · `{email:'a@gmail.com', password:''}` ⇒ ‏error הודעה-1 · `{email:'x@unknown.org', password:'p'}` ⇒ ‏error הודעה-2
- `{email:'x@unknown.org', password:'p', manualHost:'mail.org.il:587'}` ⇒ ok ‏smtp://
- `{email:'בלי-שטרודל', password:'p', manualHost:'h:465'}` ⇒ ‏error הודעה-1 (המקור: compose מחזיר null על מייל-בלי-@, וההודעה נבחרת לפי קיום-שרת — הקוד קדוש, L4)

## DoD (נכתב לפני הקוד — דיבר 12)
- `node new/boxes/smtp-url.test.mjs` ⇒ exit 0 + ‏"✓ קופסת-חשבון-המייל"
- `node /home/user/maor-system/machtzev/parity/smtp-url.parity.mjs` ⇒ exit 0, אפס-סטייה ישן≡חדש (‏LCG seed=20260824)
- `node machtzev/police.mjs --fast` ⇒ ירוק
