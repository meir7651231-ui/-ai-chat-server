# 📄 חוזה · קופסת-חיבורים platform (לוח-הבקרה + ORGADMIN)

> מקור-האמת (L4): `maor-system/src/components/platform/lib.ts` — כל עוגן-שורה למטה מפנה לשם.
> הקופסה מחווטת 24 אטומים מ-`new/atoms` לפי גרף-הקריאות של המקור. שום import פנימי
> מלבד אטומים (חוק-2). קריאת-שכן במקור ⇒ הזרקת-שקע בקופסה (חוק-1/3).

## שקעי-הזרעה (החלטות שחיות בקופסה)
- **DEFAULT_CONFIG** — קונפיג-הלידה של ארגון חדש; מוטבע כקבוע-קופסה verbatim מ-
  `maor-system/src/types/config.ts:404-410` (`{ slug:'default', orgName:'', theme:'or-rishon', modules:{}, features:{} }`).
  זו הכרעת-ברירת-מחדל (טווח-החוזה: "ברירות-מחדל חיות בקופסה"), לא IO. `newOrgConfig`/`allOffConfig` זורעים ממנו.
- אין שקעי-IO אמיתיים (DOM/localStorage/fetch/ענן): כל 24 החוטים טהורים.

## API החשוף (חתימות זהות למקור)

### תעתיק וסלאג
- `slugify(orgName, taken)` → string. מקור: `lib.ts:21-31`.
  - `slugify('מאור החסד', [])` → `'mavr-hchsd'` · `slugify('', [])` → `'org'` · `slugify('Test', ['test'])` → `'test-2'`.
- `isValidSlug(slug)` → boolean. מקור: `lib.ts:34-36`. `isValidSlug('ab')`→true · `isValidSlug('A')`→false.

### מרשמי-מודולים
- `ALL_MODULES` → 9 מפתחות. מקור: `lib.ts:39`. `['families','courses','calendar','diary','supporters','reports','tzedaka','shop','shop7']`.
- `MODULE_LABELS` → מפה. מקור: `lib.ts:42-52`. `MODULE_LABELS.shop7`→`'חלוקה'`.

### קונפיג-לידה וקישורים
- `allOffConfig(slug, orgName)` → OrgConfig — כל המודולים `false` מפורש. מקור: `lib.ts:58-62`.
  - `allOffConfig('x','ארגון').modules.families`→`false`; `.theme`→`'or-rishon'`; `.features`→`{}`.
- `orgLink(origin, basePath, slug)` → string. מקור: `lib.ts:65-67`. `orgLink('https://a.co','/','x')`→`'https://a.co/?org=x'`.

### זהות-מייל, קודי-הזמנה
- `normEmail(email)` → string. מקור: `lib.ts:77-79`. `normEmail(' A@B.CO ')`→`'a@b.co'`.
- `genJoinCode(seed)` → 8 תווי-base36 דטרמיניסטיים. מקור: `lib.ts:83-96`. `genJoinCode('x').length`→8.
- `orgJoinLink(origin, basePath, slug, code)` → string. מקור: `lib.ts:99-101`. `...?org=x&join=c`.
- `orgJoinFullCode(slug, code)` → `'{slug}.{code}'`. מקור: `lib.ts:108-110`. `orgJoinFullCode('x','abcd')`→`'x.abcd'`.
- `parseJoinFullCode(full)` → `{slug,code}|null`. מקור: `lib.ts:113-121` (שקע isValidSlug ⇒ סלאג≥2 תווים).
  - `parseJoinFullCode('org.abcd')`→`{slug:'org',code:'abcd'}` · `parseJoinFullCode('nodot')`→null · `parseJoinFullCode('x.c')`→null (slug<2).

### היררכיית-הרשאות (ORGADMIN)
- `isOrgManager(email, org)` → boolean. מקור: `lib.ts:124-127` (שקע normEmail).
  - `isOrgManager('m@o.co',{manager:'m@o.co'})`→true · `isOrgManager('x@o.co',{manager:''})`→false.
- `orgEnabledModules(orgConfig)` → ModuleKey[] (רק false מכבה). מקור: `lib.ts:135-137` (שקע ALL_MODULES).
  - `orgEnabledModules({modules:{shop:false}})` → 8 (בלי shop).
- `orgEnabledFeatures(orgConfig, features)` → F[] (עקרון-התקרה: מודול-אב-כבוי/opt-in). מקור: `lib.ts:145-160`.
  - דגל רגיל: חסר/לא-false ⇒ נכלל. opt-in: רק `=== true` נכלל. מודול-אב כבוי ⇒ מוחרג.
- `isMember(email, org)` → boolean. מקור: `lib.ts:163-167` (שקעי normEmail+isOrgManager).
- `overrideOf(email, org)` → EmployeeOverride (`{}` כשאין). מקור: `lib.ts:170-172` (שקע normEmail).
- `GRANTABLE_STAFF_FEATURES` → Set(10). מקור: `lib.ts:180-191`.
- `isGrantableFeature(key)` → boolean. מקור: `lib.ts:194-196` (שקע הסט).
- `effectiveConfigFor(email, org, orgConfig)` → קונפיג-אפקטיבי (הגבלה-בלבד + הדלקת-grantable). מקור: `lib.ts:205-219`.
  - מנהל ⇒ orgConfig כמו-שהוא. עובד עם override.features[k]===false ⇒ features[k]=false.
    override.features[k]===true ⇒ מדליק **רק** אם k∈GRANTABLE.
- `allowedDesignationsFor(email, org)` → `string[]|null`. מקור: `lib.ts:226-230`. מנהל⇒null; רשימה-ריקה⇒null; אחרת הרשימה.
- `canIssueReceipt({superAdmin,isManager,cloudRoot,cloudConnected})` → boolean. מקור: `lib.ts:239-246`.
  - `superAdmin||isManager||cloudRoot||!cloudConnected`. `canIssueReceipt({...all-false, cloudConnected:false})`→true.

### מוטציות-חברות (טהורות — מחזירות partial)
- `approveMember(org, email)` → `{members}` (מנורמל, בלי כפילות). מקור: `lib.ts:249-253` (שקע normEmail).
- `setEmployeeOverride(org, email, override)` → `{memberConfigs}`. מקור: `lib.ts:256-263` (שקע normEmail).
- `removeMember(org, email)` → `{members, memberConfigs}` (מוציא מ-2). מקור: `lib.ts:266-275` (שקע normEmail).

## מגן-הכרעה (נבדק ב-platform.test.mjs מול מקור-הקופסה)
1. DEFAULT_CONFIG בקופסה = `theme: 'or-rishon'` verbatim (קונפיג-הלידה).
2. הקופסה מייבאת אך-ורק מ-`../atoms/` (חוק-2 — אפס import-קופסה).
3. תפר-ההדלקה-פר-עובד: effectiveConfigFor מזריק את GRANTABLE_STAFF_FEATURES (הדלקת-true רק לרשימה-הסגורה).

## DoD (פקודה + פלט צפוי — נכתב לפני הקוד, דיבר 12)
- `node new/boxes/platform.test.mjs` ⇒ exit 0, שורת-סיום "✓ קופסת-platform".
- `node machtzev/parity/platform.parity.mjs` (במאור) ⇒ exit 0, "🥇 זהב-platform: ישן≡חדש על N השוואות" (N>0, אפס-סטייה).
