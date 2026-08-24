/** 🔌 חוט · resolve-org-config — מיזוג-עדיפויות ענן > סטטי > ברירת-מחדל:
 *  קונפיג-הענן גובר, אך ה-slug נשאר של הכתובת ו-firebase נשמר מהסטטי כשהענן לא מגדיר.
 *  ‏cloudRaw לא-שמיש ⇒ הסטטי כמות-שהוא (אפס-שינוי כשאין ענן — ratchet).
 *  מוצא: maor/src/lib/config.ts:803-810 כלשונו; ‏normalizeConfig הוזרק כשקע (חוק-1). */
/** @param normalizeConfig שקע: (raw)=>OrgConfig|null — מחטא-הקונפיג */
export function resolveOrgConfig(staticCfg, cloudRaw, normalizeConfig) {
  const cloud = normalizeConfig(cloudRaw);
  if (!cloud) return staticCfg;
  const merged = { ...cloud, slug: staticCfg.slug };
  if (!merged.firebase && staticCfg.firebase) merged.firebase = staticCfg.firebase;
  return merged;
}
