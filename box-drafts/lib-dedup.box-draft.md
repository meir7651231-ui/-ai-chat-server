# 📦 טיוטת-קופסה · lib-dedup
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/dedup.ts). ‏13 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· normPhone (27ש) ← פנימי: normPhone ← שקעים-חיצוניים: nameCityKey,phonesOf
· findDuplicateGroups (67ש) ← פנימי: findDuplicateGroups ← שקעים-חיצוניים: phonesOf,union,nameCityKey
· mergeFamilies (80ש) ← פנימי: mergeFamilies,normPhone ← שקעים-חיצוניים: pick,rank,firstNonEmpty,dedupById,flatMap
· DUP_FIELDS (22ש)
· dupFieldValue (13ש) ← פנימי: dupFieldValue
· mergeFamiliesByFields (48ש) ← פנימי: mergeFamiliesByFields,mergeFamilies,dupFieldValue ← שקעים-חיצוניים: supNameCityKey
· normId (14ש) ← פנימי: normId
· findSupporterDupGroups (56ש) ← פנימי: findSupporterDupGroups,normPhone,normId ← חוטי-מודולים-אחרים: nameSortKey ← שקעים-חיצוניים: union,link,supNameCityKey
· mergeSupporterInto (46ש) ← פנימי: mergeSupporterInto ← חוטי-מודולים-אחרים: mergeHist
· mergeSupportersGroup (16ש) ← פנימי: mergeSupportersGroup,mergeSupporterInto
· SUP_DUP_FIELDS (13ש)
· supDupFieldValue (13ש) ← פנימי: supDupFieldValue
· mergeSupportersByFields (24ש) ← פנימי: mergeSupportersByFields,mergeSupportersGroup,supDupFieldValue
