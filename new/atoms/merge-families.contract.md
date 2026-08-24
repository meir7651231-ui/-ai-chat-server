# חוזה · חוט merge-families
**תפקיד:** מיזוג משפחות-כפולות אל "שומר" (keeper) — ה-losers נספגים, **אפס
אובדן נתונים**: שדות-טקסט ריקים בשומר מתמלאים מהערך הראשון הלא-ריק (סדר:
שומר←losers); ‏phone2 ריק מתמלא מטלפון ששונה-מנורמל מהראשי; מוני-ילדים =
מקסימום; ‏fullSefach = ‏OR; סטטוס = הגבוה (‏active>pending>inactive); בני-משפחה
ומסמכים מאוחדים בדה-דופ-לפי-id (שיבוצים/תשלומים שורדים); ‏createdAt = המוקדם;
הערות מאוחדות (ייחודיות, ‏' · ') + סמן ‏"| מוזג: <שמות>". ‏cred נשאר של השומר.
טהור — מחזיר Family חדש, לא משנה קלט.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כאובייקט deps):**
- ‏deps.normPhone(s) ⇒ מחרוזת — נרמול-טלפון להשוואה (במקור: ספרות-בלבד,
  ‏972→0, ספרה-חוזרת ⇒ ''; קיים כחוט ‏norm-phone).
- ‏deps.dedupById(items) ⇒ מערך — דה-דופ לפי ‏id, המופע הראשון שורד והסדר נשמר.
**קלט:** ‏keeper (Family) · ‏losers (Family[]) · ‏deps. **פלט:** ‏Family ממוזג.
**דוגמאות מחייבות** (בכולן ‏normPhone=(s)=>(s||'').replace(/\D/g,'') ·
‏dedupById=ראשון-לפי-id):
1. השלמת-ריקים + phone2 + איחוד-חברים: ‏keeper={id:'f1',name:'כהן',father:'',
   phone:'050-1111111',status:'inactive',members:[{id:'m1'}],docs:[],
   createdAt:'2026-02-01',notes:''} · ‏loser={id:'f2',name:'כהן',father:'יוסף',
   phone:'0502222222',status:'active',members:[{id:'m1'},{id:'m2'}],docs:[],
   createdAt:'2026-01-15',notes:'ותיקה'} ⇒ ‏father='יוסף' · ‏phone='050-1111111'
   (של-השומר נשמר) · ‏phone2='0502222222' (שונה-מנורמל מהראשי) ·
   ‏status='active' · ‏members=[m1,m2] (m1 פעם אחת) · ‏createdAt='2026-01-15' ·
   ‏notes='ותיקה | מוזג: כהן' · ‏id='f1'.
2. דירוג-סטטוס: שומר ‏pending + ‏losers [inactive, active] ⇒ ‏active.
3. מונים/ספח: ‏kidsHome 2 מול 5 ⇒ ‏5; ‏fullSefach false מול true ⇒ ‏true.
4. טלפון זהה-מנורמל אינו הופך phone2: שומר ‏phone='0501111111' · לוזר
   ‏phone='050-111-1111' (אותן ספרות) ⇒ ‏phone2='' נשאר ריק.
5. הערות זהות לא מוכפלות: שניהם ‏notes='חשוב', לוזר ‏name='לוי' ⇒
   ‏notes='חשוב | מוזג: לוי'.
6. immutability: אחרי דוגמה 1 — ‏keeper.father עדיין ‏'' ו-keeper.members באורך 1.
**מוצא:** maor/src/lib/dedup.ts:109-188 (‏mergeFamilies — "עקרון-בטיחות:
המיזוג משמר הכול, לעולם לא מוחק רשומה כספית"). השכנים ‏normPhone (מיוצא)
ו-dedupById (עוזר-קובץ פרטי) הפכו לשקעי-deps (חוק-1).
