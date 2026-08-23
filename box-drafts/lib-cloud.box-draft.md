# 📦 טיוטת-קופסה · lib-cloud
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/cloud.ts). ‏36 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· setCloudScope (21ש) ← פנימי: setCloudScope ← חוטי-מודולים-אחרים: colPath,metaPath,envPath,donationsPath,donationSplitOn ← שקעים-חיצוניים: scopedCol,scopedMeta,scopedEnv,scopedDonations
· setDonationSplit (4ש) ← פנימי: setDonationSplit
· donationSplitActive (8ש) ← פנימי: donationSplitActive
· setAllowedPurposes (10ש) ← פנימי: setAllowedPurposes ← חוטי-מודולים-אחרים: supEnforceOn
· setSupEnforce (4ש) ← פנימי: setSupEnforce
· supEnforceActive (12ש) ← פנימי: supEnforceActive
· setAuditContext (6ש) ← פנימי: setAuditContext
· auditWriterEmail (5ש) ← פנימי: auditWriterEmail
· pushAuditRing (9ש) ← פנימי: pushAuditRing ← חוטי-מודולים-אחרים: encryptDoc ← שקעים-חיצוניים: requireDb,setDoc,scopedCol
· pullAuditRing (17ש) ← פנימי: pullAuditRing ← חוטי-מודולים-אחרים: decryptDoc ← שקעים-חיצוניים: requireDb,getDocs,collection,scopedCol,data
· pushDonations (26ש) ← פנימי: pushDonations ← חוטי-מודולים-אחרים: encryptDoc ← שקעים-חיצוניים: requireDb,scopedDonations,writeBatch,commit
· migrateDonationsToCollection (13ש) ← פנימי: migrateDonationsToCollection,pushDonations ← חוטי-מודולים-אחרים: donationPartitionDiff ← שקעים-חיצוניים: import
· migrateSupportersToKeyed (27ש) ← פנימי: migrateSupportersToKeyed ← חוטי-מודולים-אחרים: supKeyMapOf,encryptDoc,supKeyOf,docSkey ← שקעים-חיצוניים: requireDb,toPlain,scopedCol,writeBatch,commit
· initCloud (32ש ⚠️לא-טהור) ← פנימי: initCloud ← חוטי-מודולים-אחרים: initAppCheck ← שקעים-חיצוניים: initializeApp,getAuth,useDeviceLanguage,initializeFirestore,persistentLocalCache
· cloudDb (26ש) ← פנימי: cloudDb ← שקעים-חיצוניים: requireDb,hebrewAuthError,toString
· watchAuth (7ש) ← פנימי: watchAuth ← שקעים-חיצוניים: onAuthStateChanged,requireAuth
· signIn (12ש) ← פנימי: signIn ← שקעים-חיצוניים: signInWithEmailAndPassword,requireAuth,hebrewAuthError
· signUp (20ש) ← פנימי: signUp ← שקעים-חיצוניים: createUserWithEmailAndPassword,requireAuth,sendEmailVerification,catch,toString
· signOutCloud (9ש) ← פנימי: signOutCloud ← שקעים-חיצוניים: signOut,requireAuth
· resetPassword (15ש) ← פנימי: resetPassword ← שקעים-חיצוניים: sendPasswordResetEmail,requireAuth,toString,hebrewAuthError
· changePassword (60ש) ← פנימי: changePassword ← שקעים-חיצוניים: requireAuth,reauthenticateWithCredential,credential,toString,hebrewAuthError
· pushDiff (36ש) ← פנימי: pushDiff ← חוטי-מודולים-אחרים: encryptDoc,docSkey,stripAuditMeta ← שקעים-חיצוניים: requireDb,toPlain,scopedCol,writeBatch,commit
· readCloudEnvelope (13ש) ← פנימי: readCloudEnvelope ← שקעים-חיצוניים: getDoc,requireDb,scopedEnv,exists,data
· writeCloudEnvelope (10ש) ← פנימי: writeCloudEnvelope,pushDiff ← חוטי-מודולים-אחרים: fullDbDiff ← שקעים-חיצוניים: setDoc,requireDb,scopedEnv
· encryptExistingCloud (9ש) ← פנימי: encryptExistingCloud,pushDiff ← חוטי-מודולים-אחרים: fullDbDiff,supKeyMapOf
· pullAll (66ש) ← פנימי: pullAll ← חוטי-מודולים-אחרים: decryptDoc ← שקעים-חיצוניים: requireDb,getDoc,scopedMeta,exists,data
· subscribeAll (107ש) ← פנימי: subscribeAll ← חוטי-מודולים-אחרים: stripSupKey,supAllowedKeys ← שקעים-חיצוניים: requireDb,onSnapshot,query,collection,scopedCol
· fetchNedarimDonors (7ש) ← פנימי: fetchNedarimDonors ← שקעים-חיצוניים: getDocs,collection,requireDb,scopedCol,data
· fetchIncomingPayments (8ש) ← פנימי: fetchIncomingPayments ← שקעים-חיצוניים: getDocs,query,collection,requireDb,scopedCol
· fetchProviderRows (9ש) ← פנימי: fetchProviderRows ← שקעים-חיצוניים: getDocs,query,collection,requireDb,scopedCol
· pullNedarim (19ש) ← פנימי: pullNedarim ← שקעים-חיצוניים: requireAuth,getIdToken,fetch,toString,json
· pullSola (20ש) ← פנימי: pullSola ← שקעים-חיצוניים: requireAuth,getIdToken,fetch,toString,json
· markIncomingPayment (12ש) ← פנימי: markIncomingPayment ← שקעים-חיצוניים: updateDoc,requireDb,scopedCol,toISOString
· watchIncomingPayments (14ש) ← פנימי: watchIncomingPayments ← שקעים-חיצוניים: query,collection,requireDb,scopedCol,where
· writeSmsOutbox (10ש) ← פנימי: writeSmsOutbox ← שקעים-חיצוניים: addDoc,collection,requireDb,scopedCol,toISOString
· writeMailOutbox (10ש) ← פנימי: writeMailOutbox ← שקעים-חיצוניים: addDoc,collection,requireDb,scopedCol,toISOString
