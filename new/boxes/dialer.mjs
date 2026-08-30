/** קופסת-חיבורים · dialer — מנוע חייגן-מונחה. חוזה: dialer.contract.md
 *  מחווטת את 14 חוטי-החייגן (מקור: maor/src/lib/dialer.ts). זה המקום היחיד
 *  שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md); קבועי-השכן מחווטים כאן, שקעי-IO
 *  (iso/nameOf) נשארים פרמטרים-מוזרקים של הצרכן. */
import { REQUEUE_OUTCOMES } from '../atoms/requeue-outcomes.mjs';
import { TERMINAL_OUTCOMES } from '../atoms/terminal-outcomes.mjs';
import { OUTCOME_LABELS } from '../atoms/outcome-labels.mjs';
import { startCampaign as startCampaignAtom } from '../atoms/start-campaign.mjs';
import { currentId as currentIdAtom } from '../atoms/current-id.mjs';
import { applyOutcome as applyOutcomeAtom } from '../atoms/apply-outcome.mjs';
import { progress as progressAtom } from '../atoms/progress.mjs';
import { isDone as isDoneAtom } from '../atoms/is-done.mjs';
import { undoLast as undoLastAtom } from '../atoms/undo-last.mjs';
import { CALL_LOG_CAP } from '../atoms/call-log-cap.mjs';
import { appendCall as __pure_appendCall } from '../atoms/append-call.mjs';
import { APPEND_CALL_T as __d_appendCall_APPEND_CALL_T } from '../atoms/append-call-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const appendCallAtom = (...a) => __pure_appendCall(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_appendCall_APPEND_CALL_T);
import { popCall as popCallAtom } from '../atoms/pop-call.mjs';
import { callStats as __pure_callStats } from '../atoms/call-stats.mjs';
import { CALL_STATS_T as __d_callStats_CALL_STATS_T } from '../atoms/call-stats-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const callStatsAtom = (...a) => __pure_callStats(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_callStats_CALL_STATS_T);
import { campaignCsvRows as __pure_campaignCsvRows } from '../atoms/campaign-csv-rows.mjs';
import { CAMPAIGN_CSV_ROWS_T as __d_campaignCsvRows_CAMPAIGN_CSV_ROWS_T } from '../atoms/campaign-csv-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const campaignCsvRowsAtom = (...a) => __pure_campaignCsvRows(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_campaignCsvRows_CAMPAIGN_CSV_ROWS_T);

// ── החיווט (ההכרעות החיות בקופסה) ──
// קבועי-השכן מוזרקים כאן — הצרכן לא רואה אותם. שקעי-IO (iso/nameOf) נשארים.
export const startCampaign = (name, ids, iso) => startCampaignAtom(name, ids, iso);
export const currentId = (c) => currentIdAtom(c);
export const applyOutcome = (c, outcome, note, iso) =>
  applyOutcomeAtom(c, outcome, note, iso, currentIdAtom, REQUEUE_OUTCOMES);
export const progress = (c) => progressAtom(c, REQUEUE_OUTCOMES);
export const isDone = (c) => isDoneAtom(c);
export const undoLast = (c) => undoLastAtom(c, REQUEUE_OUTCOMES);
export const appendCall = (calls, outcome, iso) => appendCallAtom(calls, outcome, iso, CALL_LOG_CAP);
export const popCall = (calls) => popCallAtom(calls);
export const callStats = (calls) => callStatsAtom(calls);
export const campaignCsvRows = (c, nameOf) => campaignCsvRowsAtom(c, nameOf, OUTCOME_LABELS);

// ── חשיפת-הקבועים (חלק מפני-המודול במקור) ──
export { REQUEUE_OUTCOMES, TERMINAL_OUTCOMES, OUTCOME_LABELS, CALL_LOG_CAP };
