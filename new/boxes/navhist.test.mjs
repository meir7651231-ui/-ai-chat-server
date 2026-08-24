/** בדיקת-קצה: קופסת-הניווט המלאה — תקרה 20 · אותו-מיקום-לא-נרשם · recent עד 6 ·
 *  חזרה-שאינה-צעד · כפתור-רק-כשיש-היסטוריה. מוכיחה את דוגמאות-החוזה עצמן. */
import {
  NAV_HIST_MAX, RECENT_MAX, BACK_LABEL, BACK_TITLE,
  goTo, openFamily, openCourse, goBack, canGoBack, navStep,
} from './navhist.mjs';

let f = 0;
const loc = (view, fam = null, crs = null) => ({ view, selFamilyId: fam, selCourseId: crs });

// 25 מעברי-מסך שונים ⇒ תקרה 20, הישן נזרק (החוזה: הראשון שנשאר = הצעד ה-6)
let s = { view: 'v0', selFamilyId: null, selCourseId: null, hist: [] };
for (let i = 1; i <= 25; i++) {
  const r = goTo({ hist: s.hist, prev: loc(s.view, s.selFamilyId, s.selCourseId), view: 'v' + i });
  s = { ...s, view: r.view, hist: r.hist };
}
if (s.hist.length !== NAV_HIST_MAX) { console.error(`✗ תקרה: ${s.hist.length}≠${NAV_HIST_MAX}`); f = 1; }
if (s.hist[0].view !== 'v5') { console.error(`✗ הישן-ביותר לא נזרק (נשאר ${s.hist[0].view})`); f = 1; }

// מעבר לאותו מיקום ⇒ hist ללא-שינוי (אותו מערך — לא נרשם צעד)
const same = goTo({ hist: s.hist, prev: loc('v25'), view: 'v25' });
if (same.hist !== s.hist) { console.error('✗ אותו-מיקום נרשם כצעד'); f = 1; }

// openFamily: 7 מזהים ⇒ recent אורך 6, האחרון ראשון; קידום-קיים בלי כפילות; null לא נוגע
let r6 = [];
let h = [];
let prev = loc('home');
for (const id of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
  const r = openFamily({ hist: h, recentIds: r6, prev, id });
  r6 = r.recentIds; h = r.hist; prev = loc('families', id);
}
if (r6.length !== RECENT_MAX || r6[0] !== 'g' || r6.includes('a')) { console.error(`✗ recent: ${r6}`); f = 1; }
const dup = openFamily({ hist: h, recentIds: r6, prev, id: 'd' });
if (dup.recentIds[0] !== 'd' || dup.recentIds.length !== RECENT_MAX ||
    new Set(dup.recentIds).size !== RECENT_MAX) { console.error(`✗ קידום-קיים: ${dup.recentIds}`); f = 1; }
const clear = openFamily({ hist: h, recentIds: r6, prev: loc('families', 'g'), id: null });
if (clear.recentIds !== r6) { console.error('✗ ניקוי-בחירה נגע ב-recent'); f = 1; }

// openCourse: מחליף view+בחירה, שומר משפחה ב-next (אין recent בכלל)
const oc = openCourse({ hist: [], prev: loc('home', 'fam1'), id: 'c1' });
if (oc.view !== 'courses' || oc.selCourseId !== 'c1' || oc.hist.length !== 1 ||
    oc.hist[0].view !== 'home') { console.error('✗ openCourse'); f = 1; }
if ('recentIds' in oc) { console.error('✗ openCourse נגע ב-recent'); f = 1; }

// goBack: [A] ⇒ {loc:A, hist:[]}; [] ⇒ null; החזרה אינה נרשמת (hist רק קטן)
const A = loc('families', 'f1');
const back = goBack([A]);
if (!back || back.loc !== A || back.hist.length !== 0) { console.error('✗ goBack'); f = 1; }
if (goBack([]) !== null) { console.error('✗ goBack על ריק לא החזיר null'); f = 1; }

// canGoBack — הכפתור רק כשיש היסטוריה
if (canGoBack([]) !== false || canGoBack([A]) !== true) { console.error('✗ canGoBack'); f = 1; }
if (BACK_LABEL !== '↩ חזרה' || BACK_TITLE !== 'חזרה למסך הקודם') { console.error('✗ מילון'); f = 1; }

/* 🛡 מגן-הכרעה (דפוס theme.test): שלוש ההכרעות חתומות verbatim במקור-הקופסה. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./navhist.mjs', import.meta.url), 'utf8');
if (!src.includes('sameLoc(prev, next) ? hist : pushNav(hist, prev)')) {
  console.error('✗ מגן: הכרעה 1 (אותו-מיקום-לא-נרשם) שונתה'); f = 1;
}
if (!src.includes('id ? pushRecent(recentIds, id) : recentIds')) {
  console.error('✗ מגן: הכרעה 2 (רק-פתיחה-אמיתית מקדמת recent) שונתה'); f = 1;
}
const goBackSrc = src.slice(src.indexOf('export function goBack'), src.indexOf('export function canGoBack'));
if (!goBackSrc.includes('hist.slice(0, -1)') || goBackSrc.includes('pushNav')) {
  console.error('✗ מגן: הכרעה 3 (חזרה-אינה-צעד) שונתה'); f = 1;
}
if (!src.includes("BACK_LABEL = '↩ חזרה'")) { console.error('✗ מגן: תווית-הכפתור שונתה'); f = 1; }
void navStep;
if (f) process.exit(1);
console.log('✓ קופסת-הניווט: תקרה-20 · אותו-מיקום-לא-נרשם · recent-6-ייחודי · חזרה-לא-צעד · canGoBack — ירוק');
