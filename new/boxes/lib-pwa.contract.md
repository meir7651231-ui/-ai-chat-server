# חוזה · קופסת-חיבורים "lib-pwa"
**תפקיד:** קופסת-החיבורים של מודול ה-PWA — רישום service-worker, זיהוי מצב-התקנה,
ומניפסט פר-ארגון (white-label). מחווטת את חוטי-ה-PWA הטהורים (install-available ·
prompt-install · is-ios) + חוט-הדגלים (feature-on), ואת ההכרעות-הלא-טהורות
(isStandalone/registerPwa/applyOrgManifest) עם **שקעי-IO מוזרקים** — כל נגיעת-דפדפן
(window/navigator/document/serviceWorker/Blob/import.meta.env) היא פרמטר, לא מימוש
באטום (חוק-1/חוק-5/חוק-6).

**מוצא (עוגני-שורה · דיבר 11):** `maor/src/lib/pwa.ts`
- listener beforeinstallprompt (מצב-המודול deferredInstall) — pwa.ts:22-29
- installAvailable — pwa.ts:32-34
- promptInstall — pwa.ts:37-43
- isStandalone — pwa.ts:46-50
- isIos — pwa.ts:53-55
- registerPwa — pwa.ts:57-72
- orgManifestUrl (מצב הבלוב-האחרון) — pwa.ts:77
- applyOrgManifest — pwa.ts:80-108

## החשיפה

### installAvailable(deferredInstall) → boolean
מחווט את חוט install-available. `deferredInstall !== null`.
לכידת-האירוע עצמה (addEventListener + preventDefault, pwa.ts:22-29) היא חיווט-דפדפן
בלוח-האם; הקופסה מקבלת את הערך-שנלכד כשקע.
**דוגמאות:** `(null)→false` · `({prompt(){},userChoice})→true` · `({})→true`.

### promptInstall(d) → Promise<boolean>
מחווט את חוט prompt-install. בלי אירוע (null) ⇒ `false` מיידי, אפס תופעות-לוואי.
עם אירוע: מריץ `d.prompt()` פעם-אחת, מחזיר `outcome==='accepted'`. האיפוס-אחרי-שימוש
(pwa.ts:39, `deferredInstall=null`) הוא חיווט-קופסה — האטום לא שומר מצב.
**דוגמאות:** `d=null→false` · `outcome:'accepted'→true` · `'dismissed'→false` ·
`'unknown'→false`.

### isIos() → boolean
מחווט את חוט is-ios (רגקס `/iphone|ipad|ipod/i` על `navigator.userAgent` הגלובלי;
בלי navigator ⇒ false). נאמן-למקור: קורא את navigator הגלובלי (pwa.ts:53-55).
**דוגמאות:** אין navigator → false · UA 'iPhone' → true · UA 'Firefox' → false.

### isStandalone({ window, navigator }) → boolean
לא-טהור — שקעי window+navigator מוזרקים (במקור: הגלובליים, pwa.ts:46-50).
`!window ⇒ false`; אחרת `window.matchMedia?.('(display-mode: standalone)').matches===true
|| navigator?.standalone===true`.
**דוגמאות:**
- `{}` (בלי window) → false
- `{window:{matchMedia:()=>({matches:true})}}` → true
- `{window:{matchMedia:()=>({matches:false})}, navigator:{standalone:true}}` → true
- `{window:{matchMedia:()=>({matches:false})}, navigator:{standalone:false}}` → false
- `{window:{}}` (בלי matchMedia — `?.`) → false

### registerPwa(config, io) → void
רושם/מסיר את ה-service-worker. שקעי-io: `{ navigator, isProd, baseUrl, href,
navModuleKeys?, moduleOn? }` (במקור: navigator גלובלי · import.meta.env.PROD ·
import.meta.env.BASE_URL · window.location.href, pwa.ts:57-72). סדר-השערים נאמן-למקור:
1. `!navigator || !('serviceWorker' in navigator)` ⇒ יציאה.
2. `navigator.webdriver` (סוויטת-דפדפן) ⇒ יציאה — אפס התערבות במטמון.
3. `!isProd` ⇒ יציאה — לא נלחמים ב-HMR.
4. חישוב `swUrl = new URL(baseUrl+'sw.js', href).href`.
5. `featureOn(config,'shell.pwa')` כבוי ⇒ **מתג-חירום**: `getRegistrations()` ומסיר
   **רק** רישום ש-`active.scriptURL===swUrl` (רק את שלנו). אחרת: `register(swUrl)`
   עם `.catch` בולע (דפדפן ישן/מצב-פרטי).
   הדגל מחווט דרך חוט feature-on עם `navModuleKeys=[]` ו-`moduleOn=()=>true` —
   'shell' אינו מודול-ניווט, כך שהתוצאה = שרשור-הדגלים בלבד, ביט-זהה ל-config.ts.
**דוגמאות (config={features:{}}):**
- אין serviceWorker → אפס-קריאות.
- `webdriver:true` → אפס-קריאות.
- `isProd:false` → אפס-קריאות.
- דגל דלוק (features חסר) → `register('<base>sw.js')` פעם-אחת.
- `features:{'shell.pwa':false}` → `getRegistrations` ⇒ unregister רק על swUrl תואם.

### applyOrgManifest(config, io) → void
מחליף את href של `link[rel=manifest]` במניפסט-Blob דינמי לארגון-לקוח.
שקעי-io: `{ document, baseUrl, href, createObjectURL, revokeObjectURL, makeBlob, state }`
(במקור: document/URL/Blob גלובליים + import.meta.env.BASE_URL + window.location.href +
מצב-המודול orgManifestUrl, pwa.ts:80-108). `state` = `{ orgManifestUrl }` בבעלות
לוח-האם (מצב הבלוב-האחרון — משוחרר לפני יצירת חדש, מונע דליפה).
שערים נאמנים-למקור: `!document` ⇒ יציאה · `!link` ⇒ יציאה · `slug==='default'`
או `!name` ⇒ יציאה (אתר-השורש — המניפסט הסטטי כמות-שהוא). אחרת בונה מניפסט
דרך `buildManifest`, משחרר בלוב-קודם, יוצר חדש, ומציב href.

### buildManifest(name, slug, base) → object
**טהור** — אובייקט-המניפסט (סדר-מפתחות + ערכי-ברירת-מחדל = הכרעות-הקופסה, חיים כאן):
`name` · `short_name` (name.length>12 ⇒ 12 תווים ראשונים, אחרת name) · `lang:'he'` ·
`dir:'rtl'` · `start_url: base+'?org='+encodeURIComponent(slug)` · `scope: base` ·
`display:'standalone'` · `orientation:'portrait-primary'` · `theme_color:'#211d17'` ·
`background_color:'#faf7f2'` · `icons`: 192 · 512 · maskable-512.
**דוגמה:** `buildManifest('מאור','maor','/x/')` ⇒
`{name:'מאור', short_name:'מאור', lang:'he', dir:'rtl',
start_url:'/x/?org=maor', scope:'/x/', display:'standalone',
orientation:'portrait-primary', theme_color:'#211d17', background_color:'#faf7f2',
icons:[{src:'/x/icons/icon-192.png',sizes:'192x192',type:'image/png'},
{src:'/x/icons/icon-512.png',sizes:'512x512',type:'image/png'},
{src:'/x/icons/icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]}`.
שם ארוך (>12): `buildManifest('אבגדהוזחטיכלמנ','x','/')` ⇒ short_name='אבגדהוזחטיכל' (12).

**גבול-IO מחוץ-לרתמה (תקדים names-export/net-check):** הלכידה של beforeinstallprompt,
הרישום בפועל ל-serviceWorker, וה-DOM setAttribute — נבדקים דרך שקעים-מזויפים בקופסה,
לא ברתמת-הזהב (הרתמה משווה את ההחלטות הדטרמיניסטיות: installAvailable/promptInstall/
isIos/isStandalone/registerPwa-actions/buildManifest — תו-בתו מול המקור).
