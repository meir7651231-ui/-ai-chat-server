/** חוט · telephony-to-tenant — תצורת-אשף-טלפוניה ⇒ raw-tenant למנוע (config-as-data);
 *  ערוצי-שער מוקצים אוטומטית ל-SIM-ים.
 *  חוזה: telephony-to-tenant.contract.md
 *  חולץ כלשונו מ-maor/src/components/telephony/lib.ts:68-132; מפות ONRAMP/CHANNELS
 *  (קבועים פרטיים-למודול, שורות 23-31) הוטמעו כאן. אפס import פנימי. */
const ONRAMP = {
  sim: 'sim-in-gateway',
  virtual: 'customer-forward',
  whatsapp: 'device-link',
};
const CHANNELS = {
  sim: ['voice'],
  virtual: ['voice'],
  whatsapp: ['whatsapp'],
};

export function telephonyToTenant(tc, orgName, tenantId) {
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
      if (n.kind === 'sim') { gw += 1; base.gatewayChannel = gw; }
      return base;
    });
  const firstSim = numbers.find((n) => n.onramp === 'sim-in-gateway');
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
    orgName: orgName || 'ארגון',
    timezone: 'Asia/Jerusalem',
    ...(tc.city ? { city: tc.city } : {}),
    officeHours: { days: [...tc.officeDays].sort((a, b) => a - b), start: tc.officeStart, end: tc.officeEnd },
    numbers,
    destinations: {
      office: { ext: [tc.officeExt], ringSeconds: 25 },
      manager: { ext: tc.managerExt, ringSeconds: 30 },
      voicemail: { box: tc.vmBox },
    },
    outbound: { defaultNumberId: firstSim ? firstSim.id : (numbers[0]?.id ?? 'n1') },
    cti: { org: tenantId, mode: 'directory' },
    features,
  };
}
