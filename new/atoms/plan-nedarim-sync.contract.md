# חוזה · חוט plan-nedarim-sync
**תפקיד:** מנוע-הסנכרון נדרים→מאור — מייצר **תוכנית-סנכרון** טהורה (לא משנה קלט):
מתאים כל תורם/עסקה לכרטיס-תומך לפי מפתחות-שיוך (ext→ת"ז→טלפון→אימייל→שם+עיר,
דרך שקע-keysOf), עם נפילה לקישור-לפי-שם חסין-סדר (שקע-nameSortKey; שם המשותף
ל-2 כרטיסים = עמום ⇒ לא מתאימים לפיו).
**התנהגות:**
- שלב 1 · תורמים: התאמה ⇒ העשרה (מילוי-שדות-**ריקים** בלבד + קביעת extId;
  שינוי ⇒ updatedSupporters++ ורישום-מחדש של המפתחות); אין-התאמה ⇒ כרטיס חדש
  (שקע-supFromDonor, מזהה דטרמיניסטי) ⇒ newSupporters++.
- שלב 2 · עסקאות: ‏amount=0 (ביטול) ⇒ chargesNonPositive++, מסומן handled, לא ל-hist.
  דדופ לפי שקע-chargeDedupKey מול hist הקיים (שקע-histDedupKey) ⇒ chargesDup++,
  handled, לא נוסף. מפתח ריק ⇒ chargesNoTxn++ (עדיין נוסף). חיוב-רגיל ⇒ שורת-hist
  (שקע-chargeToHist) + מילוי-הו"ק (שקע-withNedarimHok) + chargesAdded++
  (+recurring++ אם kevaId). זיכוי (amount<0) ⇒ שורת-hist שלילית **בלי** הו"ק ⇒
  refundsApplied++. הצבירה ilsAdded/usdAdded לפי שקע-curOf (זיכוי מקזז — נטו).
- אין-כרטיס-תואם לעסקה: ‏opts.attachOnly ⇒ chargesSkipped++ (לא handled, לא נוצר
  כרטיס; קישור-לפי-שם **כבוי** במצב זה); זיכוי-יתום ⇒ chargesSkipped++;
  אחרת ⇒ כרטיס חדש (שקע-supFromCharge; אם המזהה-הדטרמיניסטי כבר קיים — מאתרים אותו).
- ‏newNames/updatedNames — עד 40 לתצוגה-מקדימה; handledChargeIds — רק מה שחובר/דופל/בוטל.
**שקעים (חוק-1 — קריאות-לשכנים הוזרקו כאובייקט-deps, פרמטר 5):**
- ‏nameSortKey(s)⇒מפתח-שם חסין-סדר ("דוד כהן"≡"כהן דוד"; ריק⇒'')
- ‏keysOf(o)⇒string[] מפתחות-שיוך ‏['ext:..','id:..','ph:..','em:..','nc:..']
- ‏normId(s)⇒ת"ז מנורמלת או '' (‏"000000000" של נדרים ⇒ '')
- ‏supFromDonor(d)⇒Supporter חדש (id='sup-ned-'+toremId)
- ‏supFromCharge(c,seq)⇒Supporter חדש מעסקה
- ‏histDedupKey(h) · chargeDedupKey(c) ⇒ 'txn:..'/'ref:..'/'' (מקבילים)
- ‏chargeToHist(c)⇒שורת-hist {d,a,c,clearer,txn?,kevaId?,...}
- ‏withNedarimHok(sp,c)⇒sp עם משבצת-הו"ק ממולאת (רק חיוב-kevaId; ידני לא נדרס)
- ‏curOf(c)⇒'₪'|'$'
**קלט:** existing:Supporter[] · donors · charges · opts{attachOnly?} · deps.
**פלט:** ‏{ supporters, summary, newNames, updatedNames, handledChargeIds }.
**דוגמאות מחייבות (עם שקעי-הייחוס של הבדיקה, נאמנים למקור):**
1. קיים ‏{id:'s1',name:'דוד כהן',extId:'T1',phone:''} + תורם ‏{toremId:'T1',phone:'0501234567'}
   ⇒ ‏updatedSupporters=1 · newSupporters=0 · ‏supporters[0].phone='0501234567' ·
   ‏updatedNames=['דוד כהן']
2. ‏existing=[] + תורם ‏{toremId:'T2',name:'שרה לוי'} ⇒ ‏newSupporters=1 ·
   ‏supporters[0].id='sup-ned-T2' · ‏newNames=['שרה לוי']
3. קיים ‏{id:'s1',name:'כהן דוד'} + תורם ‏{toremId:'T9',name:'דוד כהן',zeout:'000000000'}
   ⇒ קישור-לפי-שם (ת"ז-אפסים לא מפתח; שם חסין-סדר) ⇒ ‏updatedSupporters=1 ·
   ‏newSupporters=0 · ‏supporters[0].extId='T9'
4. קיים עם ‏hist=[{txn:'99',a:100}] + עסקה ‏{id:'c1',amount:100,toremId:'T1',txnId:'99'}
   ⇒ ‏chargesDup=1 · chargesAdded=0 · ilsAdded=0 · ‏handledChargeIds=['c1'] ·
   ‏hist נשאר באורך 1
5. קיים ‏'דוד כהן' + זיכוי ‏{id:'c2',amount:-50,name:'כהן דוד',d:'2026-02-01'}
   ⇒ ‏refundsApplied=1 · ilsAdded=-50 · chargesNoTxn=1 (אין txn/ref) ·
   שורת-hist‏ a=-50 · אין hok
6. ‏attachOnly:true · ‏existing=[] + עסקה ‏{id:'c3',amount:80,name:'חדש לגמרי'}
   ⇒ ‏chargesSkipped=1 · newSupporters=0 · ‏handledChargeIds=[] · ‏supporters=[]
7. ‏existing=[] + עסקה ‏{id:'c4',amount:200,toremId:'T3',name:'משה',txnId:'500',
   kevaId:'K1',d:'2026-03-10'} ⇒ ‏newSupporters=1 · ‏id='sup-ned-T3' ·
   ‏chargesAdded=1 · recurring=1 · ilsAdded=200 · ‏hok.kevaId='K1' ·
   ‏handledChargeIds=['c4']
**מוצא:** maor/src/lib/nedarimSync.ts:541-694 (‏planNedarimSync). השכנים
(keysOf/curOf/chargeToHist/withNedarimHok/histDedupKey/chargeDedupKey/
supFromDonor/supFromCharge מאותו קובץ · nameSortKey מ-validate · normId מ-dedup)
הפכו לשקעי-deps (חוק-1).
