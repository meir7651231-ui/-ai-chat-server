/** חוט · open-cloud-key — חילוץ DEK-ענן מ-envelope: האצלה שקופה לפותח-המעטפות.
 *  חוזה: open-cloud-key.contract.md · שקע: openDek
 *  חולץ כלשונו מ-maor/src/lib/cloudCrypto.ts:72-77; ה-import של openDek הוזרק
 *  כשקע (חוק-1 — אפס import פנימי). */
export function openCloudKey(env, secret, via, openDek) {
  return openDek(env, secret, via);
}
