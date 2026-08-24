# חוזה · חוט warehouse-overview
**תפקיד:** סקירת-מחסן (ורטיקל-הסטודיו): לכל פריט-מחסן, כמה הוקצה בפרויקטים
(סכום כמויות-החומרים ‏sp.ayin.mat[].qty לפי התאמת-שם מנורמלת) וכמה נותר.
ההקצאה נגזרת — אפס-כתיבה. מעבר-יחיד מעל כל רשומות-החומרים, דטרמיניסטי.
צבירה פר-פרויקט-ושם (כמה רשומות מאותו-חומר בפרויקט אחד = שורה אחת מסוכמת);
שם-ריק (אחרי-נרמול) מדולג; סכום-פרויקט ‏≤0 מדולג; ‏+qty לא-מספרי ⇒ 0.
**קלט:** warehouse — ‏[{name, qty, cost?…}] · supporters — ‏[{id, name, ayin?:{mat?:[{name,qty}]}}] ·
שקע-norm.
**שקע (חוק-1 — helper פרטי מאותו קובץ הוזרק כפרמטר):**
- ‏norm(s) ⇒ string — נרמול-שם להתאמה (warehouse.ts:23-25):
  ‏(s||'').trim().replace(/\s+/g,' ').toLowerCase().
**פלט:** מערך באורך-המחסן ובסדרו: ‏{item, allocated, remaining, short, byProject}
כאשר ‏remaining = (+item.qty||0) − allocated · ‏short = remaining<0 ·
‏byProject = ‏[{id,name,qty}] ממוין יורד לפי qty (רק פרויקטים שצורכים).
**דוגמאות מחייבות** (מחסן ‏[{name:'צבע לבן',qty:10}], שקע-norm של maor):
- פרויקט p1 עם ‏mat=[{name:'צבע לבן',qty:3},{name:' צבע  לבן ',qty:2}] →
  ‏allocated=5, remaining=5, short=false, byProject=[{id:'p1',qty:5}]
  (נרמול-רווחים מאחד את שתי הרשומות לשורת-פרויקט אחת)
- שני פרויקטים p1‏(qty:2)‏ ו-p2‏(qty:7) → ‏allocated=9, remaining=1,
  ‏byProject=[p2,p1] (יורד לפי qty)
- מחסן ‏qty:4 מול הקצאה 6 → ‏remaining=-2, short=true
- ‏mat=[{name:'',qty:9},{name:'צבע לבן',qty:0}] → ‏allocated=0
  (שם-ריק מדולג; סכום 0 לא נצבר)
- ‏supporters=[] → לכל פריט ‏allocated=0, remaining=+qty||0, byProject=[]
- פריט ‏{name:'ברגים',qty:'x'} בלי-צריכה → ‏remaining=0 (‏+qty לא-מספרי ⇒ 0)
**מוצא:** maor/src/lib/warehouse.ts:31-67 (‏warehouseOverview, "מנוע-מחסן ·
מלאי-חומרים חוצה-פרויקטים — טהור ודטרמיניסטי"). ‏norm היה helper פרטי
באותו קובץ — הפך לשקע (חוק-1).
