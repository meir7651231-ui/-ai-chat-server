/** חוט · safe-https-url — חיטוי URL ל-https בלבד. חוזה: safe-https-url.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts (safeHttpsUrl). ‏URL = API-שפה סטנדרטי. */
export function safeHttpsUrl(raw, T) {
  const t = (raw || '').trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    return u.protocol === T.k1 ? u.toString() : null;
  } catch {
    return null;
  }
}
