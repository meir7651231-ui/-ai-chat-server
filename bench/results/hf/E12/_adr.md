# ADR: Add סך הכל particle to payments screen

## Question
Should the `סך הכל` particle show:
- (A) Sum of ALL payments in the תיק, regardless of status (שולם/not שולם)?
- (B) Sum of only PAID payments (שולם=כן)?
- (C) Sum of only UNPAID payments (שולם=לא)?

## Assumed Answer
**(A) Sum of ALL payments** — The dashboard already tracks unpaid count separately (line 11: `מונה(תשלום: שולם=לא)`). A total sum of all amounts is most useful for financial overview. The particle mirrors the pattern of line 19 `חלקיק תשלום: הכנסה = סכום(סכום)` — we're adding an alias with Hebrew label `סך הכל` (grand total).

## Consequences
- The particle will be named `סך הכל` and appear on the payments screen.
- It aggregates `סכום` field of all תשלום records linked to the תיק.
- No additional filtering by status.
