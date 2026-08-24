/** חוט · model-meta — תווית + צבעי מסלול-התמחור של חוג (punch משבץ size;
 *  לא-מוכר ⇒ 'מנוי חודשי'). חוזה: model-meta.contract.md · שקעים: אין.
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:200-206. */
export function modelMeta(c) {
  if (c.model === 'punch')
    return { label: 'כרטיסייה · ' + c.size + ' ניקובים', bg: '#fdf1d4', c: '#9a6414' };
  if (c.model === 'half_year')
    return { label: 'מנוי חצי-שנתי', bg: '#e7edf5', c: '#3a5a86' };
  if (c.model === 'year')
    return { label: 'מנוי שנתי', bg: '#efe7f3', c: '#7c3aed' };
  return { label: 'מנוי חודשי', bg: '#e4f5ea', c: '#12803c' };
}
