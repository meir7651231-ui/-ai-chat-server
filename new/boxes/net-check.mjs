/** קופסת-חיבורים · מאבחן-חסימות-רשת (net-check). חוזה: net-check.contract.md
 *  זה המקום היחיד שבו חוטי-הבדיקה נפגשים (חוקי-החשמלאי, LAW.md):
 *  בניית-יעדים (הכרעות חיות כאן) ← הרצה-מקבילית ← טקסט-להקראה.
 *  שקעי-IO (randToken · checkOne=fetch) מוזרקים — לא ממומשים כאן (חוק-1/6). */
import { runNetCheck } from '../atoms/run-net-check.mjs';
import { netCheckScript as __pure_netCheckScript } from '../atoms/net-check-script.mjs';
import { NET_CHECK_SCRIPT_T as __d_netCheckScript_NET_CHECK_SCRIPT_T } from '../atoms/net-check-script-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const netCheckScript = (...a) => __pure_netCheckScript(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_netCheckScript_NET_CHECK_SCRIPT_T);

// ── מילון-התוויות + הכרעות (הסדר/ברירות-המחדל/התבניות = המשמעות, חיה כאן) ──
const PROBE = 'netcheck';          // ערך-בדיקה ניטרלי כשחסר projectId/apiKey (התשובה עדיין נושאת CORS)
const BUST_PREFIX = 'netcheck=';   // תחילית cache-bust; הערך האקראי מוזרק (randToken)
const LABEL = {
  site: 'האתר עצמו',
  auth: 'כניסה לחשבון (Auth)',
  token: 'חידוש-חיבור (Token)',
  db: 'סנכרון נתונים (Firestore)',
};

// ── החיווט ──
/** בניית יעדי-הבדיקה — googleapis רק כשלארגון יש ענן (מקומי-בלבד לא תלוי בהם). */
export function targets(origin, firebase, randToken) {
  const bust = BUST_PREFIX + randToken;
  const projectId = (firebase && firebase.projectId) || PROBE;
  const apiKey = (firebase && firebase.apiKey) || PROBE;
  const list = [
    { key: 'site', label: LABEL.site, url: origin + '/version.json?' + bust, domain: new URL(origin).host },
  ];
  if (firebase) {
    list.push(
      {
        key: 'auth',
        label: LABEL.auth,
        url: 'https://identitytoolkit.googleapis.com/v1/recaptchaParams?' + bust,
        domain: 'identitytoolkit.googleapis.com',
      },
      {
        key: 'token',
        label: LABEL.token,
        // securetoken מחזיר CORS רק על POST; גוף-מחרוזת ⇒ text/plain ⇒ בקשה-פשוטה בלי preflight.
        url: 'https://securetoken.googleapis.com/v1/token?key=' + encodeURIComponent(apiKey) + '&' + bust,
        method: 'POST',
        body: 'grant_type=refresh_token&refresh_token=netcheck',
        domain: 'securetoken.googleapis.com',
      },
      {
        key: 'db',
        // נתיב-מסמכים אמיתי מחזיר CORS (‏robots.txt לא): מסמך-דמה ⇒ 4xx עם CORS ⇒ נמדד כפתוח.
        label: LABEL.db,
        url:
          'https://firestore.googleapis.com/v1/projects/' +
          encodeURIComponent(projectId) +
          '/databases/(default)/documents/__netcheck__/__probe__?' +
          bust,
        domain: 'firestore.googleapis.com',
      },
    );
  }
  return list;
}

/** הרצת כל הבדיקות במקביל — checkOne(target,timeoutMs) הוא שקע-הרשת המוזרק. */
export const run = (targets, timeoutMs, checkOne) => runNetCheck(targets, timeoutMs, checkOne);

/** הטקסט להקראה/שליחה למוקד — רק על סמך מה שנחסם בפועל. */
export const script = (results) => netCheckScript(results);

/** הזרימה המלאה: בניית-יעדים ← הרצה ← טקסט-להקראה. */
export async function diagnose({ origin, firebase, randToken, checkOne, timeoutMs = 8000 }) {
  const list = targets(origin, firebase, randToken);
  const results = await run(list, timeoutMs, checkOne);
  return { targets: list, results, script: script(results) };
}
