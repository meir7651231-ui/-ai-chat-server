/** בדיקת-קצה · קופסת-תבניות — דרך הקופסה בלבד (דיבר 3: אפס ייבוא-שכן).
 *  DoD (נכתב לפני הקוד — דיבר 12): `node new/boxes/templates.test.mjs` ⇒ exit 0
 *  ומדפיס '✓ קופסת-תבניות: …'; כל דוגמה מחייבת מהחוזה מוכחת תו-בתו. */
import { TEMPLATE_DEFS, TEMPLATE_KEYS, renderTemplate } from './templates.mjs';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

let checks = 0;
const eq = (got, want, tag) => { assert.strictEqual(got, want, `${tag}: "${got}" ≠ "${want}"`); checks++; };

// מילון: 5 תבניות, לכל אחת key·label·vars·def
eq(TEMPLATE_DEFS.length, 5, 'גודל-המילון');
for (const d of TEMPLATE_DEFS) {
  assert.ok(d.key && d.label && Array.isArray(d.vars) && typeof d.def === 'string', `תבנית שבורה: ${d.key}`);
  checks++;
}
// מפתחות נגזרים, בסדר-ההגדרה (חוזה + templates.ts:54)
eq(TEMPLATE_KEYS.join('|'), 'wa.delivery|wa.payment|wa.birthday|wa.dialer|wa.paylink', 'TEMPLATE_KEYS');

// דוגמה 1 — ברירת-מחדל
eq(renderTemplate(undefined, 'wa.delivery', { name: 'דנה', org: 'מאור החסד' }),
  'שלום דנה, משלוח ממאור החסד בדרך אליכם היום 🚚', 'דוגמה 1');
// דוגמה 2 — דריסת-ארגון גוברת
eq(renderTemplate({ templates: { 'wa.delivery': 'היי {name} מ{org}!' } }, 'wa.delivery',
  { name: 'דנה', org: 'מאור החסד' }), 'היי דנה ממאור החסד!', 'דוגמה 2');
// דוגמה 3 — דריסת רווחים-בלבד ⇒ ברירת-המחדל
eq(renderTemplate({ templates: { 'wa.delivery': '   ' } }, 'wa.delivery',
  { name: 'דנה', org: 'מאור החסד' }), 'שלום דנה, משלוח ממאור החסד בדרך אליכם היום 🚚', 'דוגמה 3');
// דוגמה 4 — מפתח לא-מוכר ⇒ ''; ובדריסה — הדריסה מרונדרת
eq(renderTemplate(undefined, 'wa.nope', { name: 'דנה' }), '', 'דוגמה 4א');
eq(renderTemplate({ templates: { 'wa.nope': 'חופשי {name}' } }, 'wa.nope', { name: 'דנה' }),
  'חופשי דנה', 'דוגמה 4ב');
// דוגמה 5 — משתנה לא-סופק נשאר {כפי-שהוא}
eq(renderTemplate(undefined, 'wa.birthday', { org: 'מאור' }),
  'מזל טוב ל{first} ליום ההולדת! 🎂 באהבה, מאור', 'דוגמה 5');
// דוגמה 6 — תבנית-התשלום המלאה
eq(renderTemplate(undefined, 'wa.payment', { org: 'מאור', what: 'חוג ציור', amount: '120' }),
  'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור חוג ציור — ₪120. תודה רבה!', 'דוגמה 6');
// דוגמה 7 — cfg=null / templates:null ⇒ כ-undefined
eq(renderTemplate(null, 'wa.dialer', { name: 'א', org: 'ב' }),
  'שלום א, ניסינו להשיג אתכם מב ולא הצלחנו — נשמח שתחזרו אלינו 🙏', 'דוגמה 7א');
eq(renderTemplate({ templates: null }, 'wa.paylink', { name: 'א', org: 'ב', link: 'L' }),
  'שלום א, תודה על השיחה! לתרומה מקוונת לב: L 🙏', 'דוגמה 7ב');
// קצוות: vars ריק ⇒ הנוסח כלשונו · משתנה-עודף לא מזיק
eq(renderTemplate(undefined, 'wa.delivery', {}),
  'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚', 'vars-ריק');
eq(renderTemplate(undefined, 'wa.birthday', { first: 'רות', org: 'מאור', extra: 'X' }),
  'מזל טוב לרות ליום ההולדת! 🎂 באהבה, מאור', 'משתנה-עודף');

/* 🛡 מגן-הכרעה (L18): הזרקת המילון-היחיד לשני השקעים — verbatim במקור-הקופסה. */
const src = readFileSync(new URL('./templates.mjs', import.meta.url), 'utf8');
for (const anchor of [
  'templateKeys(TEMPLATE_DEFS)',
  'renderTemplateAtom(cfg, key, vars, TEMPLATE_DEFS)',
]) { assert.ok(src.includes(anchor), `מגן: הכרעת-חיווט נעלמה — ${anchor}`); checks++; }
// הקופסה מייבאת אך-ורק אטומים (חוק-2)
for (const m of src.matchAll(/from '([^']+)'/g)) {
  assert.ok(m[1].startsWith('../atoms/'), `ייבוא-לא-אטומי: ${m[1]}`); checks++;
}

console.log(`✓ קופסת-תבניות: ${checks} בדיקות — מילון×5, מפתחות-נגזרים, דריסה/ברירת-מחדל/משתנים, מגן-הכרעה`);
