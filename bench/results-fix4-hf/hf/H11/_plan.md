# 10-Step Decomposition — Task H11

**Goal:** Add computed field `תקרה נמוכה` (min of two ceiling fields) to entity תיק in sechirut.txt

## Steps

1. **Read & understand source spec** — locate entity תיק in sechirut.txt, identify the two ceiling fields and their formulas
2. **Search record** — run `node machtzev/search-record.mjs` to check if this pattern exists elsewhere
3. **Parse spec line** — understand the entity definition syntax (שדה = נוסחה pattern)
4. **Design formula** — confirm min(a,b) syntax is supported by the generator (check existing examples)
5. **Add field to spec** — edit sechirut.txt line 7 to append the new computed field before the closing pipe
6. **Run police check (--fast)** — ensure no byte violations, wiring stays intact
7. **Run full generator** — invoke the machine report to verify spec parses correctly
8. **Check atoms** — inspect generated output to confirm תקרה נמוכה appears in rendered forms (if touched by generation)
9. **Write verification test** — optional; confirm computed value is min of inputs in golden or app
10. **Verify gates pass** — run full police, confirm VERDICT=DONE in machine report

