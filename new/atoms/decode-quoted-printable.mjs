/** חוט · decode-quoted-printable — קודם אוטומטית (אפיון-Golden). חוזה: decode-quoted-printable.contract.md */
export function decodeQuotedPrintable(s, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function unfoldLines(text) {
      const raw = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
      const out = [];
      let qpActive = false; // השורה-הלוגית הנוכחית היא QP וממתינה להמשך רך
      for (const line of raw) {
          // קיפול-vCard רגיל: המשך בהזחה מצטרף לקודמת.
          if (out.length && (line.startsWith(' ') || line.startsWith('\t'))) {
              out[out.length - 1] += line.slice(1);
              if (!out[out.length - 1].endsWith('='))
                  qpActive = false;
              continue;
          }
          // ריכוך-QP: רק כשהשורה-הלוגית הנוכחית היא QP ונגמרת ב-'='.
          if (out.length && qpActive && out[out.length - 1].endsWith('=')) {
              out[out.length - 1] = out[out.length - 1].slice(0, -1) + line;
              if (!out[out.length - 1].endsWith('='))
                  qpActive = false;
              continue;
          }
          // שורה-לוגית חדשה — QP-פעיל אם היא שדה-QP שנגמר ב-'=' (ממתין להמשך).
          out.push(line);
          qpActive = /ENCODING=QUOTED-PRINTABLE/i.test(line) && line.endsWith('=');
      }
      return out;
  }
  function splitProperty(line) {
      const colon = line.indexOf(':');
      if (colon < 0)
          return null;
      const head = line.slice(0, colon);
      const value = line.slice(colon + 1);
      const segs = head.split(';');
      const name = (segs.shift() || '').trim().toUpperCase();
      if (!name)
          return null;
      return { name, params: segs, value };
  }
  const hasParam = (params, token) => params.some((p) => p.toUpperCase().includes(token));
  function decodeValue(value, params) {
      return hasParam(params, T.k1) ? decodeQuotedPrintable(value) : value;
  }
  const PHONE_LABELS = {
      CELL: T.k2,
      HOME: T.k3,
      WORK: T.k4,
      FAX: T.k5,
      MAIN: T.k6,
      VOICE: '',
      PREF: '',
  };
  function phoneLabel(params) {
      for (const p of params) {
          const up = p.toUpperCase();
          if (up.startsWith(T.k7)) {
              // X-CUSTOM(CHARSET=UTF-8,ENCODING=QUOTED-PRINTABLE,=D7=A0=D7=99=D7=99=D7=93)
              const inner = p.slice(p.indexOf('(') + 1, p.lastIndexOf(')'));
              const parts = inner.split(',');
              const last = parts[parts.length - 1] || '';
              const decoded = /=[0-9A-Fa-f]{2}/.test(last) ? decodeQuotedPrintable(last) : last;
              if (decoded.trim())
                  return decoded.trim();
          }
      }
      for (const p of params) {
          const key = p.toUpperCase().trim();
          if (key in PHONE_LABELS && PHONE_LABELS[key])
              return PHONE_LABELS[key];
      }
      return '';
  }
  function joinAddress(value, params) {
      const decoded = decodeValue(value, params);
      return decoded
          .split(';')
          .map((s) => s.trim())
          .filter(Boolean)
          .join(', ');
  }

    const HEX2 = /^[0-9A-Fa-f]{2}$/; // הוטמע: קבוע-שכן מ-vcardImport.ts:33 (הפאזר תפס חסר-הזרקה)
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === '=' && i + 2 < s.length && HEX2.test(s.slice(i + 1, i + 3))) {
            bytes.push(parseInt(s.slice(i + 1, i + 3), 16));
            i += 2;
        }
        else {
            // תו ASCII רגיל — code-point בטווח בית בודד; מעל 0xFF נשמר כמות-שהוא (נדיר).
            const cp = s.charCodeAt(i);
            bytes.push(cp <= T.k9 ? cp : T.k10 /* '?' */);
        }
    }
    try {
        return new TextDecoder(T.k8).decode(new Uint8Array(bytes));
    }
    catch {
        return s;
    }
}
/**
 * איחוד שורות פיזיות לשורות-לוגיות: (א) קיפול-vCard רגיל — שורה שמתחילה ברווח/טאב
 * ממשיכה את הקודמת; (ב) שורת-המשך רכה של QP — שורה שנגמרת ב-`=` מתחברת לבאה בלי
 * ה-`=`. חשוב: ריכוך-ה-`=` חל **רק** על שדה QUOTED-PRINTABLE — אחרת בסיס-64 של
 * PHOTO (שנגמר ב-`=`/`==` ריפוד) היה בולע את גבול-הכרטיס (END/BEGIN) ומאבד רשומות.
 */
/** פיצול "NAME;PARAM;PARAM:VALUE" ל-{ name, params[], value }. ה-`:` הראשון מפריד. */
/** ערך-שדה מפוענח לפי הפרמטרים (QUOTED-PRINTABLE אם צוין; אחרת גלמי). */
/** תווית-טלפון קריאה מהפרמטרים: X-CUSTOM(…עברית…) מפוענח, אחרת מיפוי CELL/HOME/… */
/** ADR מובנה (po;ext;street;city;region;postal;country) → מחרוזת-כתובת נקייה. */
/**
 * פענוח קובץ vCard שלם → רשימת אנשי-קשר. כרטיס בלי שם ובלי טלפון/מייל מדולג.
 * דטרמיניסטי, טהור. סדר-הפלט = סדר-הכרטיסים בקובץ.
 */
