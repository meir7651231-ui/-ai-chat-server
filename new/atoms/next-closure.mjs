/** חוט · next-closure — הסגירה ההלכתית הבאה (שבת/יו״ט, חלון 10 ימים) לווידג'ט-הבית.
 *  חוזה: next-closure.contract.md
 *  חולץ כלשונו מ-maor/src/components/telephony/lib.ts:186-198; השכנים
 *  hebrewClosedWindows (מנוע-הזמנים) ו-CITIES (מילון-ערים) הוזרקו כשקעים
 *  (חוק-1 — אפס import פנימי). */
export function nextClosure(config, todayIso, hebrewClosedWindows, CITIES) {
  const tel = config.telephony;
  if (!tel) return null;
  const city = tel.city || 'default';
  const tenant = { city, timezone: 'Asia/Jerusalem' };
  const wins = hebrewClosedWindows(todayIso, 10, tenant, {});
  const w = wins[0];
  if (!w) return null;
  const cityHe = (tel.city && CITIES[tel.city]) ? CITIES[tel.city].he : CITIES.jerusalem.he;
  return { reason: w.reason, kind: w.kind, startIso: w.startIso, candle: w.startTime, endIso: w.endIso, tzeis: w.endTime, cityHe };
}
