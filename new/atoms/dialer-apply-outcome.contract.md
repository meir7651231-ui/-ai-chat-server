# חוזה · dialer-apply-outcome
**תפקיד:** רישום-יומן + קידום; לא-סופי ⇒ requeue; בלי-נוכחי ⇒ no-op.
**מוצא:** `maor-system/src/lib/dialer.ts`. חוק-4: verbatim (consts/עוזרים inline).
**חתימה:** `applyOutcome(c, outcome, note, iso, {currentId}) => DialerCampaign`
**שקעים:** currentId (אח)
**Golden:** `dialer-apply-outcome.test.mjs` — תרחיש-קמפיין דטרמיניסטי; פלט נלכד מהרצה.
