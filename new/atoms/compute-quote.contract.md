# חוזה · חוט compute-quote
**תפקיד:** מנוע הצעת-מחיר — מחשב פירוט-חיוב מלא מטבלת-מחירים נתונה: מודולים
דלוקים (חסר=דלוק, רק false מכבה) + הרחבות ⇒ שורות-חיוב (מחיר>0), "כלול בבסיס"
(מחיר 0), חודשי=‏round((base+subtotal)×sizeMult), תשלום-ראשון=חודשי+הקמה,
שנתי=×12, שנתי-מוזל=×10, ונתוני-Enterprise כהעברה. המנוע לא קובע מחיר —
רק מחשב מטבלה נתונה.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏allModules — מערך כל מפתחות-המודולים (בקוד-המקור: ‏ALL_MODULES השכן).
  קובע גם את סדר-השורות.
- ‏nameOf(m)⇒string — תווית-מודול (בקוד-המקור מכבד termOf של הלקוח).
**קלט:** ‏cfg ‏{modules?} · size · prices ‏{base,modules,integrations,sizeMult,
setup,enterprise} · nameOf · allModules · addons=[] ‏[{key,label}] ·
mode='subscription'. **פלט:** אובייקט-Quote מלא.
**דוגמאות מחייבות** (טבלה P: base=290 · modules ‏{families:0,courses:120,
supporters:180} · integrations ‏{whatsapp:50} · sizeMult ‏{small:1,medium:1.6} ·
setup=1500 · enterprise ‏{oneTime:55000,annualMaintenance:9000} ·
allModules=['families','courses','supporters']):
1. ‏cfg={modules:{courses:false}}, size='small', בלי addons ⇒
   lines=[supporters@180] · included=[families@0] · modulesSubtotal=180 ·
   monthly=470 · firstPayment=1970 · yearly=5640 · yearlyDiscounted=4700.
2. ‏cfg={} (הכל דלוק), size='medium', addons=[{key:'whatsapp',label:'וואטסאפ'}] ⇒
   lines=[courses@120, supporters@180, whatsapp@50(kind:'integration')] ·
   modulesSubtotal=350 · sizeMult=1.6 · monthly=round(640×1.6)=1024 ·
   firstPayment=2524 · yearlyDiscounted=10240.
3. גודל לא-מוכר 'huge' ⇒ ‏sizeMult=1 (נפילה): ‏cfg={} בלי addons ⇒ monthly=590.
4. הרחבה בלי מחיר בטבלה (key='zzz') ⇒ מחירה 0 ⇒ **לא** נכנסת ל-lines.
5. ‏mode='enterprise' + טבלה בלי ‏setup (undefined) ⇒ setup=0 ·
   firstPayment=monthly · mode='enterprise' · enterpriseOneTime=55000 ·
   enterpriseAnnual=9000 (העברה כמו-שהם).
**מוצא:** maor/src/lib/pricing.ts:152-187 (‏computeQuote); השכן ALL_MODULES
הפך לשקע allModules (חוק-1). nameOf היה כבר פרמטר במקור.
