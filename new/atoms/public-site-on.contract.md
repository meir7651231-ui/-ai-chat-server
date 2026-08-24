# חוזה · חוט public-site-on
**תפקיד:** המצב הלוגי "האתר-הציבורי פעיל לארגון": הדגל ‏shell.publicsite דלוק
**וגם** קיים תוכן-‏site **וגם** הוא לא כובה במפורש (‏enabled!==false — חסר=פעיל,
חוזה-הדגלים). הגידור על בקשת-הכתובת (‎?site‎) הוא חיווט-App — לא כאן. טהור.
**שקעים (חוק-1 — קריאת-השכן הוזרקה כפרמטר):**
- ‏featureOn(cfg, key)⇒boolean — בורר-הדגלים ההיררכי (בקוד-המקור: השכן
  featureOn ב-config.ts:40 — קיים תחת quarry; החיבור בקופסה).
**קלט:** ‏cfg (‏{site?: {enabled?}, …}) + השקע. **פלט:** ‏boolean.
**דוגמאות מחייבות** (בכולן ‏fOn=(c,k)=>c.features?.[k]!==false — זיוף מינימלי):
1. ‏cfg={features:{}, site:{enabled:true}} ⇒ ‏true.
2. בלי site: ‏cfg={features:{}} ⇒ ‏false — דגל דלוק לבדו לא מספיק.
3. ‏site כבוי: ‏cfg={features:{}, site:{enabled:false}} ⇒ ‏false.
4. ‏enabled חסר: ‏cfg={features:{}, site:{}} ⇒ ‏true — רק false מפורש מכבה.
5. הדגל כבוי: ‏cfg={features:{'shell.publicsite':false}, site:{enabled:true}}
   ⇒ ‏false.
6. השקע נקרא עם ‏(cfg, 'shell.publicsite') בדיוק; כשהוא מחזיר false —
   ‏site לא נבדק (קיצור-חישוב &&).
**מוצא:** maor/src/lib/config.ts:637-641 (‏publicSiteOn — שער האתר-הציבורי).
השכן featureOn הפך לשקע (חוק-1).
