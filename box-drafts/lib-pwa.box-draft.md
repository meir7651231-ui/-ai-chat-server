# 📦 טיוטת-קופסה · lib-pwa
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/pwa.ts). ‏6 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· installAvailable (5ש) ← פנימי: installAvailable
· promptInstall (9ש) ← פנימי: promptInstall ← שקעים-חיצוניים: prompt
· isStandalone (7ש ⚠️לא-טהור) ← פנימי: isStandalone
· isIos (4ש) ← פנימי: isIos
· registerPwa (23ש ⚠️לא-טהור) ← פנימי: registerPwa ← חוטי-מודולים-אחרים: featureOn ← שקעים-חיצוניים: getRegistrations,then,unregister,register,catch
· applyOrgManifest (30ש ⚠️לא-טהור) ← פנימי: applyOrgManifest ← שקעים-חיצוניים: querySelector,encodeURIComponent,revokeObjectURL,createObjectURL,setAttribute
