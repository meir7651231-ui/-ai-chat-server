# ADR — Adding סיכום Section to Rental Contract Report

## Context
Task M03: Add to the case report (דוח תיק) a section named סיכום built from content lines. 
One content line must read exactly: "הבטוחות ייבדקו מול התקרה"

File: `machtzev/generator/specs-ds/sechirut.txt`

## Opening Question (§ג.1 — MASTER_PROTOCOL)
**Q: What is the semantic purpose of a סיכום (summary) section in the rental contract report?**

**Assumed Answer:** The סיכום section provides a consolidated summary of key findings about the security deposits and contract terms. It should be built from content lines that highlight critical points (e.g., deposit ceiling check, critical findings, key risks). This follows the pattern of other content-driven report sections like "מה לא בדקנו" and "הסתייגות".

## 10-Step Decomposition
1. Read current sechirut.txt structure and understand the דוח תיק (report) pattern
2. Identify where to add the new report section (line position)
3. Identify where to add the content lines (line position in content section)
4. Create the דוח line: `דוח תיק: סיכום = [תוכן סיכום]`
5. Create 3 content lines starting with `תוכן סיכום:`
   - Line 1: "הבטוחות ייבדקו מול התקרה" (exact match required)
   - Line 2: Additional summary point about contract
   - Line 3: Additional summary point about contract
6. Verify no lines are broken or malformed
7. Verify the exact string exists
8. Run the machine's verification script
9. Collect claims for claims.json
10. Write INSP report if needed

## Decision
Add the סיכום section to the case report with 3 content lines as required.
This aligns with the existing content-driven report pattern and provides a summary layer.

## Rationale
- Follows existing pattern: דוח תיק lines can reference content sections like `[תוכן XXX]`
- Provides semantic value: summary of key audit points
- Non-breaking: only adds new lines, doesn't modify existing ones
- Content-driven: built from content lines, not hardcoded values

## Alternatives Rejected
- Hardcoding summary text in the דוח line: Violates the pattern of using content lines
- Placing it elsewhere: Makes sense at end of report sections before export

## Consequences
- One new דוח line added
- Three new תוכן lines added
- Total file grows by 4 lines
- No structural changes to existing content

## Verification (via machine)
Machine will verify:
- File bytes: no hand-edits outside new/ 
- Gates pass: all syntax checks
- No Hebrew in engine (specs-ds is engine-side)
