# CLOSED · GENMAX G41 — ×100 בדרך-החלקיקים: מקבץ ב׳-קכו…קכט (9.9.2026 לילה · לפי הכרעה-30)

> אפס צורך חדש, אפס אטום חדש. הרכבה אחת: `bhMoney` (פרסור-סכום «1,250»/«₪ 8,000» ⇒ מספר) — **המדף נסרק** `(String|dynamic)→num` (7 מועמדים: chipPriority · colRefToIndex · dnNumber · … — אף אחד אינו פרסור-סכום); ההיפוך של `fMoney`. **ארבעה פרסורים ידניים** במחולל (`balaganMoney` · `balaganMonthSummary` · `balaganAmountItems` · `balaganPerson`) אוחדו דרכה.

## 1 · מה המשתמש רואה
- **ב׳-קכו · ₪ בכותרת** — מסך-חודש «ספטמבר · 4 · ₪ 11,000» ומסך-שבוע (`balaganItemsMoney`, כל תיק פעם אחת). צילום: `show2/88`.
- **ב׳-קכז · נושא עם פתוחים ו-₪** — ב«נושאים» כותרת-קטע «דירה · 2 פתוחים · ₪ 11,000» (`balaganTopicOpen` על `bhOpenCount`+`bhMoney`). צילום: `show2/87`.
- **ב׳-קכח · «הטלפון הזה של רות לוי — אותו אדם?»** — בטופס-האישור כשהטלפון מוכר תחת שם אחר (`balaganPersonByPhone`, `bhPhoneKey`: 052… = +972…); צ׳יפ «כן, רות לוי» ממלא את שדה-האדם.
- **ב׳-קכט · «פתוח: ₪ n · m תיקים»** — בשורת-הכסף, כל התיקים הפתוחים עם סכום (`balaganOpenSummary`; מוצג רק כשהוא שונה מ«החודש»).

## 2 · הוכחה
`behavior` 24/24 · `gen_behaviors_test` 7/7 · `balagan_facts_test` 82/82 (חדש: ב׳-קכח) · analyze 0 · build · `balagan` 35/36 · `balaganrun` 2·1.
