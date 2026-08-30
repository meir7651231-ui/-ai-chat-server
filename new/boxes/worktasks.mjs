/** קופסת-חיבורים · משימות-העבודה (WORKPREP) — מחווטת את 7 חוטי-worktasks.
 *  חוזה: worktasks.contract.md · מקור: maor/src/lib/worktasks.ts
 *  זה המקום היחיד שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md). האטומים טהורים
 *  ומזריקים את שכניהם כשקעים; החיווט (איזה-שכן) חי כאן. */
import { taskIdentity as __pure_taskIdentity } from '../atoms/task-identity.mjs';
import { TASK_IDENTITY_T as __d_taskIdentity_TASK_IDENTITY_T } from '../atoms/task-identity-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const taskIdentity = (...a) => __pure_taskIdentity(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_taskIdentity_TASK_IDENTITY_T);
import { openTasksFor } from '../atoms/open-tasks-for.mjs';
import { doneTodayFor as __pure_doneTodayFor } from '../atoms/done-today-for.mjs';
import { DONE_TODAY_FOR_T as __d_done_today_for_T } from '../atoms/done-today-for-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const doneTodayFor = (...a) => __pure_doneTodayFor(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_done_today_for_T);
import { taskOverdue } from '../atoms/task-overdue.mjs';
import { taskStatsFor as __pure_taskStatsFor } from '../atoms/task-stats-for.mjs';
import { TASK_STATS_FOR_T as __d_task_stats_for_T } from '../atoms/task-stats-for-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const taskStatsFor = (...a) => __pure_taskStatsFor(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_task_stats_for_T);
import { overdueContactTaskDrafts as __pure_overdueContactTaskDrafts } from '../atoms/overdue-contact-task-drafts.mjs';
import { OVERDUE_CONTACT_TASK_DRAFTS_T as __d_overdueContactTaskDrafts_OVERDUE_CONTACT_TASK_DRAFTS_T } from '../atoms/overdue-contact-task-drafts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const overdueContactTaskDrafts = (...a) => __pure_overdueContactTaskDrafts(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_overdueContactTaskDrafts_OVERDUE_CONTACT_TASK_DRAFTS_T);
import { PRI_LABELS } from '../atoms/pri-labels.mjs';

// ── שקעי-IO (מוזרקים בזמן-קריאה, לא ממומשים בקופסה) ──
//   todayIso : YYYY-MM-DD של "היום" — בא מלוח-האם (isoToday), לא Date.now.

// ── החיווט (איזה-שכן מוזרק לכל חוט; זו *המשמעות*, והיא חיה כאן) ──
//   openTasksFor           ← taskIdentity
//   doneTodayFor           ← taskIdentity
//   taskStatsFor           ← taskIdentity · taskOverdue
//   overdueContactTaskDrafts ← taskIdentity

// ── החשיפה ──
export const identityOf = (email) => taskIdentity(email);

export const openTasks = (tasks, identity) =>
  openTasksFor(tasks, identity, taskIdentity);

export const doneToday = (tasks, identity, todayIso) =>
  doneTodayFor(tasks, identity, todayIso, taskIdentity);

export const isOverdue = (t, todayIso) => taskOverdue(t, todayIso);

export const stats = (tasks, identity, todayIso) =>
  taskStatsFor(tasks, identity, todayIso, taskIdentity, taskOverdue);

export const contactDrafts = (supporters, existing, assignee, todayIso) =>
  overdueContactTaskDrafts(supporters, existing, assignee, todayIso, taskIdentity);

// תווית-עדיפות לתצוגה (מילון-הקופסה — נחשף כלשונו מהאטום-הקבוע).
export { PRI_LABELS };
export const priLabel = (pri) => PRI_LABELS[pri];
