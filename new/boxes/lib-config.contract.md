# חוזה · קופסת lib-config (מנוע-הקונפיגורציה של ה-White-label)

**מהות:** המקום היחיד שמחווט את חוטי-הקונפיג של מאור — גזרי-דגלים (moduleOn/featureOn),
מנרמלי-קלט-לא-אמין (normalizeConfig/Site/Telephony), תפקידים/הרשאות, טעינת-קונפיג ו-DOM.
**מקור-האמת:** `maor/src/lib/config.ts` (עוגני-שורה למטה). הקופסה מייבאת אך ורק אטומים
מ-`new/atoms/`; ההכרעות (סדר, allowlists, ברירות-מחדל, מפתחות) חיות בקופסה; שקעי-IO
(localStorage/fetch/DOM/זהות) מוזרקים כפרמטרים.

## גזרים טהורים
| חשיפה | עוגן-מקור | התנהגות |
|---|---|---|
| `moduleOn(cfg,m)` | config.ts:15-17 | מפתח חסר = פעיל; רק `false` מכבה. |
| `featureOn(cfg,key)` | config.ts:40-52 | שרשור-אבות: כל דגל-אב `false` מכבה; מודול-ניווט (`NAV_MODULE_KEYS`) כבוי מכבה. |
| `donationSplitOn(cfg)` | config.ts:63-65 | `true` בלבד. off-by-default. |
| `supEnforceOn(cfg)` | config.ts:73-75 | `true` בלבד. |
| `integrationOn(cfg,key)` | config.ts:82-84 | `integrations[key].enabled===true` בלבד (opt-in). |
| `telephonyOn(cfg)` | config.ts:90-92 | `telephony.enabled===true` בלבד. |
| `integrationSetting(cfg,key,field)` | config.ts:95-98 | מחרוזת אחרי trim, אחרת `''`. |
| `safeHttpsUrl(raw)` | config.ts:104-113 | https בלבד ⇒ URL מנורמל; אחרת `null`. |
| `termOf(cfg,key,fallback)` | config.ts:119-126 | `terms[key]` אחרי trim אם לא-ריק, אחרת fallback. |
| `isSafeAccent(a)` | config.ts:866-872 | hex / rgb(a) / hsl(a) / מילת-צבע בלבד. |
| `publicSiteOn(cfg)` | config.ts:637-639 | `shell.publicsite` דלוק + site לא-מכובה. |
| `roleOf(cfg,email)` | config.ts:650-657 | admin ⇒ teacher ⇒ staff (case-insensitive). |
| `teacherIdOf(cfg,email)` | config.ts:660-666 | teacherId ממפת roles.teachers, אחרת `null`. |
| `isAdminUser(cfg,email)` | config.ts:673-679 | רשימה ריקה/חסרה = כולם; אחרת רק ברשימה. |
| `canGrantedAction(cfg,email,isManager,key)` | config.ts:687-694 | מנהל תמיד ∨ אדמין ∨ `features[key]===true`. |
| `isSuperAdmin(email,superAdminEmails)` | config.ts:730-733 | מייל ברשימה-המוזרקת (זהות = שקע, חוק-6). |
| `signUpError(...)` | config.ts:739-755 | הודעת-שגיאה עברית או `''`. |
| `employeeSignUpError(email,phone,password,code)` | config.ts:762-768 | הודעת-שגיאה עברית או `''`. |
| `cloudCfgCacheKey(slug)` | config.ts:773-775 | `'maor_cloudcfg:'+slug`. |
| `normalizeTelephony(raw)` | config.ts:169-211 | allowlist מלא + ברירות-מחדל; חסר/לא-אובייקט ⇒ `undefined`. |
| `normalizeSite(raw)` | config.ts:249-512 | allowlist מלא + תקרות + https; חסר ⇒ `undefined`. |
| `normalizeConfig(raw)` | config.ts:515-631 | מחטא-הקונפיג הראשי; זבל/בלי slug+orgName+theme ⇒ `null`. |
| `resolveOrgConfig(staticCfg,cloudRaw)` | config.ts:803-809 | ענן > סטטי; slug מהסטטי; firebase נשמר כשהענן לא מגדיר. |

## חוטי-IO (שקעים מוזרקים)
| חשיפה | עוגן-מקור | שקע מוזרק |
|---|---|---|
| `orgSlugFromUrl(search)` | config.ts:812-819 | `search` (window.location.search) |
| `readConfigOverride(getItem)` | config.ts:697-704 | `getItem` |
| `saveConfigOverride(cfg,setItem)` | config.ts:707-713 | `setItem` |
| `clearConfigOverride(removeItem)` | config.ts:716-722 | `removeItem` |
| `readCloudConfigCache(slug,getItem)` | config.ts:778-786 | `getItem` |
| `writeCloudConfigCache(slug,cfg,setItem)` | config.ts:789-795 | `setItem` |
| `loadOrgConfig({search,getItem,fetch})` | config.ts:822-862 | `search`·`getItem`·`fetch` |
| `applyTheme(theme,accent,motion,root)` | config.ts:875-883 | `root` (documentElement-כמו) |
| `applyFavicon(emoji,doc)` | config.ts:899-908 | `doc` (document-כמו) |
| `applyConfig(cfg,root,doc)` | config.ts:911-914 | `root`·`doc` |

## הכרעות-הקופסה (נאכפות במגן-ההכרעה)
- `NAV_MODULE_KEYS` = families·courses·calendar·diary·supporters·reports·tzedaka·shop·shop7.
- `LS_CONFIG_KEY = 'maor_org_config'` · `DEFAULT_CONFIG` = {slug:'default',orgName:'',theme:'or-rishon',modules:{},features:{}}.
- `INTEGRATION_KEYS`·`INTEGRATION_SETTING_KEYS`·`MOTION_KEYS`·`SITE_LANGS`·`TEMPLATE_KEYS` — ביט-זהים ל-types/config+templates.
- `telStr`/`telExt` — מילוי-שקע verbatim (config.ts:153-160), אין להם אטום ייעודי.
- `make-normalize-config` מפנה `isSafeAccent` כמשתנה-חופשי לא-מוצהר (סטיית-חילוץ מהמקור,
  שאיני רשאי לתקן באטום) ⇒ ממולא דרך `globalThis.isSafeAccent = <אטום is-safe-accent>`.

## דוגמאות מספריות (מוכחות בבדיקה)
- `moduleOn({modules:{shop:false}},'shop') ⇒ false` · `moduleOn({modules:{}},'shop') ⇒ true`.
- `featureOn({modules:{},features:{'a.b':false}},'a.b.c') ⇒ false`.
- `termOf({terms:{x:'  שלום '}},'x','ברירת') ⇒ 'שלום'` · `termOf({terms:{x:'  '}},'x','ד') ⇒ 'ד'`.
- `safeHttpsUrl('http://x') ⇒ null` · `safeHttpsUrl(' https://a.co ') ⇒ 'https://a.co/'`.
- `normalizeConfig({slug:'demo',accent:"url('http://e')"}).accent ⇒ undefined` (accent-זדוני נזרק).
- `normalizeConfig({slug:'demo',accent:'#fff'}).accent ⇒ '#fff'`.
- `resolveOrgConfig({slug:'root',firebase:{...}}, {slug:'x',orgName:'y'}).slug ⇒ 'root'`; firebase נשמר מהסטטי.
- `orgSlugFromUrl('?org=demo') ⇒ 'demo'` · `orgSlugFromUrl('?org=BAD!') ⇒ null`.

## ערבות-זהב (parity)
`machtzev/parity/lib-config.parity.mjs` — טרנספילציה-חיה של `config.ts` (ללא-imports,
עם שימי-קבועים) מול הקופסה, קורפוס-LCG seed=20260824, אפס-סטייה על כל הגזרים+המנרמלים+
resolve+orgSlug (window מוזרק). חוטי-IO (localStorage/fetch/DOM) = גבול-IO, מאומתים
בבדיקת-הקופסה עם שקעים-מזויפים (תקדים names-export: downloadCsv מחוץ-לזהב).
