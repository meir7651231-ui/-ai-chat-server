# חוזה · חוט normalize-prices
**תפקיד:** נירמול טבלת-מחירים לא-אמינה (localStorage של המטמיע) לטבלה מלאה
ותקינה: כל שדה עובר שומר-מספר — רק ‏number סופי ו-≥0 מתקבל (0 חוקי!), כל ערך
אחר (שלילי/NaN/מחרוזת/חסר) ⇒ ברירת-המחדל. מודולים — רק המפתחות שב-ALL_MODULES
(זרים נזרקים; ברירת-מחדל חסרה ⇒ 0); הרחבות — רק מפתחות DEFAULT_INTEGRATION_PRICES.
קלט שאינו אובייקט ⇒ טבלת-ברירות-המחדל המלאה.
**שקעים (חוק-1 + חוק-5 — טבלאות-הידע הוזרקו כפרמטרים; המחירים נתון-בעלים עריך):**
- ‏ALL_MODULES — מערך מפתחות-המודולים (במקור:
  ‏['families','courses','calendar','diary','supporters','reports','tzedaka','shop','shop7']).
- ‏DEFAULT_PRICES — טבלת-ברירות-המחדל
  ‏`{base, modules, integrations, sizeMult:{small,medium,large}, setup, enterprise:{oneTime,annualMaintenance}}`.
- ‏DEFAULT_INTEGRATION_PRICES — מילון הרחבה⇒מחיר (במקור ‏DEFAULT_PRICES.integrations
  מצביע על אותה טבלה).
**קלט:** raw (unknown) · שלושת השקעים. **פלט:** טבלת-מחירים מלאה (PriceTable).
**דוגמאות מחייבות** (שקעי-דמה: ‏ALL_MODULES=['families','courses'] ·
‏DEFAULT_INTEGRATION_PRICES={whatsapp:50,ai:120} · ‏DEFAULT_PRICES={base:290,
modules:{families:0,courses:120}, integrations:(אותו מילון), sizeMult:{small:1,
medium:1.6,large:2.4}, setup:1500, enterprise:{oneTime:55000,annualMaintenance:9000}}):
1. ‏raw=null ⇒ הטבלה המלאה מברירות-המחדל: ‏base=290 · ‏modules={families:0,courses:120} ·
   ‏integrations={whatsapp:50,ai:120} · ‏sizeMult={small:1,medium:1.6,large:2.4} ·
   ‏setup=1500 · ‏enterprise={oneTime:55000,annualMaintenance:9000}.
2. ‏raw={base:-5} ⇒ ‏base=290 (שלילי נדחה).
3. ‏raw={base:350, modules:{courses:0}} ⇒ ‏base=350 · ‏courses=0 (אפס מתקבל).
4. ‏raw={base:'100', sizeMult:{small:NaN}} ⇒ ‏base=290 · ‏small=1 (מחרוזת/NaN נדחים).
5. ‏raw={modules:{shop:999}} ⇒ ‏modules={families:0,courses:120} — מפתח-זר נזרק.
6. ‏raw={integrations:{whatsapp:70, junk:5}} ⇒ ‏integrations={whatsapp:70,ai:120} —
   ‏junk נזרק, ‏ai מברירת-המחדל.
7. ‏raw={enterprise:{oneTime:40000}} ⇒ ‏oneTime=40000 · ‏annualMaintenance=9000.
**מוצא:** maor/src/lib/pricing.ts:122-151 (‏normalizePrices, "נירמול טבלת-מחירים
לא-אמינה (localStorage)"). השכנים ALL_MODULES (platform/lib) + DEFAULT_PRICES +
DEFAULT_INTEGRATION_PRICES (קבועי-הקובץ, placeholder עריך של הבעלים) הפכו לשקעים.
