/** בדיקת-קצה · קופסת hebrew — מוכיחה את דוגמאות-החוזה (hebrew.contract.md) דרך הקופסה בלבד.
 *  DoD: node new/boxes/hebrew.test.mjs ⇒ exit 0. */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  gem, gemYear, adarNorm, hebAnnualEq, hebParts, hebPartsOfIso, hebDateFull, HOLIDAYS, holidayOf,
} from './hebrew.mjs';

// ── גימטריה ──
assert.strictEqual(gem(15), 'ט״ו');
assert.strictEqual(gem(16), 'ט״ז');
assert.strictEqual(gem(786), 'תשפ״ו');
assert.strictEqual(gem(1), 'א׳');
assert.strictEqual(gem(-3), '');
assert.strictEqual(gem(0), '');
assert.strictEqual(gem(NaN), '');
assert.strictEqual(gem(5786), 'פ״ו'); // אין אות למאות>900 — כמו במקור
assert.strictEqual(gemYear(5786), 'תשפ״ו');
assert.strictEqual(gemYear('5786'), 'תשפ״ו');

// ── דין-אדר לנרמול ──
assert.strictEqual(adarNorm('Adar II'), 'Adar');
assert.strictEqual(adarNorm('Adar I'), 'Adar I');
assert.strictEqual(adarNorm('Elul'), 'Elul');

// ── פירוק תאריך ──
assert.deepStrictEqual(hebPartsOfIso('2026-08-24'), { day: 11, month: 'Elul', year: 5786 });
assert.deepStrictEqual(hebPartsOfIso('2026-08-24'), { day: 11, month: 'Elul', year: 5786 }); // פגיעת-מטמון — אותו ערך
assert.deepStrictEqual(hebParts(new Date('zzz')), { day: 0, month: '', year: 0 }); // תאריך שבור ⇒ חלקים בטוחים

// ── תאריך מלא ──
assert.strictEqual(hebDateFull('2026-08-24'), 'י״א אלול תשפ״ו');
assert.strictEqual(hebDateFull(''), '');
assert.strictEqual(hebDateFull('junk'), '');

// ── שוויון-שנתי: כלל-ל' ──
assert.strictEqual(hebAnnualEq({ day: 30, month: 'Heshvan' }, { day: 1, month: 'Kislev', year: 5786 }), true);  // חשוון תשפ"ו חסר ⇒ נופל לא' כסלו
assert.strictEqual(hebAnnualEq({ day: 30, month: 'Heshvan' }, { day: 1, month: 'Kislev', year: 5785 }), false); // חשוון תשפ"ה מלא ⇒ אין נפילה

// ── שוויון-שנתי: דין-אדר ──
const adarB84 = hebPartsOfIso('2024-03-24'); // י"ד אדר-ב' תשפ"ד (מעוברת)
assert.deepStrictEqual(adarB84, { day: 14, month: 'Adar II', year: 5784 });
assert.strictEqual(hebAnnualEq({ day: 14, month: 'Adar' }, adarB84), true);   // עוגן-אדר-רגיל ⇒ אדר ב'
assert.strictEqual(hebAnnualEq({ day: 14, month: 'Adar I' }, adarB84), false); // עוגן-אדר-א' ⇒ לא אדר ב'
assert.strictEqual(hebAnnualEq({ day: 14, month: 'Adar II' }, hebPartsOfIso('2025-03-14')), true); // שנה פשוטה בולעת כל עוגן-אדר
assert.strictEqual(hebAnnualEq({ day: 14, month: 'Elul' }, adarB84), false); // אחד אדר והשני לא

// ── חגים ──
assert.strictEqual(HOLIDAYS['Nisan 15'], 'פסח');
assert.strictEqual(Object.keys(HOLIDAYS).length, 33);
const noon = (iso) => new Date(iso + 'T12:00:00');
assert.strictEqual(holidayOf(noon('2025-12-15')), 'חנוכה');
assert.strictEqual(holidayOf(noon('2023-12-15')), 'חנוכה');            // ג' טבת בשנה שכסלו חסר ⇒ יום ח' של חנוכה
assert.strictEqual(holidayOf(noon('2025-12-23')), null);               // ג' טבת בשנה שכסלו מלא ⇒ אין חג
assert.strictEqual(holidayOf(noon('2022-08-06')), null);               // ט' אב בשבת ⇒ הצום נדחה
assert.strictEqual(holidayOf(noon('2022-08-07')), 'תשעה באב (נדחה)');
assert.strictEqual(holidayOf(noon('2024-10-05')), null);               // ג' תשרי בשבת
assert.strictEqual(holidayOf(noon('2024-10-06')), 'צום גדליה (נדחה)');
assert.strictEqual(holidayOf(noon('2013-02-21')), 'תענית אסתר (מוקדם)');
assert.strictEqual(holidayOf(noon('2013-02-23')), null);               // י"ג אדר בשבת
assert.strictEqual(holidayOf(noon('2026-04-02')), 'פסח');
assert.strictEqual(holidayOf(noon('2026-08-24')), null);               // יום רגיל
assert.strictEqual(holidayOf(new Date('zzz')), null);                  // תאריך שבור ⇒ null, לא זריקה

/* 🛡 מגן-הכרעה (דפוס theme.test): הכרעות-החיווט חיות בקופסה verbatim. */
const src = readFileSync(new URL('./hebrew.mjs', import.meta.url), 'utf8');
for (const anchor of [
  'i < 440',                                        // חלון-הסריקה
  'hebYear - 3761',                                 // עוגן-השנה הלועזית
  'new Date(gy, 7, 1 + i, 12)',                     // 1 באוגוסט, צהריים
  'gemYearWire(y, gem)',                            // שקע-גימטריה
  'hebAnnualEqWire(anchor, query, scanHebYear)',    // שקע-סריקת-שנה
  'hebPartsOfIsoWire(iso, hebParts)',               // שקע-הפירוק
  'hebDateFullWire(iso, gem, gemYear, hebParts)',   // סדר-השקעים של התאריך-המלא
  'holidayOfWire(d, hebParts, scanHebYear, HOLIDAYS)', // סדר-השקעים של החגים
]) assert.ok(src.includes(anchor), `מגן-הכרעה: העוגן "${anchor}" נעלם ממקור-הקופסה`);
assert.ok(!/from\s+['"]\.\.?\/(?!atoms\/)/.test(src.replace(/\/\/[^\n]*/g, '')), 'מגן: הקופסה מייבאת רק מ-atoms');

console.log('✓ קופסת-hebrew: 9/9 חוטי lib-hebrew — גימטריה · פירוק · תאריך-מלא · כלל-ל\' · דין-אדר · 33 חגים + דיני-דחייה · מגן-הכרעה');
