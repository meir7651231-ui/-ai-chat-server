# ADR: Add participants field to calendar meetings + empty state

## Opening Question

**Q:** When adding a `משתתפים` (participants) field to the `פגישה` entity in calendar.txt, and implementing an empty-state message "אין פגישות השבוע" for the meetings screen:
- (a) Should participants be marked as required (`*`) or optional?
- (b) Should the empty-state appear in all views or only on the home/main meetings screen?
- (c) What should trigger the empty-state: zero meetings this week, or zero meetings total?

**Assumed Answer (A):**
- Participants are **optional** (no `*`), similar to notes/place. Meetings can exist without participants listed.
- Empty-state appears on the **main meetings list screen**, not other views (filter consistency).
- Empty-state triggers when **zero meetings in the active time range** (week-based, matching "השבוע" = this week).

**Rationale:**
- Participants optional: Not all meetings need attendee tracking (solo work/personal reminders).
- Main screen only: Filtered views have their own messaging; "זה כמו Todoist" = simple/focused.
- Week-scoped: Matches the naming "אין פגישות השבוע" (literally "no meetings this week").

---

## Context

- Task: Add `משתתפים` field to `ישות פגישה` and show empty-state text.
- Current spec: `machtzev/generator/specs-ds/calendar.txt`
- Entity line: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים`
- Current fields: what (מה), date (מועד), time (שעה), place (מקום), note (הערה)

---

## Decision

Add `משתתפים` as **optional field** (no `*`) to the `פגישה` entity spec.
Add empty-state rendering for meetings screen: `אין פגישות השבוע` when no meetings in active week.

---

## Consequences

1. Engine will auto-wire `participants: List<String>?` in the meetings model.
2. Meetings screen (BalaganMeetings) will check `_items(thisWeek).isEmpty` and render empty state.
3. UI shows a calming message instead of blank screen.
4. No new gates required (schema is auto-generated).

---

## Verification

- [ ] `calendar.txt` updated with `משתתפים` field
- [ ] Machine report shows `gates_pass` for updated spec
- [ ] UI renders empty state when meetings list is empty (playtest)
- [ ] Meetings with/without participants both render correctly
