# 📦 טיוטת-קופסה · lib-config
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/config.ts). ‏36 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· moduleOn (25ש) ← פנימי: moduleOn,featureOn
· featureOn (23ש) ← פנימי: featureOn,moduleOn
· donationSplitOn (10ש) ← פנימי: donationSplitOn
· supEnforceOn (9ש) ← פנימי: supEnforceOn
· integrationOn (8ש) ← פנימי: integrationOn
· telephonyOn (5ש) ← פנימי: telephonyOn
· integrationSetting (9ש) ← פנימי: integrationSetting
· safeHttpsUrl (15ש) ← פנימי: safeHttpsUrl ← שקעים-חיצוניים: toString
· termOf (50ש ⚠️לא-טהור) ← פנימי: termOf ← שקעים-חיצוניים: normalizeFirebase,telStr,telExt
· normalizeTelephony (80ש) ← פנימי: normalizeTelephony ← שקעים-חיצוניים: telStr,isInteger,hhmm,telExt,bool
· normalizeSite (266ש ⚠️לא-טהור) ← פנימי: normalizeSite,safeHttpsUrl ← שקעים-חיצוניים: siteStr,normLocalized,sitePosNum,sitePhone,imgUrl
· normalizeConfig (122ש ⚠️לא-טהור) ← פנימי: normalizeConfig,normalizeTelephony,isSafeAccent,normalizeSite ← שקעים-חיצוניים: normalizeFirebase
· publicSiteOn (13ש) ← פנימי: publicSiteOn,featureOn
· roleOf (10ש) ← פנימי: roleOf
· teacherIdOf (13ש) ← פנימי: teacherIdOf
· isAdminUser (14ש) ← פנימי: isAdminUser
· canGrantedAction (10ש) ← פנימי: canGrantedAction,isAdminUser
· readConfigOverride (10ש ⚠️לא-טהור) ← פנימי: readConfigOverride,normalizeConfig ← שקעים-חיצוניים: getItem
· saveConfigOverride (9ש ⚠️לא-טהור) ← פנימי: saveConfigOverride ← שקעים-חיצוניים: setItem
· clearConfigOverride (11ש ⚠️לא-טהור) ← פנימי: clearConfigOverride ← שקעים-חיצוניים: removeItem
· SUPER_ADMIN_EMAILS (3ש)
· isSuperAdmin (9ש) ← פנימי: isSuperAdmin
· signUpError (23ש) ← פנימי: signUpError
· employeeSignUpError (11ש ⚠️לא-טהור) ← פנימי: employeeSignUpError
· cloudCfgCacheKey (5ש) ← פנימי: cloudCfgCacheKey
· readCloudConfigCache (11ש ⚠️לא-טהור) ← פנימי: readCloudConfigCache,cloudCfgCacheKey,normalizeConfig ← שקעים-חיצוניים: getItem
· writeCloudConfigCache (14ש ⚠️לא-טהור) ← פנימי: writeCloudConfigCache,cloudCfgCacheKey ← שקעים-חיצוניים: setItem
· resolveOrgConfig (9ש ⚠️לא-טהור) ← פנימי: resolveOrgConfig,normalizeConfig
· orgSlugFromUrl (10ש ⚠️לא-טהור) ← פנימי: orgSlugFromUrl
· loadOrgConfig (44ש ⚠️לא-טהור) ← פנימי: loadOrgConfig,orgSlugFromUrl,readCloudConfigCache,normalizeConfig,readConfigOverride ← שקעים-חיצוניים: fetch,json
· isSafeAccent (9ש) ← פנימי: isSafeAccent
· applyTheme (11ש ⚠️לא-טהור) ← פנימי: applyTheme,isSafeAccent ← שקעים-חיצוניים: setProperty,removeProperty
· DEFAULT_FAVICON (4ש)
· faviconDataUri (9ש) ← פנימי: faviconDataUri ← שקעים-חיצוניים: encodeURIComponent
· applyFavicon (12ש ⚠️לא-טהור) ← פנימי: applyFavicon,faviconDataUri ← שקעים-חיצוניים: createElement,appendChild
· applyConfig (5ש) ← פנימי: applyConfig,applyTheme,applyFavicon
