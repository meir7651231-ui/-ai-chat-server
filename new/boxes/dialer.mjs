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
import { appendCall as appendCallAtom } from '../atoms/append-call.mjs';
import { popCall as popCallAtom } from '../atoms/pop-call.mjs';
import { callStats as callStatsAtom } from '../atoms/call-stats.mjs';
import { campaignCsvRows as campaignCsvRowsAtom } from '../atoms/campaign-csv-rows.mjs';

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
