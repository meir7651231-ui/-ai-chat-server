# 📦 טיוטת-קופסה · lib-vcardImport
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/vcardImport.ts). ‏5 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· decodeQuotedPrintable (114ש) ← פנימי: decodeQuotedPrintable ← שקעים-חיצוניים: parseInt,charCodeAt,decode,unfoldLines,splitProperty
· parseVcards (76ש) ← פנימי: parseVcards ← שקעים-חיצוניים: unfoldLines,splitProperty,decodeValue,phoneLabel,joinAddress
· isJunkContact (7ש) ← פנימי: isJunkContact ← שקעים-חיצוניים: digitsOnly
· importableContacts (19ש) ← פנימי: importableContacts,parseVcards,isJunkContact
· contactToRow (12ש) ← פנימי: contactToRow
