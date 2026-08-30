/** קופסת-חיבורים · support-chat — מחווטת את חוטי צ׳אט-התמיכה/הצוות. חוזה: support-chat.contract.md
 *  זה המקום היחיד שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md). מקור-האמת:
 *  maor/src/lib/supportChat.ts — 10 חוטים חולצו לאטומים; החיווט (הזרקת-התקרה,
 *  סדר-המיון, מילון-התוויות) חי כאן, לא בחוטים.
 *  שקעי-IO מוזרקים (מתועדים, לא ממומשים): todayIso ל-supportDayLabel (הרכיב מזרים
 *  isoToday() — טוהר, בלי Date.now). אין DOM/localStorage/fetch/ענן — הלִיבּ טהור. */
import { SUPPORT_MSG_MAX } from '../atoms/support-msg-max.mjs';
import { sanitizeSupportText as __pure_sanitizeSupportText } from '../atoms/sanitize-support-text.mjs';
import { SANITIZE_SUPPORT_TEXT_T as __d_sanitize_support_text_T } from '../atoms/sanitize-support-text-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const _sanitizeSupportText = (...a) => __pure_sanitizeSupportText(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_sanitize_support_text_T);
import { isSendableSupportText as _isSendableSupportText } from '../atoms/is-sendable-support-text.mjs';
import { sortSupportMsgs } from '../atoms/sort-support-msgs.mjs';
import { supportMsgTime as __pure_supportMsgTime } from '../atoms/support-msg-time.mjs';
import { SUPPORT_MSG_TIME_T as __d_supportMsgTime_SUPPORT_MSG_TIME_T } from '../atoms/support-msg-time-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supportMsgTime = (...a) => __pure_supportMsgTime(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_supportMsgTime_SUPPORT_MSG_TIME_T);
import { supportDayLabel as __pure_supportDayLabel } from '../atoms/support-day-label.mjs';
import { SUPPORT_DAY_LABEL_T as __d_supportDayLabel_SUPPORT_DAY_LABEL_T } from '../atoms/support-day-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supportDayLabel = (...a) => __pure_supportDayLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_supportDayLabel_SUPPORT_DAY_LABEL_T);
import { supportPreview as __pure_supportPreview } from '../atoms/support-preview.mjs';
import { SUPPORT_PREVIEW_T as __d_support_preview_T } from '../atoms/support-preview-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const supportPreview = (...a) => __pure_supportPreview(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_support_preview_T);
import { supportUnread as __pure_supportUnread } from '../atoms/support-unread.mjs';
import { SORT_SUPPORT_THREADS_T as __d_supportUnread_SUPPORT_UNREAD_T } from '../atoms/sort-support-threads-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supportUnread = (...a) => __pure_supportUnread(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_supportUnread_SUPPORT_UNREAD_T);
import { sortTeamMsgs } from '../atoms/sort-team-msgs.mjs';
import { SUPPORT_CHAT_TERMS } from '../atoms/support-chat-terms.mjs';

// ── החיווט (גרף-הקריאות של supportChat.ts, סוקטים מוזרקים) ──
// תקרת-האורך = הכרעת-קופסה: האטום מקבל שקע, הקופסה מזריקה את SUPPORT_MSG_MAX (מקור:36-38).
const sanitizeSupportText = (raw) => _sanitizeSupportText(raw, SUPPORT_MSG_MAX);
// isSendable מקבל את ה-sanitize המחווט (השכן module-private במקור:41-43 — חוק-3).
const isSendableSupportText = (raw) => _isSendableSupportText(raw, sanitizeSupportText);

// מיון רשימת-השיחות — ההכרעה (סדר-הקסקדה) חיה כאן (LAW תיקון-5): "לא-נקרא-לתמיכה"
// קודם, ואז lastAt יורד. supportUnread הוא אטום מוזרק (האטום sort-support-threads
// מפנה שכן חופשי ⇒ לא ניתן-להזרקה; הסדר שייך לקופסה). verbatim מ-supportChat.ts:104-115.
const sortSupportThreads = (threads) =>
  [...threads].sort((a, b) => {
    const ua = supportUnread(a, SUPPORT_CHAT_TERMS.k1);
    const ub = supportUnread(b, SUPPORT_CHAT_TERMS.k1);
    if ((ua > 0) !== (ub > 0)) return ua > 0 ? -1 : 1; // לא-נקרא ראשון
    const la = a.lastAt ?? '';
    const lb = b.lastAt ?? '';
    return la < lb ? 1 : la > lb ? -1 : 0; // חדש ראשון
  });

// ── החשיפה (ה-API הפומבי, ביט-זהה לחתימות supportChat.ts) ──
export {
  SUPPORT_MSG_MAX,
  sanitizeSupportText,
  isSendableSupportText,
  sortSupportMsgs,
  supportMsgTime,
  supportDayLabel,
  supportPreview,
  supportUnread,
  sortTeamMsgs,
  sortSupportThreads,
};
