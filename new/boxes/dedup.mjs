/** קופסת-חיבורים · dedup — זיהוי-כפילויות ומיזוג משפחות/תורמים. חוזה: dedup.contract.md
 *  זה המקום היחיד שבו חוטי-הדדופ נפגשים (חוקי-החשמלאי, LAW.md). מקור-האמת:
 *  maor/src/lib/dedup.ts — 13 החוטים חולצו לאטומים; החיווט (סדר-הזרקות, ברירות-
 *  מחדל, מילון-התוויות NAME_TITLES) חי כאן, לא בחוטים.
 *  שקעי-IO אמיתיים: אין — dedup טהור לגמרי (בלי DOM/localStorage/fetch/ענן). */
import { normPhone } from '../atoms/norm-phone.mjs';
import { normId } from '../atoms/norm-id.mjs';
import { findDuplicateGroups as _findDuplicateGroups } from '../atoms/find-duplicate-groups.mjs';
import { mergeFamilies as __pure_mergeFamilies } from '../atoms/merge-families.mjs';
import { MERGE_FAMILIES_T as __d_mergeFamilies_MERGE_FAMILIES_T } from '../atoms/merge-families-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _mergeFamilies = (...a) => __pure_mergeFamilies(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_mergeFamilies_MERGE_FAMILIES_T);
import { makeDUP_FIELDS as __pure_makeDUP_FIELDS } from '../atoms/dup-fields.mjs';
import { DUP_FIELDS_T as __d_dup_fields_T } from '../atoms/dup-fields-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const DUP_FIELDS = __pure_makeDUP_FIELDS(__d_dup_fields_T);
import { dupFieldValue } from '../atoms/dup-field-value.mjs';
import { mergeFamiliesByFields as __pure_mergeFamiliesByFields } from '../atoms/merge-families-by-fields.mjs';
import { MERGE_FAMILIES_BY_FIELDS_T as __d_mergeFamiliesByFields_MERGE_FAMILIES_BY_FIELDS_T } from '../atoms/merge-families-by-fields-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _mergeFamiliesByFields = (...a) => __pure_mergeFamiliesByFields(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_mergeFamiliesByFields_MERGE_FAMILIES_BY_FIELDS_T);
import { findSupporterDupGroups as _findSupporterDupGroups } from '../atoms/find-supporter-dup-groups.mjs';
import { mergeSupporterInto as _mergeSupporterInto } from '../atoms/merge-supporter-into.mjs';
import { mergeSupportersGroup as _mergeSupportersGroup } from '../atoms/merge-supporters-group.mjs';
import { makeSUP_DUP_FIELDS as __pure_makeSUP_DUP_FIELDS } from '../atoms/sup-dup-fields.mjs';
import { SUP_DUP_FIELDS_T as __d_sup_dup_fields_T } from '../atoms/sup-dup-fields-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const SUP_DUP_FIELDS = __pure_makeSUP_DUP_FIELDS(__d_sup_dup_fields_T);
import { supDupFieldValue } from '../atoms/sup-dup-field-value.mjs';
import { mergeSupportersByFields as __pure_mergeSupportersByFields } from '../atoms/merge-supporters-by-fields.mjs';
import { MERGE_SUPPORTERS_BY_FIELDS_T as __d_mergeSupportersByFields_MERGE_SUPPORTERS_BY_FIELDS_T } from '../atoms/merge-supporters-by-fields-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _mergeSupportersByFields = (...a) => __pure_mergeSupportersByFields(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_mergeSupportersByFields_MERGE_SUPPORTERS_BY_FIELDS_T);
import { mergeHist } from '../atoms/merge-hist.mjs';
import { PHOTO_MAX } from '../atoms/photo-max.mjs';
import { nameSortKey as _nameSortKey } from '../atoms/name-sort-key.mjs';
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
import { DEDUP_TERMS } from '../atoms/dedup-terms.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);

// ── מילון-החיווט (הכרעות שחיות בקופסה, verbatim מהמקור) ──
// תארים/כינויי-כבוד עבריים למפתח-שם חסין-סדר (validate.ts:73-80). מילון-תוויות
// = ידע-קופסה (חוק-5) — לא אטום; מוזרק ל-name-sort-key.
const NAME_TITLES = new Set([
  DEDUP_TERMS.k1, DEDUP_TERMS.k2, DEDUP_TERMS.k3, DEDUP_TERMS.k4, DEDUP_TERMS.k5, DEDUP_TERMS.k6, DEDUP_TERMS.k7, DEDUP_TERMS.k8, DEDUP_TERMS.k9, DEDUP_TERMS.k10, DEDUP_TERMS.k11, DEDUP_TERMS.k12, DEDUP_TERMS.k13,
  DEDUP_TERMS.k14, DEDUP_TERMS.k15, DEDUP_TERMS.k16, DEDUP_TERMS.k17, DEDUP_TERMS.k18, DEDUP_TERMS.k19, DEDUP_TERMS.k20,
  DEDUP_TERMS.k21, DEDUP_TERMS.k22, DEDUP_TERMS.k23, DEDUP_TERMS.k24, DEDUP_TERMS.k25, DEDUP_TERMS.k26, DEDUP_TERMS.k27, DEDUP_TERMS.k28, DEDUP_TERMS.k29, DEDUP_TERMS.k30, DEDUP_TERMS.k31,
]);

// ── שקעי-הצמדה (glue) — שכנים module-private במקור, שלא קודמו כאטומים ──
// dedup.ts:33-36 — כל הטלפונים המנורמלים של משפחה (ראשי + נוסף), ≥7 ספרות.
const phonesOf = (f) => [normPhone(f.phone), normPhone(f.phone2)].filter((p) => p.length >= 7);
// dedup.ts:27-31 — מפתח שם+עיר מנורמל; שם+עיר חובה, אחרת ריק (סיכון מיזוג-שווא).
const nameCityKey = (f) => {
  const n = (f.name || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const c = (f.city || '').trim().toLowerCase();
  return n && c ? n + '|' + c : '';
};
// dedup.ts:262-266 — מפתח שם+עיר לתומך (זהה, שדות-תומך).
const supNameCityKey = (sp) => {
  const n = (sp.name || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const c = (sp.city || '').trim().toLowerCase();
  return n && c ? n + '|' + c : '';
};
// dedup.ts:88-97 — דה-דופ לפי מזהה, שומר מופע-ראשון.
const dedupById = (items) => {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  return out;
};
// מפתח-שם חסין-סדר: name-sort-key מוזרק normSearch (אטום) + NAME_TITLES (מילון-קופסה).
const nameSortKey = (t) => _nameSortKey(t, normSearch, NAME_TITLES);

// ── החיווט (גרף-הקריאות של dedup.ts, סוקטים מוזרקים) ──
const findDuplicateGroups = (families) => _findDuplicateGroups(families, phonesOf, nameCityKey);
const mergeFamilies = (keeper, losers) => _mergeFamilies(keeper, losers, { normPhone, dedupById });
const mergeFamiliesByFields = (fams, pick, edit) =>
  _mergeFamiliesByFields(fams, pick, edit, { mergeFamilies, dupFieldValue, dupFields: DUP_FIELDS });
const findSupporterDupGroups = (supporters) =>
  _findSupporterDupGroups(supporters, { normPhone, normId, supNameCityKey, nameSortKey });
const mergeSupporterInto = (keep, drop) => _mergeSupporterInto(keep, drop, mergeHist, PHOTO_MAX);
const mergeSupportersGroup = (keeper, losers) => _mergeSupportersGroup(keeper, losers, mergeSupporterInto);
const mergeSupportersByFields = (sups, pick, edit) =>
  _mergeSupportersByFields(sups, pick, edit, mergeSupportersGroup, supDupFieldValue, SUP_DUP_FIELDS);

// ── החשיפה (ה-API הפומבי, ביט-זהה לחתימות dedup.ts) ──
export {
  normPhone,
  normId,
  DUP_FIELDS,
  SUP_DUP_FIELDS,
  dupFieldValue,
  supDupFieldValue,
  findDuplicateGroups,
  mergeFamilies,
  mergeFamiliesByFields,
  findSupporterDupGroups,
  mergeSupporterInto,
  mergeSupportersGroup,
  mergeSupportersByFields,
};
