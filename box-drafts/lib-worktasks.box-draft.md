# 📦 טיוטת-קופסה · lib-worktasks
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/worktasks.ts). ‏7 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· taskIdentity (6ש) ← פנימי: taskIdentity
· openTasksFor (13ש) ← פנימי: openTasksFor,taskIdentity
· doneTodayFor (6ש) ← פנימי: doneTodayFor,taskIdentity
· taskOverdue (11ש) ← פנימי: taskOverdue
· taskStatsFor (20ש) ← פנימי: taskStatsFor,taskIdentity,taskOverdue ← שקעים-חיצוניים: getTime
· PRI_LABELS (7ש)
· overdueContactTaskDrafts (23ש) ← פנימי: overdueContactTaskDrafts,taskIdentity
