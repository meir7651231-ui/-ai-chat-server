/** חוט · pop-call — קודם אוטומטית (אפיון-Golden). חוזה: pop-call.contract.md */
export function popCall(calls) {
    if (!calls || !calls.length)
        return calls;
    return calls.slice(0, -1);
}
/** סיכום יומן-השיחות לתצוגת-החייגן. טהור, סובל undefined. */
