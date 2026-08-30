/** בדיקת-קצה של קופסת-האימות — דוגמאות-החוזה עצמן, דרך הקופסה בלבד. */
import { validIsraeliId, normalizePhone, formatIsraeliPhone, normSearch, normName, nameSortKey } from './validate.mjs';
const VALIDATE_TERMS = {
  k1: "ר",
  k2: "רבי",
  k3: "הרב",
  k4: "הרבנית",
  k5: "הרהג",
  k6: "הרהח",
  k7: "הגר",
  k8: "מוהרר",
  k9: "אדמור",
  k10: "מרת",
  k11: "מר",
  k12: "גב",
  k13: "הגב",
  k14: "דר",
  k15: "פרופ",
  k16: "הבחור",
  k17: "הבהח",
  k18: "הת",
  k19: "משפ",
  k20: "משפחת",
  k21: "שליטא",
  k22: "זצל",
  k23: "זצוקל",
  k24: "זקל",
  k25: "זל",
  k26: "עה",
  k27: "היד",
  k28: "נרו",
  k29: "ניו",
  k30: "ני",
  k31: "היו",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
let f = 0;
const eq = (name, got, want) => {
  if (got !== want) { console.error(`✗ ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};

// ת"ז (validate.ts:4-16)
eq("ת\"ז תקינה", validIsraeliId('123456782'), true);
eq("ת\"ז עם רווחים (trim)", validIsraeliId(' 123456782 '), true);
eq("ת\"ז ספרת-ביקורת שגויה", validIsraeliId('123456789'), false);
eq("ת\"ז 5 ספרות מרופדת", validIsraeliId('19000'), true);
eq("ת\"ז אפסים-בלבד", validIsraeliId('000000000'), false);
eq("ת\"ז קצרה מדי", validIsraeliId('1234'), false);
eq("ת\"ז לא-ספרתית", validIsraeliId('abc12345'), false);

// נרמול-טלפון (validate.ts:19-24)
eq('נרמול רווח/מקף', normalizePhone('050-123 4567'), '0501234567');
eq('נרמול ‎+972', normalizePhone('+972-50-1234567'), '0501234567');
eq('נרמול 972 בלי פלוס', normalizePhone('972501234567'), '0501234567');
eq('נרמול ריק', normalizePhone(''), '');
try { normalizePhone(null); console.error('✗ normalizePhone(null) חייב לזרוק (נאמנות-למקור, שורה 22)'); f = 1; } catch {}

// עיצוב-טלפון (validate.ts:33-48)
eq('עיצוב 9 בלי 0', formatIsraeliPhone('501234567'), '050-1234567');
eq('עיצוב 8 בלי 0', formatIsraeliPhone('21234567'), '02-1234567');
eq('עיצוב 10 עם 0', formatIsraeliPhone('0501234567'), '050-1234567');
eq('עיצוב 9 עם 0', formatIsraeliPhone('025678901'), '02-5678901');
eq('עיצוב 00972', formatIsraeliPhone('00972 2 5678901'), '02-5678901');
eq('עיצוב 972', formatIsraeliPhone('972-50-1234567'), '050-1234567');
eq('עיצוב ריק', formatIsraeliPhone(''), '');
eq('עיצוב בלי ספרות', formatIsraeliPhone('abc'), 'abc');
eq('עיצוב אורך חריג', formatIsraeliPhone('12345'), '12345');

// נרמול-חיפוש (validate.ts:51-58)
eq('ניקוד+סופית ם', normSearch('שָׁלוֹם'), 'שלומ');
eq('סופיות', normSearch('חיים כץ'), 'חיימ כצ');
eq('גרשיים+מקף', normSearch('ד"ר לוי-כהן'), 'דר לויכהנ');
eq('lowercase', normSearch('ABC Def'), 'abc def');
eq('trim', normSearch('  רווח  '), 'רווח');
eq('null ⇒ ריק', normSearch(null), '');
eq('undefined ⇒ ריק', normSearch(undefined), '');

// נרמול-שם (validate.ts:65-67) — חסין-רווחים
eq('בן דוד ≡ בןדוד', normName('בן דוד'), 'בנדוד');
eq('שוויון חסין-רווחים', normName('בן דוד'), normName('בןדוד'));

// מפתח-שם (validate.ts:85-90) — חסין-סדר + תארים
eq('חסין-סדר', nameSortKey('רחל בן צבי'), 'בנ צבי רחל');
eq('נדרים≡מאור', nameSortKey('בן צבי רחל'), nameSortKey('רחל בן צבי'));
eq('תואר+סיומת-כבוד', nameSortKey('הרב יוסף כהן שליטא'), 'יוספ כהנ');
eq('מרים לא נחתכת', nameSortKey('מרים כהן'), 'כהנ מרימ');
eq('בן=פטרונים נשמר', nameSortKey('בן ציון'), 'בנ ציונ');
eq('תואר-בלבד ⇒ ריק', nameSortKey(VALIDATE_TERMS.k3), '');
eq('ריק ⇒ ריק', nameSortKey(''), '');

/* 🛡 מגן-הכרעה (דפוס theme.test): מילון-התארים = הכרעת-הקופסה, verbatim מהמקור
   (validate.ts:73-78) — 31 טוקנים, בלי בן/בר; והחיווט מזריק normSearch לשני החוטים. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./validate.mjs', import.meta.url), 'utf8');
const TITLES_VERBATIM =
  "VALIDATE_TERMS.k1, VALIDATE_TERMS.k2, VALIDATE_TERMS.k3, VALIDATE_TERMS.k4, VALIDATE_TERMS.k5, VALIDATE_TERMS.k6, VALIDATE_TERMS.k7, VALIDATE_TERMS.k8, VALIDATE_TERMS.k9, VALIDATE_TERMS.k10, VALIDATE_TERMS.k11, VALIDATE_TERMS.k12, VALIDATE_TERMS.k13,\n" +
  "  VALIDATE_TERMS.k14, VALIDATE_TERMS.k15, VALIDATE_TERMS.k16, VALIDATE_TERMS.k17, VALIDATE_TERMS.k18, VALIDATE_TERMS.k19, VALIDATE_TERMS.k20,";
if (!src.includes(TITLES_VERBATIM)) { console.error('✗ מגן: רשימת-התארים סטתה מהמקור'); f = 1; }
if (!src.includes("VALIDATE_TERMS.k21, VALIDATE_TERMS.k22, VALIDATE_TERMS.k23, VALIDATE_TERMS.k24, VALIDATE_TERMS.k25, VALIDATE_TERMS.k26, VALIDATE_TERMS.k27, VALIDATE_TERMS.k28, VALIDATE_TERMS.k29, VALIDATE_TERMS.k30, VALIDATE_TERMS.k31,")) { console.error('✗ מגן: סיומות-הכבוד סטו מהמקור'); f = 1; }
if (/'בן'|'בר'/.test(src)) { console.error('✗ מגן: בן/בר נכנסו למילון — פטרונים לגיטימי (validate.ts:71)'); f = 1; }
if (!src.includes('atomNormName(t, atomNormSearch)')) { console.error('✗ מגן: חיווט norm-name השתנה'); f = 1; }
if (!src.includes('atomNameSortKey(t, atomNormSearch, NAME_TITLES)')) { console.error('✗ מגן: חיווט name-sort-key השתנה'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-אימות: 32 דוגמאות-חוזה דרך כל 6 החוטים + מגן-הכרעה — ירוק');
