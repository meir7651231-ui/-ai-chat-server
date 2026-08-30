/** חוט · normalize-telephony — חיטוי תצורת-הטלפוניה (allowlist מלא + ברירות-מחדל).
 *  חוזה: normalize-telephony.contract.md · שקעים: telStr, telExt
 *  חולץ כלשונו מ-maor/src/lib/config.ts:169-211; השכנים telStr/telExt הוזרקו
 *  כשקעים (חוק-1 — אפס import פנימי); הקבועים TEL_KINDS/TEL_HHMM_RE שוכנו כאן. */

export function normalizeTelephony(raw, telStr, telExt, TEL_KINDS, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const TEL_HHMM_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!raw || typeof raw !== T.k1 || Array.isArray(raw)) return undefined;
  const t = raw;
  const numsRaw = Array.isArray(t.numbers) ? t.numbers.slice(0, 64) : [];
  const numbers = [];
  numsRaw.forEach((n, i) => {
    if (!n || typeof n !== T.k1 || Array.isArray(n)) return;
    const o = n;
    const kind = TEL_KINDS.includes(o.kind) ? o.kind : T.k2;
    const e164 = typeof o.e164 === T.k3 ? o.e164.replace(/[^\d+()\-\s]/g, '').trim().slice(0, 24) : '';
    const id = telStr(o.id, 32) || `n${i + 1}`;
    const num = { id, e164, label: telStr(o.label, 60) || id, kind };
    if (o.kosher === true) num.kosher = true;
    numbers.push(num);
  });
  const daysRaw = Array.isArray(t.officeDays) ? t.officeDays : [0, 1, 2, 3, 4];
  const officeDays = [
    ...new Set(daysRaw.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)),
  ].sort((a, b) => a - b);
  const bool = (v, def) => (typeof v === T.k4 ? v : def);
  const hhmm = (v, def) => (typeof v === T.k3 && TEL_HHMM_RE.test(v) ? v : def);
  // עיר — [a-z] בלבד, 2–20 תווים (תואם לקבלה של validate.mjs); אורך פסול ⇒ '' (מושמט,
  // לא נגזם — קלט חורג הוא זבל, עדיף נפילה לברירת-מחדל מאשר שם-עיר שגוי-שקט).
  const cityRaw = typeof t.city === T.k3 ? t.city.toLowerCase().replace(/[^a-z]/g, '') : '';
  return {
    // מתג-המקטע — opt-in: הכותרת נשמרת רק כשהיא true (חסר/false ⇒ כבוי, מושמט).
    ...(t.enabled === true ? { enabled: true } : {}),
    numbers,
    officeDays,
    officeStart: hhmm(t.officeStart, '09:00'),
    officeEnd: hhmm(t.officeEnd, '17:00'),
    officeExt: telExt(t.officeExt, '101'),
    managerExt: telExt(t.managerExt, '201'),
    vmBox: telExt(t.vmBox, '100'),
    city: cityRaw.length >= 2 && cityRaw.length <= 20 ? cityRaw : '',
    kosherMode: bool(t.kosherMode, false),
    hebrewCalendar: bool(t.hebrewCalendar, true),
    zmanim: bool(t.zmanim, false),
    shabbat: bool(t.shabbat, true),
    fasts: bool(t.fasts, false),
    voicemail: bool(t.voicemail, true),
  };
}
