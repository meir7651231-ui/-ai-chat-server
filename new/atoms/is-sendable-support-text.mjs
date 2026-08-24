/** חוט · is-sendable-support-text — האם טקסט-הודעה שליח (לא-ריק אחרי ניקוי). חוזה: is-sendable-support-text.contract.md
 *  חולץ כלשונו מ-maor/src/lib/supportChat.ts:41-44; השכן sanitizeSupportText
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function isSendableSupportText(raw, sanitizeSupportText) {
  return sanitizeSupportText(raw).length > 0;
}
