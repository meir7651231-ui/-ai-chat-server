# חוזה · חוט find-all-open-plans
**תפקיד:** סריקת כל ה-DB לאיתור **חיובים-מתוכננים פתוחים** (טרם-חויבו, לא-בוטלו)
משלושה מקורות — תורמים · שיבוצי-חוגים · שיוכי-חנות — לרשימה אחידה עם שם-ישות.
**קלט:** `db` — `{ supporters, enrollments, families, shopAssignments }`.
- `supporters[]`: `{ id, name, plannedCharges?: [{ chargedRid?, cancelledAt?, ... }] }`
- `enrollments[]`: `{ id, memberId, plannedCharges?: [...] }`
- `families[]`: `{ id, name, members: [{ id, first }] }`
- `shopAssignments[]`: `{ id, famId, plannedCharges?: [...] }`
**פלט:** מערך `{ entityType, entityId, plan, name }`, בסדר: תורמים → שיבוצים → שיוכי-חנות.
**התנהגות:**
- פלן **מדולג** אם יש לו `chargedRid` **או** `cancelledAt`.
- `entityType`: `'supporter'` (שם=`sup.name`) · `'enrollment'` (שם=`mem.first + ' ' + fam.name` מהמשפחה שחברהּ `memberId`, `.trim()`; חבר לא-נמצא ⇒ שם ריק) · `'shopAssignment'` (שם=`fam.name` לפי `famId`, חסר ⇒ `''`).
- מקור בלי `plannedCharges` (או ריק) ⇒ מדולג.
**דוגמה מחייבת:** קלט
```
supporters: [{id:'s1',name:'ראובן',plannedCharges:[{id:'p1'},{id:'p2',chargedRid:'R-5'},{id:'p3',cancelledAt:'2026-01-01'}]},
             {id:'s2',name:'שמעון'}]
enrollments:[{id:'e1',memberId:'m1',plannedCharges:[{id:'p4'}]},
             {id:'e2',memberId:'mX',plannedCharges:[]},
             {id:'e3',memberId:'ghost',plannedCharges:[{id:'p6'}]}]
families:   [{id:'f1',name:'לוי',members:[{id:'m1',first:'יעקב'}]}]
shopAssignments:[{id:'a1',famId:'f1',plannedCharges:[{id:'p5'}]}]
```
פלט (4 שורות):
```
{entityType:'supporter',    entityId:'s1', plan:{id:'p1'}, name:'ראובן'}
{entityType:'enrollment',   entityId:'e1', plan:{id:'p4'}, name:'יעקב לוי'}
{entityType:'enrollment',   entityId:'e3', plan:{id:'p6'}, name:''}
{entityType:'shopAssignment',entityId:'a1',plan:{id:'p5'}, name:'לוי'}
```
(‏p2/p3 מדולגים · s2 בלי-plannedCharges · e2 ריק ⇒ מדולג · e3 חבר-רפאים ⇒ שם ריק.)
**מוצא:** maor/src/lib/plannedMatch.ts:71-106 (`findAllOpenPlans`). אטום-טהור על ה-DB,
אפס-שקעים (הכל נגזר מהקלט).
