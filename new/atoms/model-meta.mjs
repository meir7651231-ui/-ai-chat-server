/** חוט · model-meta — תווית + צבעי מסלול-התמחור של חוג (punch משבץ size;
 *  לא-מוכר ⇒ 'מנוי חודשי'). חוזה: model-meta.contract.md · שקעים: אין.
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:200-206. */
export function modelMeta(c, T) {
  if (c.model === T.k1)
    return { label: T.k2 + c.size + T.k3, bg: T.k4, c: '#9a6414' };
  if (c.model === T.k5)
    return { label: T.k6, bg: T.k7, c: '#3a5a86' };
  if (c.model === T.k8)
    return { label: T.k9, bg: T.k10, c: T.k11 };
  return { label: T.k12, bg: '#e4f5ea', c: '#12803c' };
}
