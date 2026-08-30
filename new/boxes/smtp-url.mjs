/** קופסת-חיבורים · חשבון-המייל (smtp-url). חוזה: smtp-url.contract.md
 *  ההלחמות-לשעבר מ-maor: המנוע lib/smtpUrl.ts + החיווט בטופס
 *  OrgSecretsSection.tsx (שורות 45, 61-71) — עכשיו חיווט גלוי אחד.
 *  שקעי-IO (שמירת-הענן writeOrgSecrets · toast · שדות-הטופס) = לוח-האם; הקופסה טהורה. */
import { SMTP_HOSTS } from '../atoms/smtp-hosts.mjs';
import { smtpHostFor as __pure_smtpHostFor } from '../atoms/smtp-host-for.mjs';
import { SMTP_HOSTS as __d_smtpHostFor_SMTP_HOSTS } from '../atoms/smtp-hosts.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const smtpHostFor = (...a) => __pure_smtpHostFor(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_smtpHostFor_SMTP_HOSTS);
import { composeSmtpUrl } from '../atoms/compose-smtp-url.mjs';

// ── מילון-הקופסה (נוסח-המקור verbatim — OrgSecretsSection.tsx:66-67) ──
const MSG_MISSING_FIELDS = 'מייל: מלאו גם כתובת וגם סיסמת-אפליקציה';
const MSG_UNKNOWN_PROVIDER = 'מייל: הספק לא מוכר — מלאו את שדה שרת-היציאה (host:port)';

/** דומייני-הספקים המוכרים — לרמז-UI ("ספק מוכר ⇒ אין צורך בשדה-שרת"). */
export const KNOWN_SMTP_DOMAINS = Object.keys(SMTP_HOSTS);

/** זיהוי-חי בזמן-הקלדה (המקור: knownHost, שורה 45). '' = ספק לא-מוכר. */
export function detectSmtpHost(email) {
  return smtpHostFor(String(email ?? ''));
}

/** ── החיווט ──
 * מייל+סיסמה (+שרת-ידני לספק לא-מוכר) ⇒ רשומת-חשבון אחת:
 *   {state:'empty'}                 — שני השדות ריקים: אין מה לשמור (שער-הדילוג, שורה 61)
 *   {state:'error', message}        — נוסח-המקור, לפי קיום-שרת (שורות 64-68)
 *   {state:'ok', url, host, known}  — url = מה שנשמר כ-patch.smtpUrl (שורה 70)
 */
export function buildSmtpAccount({ email, password, manualHost } = {}) {
  const em = String(email ?? '');
  const pw = String(password ?? '');
  const mh = String(manualHost ?? '');
  if (!em.trim() && !pw.trim()) return { state: 'empty' };
  const knownHost = smtpHostFor(em); // הכרעה 2: ספק-מוכר גובר על השדה-הידני
  const url = composeSmtpUrl(em, pw, knownHost || mh);
  if (!url) {
    // הכרעה 3: הבורר בין ההודעות = קיום-שרת לא-מקוצץ (knownHost || mh), כמו במקור
    return { state: 'error', message: knownHost || mh ? MSG_MISSING_FIELDS : MSG_UNKNOWN_PROVIDER };
  }
  return { state: 'ok', url, host: (knownHost || mh).trim(), known: !!knownHost };
}
