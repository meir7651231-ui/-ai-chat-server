/** 📦 קופסת-הוורטיקלים — חיווט זהות-פר-ורטיקל: בחירת-חבילה באשף מלבישה זהות מלאה
 *  (מונחים+מודולים+דגלים+ערכה+אימוג'י+תנועה), עם שני חוקי-בעלים קשיחים:
 *  ‏chesed = הלקוח-החי ביט-זהה · צבע-ידני (accentCustom) שורד כל החלפת-חבילה.
 *  חוקי-הקופסה (חוק-2): כאן ורק כאן נפגשים החוטים; האטומים עיוורים זה-לזה. */
import { VERTICAL_PACKS } from '../atoms/vertical-packs.mjs';
import { COMMERCIAL_OFF } from '../atoms/commercial-off.mjs';
import { applyVerticalPack } from '../atoms/apply-vertical-pack.mjs';

/** הכרעת-החיווט: מילון-החבילות המוזרק = אטום-הנתונים המלא (13). */
export const PACKS = VERTICAL_PACKS;
export { COMMERCIAL_OFF };

/** החלת-חבילה — הממשק-החיצוני של הקופסה (השקע packs מחווט לאטום-הנתונים). */
export const applyPack = (config, packId) => applyVerticalPack(config, packId, VERTICAL_PACKS);

/** חבילה לפי-מזהה (לתצוגת-אשף) — null כשלא-קיימת. */
export const packOf = (id) => VERTICAL_PACKS.find((p) => p.id === id) || null;
