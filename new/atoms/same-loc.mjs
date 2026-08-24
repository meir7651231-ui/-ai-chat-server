/** חוט · same-loc — זהות שני מיקומי-ניווט (view · selFamilyId · selCourseId).
 *  חוזה: same-loc.contract.md
 *  חולץ כלשונו מ-maor/src/lib/navhist.ts:23-27. טהור — אפס שקעים. */
export function sameLoc(a, b) {
  return a.view === b.view && a.selFamilyId === b.selFamilyId && a.selCourseId === b.selCourseId;
}
