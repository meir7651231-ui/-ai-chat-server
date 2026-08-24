# חוזה · חוט ayin-action-visible
**תפקיד:** האם הכפתור-החכם (מקדם-השלב) של תיק מעקב-הטיפול גלוי — טהור.
‏done ⇒ לעולם לא. ‏new ⇒ רק כשיש לפחות שם אחד. ‏eyes ⇒ רק כשלפחות לשם אחד
יש כמות (eyes) שאינה ריקה/‏null/‏undefined — ‏0 נחשב כמות. כל שלב אחר
(lead/answer) ⇒ גלוי תמיד.
**שקעים (חוק-1):** אין — עצמאי מוחלט.
**קלט:** a = {stage, names[]} (‏names: {eyes?, …}). **פלט:** boolean.
**דוגמאות מחייבות:**
‏{stage:'done', names:[{name:'א'}]}→false · ‏{stage:'new', names:[]}→false ·
‏{stage:'new', names:[{name:'א'}]}→true ·
‏{stage:'eyes', names:[{eyes:''},{}]}→false (ריק/‏undefined לא נספרים) ·
‏{stage:'eyes', names:[{eyes:0}]}→true (‏0 = כמות לגיטימית) ·
‏{stage:'lead', names:[]}→true · ‏{stage:'answer', names:[]}→true.
**מוצא:** חולץ כלשונו מ-maor/src/lib/ayin.ts:145-153.
