/** חוט · append-call — רישום-שיחה ליומן-טבעת. חוזה: append-call.contract.md
 *  שקע: cap (במקור CALL_LOG_CAP=200 — האטום call-log-cap).
 *  חולץ כלשונו מ-maor/src/lib/dialer.ts. */
export function appendCall(calls, outcome, iso, cap, T) {
  if (outcome === T.k1) return calls;
  const next = [...(calls ?? []), { at: iso, outcome }];
  return next.length > cap ? next.slice(next.length - cap) : next;
}
