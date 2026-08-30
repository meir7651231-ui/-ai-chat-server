/** חוט · create-cloud-key — יצירת envelope-מפתח לענן + DEK חי. חוזה: create-cloud-key.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudCrypto.ts:64-71; השכנים encryptDb/openDek
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export async function createCloudKey(password, recoveryKey, encryptDb, openDek, T) {
  const env = await encryptDb('', password, recoveryKey);
  const dek = await openDek(env, password, T.k1);
  if (!dek) throw new Error(T.k2);
  return { env, dek };
}
