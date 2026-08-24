# חוזה · חוט names-to-template-lines
**תפקיד:** ממיר פריטי-"עין" (AyinName — שם · eyes ‏[כמות, לרוב מחרוזת] · rate)
לשורות-תבנית-הצעה רזות {name, qty, rate}: שם נחתך-רווחים; שורה בלי שם
(ריק/רווחים) נופלת; ‏qty = ‏+eyes עם נפילה ל-0 (לא-מספר/ריק/NaN ⇒ 0);
‏rate = ‏rate||0 (חסר/undefined ⇒ 0). לא משנה את הקלט.
**קלט:** מערך {name:string, eyes:any, rate?:number}. **פלט:** מערך {name,qty,rate}.
**דוגמאות מחייבות:**
1. ‏[{name:' דוד ', eyes:'3', rate:5}] ⇒ ‏[{name:'דוד', qty:3, rate:5}] (חיתוך + מספור).
2. ‏[{name:'  ', eyes:'2', rate:9}] ⇒ ‏[] (שם-רווחים בלבד ⇒ השורה נופלת).
3. ‏[{name:'לוי', eyes:'abc'}] ⇒ ‏[{name:'לוי', qty:0, rate:0}] (‏+‏'abc'=NaN ⇒ 0; ‏rate חסר ⇒ 0).
4. ‏[{name:'כהן', eyes:2.5, rate:0}] ⇒ ‏[{name:'כהן', qty:2.5, rate:0}] (מספר עובר כמו-שהוא).
5. ‏[] ⇒ ‏[] · וכן ‏[{name:'א', eyes:'', rate:7}] ⇒ ‏[{name:'א', qty:0, rate:7}] (‏+''=0).
**מוצא:** maor/src/lib/ayin.ts:119-125 (‏namesToTemplateLines — למידת-תבניות
מהעין, ורטיקל-הסטודיו). אפס קריאות-חוץ ⇒ אפס שקעים.
