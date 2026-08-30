/** קופסת-חיבורים · מאבחן-חסימות-רשת (net-check). חוזה: net-check.contract.md
 *  זה המקום היחיד שבו חוטי-הבדיקה נפגשים (חוקי-החשמלאי, LAW.md):
 *  בניית-יעדים (הכרעות חיות כאן) ← הרצה-מקבילית ← טקסט-להקראה.
 *  שקעי-IO (randToken · checkOne=fetch) מוזרקים — לא ממומשים כאן (חוק-1/6). */
import { runNetCheck as __pure_runNetCheck } from '../atoms/run-net-check.mjs';
import { RUN_NET_CHECK_T as __d_run_net_check_T } from '../atoms/run-net-check-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const runNetCheck = (...a) => __pure_runNetCheck(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_run_net_check_T);
import { netCheckScript as __pure_netCheckScript } from '../atoms/net-check-script.mjs';
import { NET_CHECK_SCRIPT_T as __d_netCheckScript_NET_CHECK_SCRIPT_T } from '../atoms/net-check-script-strings.mjs';
import { NET_CHECK_TERMS } from '../atoms/net-check-terms.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const netCheckScript = (...a) => __pure_netCheckScript(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_netCheckScript_NET_CHECK_SCRIPT_T);

// ── מילון-התוויות + הכרעות (הסדר/ברירות-המחדל/התבניות = המשמעות, חיה כאן) ──
// פרוטוקול-חיצוני: ערכי-בדיקה של פרוטוקול-ה-CORS (probe + cache-bust)
const PROBE = 'netcheck';          // ערך-בדיקה ניטרלי כשחסר projectId/apiKey (התשובה עדיין נושאת CORS)
const BUST_PREFIX = 'netcheck=';   // תחילית cache-bust; הערך האקראי מוזרק (randToken)
const LABEL = {
  site: NET_CHECK_TERMS.k1,
  auth: NET_CHECK_TERMS.k2,
  token: NET_CHECK_TERMS.k3,
  db: NET_CHECK_TERMS.k4,
};

// ── החיווט ──
/** בניית יעדי-הבדיקה — googleapis רק כשלארגון יש ענן (מקומי-בלבד לא תלוי בהם). */
export function targets(origin, firebase, randToken) {
  const bust = BUST_PREFIX + randToken;
  const projectId = (firebase && firebase.projectId) || PROBE;
  const apiKey = (firebase && firebase.apiKey) || PROBE;
  const list = [
    // פרוטוקול-חיצוני: מפתח-יעד + נתיב version.json של האתר
    { key: 'site', label: LABEL.site, url: origin + '/version.json?' + bust, domain: new URL(origin).host },
  ];
  if (firebase) {
    list.push(
      {
        // חוק-6: יעד-פרוטוקול Firebase — מפתח + נקודת-קצה + דומיין
        key: 'auth', label: LABEL.auth,
        // חוק-6: נקודת-קצה + דומיין של פריסת-Firebase
        url: 'https://identitytoolkit.googleapis.com/v1/recaptchaParams?' + bust,
        domain: 'identitytoolkit.googleapis.com',
      },
      {
        // חוק-6: יעד-פרוטוקול Firebase — מפתח
        key: 'token', label: LABEL.token,
        // securetoken מחזיר CORS רק על POST; גוף-מחרוזת ⇒ text/plain ⇒ בקשה-פשוטה בלי preflight.
        // חוק-6: נקודת-קצה של פריסת-Firebase
        url: 'https://securetoken.googleapis.com/v1/token?key=' + encodeURIComponent(apiKey) + '&' + bust,
        method: 'POST',
        // חוק-6: גוף-הבקשה התקני (refresh-token grant) + דומיין
        body: 'grant_type=refresh_token&refresh_token=netcheck',
        domain: 'securetoken.googleapis.com',
      },
      {
        // חוק-6: יעד-פרוטוקול Firebase — מפתח
        key: 'db',
        // נתיב-מסמכים אמיתי מחזיר CORS (‏robots.txt לא): מסמך-דמה ⇒ 4xx עם CORS ⇒ נמדד כפתוח.
        label: LABEL.db,
        // חוק-6: נקודת-קצה של פריסת-Firebase
        url:
          'https://firestore.googleapis.com/v1/projects/' +
          encodeURIComponent(projectId) +
          // חוק-6: נתיב-מסמכים תקני של Firestore
          '/databases/(default)/documents/__netcheck__/__probe__?' +
          bust,
        // חוק-6: דומיין נקודת-הקצה
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
// פרוטוקול-חיצוני: פסק-זמן ברירת-מחדל למדידת-רשת (8s)
export async function diagnose({ origin, firebase, randToken, checkOne, timeoutMs = 8000 }) {
  const list = targets(origin, firebase, randToken);
  const results = await run(list, timeoutMs, checkOne);
  return { targets: list, results, script: script(results) };
}
