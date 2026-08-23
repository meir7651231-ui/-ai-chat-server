# 📦 טיוטת-קופסה · lib-cloudConfig
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/cloudConfig.ts). ‏35 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· PLATFORM_ORGS (2ש)
· PLATFORM_REQUESTS (2ש)
· PLATFORM_LEADS (75ש)
· fetchOrgCloudConfig (14ש) ← פנימי: fetchOrgCloudConfig ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: getDoc,exists,data
· watchOrgCloudConfig (11ש) ← פנימי: watchOrgCloudConfig ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: onSnapshot,exists,data
· writeOrgCloudDoc (5ש) ← פנימי: writeOrgCloudDoc ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: setDoc
· writeOrgCloudConfig (12ש) ← פנימי: writeOrgCloudConfig,writeOrgCloudDoc
· ORG_SECRET_KEYS (5ש)
· writeOrgSecrets (15ש) ← פנימי: writeOrgSecrets ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: deleteField,setDoc,toISOString
· readOrgSecretsMeta (10ש) ← פנימי: readOrgSecretsMeta ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: getDoc,exists,data
· deleteOrgRequest (5ש) ← פנימי: deleteOrgRequest ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: deleteDoc
· writeOrgRequest (5ש) ← פנימי: writeOrgRequest ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: setDoc
· fetchOrgRequests (12ש) ← פנימי: fetchOrgRequests ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: getDocs,collection,data
· findMemberOrgSlugs (13ש) ← פנימי: findMemberOrgSlugs ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: query,collection,where,getDocs
· fetchAllOrgs (9ש) ← פנימי: fetchAllOrgs ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: getDocs,collection,data
· writeOrgJoinRequest (5ש) ← פנימי: writeOrgJoinRequest ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: setDoc
· fetchOrgJoinRequests (6ש) ← פנימי: fetchOrgJoinRequests ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: getDocs,collection,data
· deleteOrgJoinRequest (10ש) ← פנימי: deleteOrgJoinRequest ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: deleteDoc,deleteField
· deleteOrgMemberConfig (10ש) ← פנימי: deleteOrgMemberConfig ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: updateDoc,deleteField,setDoc
· clearEmployeeField (12ש) ← פנימי: clearEmployeeField ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: updateDoc,deleteField
· addOrgMember (4ש) ← פנימי: addOrgMember ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: updateDoc,arrayUnion
· removeOrgMember (13ש) ← פנימי: removeOrgMember ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: updateDoc,arrayRemove
· deleteOrgCompletely (50ש) ← פנימי: deleteOrgCompletely ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: getDocs,collection,deleteDoc,wipeCol,catch
· writeOrgLead (5ש) ← פנימי: writeOrgLead ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: addDoc,collection
· fetchOrgLeads (8ש) ← פנימי: fetchOrgLeads ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: getDocs,collection,data
· SUPPORT_CHATS (3ש) ← שקעים-חיצוניים: message
· sendSupportMessage (24ש) ← פנימי: sendSupportMessage ← חוטי-מודולים-אחרים: sanitizeSupportText,cloudDb ← שקעים-חיצוניים: toISOString,addDoc,collection,setDoc,increment
· sendSupportReply (13ש) ← פנימי: sendSupportReply ← חוטי-מודולים-אחרים: sanitizeSupportText,cloudDb ← שקעים-חיצוניים: toISOString,addDoc,collection,setDoc,increment
· watchSupportMessages (9ש) ← פנימי: watchSupportMessages ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: onSnapshot,collection,data
· watchSupportThreadMeta (9ש) ← פנימי: watchSupportThreadMeta ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: onSnapshot,exists,data
· watchAllSupportThreads (9ש) ← פנימי: watchAllSupportThreads ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: onSnapshot,collection,data
· markSupportRead (8ש) ← פנימי: markSupportRead ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: setDoc,catch
· TEAM_CHATS (3ש)
· sendTeamMessage (12ש) ← פנימי: sendTeamMessage ← חוטי-מודולים-אחרים: sanitizeSupportText,cloudDb ← שקעים-חיצוניים: addDoc,collection,toISOString
· watchTeamMessages (8ש) ← פנימי: watchTeamMessages ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: onSnapshot,collection,data
