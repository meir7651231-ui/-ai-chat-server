# חוזה · חוט orbit-theme
**תפקיד:** גזירת ערכת-מסך שלמה מ-accent של ארגון: קרקע כהה בגוון-האקסנט
(לגוונים חמים 15°–70° הקרקע מוסטת ‎-12°‎ לעבר מגנטה), אַאוּרוֹרה ±18° סביב
הגוון, כפתור וזוהר באקסנט, טקסט-כפתור מנוגד לפי בהירות-נתפסת (‎>0.62‎ ⇒ כהה),
וסצנת-כדור לפי הגוון: בהיר-מאוד (l>0.86) ⇒ Ice · חם (15°–70°) ⇒ Ember ·
אחרת ⇒ Aurora. ‏accent חסר/לא-תקין (לא ‎#?hex6‎ אחרי trim) ⇒ ערכת-הנפילה כמות-שהיא.
**שקעים (חוק-1):** fallback — ערכת-הנפילה `{vars, scene}` (החוט orbit-blue,
מחווט בקופסה). מוחזר **באותה הפניה** (===) על קלט חסר/לא-תקין.
**קלט:** accent?: string + השקע fallback. **פלט:** `{vars: Record<string,string>, scene}`.
**דוגמאות מחייבות (fallback=FB כלשהו):**
- ‏orbitTheme(undefined, FB)===FB · ‏orbitTheme('#12345', FB)===FB (5 ספרות)
- ‏'#e91e63' ⇒ vars['--o-accent']='#e91e63' · vars['--o-accent-rgb']='233,30,99' ·
  vars['--o-g1']='#31111c' · vars['--o-a1']='rgba(233,30,99,0.30)' ·
  vars['--o-btn-text']='#ffffff' · scene='Aurora'
- ‏'#ff9800' (חם) ⇒ scene='Ember' · vars['--o-g1']='#321e11' (קרקע מוסטת) ·
  vars['--o-btn-text']='#2a1710' (accent בהיר ⇒ טקסט כהה)
- ‏'#ffffff' ⇒ scene='Ice' · vars['--o-accent-rgb']='255,255,255'
- ‏'6ea8fe' (בלי ‎#‎ — תקין) ⇒ vars['--o-accent']='#6ea8fe' · scene='Aurora'
- ‏' #e91e63 ' (רווחים) ⇒ תקין, vars['--o-accent']='#e91e63'
**מוצא:** חולץ כלשונו מ-maor/src/lib/orbitTheme.ts:38-131 (ערכי-הזהב הוקלטו
מהרצת קוד-המקור); ORBIT_BLUE שוקע ל-fallback.
