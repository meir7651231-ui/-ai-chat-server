# חוזה · קופסת-חיבורים lib-cloud-config

מקור-האמת (L4): `/home/user/maor-system/src/lib/cloudConfig.ts` — קונפיג-הארגון
בפלטפורמה (CLOUD2 ענן-2): מסמך-הארגון החי (`platformOrgs/{slug}`), החברים, כספת-
הסודות, בקשות-ההרשמה (`platformRequests/{uid}`) וההצטרפות
(`platformOrgs/{slug}/joinRequests/{uid}`), הלידים (`platformLeads`), וצ׳אטי
התמיכה (`supportChats/{uid}`) והצוות (`teamChats/{slug}`). הקופסה מחווטת 35 חוטים
לפי גרף-הקריאות של המקור; שום דבר שלה אינו נוגע ב-firebase בפועל — כל ה-IO מוזרק.

**שקעי-IO מוזרקים (לוח-האם — לא ממומשים בקופסה, חוק-6):** `cloud` = אובייקט-
Firestore אחד המוזרק לכל חוט-IO:
- `cloud.db` — ידית מסד-הענן (במקור: `cloudDb()`, `cloudConfig.ts:12`).
- ופעולות-firestore לפי-הצורך: `doc`, `getDoc`, `getDocs`, `collection`, `setDoc`,
  `deleteDoc`, `updateDoc`, `onSnapshot`, `addDoc`, `query`, `where`, `arrayUnion`,
  `arrayRemove`, `deleteField`, `FieldPath`, `increment` (במקור: import מ-`firebase/firestore`,
  `cloudConfig.ts:11`). כל אטום מפרק מ-`cloud` רק את מה שהוא צורך.

**הכרעות-חיווט (חיות בקופסה, לא באטום):**
- `sanitizeSupportText` — במקור מיובא מ-`./supportChat` (`cloudConfig.ts:14`) ונקרא
  בתוך `sendSupportMessage`/`sendSupportReply`/`sendTeamMessage`. כאן זו הזרקת-שקע:
  הקופסה מחווטת `wiredSanitize = (raw) => sanitizeSupportTextAtom(raw, SUPPORT_MSG_MAX)`
  עם התקרה `SUPPORT_MSG_MAX=2000` (מקביל ל-Rules; `supportChat.ts:33`).
- `writeOrgCloudConfig` — במקור קורא ל-`writeOrgCloudDoc` (`cloudConfig.ts:127`). כאן
  זו קריאה-לשכן מפורשת: `writeOrgCloudConfigAtom(slug, config, (s,d)=>writeOrgCloudDocAtom(s,d,cloud))`.
- `ORG_SECRET_KEYS` (allowlist) מוזרק ע"י הקופסה ל-`writeOrgSecrets` (באטום = שקע `keys`).
- `entityCols` ל-`deleteOrgCompletely` = פרמטר-קורא (במקור פרמטר, `cloudConfig.ts:272-274`).

## קבועי-מנגנון (ביט-זהה למקור, מיוצאים כלשונם)
- `PLATFORM_ORGS === 'platformOrgs'` · `PLATFORM_REQUESTS === 'platformRequests'` ·
  `PLATFORM_LEADS === 'platformLeads'` (`cloudConfig.ts:17-21`).
- `SUPPORT_CHATS === 'supportChats'` (`cloudConfig.ts:335`) · `TEAM_CHATS === 'teamChats'` (`cloudConfig.ts:410`).
- `ORG_SECRET_KEYS === ['yemotToken','nedarimMosad','nedarimApiPass','smsApiKey','smtpUrl','solaXKey']` (`cloudConfig.ts:138`).

## החשיפה (חתימות המקור + שקע `cloud` נגרר; מקור-שורה לכל חוט)

### `fetchOrgCloudConfig(slug, cloud)` — Promise<doc|null> · `cloudConfig.ts:96-103`
נפילה-רכה: כל שגיאה ⇒ `null`; לא-קיים ⇒ `null`.
- מסמך קיים `{config:{},members:['a@b.co']}` ⇒ אותו אובייקט; `doc` נקרא עם `(db,'platformOrgs',slug)`.
- `getDoc` זורק ⇒ `null` (נבלע).

### `watchOrgCloudConfig(slug, cb, cloud)` — unsubscribe · `cloudConfig.ts:110-118`
`onSnapshot` על `doc(db,'platformOrgs',slug)`; קיים ⇒ `cb(data)`, לא-קיים ⇒ `cb(null)`;
error-cb שקט. מחזיר את ה-unsubscribe.

### `writeOrgCloudDoc(slug, data, cloud)` — Promise<void> · `cloudConfig.ts:121-123`
`setDoc(doc(db,'platformOrgs',slug), JSON-clone(data), {merge:true})`. עיקור-JSON מפיל `undefined`.

### `writeOrgCloudConfig(slug, config, cloud)` — Promise<void> · `cloudConfig.ts:126-128`
עוטף ⇒ `writeOrgCloudDoc(slug, {config: JSON-clone(config)}, cloud)`.
- `writeOrgCloudConfig('x', {theme:'a'}, cloud)` ⇒ `setDoc` על `(db,'platformOrgs','x')` עם `{config:{theme:'a'}}, {merge:true}`.

### `writeOrgSecrets(slug, patch, cloud)` — Promise<void> · `cloudConfig.ts:143-155`
לכל מפתח ב-`ORG_SECRET_KEYS` שנמצא ב-`patch`: ערך-trim ⇒ נשמר; `''` ⇒ `deleteField()`; `meta[k]=!!v`.
patch ריק-מ-keys ⇒ `return` בלי כתיבה. אחרת שתי כתיבות-merge: `orgSecrets/{slug}` + `orgSecretsMeta/{slug}`.
- `writeOrgSecrets('o', {smtpUrl:' u '}, cloud)` ⇒ `orgSecrets/o` מקבל `{smtpUrl:'u'}`, `orgSecretsMeta/o` מקבל `{smtpUrl:true, updatedAt:…}`.
- `writeOrgSecrets('o', {smtpUrl:''}, cloud)` ⇒ `orgSecrets/o.smtpUrl = deleteField()`, `meta.smtpUrl=false`.
- `writeOrgSecrets('o', {unknownKey:'x'}, cloud)` ⇒ בלי כתיבה (מפתח מחוץ-לרשימה מסונן).

### `readOrgSecretsMeta(slug, cloud)` — Promise<obj> · `cloudConfig.ts:158-165`
`orgSecretsMeta/{slug}`; לא-קיים/שגיאה ⇒ `{}`.

### `deleteOrgRequest(uid, cloud)` — Promise<void> · `cloudConfig.ts:168-170`
`deleteDoc(doc(db,'platformRequests',uid))`.

### `writeOrgRequest(uid, req, cloud)` — Promise<void> · `cloudConfig.ts:173-175`
`setDoc(doc(db,'platformRequests',uid), JSON-clone(req))` — כתיבה מלאה (בלי merge).

### `fetchOrgRequests(cloud)` — Promise<Array<req & {uid}>> · `cloudConfig.ts:178-181`
`getDocs(collection(db,'platformRequests'))` ⇒ מיפוי `{uid:d.id, ...d.data()}`.

### `findMemberOrgSlugs(email, cloud)` — Promise<string[]> · `cloudConfig.ts:190-200`
מייל מנורמל (trim+lower); ריק ⇒ `[]`. `query(collection(db,'platformOrgs'), where('members','array-contains',mail))` ⇒ מזהי-המסמכים. שגיאה ⇒ `[]`.

### `fetchAllOrgs(cloud)` — Promise<Array<doc & {slug}>> · `cloudConfig.ts:203-206`
`getDocs(collection(db,'platformOrgs'))` ⇒ `{slug:d.id, ...d.data()}`.

### `writeOrgJoinRequest(slug, uid, req, cloud)` — Promise<void> · `cloudConfig.ts:212-214`
`setDoc(doc(db,'platformOrgs',slug,'joinRequests',uid), JSON-clone(req))`.

### `fetchOrgJoinRequests(slug, cloud)` — Promise<Array<req & {uid}>> · `cloudConfig.ts:217-220`
`getDocs(collection(db,'platformOrgs',slug,'joinRequests'))` ⇒ `{uid:d.id, ...d.data()}`.

### `deleteOrgJoinRequest(slug, uid, cloud)` — Promise<void> · `cloudConfig.ts:223-225`
`deleteDoc(doc(db,'platformOrgs',slug,'joinRequests',uid))`.

### `deleteOrgMemberConfig(slug, email, cloud)` — Promise<void> · `cloudConfig.ts:233-235`
`updateDoc(doc(db,'platformOrgs',slug), new FieldPath('memberConfigs', email), deleteField())`.

### `clearEmployeeField(slug, email, field, cloud)` — Promise<void> · `cloudConfig.ts:243-245`
`updateDoc(doc(db,'platformOrgs',slug), new FieldPath('memberConfigs', email, field), deleteField())`.

### `addOrgMember(slug, email, cloud)` — Promise<void> · `cloudConfig.ts:255-257`
`updateDoc(doc(db,'platformOrgs',slug), {members: arrayUnion(email.trim().toLowerCase())})`.

### `removeOrgMember(slug, email, cloud)` — Promise<void> · `cloudConfig.ts:259-262`
מסיר גם את הצורה-הגולמית וגם ה-lowercase: `arrayRemove(...unique([trim, trim.toLowerCase()]))`.

### `deleteOrgCompletely(slug, entityCols, cloud)` — Promise<number> · `cloudConfig.ts:272-315`
מחיקה-מסודרת: כל `entityCols`+`['donations','auditlog','incomingPayments','smsOutbox','mailOutbox']`
תחת `orgs/{slug}/…` (wipe-collection, סופר מסמכים), מסמכי-שורש (orgSecrets/orgSecretsMeta/icsFeeds,
`.catch`+1), צ׳אט-הצוות (`teamChats/{slug}/messages`+האב), meta+envelope, בקשות-ההצטרפות,
ולבסוף **מצבת** `setDoc(doc(db,'platformOrgs',slug), {deleted:true, deletedAt:…})`. מחזיר מונה-מחיקות.

### `writeOrgLead(lead, cloud)` — Promise<void> · `cloudConfig.ts:322-324`
`addDoc(collection(db,'platformLeads'), JSON-clone(lead))` — מזהה-אוטומטי.

### `fetchOrgLeads(cloud)` — Promise<Array<lead & {id}>> · `cloudConfig.ts:327-330`
`getDocs(collection(db,'platformLeads'))` ⇒ `{id:d.id, ...d.data()}`.

### `sendSupportMessage(uid, meta, text, cloud)` — Promise<void> · `cloudConfig.ts:338-359`
`wiredSanitize(text)` ריק ⇒ `return`. אחרת `addDoc(…/messages, {from:'user',text:clean,at:now})`
+ `setDoc(supportChats/uid, {email,orgName,lastText,lastAt,lastFrom:'user', unreadAdmin:increment(1)}, {merge:true})`.
כל שדות-המטא חתוכים ל-120 תווים.

### `sendSupportReply(uid, text, cloud)` — Promise<void> · `cloudConfig.ts:362-372`
`wiredSanitize(text)` ריק ⇒ `return`. אחרת הודעת-`admin` + מטא `unreadUser:increment(1)`.

### `watchSupportMessages(uid, cb, cloud)` — unsubscribe · `cloudConfig.ts:375-381`
`onSnapshot(collection(db,'supportChats',uid,'messages'))` ⇒ `cb(docs.map(d=>d.data()))` (בלי id); error שקט.

### `watchSupportThreadMeta(uid, cb, cloud)` — unsubscribe · `cloudConfig.ts:384-390`
`onSnapshot(doc(db,'supportChats',uid))` ⇒ קיים `cb(data)` / לא-קיים `cb(null)`; error שקט.

### `watchAllSupportThreads(cb, cloud)` — unsubscribe · `cloudConfig.ts:393-399`
`onSnapshot(collection(db,'supportChats'))` ⇒ `cb(docs.map(d=>({uid:d.id, ...d.data()})))` — ה-uid **נחשף**; error שקט.

### `markSupportRead(uid, side, cloud)` — Promise<void> · `cloudConfig.ts:402-405`
`field = side==='admin' ? 'unreadAdmin' : 'unreadUser'`; `setDoc(supportChats/uid, {[field]:0}, {merge:true}).catch(()=>{})`.

### `sendTeamMessage(slug, sender, name, text, cloud)` — Promise<void> · `cloudConfig.ts:413-422`
`wiredSanitize(text)` ריק ⇒ `return`. אחרת `addDoc(teamChats/slug/messages, {sender(≤120),name(≤60),text:clean,at:now})`.

### `watchTeamMessages(slug, cb, cloud)` — unsubscribe · `cloudConfig.ts:425-431`
`onSnapshot(collection(db,'teamChats',slug,'messages'))` ⇒ `cb(docs.map(d=>d.data()))` (בלי id); error שקט.

## DoD (פקודות-אימות, נכתבו לפני הקוד — דיבר 12)
- `node /home/user/-ai-chat-server/new/boxes/lib-cloud-config.test.mjs` ⇒ exit 0 (חוזה + מגן-הכרעה)
- `node /home/user/maor-system/machtzev/parity/lib-cloud-config.parity.mjs` ⇒ exit 0 (רתמת-זהב: ישן≡חדש, אפס-סטייה)
- `node /home/user/-ai-chat-server/machtzev/police.mjs --fast` ⇒ exit 0
