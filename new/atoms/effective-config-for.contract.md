# חוזה · חוט effective-config-for
**תפקיד:** הקונפיג האפקטיבי של עובד/ת = קונפיג-הארגון **בניכוי** מה שהמנהל כיבה
בכרטיס-העובד (false=כיבוי; חסר=יורש — זהה בסמנטיקה ל-featureOn/moduleOn).
מנהל ⇒ קונפיג-הארגון כמו-שהוא. חריג יחיד: מפתח בסט-ההדלקות (grantable) שסומן
true בכרטיס-העובד **מדליק** פר-עובד; לכל שאר המפתחות true מתעלמים (הגבלה-בלבד).
**שקעים (חוק-1 — קריאות-לשכן מוזרקות):** isOrgManager(email, org)→boolean ·
overrideOf(email, org)→כרטיס-עובד {modules?, features?} ·
grantable: Set של מפתחות-הדלקה-פר-עובד (בקופסה: GRANTABLE_STAFF_FEATURES).
**קלט:** email, org, orgConfig {modules?, features?}, ושלושת השקעים.
**פלט:** קונפיג אפקטיבי (אובייקט חדש כשיש דריסות; הקלט לא משתנה).
**דוגמאות מחייבות (org: manager='boss@x.co'; קונפיג-ארגון:
modules={shop:true, courses:true}, features={'a.x':true, 'supporters.delete':false};
grantable=Set{'supporters.delete'}; כרטיס 'emp@x.co':
modules={shop:false, courses:true}, features={'a.x':false, 'supporters.delete':true, 'b.y':true}):**
‏'boss@x.co' (מנהל)→אותו אובייקט-קונפיג בדיוק (===) ·
‏'ghost@x.co' (בלי כרטיס)→אותו אובייקט (===) ·
‏'emp@x.co': ‏modules.shop→false (כיבוי) · ‏modules.courses→true
(true בכרטיס על מודול = מתעלמים, נשאר כבארגון) · ‏features['a.x']→false ·
‏features['supporters.delete']→true (הדלקה — בסט) · ‏features['b.y']→undefined
(true שלא-בסט מתעלמים) · קונפיג-הארגון המקורי לא השתנה (shop נשאר true)
**מוצא:** maor/src/components/platform/lib.ts:205-220 (‏ORGADMIN — "לב האכיפה
בממשק"; חולץ מטיוטת-המחצבה effective-config-for@src_components_platform_lib_ts;
קריאות-השכן isOrgManager/overrideOf והקבוע GRANTABLE_STAFF_FEATURES שוקעו).
