/** חוט · finder-axis-value — ערך-המשפחה בציר-צלילה נתון. חוזה: finder-axis-value.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:102-118; השכנים termOf/
 *  tierOf/famLiveEnrollments/STATUS_META הוזרקו כאובייקט-שקעים (חוק-1). */
export function finderAxisValue(db, f, axis, config, { termOf, tierOf, famLiveEnrollments, STATUS_META }) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  switch (axis) {
    case 'city': return f.city || '';
    case 'comm': return f.community || '';
    case 'marital': return f.maritalStatus || 'לא ידוע';
    case 'status': return STATUS_META[f.status].label;
    case 'cred': return tierOf(f.cred?.score ?? 700).label;
    case 'kids': return f.members.some((m) => !m.isParent) ? 'עם ילדים' : 'בלי ילדים';
    case 'enrolled': return famLiveEnrollments(db, f).length ? 'משתתפות ב' + T('nav.courses', 'חוגים') : 'לא משתתפות';
    case 'sefach': return f.fullSefach ? 'קיים' : 'חסר';
    case 'lang': return f.language || '';
    default: return '';
  }
}
