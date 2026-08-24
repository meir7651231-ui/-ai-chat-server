# חוזה · חוט renew-of
**תפקיד:** ההחלטה הנוכחית של שיבוץ לשנה הבאה (רישום-מחדש לחוגים) — קורא את
‏e.renew; חסר (undefined/null) ⇒ '' = "טרם הוחלט". ערכי-ההחלטה במקור
(‏RenewDecision): ‏'yes' | 'no' | 'hold' | ''.
**קלט:** ‏e (שיבוץ, ‏{renew?: string}). **פלט:** מחרוזת-החלטה.
**דוגמאות מחייבות:**
1. ‏{renew:'yes'} ⇒ ‏'yes'.
2. ‏{renew:'hold'} ⇒ ‏'hold'.
3. ‏{} (בלי renew) ⇒ ‏'' — טרם הוחלט.
4. ‏{renew:null} ⇒ ‏'' — ‏?? תופס גם null.
5. ‏{renew:''} ⇒ ‏'' — ריק מפורש נשאר ריק (לא undefined-בלבד).
**מוצא:** maor/src/components/courses/reenroll-lib.ts:47-51 (‏renewOf,
מנגנון הרישום-מחדש לשנה הבאה).
