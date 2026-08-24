# חוזה · קופסת-חיבורים "dialer" (מנוע חייגן-מונחה)

**תפקיד:** מכונת-המצב של קמפיין-שיחות מ-`maor/src/lib/dialer.ts` — תור לפי-סדר,
"הנוכחי" בחזית, סיווג-תוצאה מקדם לבא, מי-שלא-ענה חוזר לסוף-התור (requeue), יומן-
שיחות עמיד פר-תומך, ו-CSV לסיכום. 14 חוטים מולחמים כאן במקום אחד (חוקי-החשמלאי).
מקור-האמת: `maor/src/lib/dialer.ts`.

## החיווט (ההכרעות החיות בקופסה)
השקעים הפנימיים (קבועי-שכן) מחווטים כאן — הצרכן לא מזריק אותם:
- `apply-outcome` ← `current-id` + `requeue-outcomes` (`dialer.ts:47,50`)
- `progress` ← `requeue-outcomes` (`dialer.ts:86`)
- `undo-last` ← `requeue-outcomes` (`dialer.ts:110`)
- `append-call` ← `call-log-cap` (=200, `dialer.ts:129`)
- `campaign-csv-rows` ← `outcome-labels` (`dialer.ts:165`)

## שקעי-IO (פרמטרים-מוזרקים אמיתיים — לא מחווטים)
- `iso` — חותמת-הזמן (אין שעון באטום, חוק-5). ל-`startCampaign`/`applyOutcome`/`appendCall`.
- `nameOf(id)` — מיפוי מזהה→שם מה-store (המנוע לא מכיר store, `dialer.ts:161`).

## חשיפה
- `startCampaign(name, ids, iso)` ⇒ `{name, startedAt, queue, total, log:[]}` — דדופ+סינון-falsy, סדר נשמר (`dialer.ts:25`)
- `currentId(c)` ⇒ מזהה-חזית או `null` (`dialer.ts:37`)
- `applyOutcome(c, outcome, note, iso)` ⇒ קמפיין-חדש; לא-סופי⇒requeue לסוף, סופי⇒הסרה; בלי-נוכחי no-op (`dialer.ts:46`)
- `progress(c)` ⇒ `{total, remaining, finalized, counts}`; לא-ענה/דלג נספרים פר-אדם (`dialer.ts:80`)
- `isDone(c)` ⇒ תור-ריק (`dialer.ts:97`)
- `undoLast(c)` ⇒ מבטל הסיווג-האחרון, מחזיר לחזית; בלי-יומן no-op (`dialer.ts:106`)
- `appendCall(calls, outcome, iso)` ⇒ יומן-טבעת 200, `skip` לא-נרשם (`dialer.ts:126`)
- `popCall(calls)` ⇒ הסרת-האחרון (`dialer.ts:133`)
- `callStats(calls)` ⇒ `{total, last, noanswer}`, סובל undefined (`dialer.ts:147`)
- `campaignCsvRows(c, nameOf)` ⇒ שורות עם כותרת, שורה-פר-ניסיון (`dialer.ts:159`)
- קבועים: `REQUEUE_OUTCOMES` · `TERMINAL_OUTCOMES` · `OUTCOME_LABELS` · `CALL_LOG_CAP`

## דוגמאות מחייבות (מספריות, מ-DoD)
1. `startCampaign('קיץ', ['a','','a','b'], '2026-01-01')` ⇒ `queue:['a','b']`, `total:2`.
2. `applyOutcome(camp,'noanswer','',iso)` על queue `['a','b']` ⇒ queue `['b','a']` (a לסוף), log[0]={id:'a',outcome:'noanswer',at:iso} בלי note.
3. `applyOutcome(camp,'donated','תרם 100',iso)` על queue `['a','b']` ⇒ queue `['b']`, log entry עם note:'תרם 100'.
4. `applyOutcome` על queue ריק ⇒ אותו object (no-op).
5. `progress` על log `[na(a),na(a),refused(b)]`,total 2,queue `['a']` ⇒ `remaining:1, finalized:1, counts.noanswer:1` (a פעם-אחת, לא 2), `counts.refused:1`.
6. `undoLast` אחרי `noanswer` על a ⇒ a חוזר לחזית, מוסר מסוף-התור, log מתקצר.
7. `appendCall(undefined,'donated','2026-01-01')` ⇒ `[{at:'2026-01-01',outcome:'donated'}]`; `appendCall(x,'skip',iso)` ⇒ `x` ללא-שינוי.
8. 201 שיחות ⇒ `length===200` (טבעת), הראשונה נשמטה.
9. `callStats([{outcome:'noanswer'},{outcome:'donated'}])` ⇒ `{total:2,last:...,noanswer:1}`; `callStats(undefined)` ⇒ `{total:0,last:'',noanswer:0}`.
10. `campaignCsvRows(camp,id=>'שם-'+id)` ⇒ שורה-0 כותרת `['שם','תוצאה','הערה','מתי']`; תוויות מ-OUTCOME_LABELS ('תרם/ה' וכו').

## DoD
`node new/boxes/dialer.test.mjs` ⇒ exit 0 · `node machtzev/parity/dialer.parity.mjs` (במאור) ⇒ exit 0 (אפס-סטייה ישן≡חדש).
