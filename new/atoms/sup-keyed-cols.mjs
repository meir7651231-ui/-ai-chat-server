/** אטום-קבוע · sup-keyed-cols — קודם אוטומטית (צילום-ערך). חוזה: sup-keyed-cols.contract.md */
export const SUP_KEYED_COLS = ['supporters', 'events'];
/**
 * מפתח-ה-skey של מסמך באוסף נאכף (טהור). `supporters` ⇒ forWho שלו. `events` ⇒
 * מפתח-התומך-המקושר (spId→forWho דרך המפה); אירוע ללא-תומך (כללי/משפחה) = משותף.
 * אוסף לא-נאכף ⇒ '' (הקורא לא יזריק skey). המפה = spId→skey (נבנית מהתומכים).
 */
