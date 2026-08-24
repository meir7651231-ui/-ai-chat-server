/** קופסת-חיבורים · שער-יציאת-המידע. חוזה: export-gate.contract.md
 *  נקודת-החנק היחידה לפני כל הורדה/הדפסה/העתקה (בקשת-בעלים 13.8) —
 *  שני משתני-המודול של המקור (exportGate.ts:15-16) הפכו למצב-הקופסה כאן.
 *  שקע-IO: onBlocked (toast) מוזרק ע"י הקורא — הקופסה לא נוגעת ב-DOM. */
import { setExportBlocked as computeGateState } from '../atoms/set-export-blocked.mjs';
import { exportAllowed as allowedOf } from '../atoms/export-allowed.mjs';
import { guardExport as guardOf } from '../atoms/guard-export.mjs';

// ── החיווט ──
export function createExportGate() {
  // הכרעת-הקופסה · לידה-מותרת: blocked=false · notify=null (exportGate.ts:15-16 —
  // חוזה-הדגלים: חסר=מותר, רק false בכרטיס-העובד חוסם)
  let state = computeGateState(false, null);
  return {
    /** נקבע מ-App לפי הקונפיג-האפקטיבי; onBlocked (אופציונלי) מריץ toast בסירוב. */
    setExportBlocked(isBlocked, onBlocked) { state = computeGateState(isBlocked, onBlocked); },
    /** האם יציאת-מידע מותרת כרגע (חסר-דגל/ברירת-מחדל ⇒ true) — שקט, בלי toast. */
    exportAllowed() { return allowedOf(state.blocked); },
    /** שער לפני כל נתיב-יציאה: מותר ⇒ true; חסום ⇒ מריץ התרעה ומחזיר false. */
    guardExport() { return guardOf(state.blocked, state.notify); },
  };
}

// ── מופע-המודול-היחיד (כמו במקור) + חתימות-המקור ──
export const gate = createExportGate();
export const setExportBlocked = (isBlocked, onBlocked) => gate.setExportBlocked(isBlocked, onBlocked);
export const exportAllowed = () => gate.exportAllowed();
export const guardExport = () => gate.guardExport();
