# 📦 טיוטת-קופסה · lib-csvx
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/csvx.ts). ‏7 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· csvEscape (10ש) ← פנימי: csvEscape
· toCsv (5ש) ← פנימי: toCsv
· downloadCsv (16ש ⚠️לא-טהור) ← פנימי: downloadCsv,toCsv ← חוטי-מודולים-אחרים: guardExport ← שקעים-חיצוניים: createElement,createObjectURL,click,setTimeout,revokeObjectURL
· decodeCsvBuffer (21ש) ← פנימי: decodeCsvBuffer ← שקעים-חיצוניים: decode,subarray
· readCsvFileText (8ש) ← פנימי: readCsvFileText,decodeCsvBuffer ← שקעים-חיצוניים: arrayBuffer
· parseCsv (49ש) ← פנימי: parseCsv
· parseAnyDate (40ש) ← פנימי: parseAnyDate ← שקעים-חיצוניים: getUTCFullYear,getUTCMonth,getUTCDate,getFullYear,setUTCDate
