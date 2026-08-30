/** חוט · telephony-to-tenant — תצורת-אשף-טלפוניה ⇒ raw-tenant למנוע (config-as-data);
 *  ערוצי-שער מוקצים אוטומטית ל-SIM-ים.
 *  חוזה: telephony-to-tenant.contract.md
 *  חולץ כלשונו מ-maor/src/components/telephony/lib.ts:68-132; מפות ONRAMP/CHANNELS
 *  (קבועים פרטיים-למודול, שורות 23-31) הוטמעו כאן. אפס import פנימי. */

export function telephonyToTenant(tc, orgName, tenantId, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const ONRAMP = {
    sim: T.k1,
    virtual: T.k2,
    whatsapp: T.k3,
  };
  const CHANNELS = {
    sim: [T.k4],
    virtual: [T.k4],
    whatsapp: [T.k5],
  };

  let gw = 0;
  const numbers = (tc.numbers || [])
    .filter((n) => n.e164 && n.e164.trim())
    .map((n) => {
      const base = {
        id: n.id,
        e164: n.e164.trim(),
        label: n.label || n.id,
        type: n.kind,
        onramp: ONRAMP[n.kind],
        channels: CHANNELS[n.kind],
        ...(n.kosher ? { kosher: true } : {}),
      };
      if (n.kind === T.k6) { gw += 1; base.gatewayChannel = gw; }
      return base;
    });
  const firstSim = numbers.find((n) => n.onramp === T.k1);
  const features = {
    'voice.kosher': tc.kosherMode,
    'calendar.hebrew': tc.hebrewCalendar,
    'calendar.shabbat': tc.shabbat,
    'calendar.fasts': tc.fasts,
    'calendar.zmanim': tc.zmanim,
    voicemail: tc.voicemail,
  };
  return {
    tenantId,
    orgName: orgName || T.k7,
    timezone: T.k8,
    ...(tc.city ? { city: tc.city } : {}),
    officeHours: { days: [...tc.officeDays].sort((a, b) => a - b), start: tc.officeStart, end: tc.officeEnd },
    numbers,
    destinations: {
      office: { ext: [tc.officeExt], ringSeconds: 25 },
      manager: { ext: tc.managerExt, ringSeconds: 30 },
      voicemail: { box: tc.vmBox },
    },
    outbound: { defaultNumberId: firstSim ? firstSim.id : (numbers[0]?.id ?? 'n1') },
    cti: { org: tenantId, mode: T.k9 },
    features,
  };
}
