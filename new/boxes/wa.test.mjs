/** בדיקת-קצה · קופסת-וואטסאפ — מוכיחה את דוגמאות-החוזה (wa.contract.md) דרך הקופסה בלבד. */
import { waDigits, waLink, waDeliveryText, waPaymentText, waBirthdayText } from './wa.mjs';
const WA_TERMS = {
  k1: "העמותה",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
let f = 0;
const eq = (got, want, msg) => {
  if (got !== want) { console.error(`✗ ${msg}: ציפינו ${JSON.stringify(want)}, קיבלנו ${JSON.stringify(got)}`); f = 1; }
};

// ── waDigits (wa.ts:14-29) ──
eq(waDigits('050-123-4567'), '972501234567', 'טלפון מקומי מעוצב');
eq(waDigits('+972 050-123-4567'), '972501234567', '+972 עם ה-0 המקומי');
eq(waDigits('00972501234567'), '972501234567', 'קידומת-חיוג 00972');
eq(waDigits('501234567'), '972501234567', 'ישראלי בלי 0 מוביל');
eq(waDigits('0044 20 7946 0958'), '442079460958', 'בינלאומי 00 כללי');
eq(waDigits('05012'), null, '0-מוביל באורך לא-תקין ⇒ null');
eq(waDigits('123'), null, 'קצר מגבול E.164 ⇒ null');
eq(waDigits(''), null, 'ריק ⇒ null');
eq(waDigits('אין טלפון'), null, 'בלי ספרות ⇒ null');

// ── waLink (wa.ts:32-37) ──
eq(waLink('050-123-4567'), 'https://wa.me/972501234567', 'קישור בלי טקסט');
eq(waLink('050-123-4567', 'שלום'), 'https://wa.me/972501234567?text=%D7%A9%D7%9C%D7%95%D7%9D', 'טקסט עברי מקודד');
eq(waLink('050-123-4567', '   '), 'https://wa.me/972501234567', 'רווחים-בלבד = בלי ?text');
eq(waLink('050-123-4567', '  היי  '), 'https://wa.me/972501234567?text=' + encodeURIComponent('היי'), 'trim לפני הקידוד');
eq(waLink('אבג', 'היי'), null, 'טלפון לא-תקין ⇒ null גם עם טקסט');

// ── נוסחי-ההודעה (wa.ts:52-68) — ברירות-מחדל, נפילת-ארגון, דריסות ──
eq(waDeliveryText('מאור החסד', 'כהן'), 'שלום משפחת כהן, משלוח ממאור החסד בדרך אליכם היום 🚚', 'הודעת-מסירה');
eq(waDeliveryText('  ', 'לוי'), 'שלום משפחת לוי, משלוח מהעמותה בדרך אליכם היום 🚚', 'הכרעה 1: ארגון ריק ⇒ העמותה');
eq(waPaymentText('מאור', 'חוג ציור', 1234.6),
  'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור חוג ציור — ₪1,235. תודה רבה!', 'תזכורת-תשלום: עיגול+he-IL');
eq(waBirthdayText('מאור', 'דנה'), 'מזל טוב לדנה ליום ההולדת! 🎂 באהבה, מאור', 'ברכת יום-הולדת');
eq(waBirthdayText('מאור', 'דנה', { templates: { 'wa.birthday': 'יומולדת שמח {first}! מ{org}' } }),
  'יומולדת שמח דנה! ממאור', 'הכרעה 2: דריסת-ארגון גוברת');
eq(waBirthdayText('מאור', 'דנה', { templates: { 'wa.birthday': '   ' } }),
  'מזל טוב לדנה ליום ההולדת! 🎂 באהבה, מאור', 'הכרעה 2: דריסה ריקה ⇒ ברירת-המחדל');
eq(waDeliveryText('מאור', ''), 'שלום משפחת, משלוח ממאור בדרך אליכם היום 🚚', 'שם-משפחה ריק — התנהגות-המקור (trim על השם המורכב)');

/* 🛡 מגן-הכרעה: הקריאה קוראת את מקור-הקופסה ומאשרת שההכרעות חיות בה verbatim (דפוס theme.test). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./wa.mjs', import.meta.url), 'utf8');
if (!src.includes("const ORG_FALLBACK = WA_TERMS.k1")) { console.error('✗ מגן: נפילת-הארגון (הכרעה 1) שונתה'); f = 1; }
if (!src.includes('renderAtom(cfg, key, vars, TEMPLATE_DEFS)')) { console.error('✗ מגן: תפר-הזרקת TEMPLATE_DEFS (הכרעה 2) שונה'); f = 1; }
if (!src.includes('linkAtom(phone, text, digitsAtom)')) { console.error('✗ מגן: תפר-שקע-הספרות של waLink שונה'); f = 1; }
if (!src.includes("orgName.trim() || ORG_FALLBACK")) { console.error('✗ מגן: חיווט-orgOf שונה'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-וואטסאפ: 21 דוגמאות-חוזה (ספרות·קישור·3 נוסחים·דריסות) + 4 מגני-הכרעה');
