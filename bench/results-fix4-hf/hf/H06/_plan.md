# Task: Sort cases table by price (cheapest first, numeric comparison)

## Goal
Make the cases table in the app generated from peruk12.txt (used car purchase app) sort by price (מחיר) with cheapest first, using numeric comparison (not text).

## Decomposition (≤10 steps)
1. Examine peruk12.txt spec to understand table structure and fields
2. Search code for where "cases table" / particle table is rendered
3. Locate the table rendering code (likely a .mjs generator or .data.json)
4. Find the sorting logic (likely missing or sorting as text)
5. Identify the price field name and data format in the app
6. Add numeric sorting by price in ascending order
7. Fix in correct layer (spec, engine, or data — NOT generated output)
8. Run search-record.mjs to document the change
9. Run police checks to verify no breakage
10. Write claims.json with byte-verified assertions

## Key Unknowns
- Which engine generates the table rendering code
- Current sorting method (if any)
- Where the price data comes from
