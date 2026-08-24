# חוזה · קופסת-חיבורים "lib-cloud" — מנוע-הענן (Firebase Auth + Firestore)

**תפקיד:** לוח-החיבורים של `maor/src/lib/cloud.ts` (770ש). כל 36 חוטי-הענן
נפגשים כאן במקום אחד. IO אמיתי (firebase/fetch/הצפנה/migrate) = **שקעים מוזרקים**
דרך `createLibCloud(io)`; ההכרעות (ברירת-תחום, נתיבים, מילוני-שגיאה, בטיחות-מונים,
בניית-URL) חיות בקופסה, verbatim מהמקור.

## מקור-האמת (עוגני-שורה — דיבר 11)
כל טענת-עובדה מפנה `maor/src/lib/cloud.ts:<שורה>`:
- ברירת-התחום `{slug:'default',cloudRoot:true}` — cloud.ts:76
- נתיבים מתוחמים (scopedCol/Meta/Env/Donations) — cloud.ts:84-95 · `DONATIONS_COL='donations'` — cloud-diff.ts:64
- נרמול-ייעודים `p && p.length ? p : null` — cloud.ts:112-113 (אטום set-allowed-purposes)
- מייל-מבקר `email.trim().toLowerCase()` · readable=canRead — cloud.ts:138-146
- `hebrewAuthError` (מילון-קודים→עברית) — cloud.ts:278-296
- מיפוי-שגיאת signUp — cloud.ts:329-334 · resetPassword — cloud.ts:351-354 · changePassword (נוכחי/חדש) — cloud.ts:368-378
- `META_COUNTER_KEYS` — cloud.ts:393 · מיזוג-בטוח-למונים (max מונוטוני) — cloud.ts:411-416
- `AUDIT_CAP=500` — domain.ts:1072 · `DB_VERSION=6` (מוזרק io.dbVersion) — domain.ts:1092
- בניית-URL משיכה (org=root/slug · full/reset/vault · https-בלבד) — cloud.ts:687-718
- אצווה ≤400 — cloud.ts:187,232,438

## חשיפה — שתי שכבות
### א) הכרעות טהורות (יצוא-על, בלי IO — נבדקות ונרתמות-זהב)
- `DEFAULT_SCOPE` · `DONATIONS_COL` · `META_COUNTER_KEYS` · `AUDIT_CAP` · `PUSH_BATCH`
- `newScope(slug, cloudRoot)` ⇒ `{slug,cloudRoot}` (אטום set-cloud-scope)
- `scopedCol(scope,col)` · `scopedMeta(scope)` · `scopedEnv(scope)` · `scopedDonations(scope)`
- `hebrewAuthError(e)` ⇒ Error · `signUpError(e)` · `resetPasswordError(e)` ·
  `changePasswordCurrentError(e)` · `changePasswordNextError(e)` ⇒ Error
- `mergeMetaCounters(existing, meta)` ⇒ meta בטוח-למונים (הענן לא נסוג)
- `normalizeAllowedPurposes(p)` ⇒ מערך|null · `normalizeAuditEmail(email)` ⇒ trimmed-lower
- `buildNedarimUrl(scope, rawUrl, opts)` · `buildSolaUrl(scope, rawUrl, opts)` ⇒ URL (זורק בעברית אם לא-https)

### ב) `createLibCloud(io)` ⇒ מנוע-הענן המחווט (חתימות ביט-זהות ל-cloud.ts)
מחזיר את כל ה-API: setCloudScope · setDonationSplit · donationSplitActive ·
setAllowedPurposes · setSupEnforce · supEnforceActive · setAuditContext ·
auditWriterEmail · pushAuditRing · pullAuditRing · pushDonations ·
migrateDonationsToCollection · migrateSupportersToKeyed · initCloud · cloudDb ·
watchAuth · signIn · signUp · signOutCloud · resetPassword · changePassword ·
pushDiff · readCloudEnvelope · writeCloudEnvelope · encryptExistingCloud ·
pullAll · subscribeAll · fetchNedarimDonors · fetchIncomingPayments ·
fetchProviderRows · pullNedarim · pullSola · markIncomingPayment ·
watchIncomingPayments · writeSmsOutbox · writeMailOutbox.
המצב (scope/splitOn/allowedPurposes/supEnforceOn/audit/singletons) חי בסגור.

## שקעי-IO (מוזרקים, מתועדים — לא ממומשים)
`io` = firestore(doc/collection/getDoc/getDocs/setDoc/updateDoc/addDoc/onSnapshot/
query/where/writeBatch/runTransaction) · init(initializeApp/getAuth/
initializeFirestore/getFirestore/persistentLocalCache/persistentMultipleTabManager/
initAppCheck) · auth(onAuthStateChanged/signInWithEmailAndPassword/
createUserWithEmailAndPassword/sendEmailVerification/signOut/sendPasswordResetEmail/
reauthenticateWithCredential/updatePassword/emailCredential) · `fetch` · `now()`
(ISO — במקום Date.now) · שכנים(migrate/metaOf/donationPartitionDiff/dbVersion) ·
הצפנה(b64/unb64/isEncDoc — לאטומי encrypt-doc/decrypt-doc).

## דוגמאות מחייבות (נבדקות)
1. `hebrewAuthError({code:'auth/too-many-requests'}).message` = 'יותר מדי ניסיונות — המתינו מספר דקות ונסו שוב' · קוד-לא-מוכר ⇒ 'הכניסה נכשלה — נסו שוב' · e=null ⇒ ברירת-מחדל.
2. `signUpError({code:'auth/email-already-in-use'}).message` = 'האימייל כבר רשום — נסו להתחבר או לאפס סיסמה' · קוד-לא-מוכר ⇒ נופל ל-hebrewAuthError.
3. `scopedCol({slug:'x',cloudRoot:true},'families')`='families' · `scopedCol({slug:'x',cloudRoot:false},'families')`='orgs/x/families' · `scopedMeta(root)`='meta/org' · `scopedEnv(root)`='_enc/envelope' · `scopedDonations({slug:'x',cloudRoot:false})`='orgs/x/donations'.
4. `mergeMetaCounters({seq:9,receiptSeq:3},{seq:5,receiptSeq:8,orgName:'א'})` ⇒ seq=9 (הענן גבוה, לא נסוג) · receiptSeq=8 (החדש גבוה) · orgName='א'. חסר-מונה-בחדש ⇒ ננעל לישן.
5. `normalizeAllowedPurposes([])`=null · `normalizeAllowedPurposes(['ק'])`=['ק'] · `normalizeAuditEmail('  A@B.CO ')`='a@b.co'.
6. `buildNedarimUrl({slug:'default',cloudRoot:true},'https://f/x',{reset:true})` ⇒ org=root, full=1, reset=1. `buildSolaUrl({slug:'a',cloudRoot:false},'http://x',{})` ⇒ זורק ('חייבת https'). buildSolaUrl-שורש-עם-slug מוסיף vault; אינו מוסיף full.

## מגן-הכרעה (הבדיקה קוראת את מקור-הקופסה)
- ברירת-התחם הבטוחה `cloudRoot: true` נוכחת verbatim (הגנה על הלקוח-החי).
- `META_COUNTER_KEYS` = ['seq','receiptSeq','donationSeq','shopReceiptSeq'] verbatim ובסדר.
- שער-ה-https ב-buildNedarimUrl/buildSolaUrl **לפני** בניית ה-URL.

## רתמת-זהב
`maor/machtzev/parity/lib-cloud.parity.mjs`: טרנספילציה-חיה של cloud.ts + cloud-diff.ts
(seed=20260824, קורפוס-LCG, אפס Date.now) ⇒ ישן≡חדש על hebrewAuthError + מיפוי-השגיאות
+ scoped-paths + mergeMetaCounters + bניית-URL. אפס-סטייה.
