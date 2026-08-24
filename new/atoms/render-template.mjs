/** חוט · render-template — רינדור תבנית-הודעה: דריסת-ארגון גוברת, ריק ⇒ ברירת-מחדל,
 *  והחלפת משתני-{סוגריים} טקסטואלית.
 *  חוזה: render-template.contract.md
 *  חולץ כלשונו מ-maor/src/lib/templates.ts:57-67; קבוע-השכן TEMPLATE_DEFS
 *  הוזרק כשקע defs (חוק-1 + חוק-5 — נוסחי-ברירת-המחדל הם דאטת-חיווט). */
export function renderTemplate(cfg, key, vars, defs) {
  const def = defs.find((d) => d.key === key)?.def ?? '';
  let t = (cfg?.templates?.[key] ?? '').trim() || def;
  for (const [k, v] of Object.entries(vars)) t = t.split('{' + k + '}').join(v);
  return t;
}
