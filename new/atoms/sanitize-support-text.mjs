/** חוט · sanitize-support-text — ניקוי טקסט-הודעת-צ׳אט: קיצוץ רווחי-קצה +
 *  חיתוך-לתקרה. חוזה: sanitize-support-text.contract.md
 *  חולץ כלשונו מ-maor/src/lib/supportChat.ts:36-38; השכן SUPPORT_MSG_MAX הוזרק
 *  כשקע supportMsgMax (חוק-1; ברירת-מחדל 2000 = ערך-המוצא, מקביל ל-Rules). */
export function sanitizeSupportText(raw, supportMsgMax , T) {
  if (supportMsgMax === undefined) supportMsgMax = T.k1;
  return (raw ?? '').replace(/\s+$/u, '').replace(/^\s+/u, '').slice(0, supportMsgMax);
}
