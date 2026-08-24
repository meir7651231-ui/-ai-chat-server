/** קופסת-חיבורים · dedup — זיהוי-כפילויות ומיזוג משפחות/תורמים. חוזה: dedup.contract.md
 *  זה המקום היחיד שבו חוטי-הדדופ נפגשים (חוקי-החשמלאי, LAW.md). מקור-האמת:
 *  maor/src/lib/dedup.ts — 13 החוטים חולצו לאטומים; החיווט (סדר-הזרקות, ברירות-
 *  מחדל, מילון-התוויות NAME_TITLES) חי כאן, לא בחוטים.
 *  שקעי-IO אמיתיים: אין — dedup טהור לגמרי (בלי DOM/localStorage/fetch/ענן). */
import { normPhone } from '../atoms/norm-phone.mjs';
import { normId } from '../atoms/norm-id.mjs';
import { findDuplicateGroups as _findDuplicateGroups } from '../atoms/find-duplicate-groups.mjs';
import { mergeFamilies as _mergeFamilies } from '../atoms/merge-families.mjs';
import { DUP_FIELDS } from '../atoms/dup-fields.mjs';
import { dupFieldValue } from '../atoms/dup-field-value.mjs';
import { mergeFamiliesByFields as _mergeFamiliesByFields } from '../atoms/merge-families-by-fields.mjs';
import { findSupporterDupGroups as _findSupporterDupGroups } from '../atoms/find-supporter-dup-groups.mjs';
import { mergeSupporterInto as _mergeSupporterInto } from '../atoms/merge-supporter-into.mjs';
import { mergeSupportersGroup as _mergeSupportersGroup } from '../atoms/merge-supporters-group.mjs';
import { SUP_DUP_FIELDS } from '../atoms/sup-dup-fields.mjs';
import { supDupFieldValue } from '../atoms/sup-dup-field-value.mjs';
import { mergeSupportersByFields as _mergeSupportersByFields } from '../atoms/merge-supporters-by-fields.mjs';
import { mergeHist } from '../atoms/merge-hist.mjs';
import { PHOTO_MAX } from '../atoms/photo-max.mjs';
import { nameSortKey as _nameSortKey } from '../atoms/name-sort-key.mjs';
import { normSearch } from '../atoms/norm-search.mjs';

// ── מילון-החיווט (הכרעות שחיות בקופסה, verbatim מהמקור) ──
// תארים/כינויי-כבוד עבריים למפתח-שם חסין-סדר (validate.ts:73-80). מילון-תוויות
// = ידע-קופסה (חוק-5) — לא אטום; מוזרק ל-name-sort-key.
const NAME_TITLES = new Set([
  'ר', 'רבי', 'הרב', 'הרבנית', 'הרהג', 'הרהח', 'הגר', 'מוהרר', 'אדמור', 'מרת', 'מר', 'גב', 'הגב',
  'דר', 'פרופ', 'הבחור', 'הבהח', 'הת', 'משפ', 'משפחת',
  'שליטא', 'זצל', 'זצוקל', 'זקל', 'זל', 'עה', 'היד', 'נרו', 'ניו', 'ני', 'היו',
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
