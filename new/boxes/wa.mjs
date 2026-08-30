/** קופסת-חיבורים · וואטסאפ (wa). חוזה: wa.contract.md
 *  ההלחמות-לשעבר מ-maor/src/lib/wa.ts + lib/templates.ts — עכשיו חיווט גלוי אחד.
 *  קישורי wa.me click-to-chat + נוסחי-הודעה, טהור לגמרי: פתיחת-הקישור
 *  בדפדפן/אפליקציה = שקע של לוח-האם, לא כאן. */
import { waDigits as digitsAtom } from '../atoms/wa-digits.mjs';
import { waLink as linkAtom } from '../atoms/wa-link.mjs';
import { waDeliveryText as __pure_waDeliveryText } from '../atoms/wa-delivery-text.mjs';
import { WA_DELIVERY_TEXT_T as __d_waDeliveryText_WA_DELIVERY_TEXT_T } from '../atoms/wa-delivery-text-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const deliveryAtom = (...a) => __pure_waDeliveryText(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_waDeliveryText_WA_DELIVERY_TEXT_T);
import { waPaymentText as __pure_waPaymentText } from '../atoms/wa-payment-text.mjs';
import { WA_PAYMENT_TEXT_T as __d_waPaymentText_WA_PAYMENT_TEXT_T } from '../atoms/wa-payment-text-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const paymentAtom = (...a) => __pure_waPaymentText(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_waPaymentText_WA_PAYMENT_TEXT_T);
import { waBirthdayText as __pure_waBirthdayText } from '../atoms/wa-birthday-text.mjs';
import { WA_BIRTHDAY_TEXT_T as __d_waBirthdayText_WA_BIRTHDAY_TEXT_T } from '../atoms/wa-birthday-text-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const birthdayAtom = (...a) => __pure_waBirthdayText(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_waBirthdayText_WA_BIRTHDAY_TEXT_T);
import { renderTemplate as renderAtom } from '../atoms/render-template.mjs';
import { TEMPLATE_DEFS } from '../atoms/template-defs.mjs';

// ── מילון-הקופסה (הכרעות — נוסח-המקור verbatim) ──
// הכרעה 1: שם-ארגון ריק/רווחים ⇒ 'העמותה' (wa.ts:47-49).
const ORG_FALLBACK = 'העמותה';

// ── החיווט ──
// orgOf היה helper פנימי ב-wa.ts:47-49 — התפקיד (נפילת-שם) חי בקופסה, לא באטום (חוק-5).
const orgOf = (orgName) => orgName.trim() || ORG_FALLBACK;
// הכרעה 2: נוסחי-ברירת-המחדל = TEMPLATE_DEFS (templates.ts:19-52) — דאטת-חיווט לשקע defs.
const wiredRender = (cfg, key, vars) => renderAtom(cfg, key, vars, TEMPLATE_DEFS);

// ── החשיפה (הממשק של lib/wa.ts, אחד-לאחד — L4) ──
/** ספרות-בינלאומי מטלפון שמור: '050-123-4567' → '972501234567'; לא-תקין ⇒ null. */
export const waDigits = (phone) => digitsAtom(phone);
/** קישור פתיחת-שיחה: https://wa.me/<digits>[?text=…]. בלי מספר תקין ⇒ null. */
export const waLink = (phone, text = '') => linkAtom(phone, text, digitsAtom);
/** הודעת-מסירה (חלוקה): נשלחת למשפחה כשהמשלוח יוצא/בדרך. */
export const waDeliveryText = (orgName, famName, cfg) =>
  deliveryAtom(orgName, famName, cfg, wiredRender, orgOf);
/** תזכורת-תשלום ידידותית (חוגים): שם-הפריט + היתרה (₪, מעוגל, he-IL). */
export const waPaymentText = (orgName, what, balance, cfg) =>
  paymentAtom(orgName, what, balance, cfg, wiredRender, orgOf);
/** ברכת יום-הולדת לחוגג/ת. */
export const waBirthdayText = (orgName, firstName, cfg) =>
  birthdayAtom(orgName, firstName, cfg, wiredRender, orgOf);
