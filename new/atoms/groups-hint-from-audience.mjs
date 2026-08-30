/** חוט · groups-hint-from-audience — הצעת מספר-קבוצות מטקסט קהל-היעד
 *  ‏(regex 'קבוצות|פעמים' מהלגאסי); הצעה בלבד, מחוץ ל-2–12 ⇒ null.
 *  חוזה: groups-hint-from-audience.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:92-97 — אפס שקעים
 *  ‏(parseInt = שפה/סטנדרט, מותר לפי חוק-1). */
export function groupsHintFromAudience(audience, T) {
  const m = (audience || '').match(/(\d+)\s*(?:קבוצות|פעמים)/);
  if (!m) return null;
  const n = parseInt(m[1], T.k1);
  return n >= 2 && n <= T.k2 ? n : null;
}
