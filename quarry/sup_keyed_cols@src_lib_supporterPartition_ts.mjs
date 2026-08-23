/** 🪨 טיוטת-חוט (דרגת-מחצבה) · SUP_KEYED_COLS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supporterPartition.ts:35-41 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const SUP_KEYED_COLS = ['supporters', 'events'];
/**
 * מפתח-ה-skey של מסמך באוסף נאכף (טהור). `supporters` ⇒ forWho שלו. `events` ⇒
 * מפתח-התומך-המקושר (spId→forWho דרך המפה); אירוע ללא-תומך (כללי/משפחה) = משותף.
 * אוסף לא-נאכף ⇒ '' (הקורא לא יזריק skey). המפה = spId→skey (נבנית מהתומכים).
 */
