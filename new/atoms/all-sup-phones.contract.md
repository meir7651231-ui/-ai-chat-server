# חוזה · חוט all-sup-phones
**תפקיד:** תורם ⇒ רשימת כל הטלפונים שלו — הראשי (`phone`) ואז `phones[]` —
כל אחד עם סיווג-אזור, בשורה אחידה. דטרמיניסטי.
**קלט:**
- `sp` — אובייקט-תורם: `{ phone?, phones?: [{ num, label?, note?, wa? }] }`.
- `phoneRegion` — **שקע** (חוט-שכן, מוזרק): `(num:string) ⇒ 'il' | 'intl'`.
**פלט:** מערך שורות `{ num, label, note, wa, region, primary }`.
**התנהגות:**
- אם `sp.phone` קיים ⇒ שורה ראשונה `{ label:'', note:'', wa:false, primary:true }`.
- לכל `p` ב-`sp.phones` **עם `num`** ⇒ שורה `{ label:p.label??'', note:p.note??'', wa:!!p.wa, primary:false }`.
- `p` בלי `num` ⇒ מדולג. `region` תמיד מ-`phoneRegion(num)`.
**דוגמאות מחייבות (עם שקע `reg = n => n.startsWith('0') ? 'il' : 'intl'`):**
- ‏`{}` → `[]`
- ‏`{phone:'0501234567'}` → `[{num:'0501234567',label:'',note:'',wa:false,region:'il',primary:true}]`
- ‏`{phone:'+15551234'}` → `[{num:'+15551234',label:'',note:'',wa:false,region:'intl',primary:true}]`
- ‏`{phones:[{num:'0521111111',label:'בית',wa:true}]}` → `[{num:'0521111111',label:'בית',note:'',wa:true,region:'il',primary:false}]`
- ‏`{phones:[{num:''},{num:'0523333333',note:'נייד'}]}` → `[{num:'0523333333',label:'',note:'נייד',wa:false,region:'il',primary:false}]`
- ‏`{phone:'0501234567',phones:[{num:'0522222222'}]}` → שתי שורות (ראשי primary:true, ואז additional primary:false)
**מוצא:** maor/src/components/supporters/lib.ts:283-292 (`allSupPhones`). במקור קרא ל-`phoneRegion`
מאותו מודול — כאן הוזרם כשקע-פרמטר (חוק-1: אפס import פנימי).
