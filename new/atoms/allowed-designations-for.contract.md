# חוזה · חוט allowed-designations-for
**תפקיד:** ייעודי-התרומה שהעובד/ת רשאי/ת לראות (בקשת-בעלים 13.8 ג'). מנהל ⇒
null (רואה הכל). אחרת: רשימת-הייעודים בכרטיס-העובד אם אינה ריקה, אחרת null.
null = "בלי מסנן"; מערך = הגבלה לרשימה בלבד.
**שקעים (חוק-1 — קריאות-לשכן מוזרקות):** isOrgManager(email, org)→boolean ·
overrideOf(email, org)→כרטיס-עובד {designations?: string[]}.
**קלט:** email, org, ושני השקעים. **פלט:** string[] או null.
**דוגמאות מחייבות (org: manager='boss@x.co', כרטיס 'emp@x.co' עם
designations=['חתן','כללי'], כרטיס 'emp2@x.co' עם designations=[]):**
‏'boss@x.co'→null (מנהל) · ‏'emp@x.co'→['חתן','כללי'] · ‏'emp2@x.co'→null
(רשימה ריקה = בלי מסנן) · ‏'ghost@x.co' (בלי כרטיס)→null.
**מוצא:** חולץ כלשונו מ-maor/src/components/platform/lib.ts:226-230.
