/** חוט · create-cloud-key — יצירת envelope-מפתח לענן + DEK חי. חוזה: create-cloud-key.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudCrypto.ts:64-71; השכנים encryptDb/openDek
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export async function createCloudKey(password, recoveryKey, encryptDb, openDek) {
  const env = await encryptDb('', password, recoveryKey);
  const dek = await openDek(env, password, 'pass');
  if (!dek) throw new Error('יצירת מפתח-הצפנה נכשלה');
  return { env, dek };
}
