/** חוט · merge-families-by-fields — מיזוג-כפולים לפי בחירת-שדות (בסיס-בטוח + דריסה נבחרת).
 *  חוזה: merge-families-by-fields.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:224-256 (תורגם TS→JS); השכנים
 *  mergeFamilies + dupFieldValue + DUP_FIELDS הוזרקו כאובייקט-שקעים deps
 *  (חוק-1 — אפס import פנימי; שלושתם קיימים כחוטים עצמאיים). */
export function mergeFamiliesByFields(fams, pick, edit, deps, T) {
  const { mergeFamilies, dupFieldValue, dupFields } = deps;
  const base = mergeFamilies(fams[0], fams.slice(1));
  const out = { ...base };
  for (const def of dupFields) {
    const val = dupFieldValue(fams, def, pick, edit);
    switch (def.key) {
      case T.k1:
        out.kidsHome = val === '' ? 0 : +val;
        break;
      case T.k2:
        out.kidsMarried = val === '' ? 0 : +val;
        break;
      case T.k3:
        out.status = (val || base.status);
        break;
      case T.k4:
        out.name = val;
        break;
      case T.k5:
        out.mother = val;
        break;
      case T.k6:
        out.father = val;
        break;
      case T.k7:
        out.phone = val;
        break;
      case T.k8:
        out.phone2 = val;
        break;
      case T.k9:
        out.email = val;
        break;
      case T.k10:
        out.city = val;
        break;
      case T.k11:
        out.address = val;
        break;
      case T.k12:
        out.motherId = val;
        break;
      case T.k13:
        out.fatherId = val;
        break;
      case T.k14:
        out.community = val;
        break;
      case T.k15:
        out.language = val;
        break;
      case T.k16:
        out.maritalStatus = val;
        break;
      case T.k17:
        out.createdAt = val;
        break;
      case T.k18:
        out.notes = val;
        break;
    }
  }
  return out;
}
