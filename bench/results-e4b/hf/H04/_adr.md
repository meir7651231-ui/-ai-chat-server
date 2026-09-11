# ADR-H04: Calendar Meetings Table Sort

## Opening Question (§ג.1)

**Q:** How should the meetings (פגישה) table display and in what order?
- **Assumed answer:** A table particle with columns: what, date, time, location; sorted by date (ascending), then by time (ascending). This allows users to see meetings chronologically without manual scrolling.

**Q:** Should all fields be shown or a subset?
- **Assumed answer:** Show the essential fields: what (מה), date (מועד), time (שעה), location (מקום). Omit the note (הערה) to avoid horizontal scroll.

**Q:** Is the sort order ascending (earliest first) or descending (latest first)?
- **Assumed answer:** Ascending (oldest/earliest first), as that's the natural reading order for a timeline.

---

## Context / Decision

**Task:** In the app generated from `machtzev/generator/specs-ds/calendar.txt`, make the meetings table (פגישה particle screen) sorted by date מועד and then by time שעה.

**Current State:**
- `calendar.txt` defines entity `פגישה` with fields: מה*, מועד*, שעה, מקום, הערה
- No particle (חלקיק) is defined → table doesn't exist yet; need to define it

**Decision:**
- Add a particle definition in spec language: `חלקיק פגישה: [טבלה] … | מיון: מועד עולה, שעה עולה`
- Use SPEC-LANG syntax (line 17) to specify columns and sort order
- Regenerate app using `node machtzev/generator/app-ds.mjs`

---

## Rationale

- **Fix in spec layer, not engine:** SPEC-LANG already supports sort (`מיון:` clause). No engine changes needed.
- **No byte-identical breakage:** Modifying calendar.txt only affects the calendar app; other apps stay untouched.
- **Helper-first:** Sorting is a data concern, not UI logic. The spec language carries it all.

---

## Alternatives Rejected

1. **Hand-edit the generated Dart:** Would fail `no_hand_edit` gate (machine checks new/* files are verbatim from engine).
2. **Add sort logic in engine.mjs:** Unnecessary; spec language already handles it.
3. **Sort by mועד descending:** Violates UX (users expect chronological: earliest first).

---

## Consequences

- **Positive:** Meetings appear in chronological order (sorted by date, then time).
- **Requires:** Rerun `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
- **Machine checks:** `regen_ok`, `byte_identical_others`, `gates_pass`, `compiles`

---

## Verification

1. Read current calendar.txt to confirm no particle exists
2. Add particle with sort spec: `חלקיק פגישה: [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה`
3. Run generator
4. Machine runs police-bench → DONE or NOT DONE
5. If DONE: add claim, write LEARNINGS lesson
6. If NOT DONE: iterate via INSP/stuck-loop checks

---
