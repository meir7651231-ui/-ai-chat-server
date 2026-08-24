# חוזה · חוט ayin-advance-label
**תפקיד:** תווית הכפתור-החכם (המקדם לשלב-הבא) לפי השלב הנוכחי — טהור.
‏new ⇒ 'תווית-lead ←' · ‏lead ⇒ '✓ אישור — תווית-lead' · ‏eyes ⇒ 'תווית-answer ←'
· ‏answer ⇒ '✓ תווית-done' אם answerPushed, אחרת '📞 דחיפה ללוח' · ‏done ⇒ ''.
**שקעים (חוק-1):** stageLabel(cfg, stage)→string — תווית-שלב מותאמת-ארגון
(‏termOf; ברירות-המחדל: new='חדש', lead='בהכנה', eyes='רישום', answer='מסירה',
done='הושלם'). ‏cfg מושחל לשקע כמות-שהוא.
**קלט:** cfg · a = {stage, answerPushed?} · שקע stageLabel. **פלט:** string.
**דוגמאות מחייבות (stageLabel = ברירות-המחדל):**
‏{stage:'new'}→'בהכנה ←' · ‏{stage:'lead'}→'✓ אישור — בהכנה' ·
‏{stage:'eyes'}→'מסירה ←' · ‏{stage:'answer', answerPushed:true}→'✓ הושלם' ·
‏{stage:'answer', answerPushed:false}→'📞 דחיפה ללוח' · ‏{stage:'done'}→''.
**מוצא:** חולץ כלשונו מ-maor/src/lib/ayin.ts:154-174 (‏stageLabel שוקע).
