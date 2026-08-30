/** חוט · hash-pin — גיבוב קוד-נעילה ל-hex של SHA-256 עם מלח מוזרק.
 *  חוזה: hash-pin.contract.md · חולץ כלשונו מ-maor/src/lib/lock.ts:73-81;
 *  השכן SALT (קבוע-קובץ) הוזרק כשקע (חוק-1 + חוק-6 — קבוע-הצבה אינו אטום). */
export async function hashPin(pin, salt, T) {
  const data = new TextEncoder().encode(salt + pin);
  const buf = await crypto.subtle.digest(T.k1, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
