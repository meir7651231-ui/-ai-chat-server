# חוזה · חוט is-grantable-feature
**תפקיד:** האם מפתח-דגל הוא יכולת-הדלקה-פר-עובד — כלומר שייך לרשימה הסגורה
שעבורה ‏`true` בכרטיס-העובד **מדליק** (החריג היחיד; כל שאר המפתחות = הגבלה-בלבד).
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏grantableSet — קבוצה עם ‏`.has(key)` (בקוד-המקור: הקבוע
  ‏GRANTABLE_STAFF_FEATURES; קיים במחסן כאטום-קבוע ‏grantable-staff-features —
  הקופסה מחווטת אותו לשקע).
**קלט:** ‏key (מחרוזת) · שקע-grantableSet. **פלט:** boolean.
**דוגמאות מחייבות** (בכולן ‏S=new Set(['supporters.delete','families.delete','courses.bulkadmin'])):
1. ‏'supporters.delete' ⇒ true — ברשימה.
2. ‏'families.delete' ⇒ true — ברשימה.
3. ‏'supporters.export' ⇒ false — דגל רגיל (הגבלה-בלבד).
4. ‏'' ⇒ false — ריק לעולם אינו ברשימה.
5. ‏'Supporters.Delete' ⇒ false — הקבוצה רגישת-רישיות, אין נירמול.
**מוצא:** maor/src/components/platform/lib.ts:194-204 (‏isGrantableFeature,
היררכיית ORGADMIN). השכן GRANTABLE_STAFF_FEATURES הפך לשקע (חוק-1).
