# חוזה · חוט plan-ayin-advance
**תפקיד:** תכנון פעולת הכפתור-החכם של תיק-המעקב (ayin) — טהור, לא נוגע
ב-store/לוח. הכפתור לא-נראה (השקע ayinActionVisible מחזיר false) ⇒ null.
אחרת, לפי השלב: 'new' ⇒ patch{stage:'lead'} + אירוע-לוח פתוח
'<feat>: <lead> — <name> (<N> <item>)' + טוסט 'נרשמו <N> — נכנס ללוח: <lead>' ·
‏'lead' ⇒ patch{stage:'eyes'} + אירוע-סגור '<feat>: <lead> ✓ — <name>' + טוסט
'אושר — נרשם בלוח ובדוח. עכשיו: <eyes>' · ‏'eyes' ⇒ patch{stage:'answer'} +
אירוע-פתוח '<feat>: <answer> — <name> (<eyesTotal> <unit>)' + טוסט 'נרשם —
נכנס ללוח: <answer>' · ‏'answer' בלי answerPushed ⇒ patch{answerPushed:true} +
אירוע-פתוח '<feat>: <answer> — <name>' + טוסט 'נמסר — נרשם בלוח היומי ובכרטיס' ·
‏'answer' עם answerPushed ⇒ patch{stage:'done'} + אירוע-סגור
'<feat>: <done> — <name>' + טוסט 'הטיפול הושלם ✓ — נרשם בלוח'.
**שקעים (חוק-1 — אובייקט sockets):** ayinActionVisible(a)→boolean ·
featLabel(cfg)/itemLabel(cfg)/unitLabel(cfg)→תוויות-מונחים ·
stageLabel(cfg,stage)→תווית-שלב · eyesTotal(a)→סכום-המונים.
**קלט:** cfg · name · a ({stage,names[],answerPushed?}) · sockets.
**פלט:** {patch, event:{title,done}, toast} | null.
**דוגמאות מחייבות (תוויות ברירת-המחדל של maor: feat='מעקב טיפול' ·
item='שם לטיפול' · unit='כמות' · שלבים lead='בהכנה'/eyes='רישום'/
answer='מסירה'/done='הושלם' · name='רות'):**
‏stage='new', 2 שמות ⇒ patch={stage:'lead'} · event.title=
'מעקב טיפול: בהכנה — רות (2 שם לטיפול)' · done=false · toast=
'נרשמו 2 — נכנס ללוח: בהכנה' ·
‏stage='new', 0 שמות ⇒ null (לא-נראה) ·
‏stage='lead' ⇒ event={title:'מעקב טיפול: בהכנה ✓ — רות',done:true} ·
toast='אושר — נרשם בלוח ובדוח. עכשיו: רישום' ·
‏stage='eyes', מונים 3+2 ⇒ patch={stage:'answer'} · event.title=
'מעקב טיפול: מסירה — רות (5 כמות)' · toast='נרשם — נכנס ללוח: מסירה' ·
‏stage='answer', answerPushed=false ⇒ patch={answerPushed:true} · event=
{title:'מעקב טיפול: מסירה — רות',done:false} · toast='נמסר — נרשם בלוח היומי ובכרטיס' ·
‏stage='answer', answerPushed=true ⇒ patch={stage:'done'} · event=
{title:'מעקב טיפול: הושלם — רות',done:true} · toast='הטיפול הושלם ✓ — נרשם בלוח' ·
‏stage='done' ⇒ null.
**מוצא:** חולץ כלשונו מ-maor/src/lib/ayin.ts:177-225 (כל השכנים שוקעו).
