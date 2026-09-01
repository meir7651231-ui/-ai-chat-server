/** אטום-דאטה · chat-shelf — פירוק משפחת-Pure "chat" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/chat-family.html (אל תערוך ידנית — regen). */
export const PURE_CHAT_SHELF = {
 "family": "chat",
 "source": "machtzev/pure/chat-family.html",
 "count": 6,
 "atoms": [
  {
   "name": "MessageThread",
   "note": "in / out / system",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "Bubble states",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TypingIndicator",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "Composer",
   "note": "field + send",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "QuickReply",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DeliveryTicks",
   "note": "sent/delivered/read",
   "kind": "signature",
   "seam": "fields"
  }
 ]
};
