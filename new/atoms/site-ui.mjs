/** חוט · site-ui — תווית-הממשק של האתר-הציבורי לשפה+מפתח, עם נפילה כפולה
 *  לעברית (שפה לא-מוכרת ⇒ he; מפתח חסר בשפה ⇒ he; חסר גם שם ⇒ '').
 *  חוזה: site-ui.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:198-217; הקבוע-השכן SITE_UI
 *  (מילון-התוויות פר-שפה — קודם כאטום-נתונים site-ui-labels) הוזרק
 *  כשקע-נתונים (חוק-1 — אפס import פנימי). */
export function siteUi(lang, key, uiLabels) {
  return (uiLabels[lang] ?? uiLabels.he)[key] ?? uiLabels.he[key] ?? '';
}
