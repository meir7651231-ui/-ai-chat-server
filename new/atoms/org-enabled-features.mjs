/** חוט · org-enabled-features — תת-הדגלים שהמנהל מחלק לעובדות (עקרון-התקרה).
 *  חוזה: org-enabled-features.contract.md · שקעים: allModules, orgEnabledModules.
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts (קריאות-השכנים שוקעו). */
export function orgEnabledFeatures(orgConfig, features, allModules, orgEnabledModules) {
  const enabledMods = new Set(orgEnabledModules(orgConfig, allModules));
  return features.filter((f) => {
    const isRealModule = allModules.includes(f.module);
    if (isRealModule && !enabledMods.has(f.module)) return false; // מודול-אב כבוי
    // דגל-opt-in (תיקון 21.8, ממצא-נחיל): חסר = **כבוי** — הקריאה הגולמית `=== false`
    // הציגה למנהל צ'יפ-עובד ליכולת שהארגון מעולם לא הדליק/קנה (13 דגלי-opt-in).
    if (f.optIn === true) return orgConfig.features?.[f.key] === true;
    return orgConfig.features?.[f.key] !== false; // דגל רגיל: רק false מכבה
  });
}
