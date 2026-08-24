# חוזה · חוט eligible-families
**תפקיד:** המשפחות הזכאיות לשיוך-חנות המוני: משפחות פעילות שמחזיקות — באיחוד
על-פני שיוכיהן הקיימים — את **כל** הקריטריונים שנבחרו; כשלא נבחר קריטריון ⇒ כל
הפעילות. מסונן ממי שכבר מחזיקה שיוך active לאותה חבילה (אין כפל). כל תוצאה
מצומצמת ל-{famId, name, memberIds}.
**קלט:** db {families: [{id, name, status, members:[{id}]}],
shopAssignments: [{famId, productId, status, criterionIds:[]}]},
criterionIds (מערך-מזהים), excludeProductId (מזהה-החבילה המשויכת).
**פלט:** מערך {famId, name, memberIds}.
**דוגמאות מחייבות (משפחות: f1 active (חברים m1,m2) · f2 active (חבר m3) ·
f3 inactive; שיוכים: f1←p9 active עם ['c1'] · f1←p1 active עם ['c2'] ·
f2←p1 canceled עם ['c1']):**
‏([], 'p9')→רק f2 (‏f1 מוחזקת-כבר ב-p9 active; f3 לא-פעילה) ·
‏([], 'p2')→f1 וגם f2 (אין קריטריון ⇒ כל הפעילות שאינן משויכות-p2) ·
‏(['c1','c2'], 'p2')→רק f1 (איחוד שני שיוכיה מחזיק את שניהם; ל-f2 יש 'c1'
רק בשיוך canceled — אבל האיחוד סופר גם אותו ⇒ 'c2' חסר לה) ·
‏(['c3'], 'p2')→[] (אף אחת לא מחזיקה) ·
צורת-פלט: f1 ⇒ {famId:'f1', name:'כהן', memberIds:['m1','m2']}
**מוצא:** maor/src/components/shop/lib.ts:610-626 (‏SHOP6 — חלוקה המונית;
חולץ כלשונו מטיוטת-המחצבה eligible-families@src_components_shop_lib_ts).
**הערת-קריאה מחייבת:** איחוד-הקריטריונים נבנה מכל שיוכי-המשפחה — גם לא-active
(רק סינון-הכפל מוגבל ל-active); כך במקור.
