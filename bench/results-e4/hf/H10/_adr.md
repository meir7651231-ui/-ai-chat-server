# ADR-H10: Sort Meetings by Time

**Opening Question:**
Should meetings be sorted by time (שעה) in ascending order (earliest first)?

**Assumed Answer:**
Yes. Meetings should be sorted by time (שעה) in ascending order (earliest first) everywhere they appear:
1. In the entity list screen (_view == 0, default list view with cards)
2. In the table view (_view == 3, ForgeDataGrid)
3. Both views should reflect the same sort order

**Rationale:**
This makes the calendar/meeting app more usable - users can see meetings in chronological order by time of day, making it easier to track when meetings occur.

**Implementation Strategy:**
Modify calendar.txt to add sorting by שעה field using the spec-lang `| מיון:` syntax. The generator will then apply this sorting automatically to both the list view and table view.
