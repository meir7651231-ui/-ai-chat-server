/** חוט · merge-families-by-fields — מיזוג-כפולים לפי בחירת-שדות (בסיס-בטוח + דריסה נבחרת).
 *  חוזה: merge-families-by-fields.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:224-256 (תורגם TS→JS); השכנים
 *  mergeFamilies + dupFieldValue + DUP_FIELDS הוזרקו כאובייקט-שקעים deps
 *  (חוק-1 — אפס import פנימי; שלושתם קיימים כחוטים עצמאיים). */
export function mergeFamiliesByFields(fams, pick, edit, deps) {
  const { mergeFamilies, dupFieldValue, dupFields } = deps;
  const base = mergeFamilies(fams[0], fams.slice(1));
  const out = { ...base };
  for (const def of dupFields) {
    const val = dupFieldValue(fams, def, pick, edit);
    switch (def.key) {
      case 'kidsHome':
        out.kidsHome = val === '' ? 0 : +val;
        break;
      case 'kidsMarried':
        out.kidsMarried = val === '' ? 0 : +val;
        break;
      case 'status':
        out.status = (val || base.status);
        break;
      case 'name':
        out.name = val;
        break;
      case 'mother':
        out.mother = val;
        break;
      case 'father':
        out.father = val;
        break;
      case 'phone':
        out.phone = val;
        break;
      case 'phone2':
        out.phone2 = val;
        break;
      case 'email':
        out.email = val;
        break;
      case 'city':
        out.city = val;
        break;
      case 'address':
        out.address = val;
        break;
      case 'motherId':
        out.motherId = val;
        break;
      case 'fatherId':
        out.fatherId = val;
        break;
      case 'community':
        out.community = val;
        break;
      case 'language':
        out.language = val;
        break;
      case 'maritalStatus':
        out.maritalStatus = val;
        break;
      case 'createdAt':
        out.createdAt = val;
        break;
      case 'notes':
        out.notes = val;
        break;
    }
  }
  return out;
}
