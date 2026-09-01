/** קופסת-חיבורים · ids — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/lib/ids.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { DEVICE_TAG_KEY, cachedTag } from '../atoms/ids-data.mjs';
/** מרכיב מזהה מתג נתון — טהור (הליבה הנבדקת). tag ריק ⇒ פורמט קודם (`prefix+seq`). */
export function makeId(prefix, seq, tag) {
    return prefix + seq + tag;
}

// גלובלי-למכשיר (מזהה את הדפדפן, לא את הארגון)

/**
 * תג-המכשיר של הדפדפן הנוכחי — 5 תווי base36 (~60M צירופים) קבועים ונשמרים.
 * ללא localStorage (טסטים ב-Node / SSR) מחזיר '' — אז makeId נותן פורמט
 * דטרמיניסטי זהה-לעבר, כך שהטסטים והזרעים נשארים יציבים.
 */
export function deviceTag() {
    if (cachedTag != null)
        return cachedTag;
    try {
        let t = localStorage.getItem(DEVICE_TAG_KEY);
        if (!t) {
            // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
            t = Math.floor(Math.random() * 60466176).toString(36).padStart(5, '0'); // 36^5
            localStorage.setItem(DEVICE_TAG_KEY, t);
        }
        cachedTag = t;
        return t;
    }
    catch {
        return ''; // אין localStorage — בלי תג (דטרמיניסטי)
    }
}
