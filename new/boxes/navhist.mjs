/** קופסת-חיבורים · ניווט-אחורה + "נפתחו לאחרונה" (shell.navhist, P1.5).
 *  חוזה: navhist.contract.md
 *  ההלחמות-לשעבר מ-maor src/lib/navhist.ts + useApp.ts (go/selectFamily/selectCourse/goBack)
 *  — עכשיו חיווט גלוי אחד. שקעי לוח-אם: גידור-הדגל, עדכון-store, DOM הכפתור. */
import { sameLoc } from '../atoms/same-loc.mjs';
import { pushNav as __pure_pushNav } from '../atoms/push-nav.mjs';
import { NAV_HIST_MAX as __d_pushNav_NAV_HIST_MAX } from '../atoms/push-nav-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const pushNav = (...a) => __pure_pushNav(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_pushNav_NAV_HIST_MAX);
import { pushRecent } from '../atoms/push-recent.mjs';
import { NAV_HIST_MAX } from '../atoms/nav-hist-max.mjs';
import { RECENT_MAX } from '../atoms/recent-max.mjs';
import { NAVHIST_TERMS } from '../atoms/navhist-terms.mjs';

export { NAV_HIST_MAX, RECENT_MAX };

// ── שקעי-תוכן (מילון הקופסה — App.tsx:635,639) ──
export const BACK_LABEL = NAVHIST_TERMS.k1;
export const BACK_TITLE = NAVHIST_TERMS.k2;

// ── החיווט ──

/** הכרעה 1: מעבר לאותו מיקום אינו נרשם כצעד (useApp.ts:1366). */
export function navStep(hist, prev, next) {
  return sameLoc(prev, next) ? hist : pushNav(hist, prev);
}

/** מעבר-מסך — הבחירות נשמרות, רק ה-view מתחלף (useApp.ts:1362-1367). */
export function goTo({ hist, prev, view }) {
  const next = { view, selFamilyId: prev.selFamilyId, selCourseId: prev.selCourseId };
  return { view, hist: navStep(hist, prev, next) };
}

/** פתיחת כרטיס-משפחה — הכרעה 2: רק id אמיתי מקדם את "נפתחו לאחרונה"
 *  (useApp.ts:1368-1379; שורה 1377 — `id ? pushRecent : {}`). */
export function openFamily({ hist, recentIds, prev, id }) {
  const next = { view: NAVHIST_TERMS.k3, selFamilyId: id, selCourseId: prev.selCourseId };
  return {
    view: NAVHIST_TERMS.k3,
    selFamilyId: id,
    hist: navStep(hist, prev, next),
    recentIds: id ? pushRecent(recentIds, id) : recentIds,
  };
}

/** פתיחת חוג — ללא recent (useApp.ts:1380-1389). */
export function openCourse({ hist, prev, id }) {
  const next = { view: NAVHIST_TERMS.k4, selFamilyId: prev.selFamilyId, selCourseId: id };
  return { view: NAVHIST_TERMS.k4, selCourseId: id, hist: navStep(hist, prev, next) };
}

/** הכרעה 3: החזרה אינה נרשמת כצעד (useApp.ts:1392-1405 · legacy:3147);
 *  מחסנית ריקה ⇒ null (useApp.ts:1396). */
export function goBack(hist) {
  const p = hist[hist.length - 1];
  if (!p) return null;
  return { loc: p, hist: hist.slice(0, -1) };
}

/** "↩ חזרה" מוצג רק כשיש היסטוריה (App.tsx:630 · legacy:3146 showBack). */
export function canGoBack(hist) {
  return hist.length > 0;
}
