# 📦 טיוטת-קופסה · lib-search
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/search.ts). ‏6 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· XLAT (60ש)
· levenshtein (28ש) ← פנימי: levenshtein
· scoreTerm (29ש) ← פנימי: scoreTerm,levenshtein ← חוטי-מודולים-אחרים: normSearch
· expandQuery (20ש) ← פנימי: expandQuery ← חוטי-מודולים-אחרים: normSearch
· smartScore (39ש) ← פנימי: smartScore,expandQuery,scoreTerm ← חוטי-מודולים-אחרים: normSearch
· smartFilter (17ש) ← פנימי: smartScore ← חוטי-מודולים-אחרים: normSearch ← שקעים-חיצוניים: getTerms
