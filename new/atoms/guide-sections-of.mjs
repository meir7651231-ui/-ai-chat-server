/** חוט · guide-sections-of — שורות-המדריך למצב-מערכת: סינון לפי מודולים פעילים
 *  ‏(שורה בלי מודול תמיד נשארת) + תרגום מונחי-ישות פר-עסק בכותרות ובגוף.
 *  חוזה: guide-sections-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/guide.ts:101-115 (‏guideSections); השכנים
 *  GUIDE_SECTIONS·termOf·swap הוזרקו כשקעים (חוק-1 — אפס import פנימי).
 *  השם guide-sections-of — כי guide-sections במחסן הוא אטום-הקבוע (הנתונים). */
export function guideSections(isModuleOn, config, sections, termOf, swap) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  const loc = (s) => {
    let { title, text } = s;
    if (title === 'כרטיס משפחה') title = 'כרטיס ' + T('entity.family', 'משפחה');
    text = swap(text, 'חדרים חיים', T('entity.rooms', 'חדרים') + ' חיים');
    text = swap(text, 'על חדר', 'על ' + T('entity.room', 'חדר'));
    text = swap(text, 'בתוך חוג', 'בתוך ' + T('entity.course', 'חוג'));
    text = swap(text, 'תדפיס למורה', 'תדפיס ל' + T('entity.teacher', 'מורה'));
    text = swap(text, '＋ תרומה', '＋ ' + T('entity.donation', 'תרומה'));
    text = swap(text, 'שיוך למשפחה', 'שיוך ל' + T('entity.family', 'משפחה'));
    return title === s.title && text === s.text ? s : { ...s, title, text };
  };
  return sections.filter((s) => !s.module || isModuleOn(s.module)).map(loc);
}
