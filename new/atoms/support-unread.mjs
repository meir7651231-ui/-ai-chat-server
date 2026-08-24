/** חוט · support-unread — מספר "לא-נקרא" של צ'אט-תמיכה לצד נתון (לתג-מונה). לא-שלילי; חסר ⇒ 0.
 *  חוזה: support-unread.contract.md · חולץ כלשונו מ-maor/src/lib/supportChat.ts:82-86. */
export function supportUnread(thread, side) {
  if (!thread) return 0;
  const n = side === 'admin' ? thread.unreadAdmin : thread.unreadUser;
  return typeof n === 'number' && n > 0 ? n : 0;
}
