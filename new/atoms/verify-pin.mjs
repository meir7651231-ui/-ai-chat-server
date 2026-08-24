/** חוט · verify-pin — בדיקת קוד-PIN מול גיבוב שמור. חוזה: verify-pin.contract.md
 *  חולץ כלשונו מ-maor/src/lib/lock.ts:82-85; השכן hashPin (גיבוב-עם-מלח,
 *  SHA-256⇒hex) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export async function verifyPin(pin, hash, hashPin) {
  if (!hash) return false;
  return (await hashPin(pin)) === hash;
}
