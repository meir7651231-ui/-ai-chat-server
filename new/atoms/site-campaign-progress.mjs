/** חוט · site-campaign-progress — התקדמות-קמפיין וספירה-לאחור של האתר-הציבורי
 *  (שונה מ-campaign-progress של הקופות): יעד/נאסף/אחוז-חסום/מטבע/ימים-נותרו/הצגה.
 *  ‏nowMs מוזרק (טהור/בדיק — אפס Date.now). חוזה: site-campaign-progress.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:218-236 (הפונקציה campaignProgress —
 *  שם-הקובץ site-campaign-progress כי הכינוי campaign-progress תפוס ע"י אטום-
 *  התרומות מ-tzedaka/lib.ts, גוף שונה לגמרי). isFinite=Number.isFinite (שפה). */
export function campaignProgress(c, nowMs, T) {
  const goal = typeof c?.goal === T.k1 && c.goal > 0 ? c.goal : 0;
  const raised = typeof c?.raised === T.k1 && c.raised > 0 ? c.raised : 0;
  const pct = goal > 0 ? Math.max(0, Math.min(T.k2, Math.round((raised / goal) * T.k2))) : 0;
  let daysLeft = null;
  if (c?.end) {
    // חצות-מקומי של יום-היעד (חלק-התאריך בלבד) — ספירת ימים קלנדרית: מ-1.9 ל-11.9
    // = 10 (ולא 11 שנוצר מחישוב סוף-יום). עבר ⇒ 0.
    const t = Date.parse(c.end.slice(0, T.k3) + 'T00:00:00');
    if (Number.isFinite(t)) {
      const diff = Math.ceil((t - nowMs) / T.k4);
      daysLeft = diff > 0 ? diff : 0;
    }
  }
  return { goal, raised, pct, currency: c?.currency || '₪', daysLeft, show: goal > 0 };
}
