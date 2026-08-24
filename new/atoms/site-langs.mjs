/** חוט · site-langs — רשימת השפות שהאתר-הציבורי מציע: ‏site.langs מסונן
 *  לשפות-מוכרות, בלי כפולים; ריק/חסר ⇒ ['he']. חוזה: site-langs.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:191-197; הקבוע-השכן SITE_LANGS
 *  (types/config — ['he','en','yi']) הוזרק כשקע-נתונים (חוק-1 — אפס import פנימי). */
export function siteLangs(site, knownLangs) {
  const raw = site?.langs?.filter((l) => knownLangs.includes(l)) ?? [];
  const uniq = [...new Set(raw)];
  return uniq.length ? uniq : ['he'];
}
