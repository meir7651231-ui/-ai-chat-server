import { normSearch as __pure_normSearch } from './norm-search.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_normSearch_NORM_SEARCH_T = {
  k1: "כ",
  k2: "מ",
  k3: "נ",
  k4: "פ",
  k5: "צ",
};
const normSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
const C = [['שָׁלוֹם','שלומ'],['כהן ז"ל','כהנ זל'],['בֵּן־דָּוִד','בנדוד'],['ABC','abc'],['חוגים','חוגימ'],[null,''],['  יוסף ','יוספ']];
let f=0; for (const [a,w] of C) { const g=normSearch(a); if (g!==w){console.error(`✗ "${a}" ⇒ "${g}" ≠ "${w}"`);f=1;} }
if (f) process.exit(1); console.log(`✓ norm-search: ${C.length} דוגמאות-חוזה — ירוק`);
