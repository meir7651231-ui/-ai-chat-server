/** קופסת-חיבורים · חיפוש — מחווטת את חוטי-החיפוש. חוזה: search.contract.md
 *  זה המקום היחיד שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md). */
import { levenshtein } from '../atoms/levenshtein.mjs';
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
import { expandQuery } from '../atoms/xlat.mjs';
import { ruleExact as __pure_ruleExact } from '../atoms/rule-exact.mjs';
import { RULE_EXACT_T as __d_rule_exact_T } from '../atoms/rule-exact-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const ruleExact = (...a) => __pure_ruleExact(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rule_exact_T);
import { rulePrefix as __pure_rulePrefix } from '../atoms/rule-prefix.mjs';
import { RULE_PREFIX_T as __d_rule_prefix_T } from '../atoms/rule-prefix-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const rulePrefix = (...a) => __pure_rulePrefix(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rule_prefix_T);
import { rulePlural as __pure_rulePlural } from '../atoms/rule-plural.mjs';
import { RULE_PLURAL_T as __d_rulePlural_RULE_PLURAL_T } from '../atoms/rule-plural-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const rulePlural = (...a) => __pure_rulePlural(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rulePlural_RULE_PLURAL_T);
import { ruleContains as __pure_ruleContains } from '../atoms/rule-contains.mjs';
import { RULE_CONTAINS_T as __d_rule_contains_T } from '../atoms/rule-contains-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const ruleContains = (...a) => __pure_ruleContains(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rule_contains_T);
import { ruleSkeleton as __pure_ruleSkeleton } from '../atoms/rule-skeleton.mjs';
import { RULE_SKELETON_T as __d_rule_skeleton_T } from '../atoms/rule-skeleton-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const ruleSkeleton = (...a) => __pure_ruleSkeleton(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rule_skeleton_T);
import { ruleTypo as __pure_ruleTypo } from '../atoms/rule-typo.mjs';
import { RULE_TYPO_T as __d_rule_typo_T } from '../atoms/rule-typo-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const ruleTypo = (...a) => __pure_ruleTypo(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_rule_typo_T);
import { smartScore as __pure_smartScore } from '../atoms/smart-score.mjs';
import { SMART_SCORE_T as __d_smart_score_T } from '../atoms/smart-score-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const smartScore = (...a) => __pure_smartScore(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_smart_score_T);
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
