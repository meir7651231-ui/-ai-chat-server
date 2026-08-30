/** קופסת-חיבורים · חיפוש — מחווטת את חוטי-החיפוש. חוזה: search.contract.md
 *  זה המקום היחיד שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md). */
import { levenshtein } from '../atoms/levenshtein.mjs';
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
import { expandQuery } from '../atoms/xlat.mjs';
import { ruleExact } from '../atoms/rule-exact.mjs';
import { rulePrefix } from '../atoms/rule-prefix.mjs';
import { rulePlural as __pure_rulePlural } from '../atoms/rule-plural.mjs';
import { RULE_PLURAL_T as __d_rulePlural_RULE_PLURAL_T } from '../atoms/rule-plural-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const rulePlural = (...a) => __pure_rulePlural(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rulePlural_RULE_PLURAL_T);
import { ruleContains } from '../atoms/rule-contains.mjs';
import { ruleSkeleton } from '../atoms/rule-skeleton.mjs';
import { ruleTypo } from '../atoms/rule-typo.mjs';
import { smartScore } from '../atoms/smart-score.mjs';
import { smartFilter } from '../atoms/smart-filter.mjs';

// ── החיווט ──
// הקסקדה: הסדר הזה הוא *המשמעות* — והוא חי כאן, לא בחוטים (הכרעת-בעלים).
// שינוי-דירוג = סידור-מחדש של השורות האלה, אפס נגיעה בכללים עצמם.
const CASCADE = [ruleExact, rulePrefix, rulePlural, ruleContains, ruleSkeleton,
  (nq, nt) => ruleTypo(nq, nt, levenshtein)];
const wiredScore = (q, term) => {
  const nq = normSearch(q), nt = normSearch(term);
  if (!nq || !nt) return 0;
  for (const rule of CASCADE) { const s = rule(nq, nt); if (s != null) return s; }
  return 0;
};
const wiredExpand = (q, norm)  => expandQuery(q, norm || normSearch);
const wiredSmart  = (q, terms) => smartScore(q, terms, normSearch, wiredExpand, wiredScore);

// ── החשיפה ──
export const score  = wiredSmart;
export const expand = (q) => wiredExpand(q);
export const search = (q, items, getTerms, limit) =>
  smartFilter(q, items, getTerms, (x) => !!normSearch(x), wiredSmart, limit);
