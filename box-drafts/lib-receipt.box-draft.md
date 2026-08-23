# 📦 טיוטת-קופסה · lib-receipt
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/receipt.ts). ‏7 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· receiptVerifyCode (11ש) ← פנימי: receiptVerifyCode ← שקעים-חיצוניים: charCodeAt,imul,toString
· receiptLines (64ש) ← פנימי: receiptLines,receiptVerifyCode ← חוטי-מודולים-אחרים: hebDateFull,amountInWords ← שקעים-חיצוניים: isNaN,getTime,toLocaleDateString,receipt,hebrewLocaleDate
· downloadReceipt (25ש ⚠️לא-טהור) ← פנימי: downloadReceipt,receiptLines ← חוטי-מודולים-אחרים: guardExport ← שקעים-חיצוניים: createElement,createObjectURL,click,setTimeout,revokeObjectURL
· receiptHtml (26ש ⚠️לא-טהור) ← פנימי: receiptHtml,receiptLines
· printReceipt (24ש ⚠️לא-טהור) ← פנימי: printReceipt,receiptHtml ← חוטי-מודולים-אחרים: guardExport ← שקעים-חיצוניים: createElement,setAttribute,focus,print,setTimeout
· deliverReceipt (9ש) ← פנימי: deliverReceipt,printReceipt,downloadReceipt
· receiptFmtOf (4ש) ← פנימי: receiptFmtOf ← חוטי-מודולים-אחרים: featureOn
