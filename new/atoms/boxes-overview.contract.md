# חוזה · חוט boxes-overview
**תפקיד:** מבט "כל הקופות" — שורה לכל קופה ב-`db.tzBoxes` עם שם-הרכז
(‏tzCoordinators לפי coordinatorId), שם-המשפחה (‏families לפי famId), ריקון-אחרון
וסך-כולל; רכז/משפחה שלא נמצאו ⇒ ''. אחר-כך: סינון-סטטוס (status ריק = הכול),
חיפוש דרך שקע-smartFilter (מונחים: '#'+num · num · שם-הרכז · כל מילה משם-הרכז
בנפרד · שם-המשפחה), ומיון לפי sort:
- ‏'num' — מספר-קופה עולה (‏parseInt; לא-מספרי ⇒ 0 וצף לראש)
- ‏'lastCollection' — ‏localeCompare עולה: ריק ('' = מעולם-לא-רוקנה) ראשון,
  אחריו הישן-ביותר — לרדיפה
- ‏'total' — סך-כולל יורד
המיון על עותק (‏[...rows]) — הקלט לא משתנה.
**שקעים (חוק-1 — קריאות-שכן הוזרקו):**
- ‏lastCollectionIso(box) ⇒ ‏iso|'' — תאריך-הריקון המאוחר בקופה ('' כשאין;
  קיים כאטום last-collection-iso? במקור: tzedaka/lib.ts:26-30).
- ‏boxTotal(box) ⇒ ‏number — סך-הריקונים (האטום box-total).
- ‏smartFilter(q, rows, getTerms) ⇒ ‏rows — חיפוש-חכם: ‏q ריק ⇒ עותק-הכול;
  אחרת מסנן/מדרג לפי המונחים (האטום smart-filter).
**קלט:** db{tzBoxes,tzCoordinators,families} · q · status ('' | ערך) ·
sort ('num'|'lastCollection'|'total') · שלושת השקעים.
**פלט:** ‏{box, coordName, famName, last, total}[].
**דוגמאות מחייבות** (‏db: קופות num '12' (רכז c1, משפחה f1, ריקונים 100+50,
אחרון '2026-03-01', סטטוס 'active') · num '3' (רכז c2, משפחה f2, בלי ריקונים,
'returned') · num '7' (רכז c1, בלי famId, ריקון 200 ב-'2026-02-01', 'active');
רכזים c1='רבקה כהן', c2='שרה לוי'; משפחות f1='משפחת פרץ', f2='משפחת גל';
שקעים: ‏lastCollectionIso=מקס-תאריך, ‏boxTotal=סכימה, ‏smartFilter=עותק כש-q
ריק / הכלה-במונח אחרת):
1. ‏q='', status='', sort='num' ⇒ סדר מספרי: '3','7','12'; השורה של '12':
   coordName='רבקה כהן', famName='משפחת פרץ', last='2026-03-01', total=150.
2. השורה של '7': ‏famName='' (‏famId ריק ⇒ לא נמצא).
3. ‏status='active' ⇒ 2 שורות ('12','7' בלבד).
4. ‏sort='total' ⇒ יורד: '7'(200), '12'(150), '3'(0).
5. ‏sort='lastCollection' ⇒ '3'(''), '7'('2026-02-01'), '12'('2026-03-01') —
   מעולם-לא ראשון.
6. ‏q='רבקה' (שקע-ההכלה) ⇒ רק קופות הרכז c1: '3' נופלת, נשארות '12','7'.
**מוצא:** maor/src/components/tzedaka/lib.ts:203-232 (‏boxesOverview). חולץ
כלשונו; שלוש קריאות-השכן שוקעו.
