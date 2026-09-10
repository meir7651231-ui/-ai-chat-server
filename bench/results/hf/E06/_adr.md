# E06 — ADR: Add "שלח תזכורת" button to peruk17 case screen

## Context
- Task: Add an action button "שלח תזכורת" to the case screen (particle screen of תיק)
- Location: machtzev/generator/specs-ds/peruk17.txt
- Constraint: Don't break anything

## Opening Question
**Q: What is the interaction model for the "שלח תזכורת" button?**

**Assumed Answer:**
- Type: Action button (like the existing "פתח תיק" button)
- Behavior: Sends a reminder to the case contact (via SMS/WhatsApp)
- No new screen/dialog opens (R2 compliance — dial-drill only)
- Button appears on the particle screen alongside other case actions
- No backend implementation needed (spec-only change)

## Decision
Add a new action particle particle: `חלקיק תיק: [פעולה] שלח תזכורת`

## Rationale
- Matches existing particle format
- Uses existing DsChipButton infrastructure
- Minimal change surface
- Follows peruk convention (action particles for case operations)

## Verification Plan
1. Add particle to peruk17.txt
2. Run machine police report
3. Verify: particle plan generated, no gates broken, no hand-edits in generated files

---

## 10-Step Decomposition

1. **Verify current state** — Read peruk17.txt, particle-plan-peruk17.md
2. **Identify insertion point** — Find where "פעולה" particles are listed
3. **Add particle line** — Insert `חלקיק תיק: [פעולה] שלח תזכורת`
4. **Search record** — `node machtzev/search-record.mjs "שלח תזכורת reminder send"`
5. **Run generator** — Pipeline will regenerate particle plan (not hand-edited)
6. **Verify no broken files** — Check generated outputs are untouched
7. **Inspect byte-identical** — Confirm only peruk17.txt changed, no new/dart-* edits
8. **Gates pass** — Run police machine, all checks green
9. **Write claims.json** — Document verified changes
10. **Done** — Police VERDICT = DONE

