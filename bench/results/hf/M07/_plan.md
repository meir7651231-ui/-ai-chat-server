# Plan: Add Unsent Findings Counter to Dashboard and Particle

## Goal (one line)
Add a dashboard counter and findings-screen particle to track findings with `נשלח=לא` (not sent).

## Decomposition (≤10 steps)

1. **Search for precedent**: Find how payment "לא שולם" (not paid) counter is implemented
   - Verify pattern in sechirut.txt lines 11 and 20
   - Confirm mechanism uses `מונה(entity: field=value)` syntax

2. **Record search**: Run `node machtzev/search-record.mjs` with Hebrew+English terms
   - Search for "לא נשלחו not sent counter findings"
   - Record --choose or --none response

3. **Identify insertion points**: Mark exact locations in sechirut.txt
   - Line 11: dashboard line, after `מונה(תשלום: שולם=לא)`
   - New line after 20: findings particle

4. **Edit dashboard counter**: Add `מונה(ממצא: נשלח=לא)` to line 11
   - Preserve all existing counters
   - Add new counter with consistent comma separation

5. **Add findings particle**: Insert new line after line 20
   - New line: `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)`
   - Follows exact naming pattern of payment particle (line 20)

6. **Verify byte changes**: Read modified sechirut.txt
   - Confirm only intended lines changed
   - No accidental whitespace/formatting breaks

7. **Run police**: Execute `node machtzev/police.mjs --fast`
   - Check for spec parsing errors
   - Verify gates pass

8. **Generate and inspect**: Run full generator
   - Check that new counter and particle generate without error
   - Inspect generated dart files in new/ for correct wiring

9. **Audit generated code**: Spot-check dart generation
   - Dashboard counter renders in monitor screen
   - Particle generates with correct counter logic

10. **Write claims.json**: Document verified changes
    - Claim dashboard counter added: regen_ok, no_hand_edit
    - Claim particle added: regen_ok, byte_identical_others
    - Run machine police to confirm DONE

## Key Assumptions
- Generator uses spec .txt file (not generated outputs) as source of truth
- `מונה(entity: field=value)` pattern is correctly handled by engine
- No new engine rules needed; uses existing counter mechanism
