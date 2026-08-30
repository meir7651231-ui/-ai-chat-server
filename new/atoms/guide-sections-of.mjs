/** חוט · guide-sections-of — שורות-המדריך למצב-מערכת: סינון לפי מודולים פעילים
 *  ‏(שורה בלי מודול תמיד נשארת) + תרגום מונחי-ישות פר-עסק בכותרות ובגוף.
 *  חוזה: guide-sections-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/guide.ts:101-115 (‏guideSections); השכנים
 *  GUIDE_SECTIONS·termOf·swap הוזרקו כשקעים (חוק-1 — אפס import פנימי).
 *  השם guide-sections-of — כי guide-sections במחסן הוא אטום-הקבוע (הנתונים). */
export function guideSections(isModuleOn, config, sections, termOf, swap, T2) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  const loc = (s) => {
    let { title, text } = s;
    if (title === T2.k1) title = T2.k2 + T(T2.k3, T2.k4);
    text = swap(text, T2.k5, T(T2.k6, T2.k7) + T2.k8);
    text = swap(text, T2.k9, T2.k10 + T(T2.k11, T2.k12));
    text = swap(text, T2.k13, T2.k14 + T(T2.k15, T2.k16));
    text = swap(text, T2.k17, T2.k18 + T(T2.k19, T2.k20));
    text = swap(text, T2.k21, '＋ ' + T(T2.k22, T2.k23));
    text = swap(text, T2.k24, T2.k25 + T(T2.k3, T2.k4));
    return title === s.title && text === s.text ? s : { ...s, title, text };
  };
  return sections.filter((s) => !s.module || isModuleOn(s.module)).map(loc);
}
