# חוזה · חוט box-total
**תפקיד:** סך-הריקונים של קופת-צדקה — סכימת `amount` על `box.collections`,
כשרק מספרים סופיים (`Number.isFinite`) נספרים: ‏NaN / Infinity / מחרוזת
("50") / ‏null — נבלעים כ-0 ולא מפילים את הסכום.
**קלט:** box עם `collections: {amount}[]`. **פלט:** מספר (0 כשאין ריקונים).
**שקעים:** אין — אטום עצמאי מוחלט (‏Number.isFinite = שפה).
**דוגמאות מחייבות:**
- ‏{collections:[{amount:100},{amount:50}]} ⇒ ‏150
- ‏{collections:[]} ⇒ ‏0
- ‏{collections:[{amount:100},{amount:NaN},{amount:'50'},{amount:Infinity}]} ⇒ ‏100
  (מחרוזת אינה מספר-סופי — לא נספרת; זהו חוזה-הקוד כלשונו)
- ‏{collections:[{amount:-30},{amount:100}]} ⇒ ‏70 (שלילי סופי — נספר)
- ‏{collections:[{amount:0.5},{amount:0.25}]} ⇒ ‏0.75
**מוצא:** maor/src/components/tzedaka/lib.ts:52-55 (‏boxTotal, מנוע קופות-הצדקה
הטהור). חולץ כלשונו — אפס שינוי.
