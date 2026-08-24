/** בדיקת-חוזה · expand-query — דו-כיווניות · נירמול-דרך-שקע · ריק · דדופ. */
import { expandQuery } from './expand-query.mjs';
import assert from 'node:assert';

const norm = (s) => String(s || '').trim().toLowerCase().replace(/ם/g, 'מ').replace(/ן/g, 'נ');
const XLAT = { 'שלום': ['shalom', 'שלומ'], 'בני ברק': ['bnei brak'] };

// 1) מפתח ⇒ כינויים (q ראשונה)
assert.deepStrictEqual(expandQuery('שלום', norm, XLAT), ['שלום', 'shalom', 'שלומ']);
// 2) כינוי ⇒ מפתח
assert.deepStrictEqual(expandQuery('SHALOM', norm, XLAT), ['SHALOM', 'שלום']);
// 3) נירמול-דרך-שקע: סופית ⇒ מזוהה כמפתח ⇒ כינויים בלבד (המפתח לא מתווסף —
//    ענף-המפתח דוחף aliases בלבד; 'שלומ' הכפול נבלע ב-Set) — כלשון-המקור (L4)
assert.deepStrictEqual(expandQuery('שלומ', norm, XLAT), ['שלומ', 'shalom']);
// 4) ריק/לא-במילון ⇒ [q]
assert.deepStrictEqual(expandQuery('', norm, XLAT), ['']);
assert.deepStrictEqual(expandQuery('אבץ', norm, XLAT), ['אבץ']);
// 5) רב-מילתי כמכלול
assert.deepStrictEqual(expandQuery('בני ברק', norm, XLAT), ['בני ברק', 'bnei brak']);
console.log('✓ expand-query');
