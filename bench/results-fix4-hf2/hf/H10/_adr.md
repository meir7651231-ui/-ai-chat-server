# ADR-H10: Meeting Sorting by Time (שעה)

## Context
Task: Sort meetings by time (שעה) everywhere they are listed in the calendar app:
1. Meetings table on the particle screen  
2. Entity list screen

The calendar spec defines Meeting entity with fields: what*, when*, time, place, note.

## Opening Question (per MASTER_PROTOCOL ג.1)
**What are the exact screens/surfaces where meetings appear, and which uses the Meeting entity directly vs. derived?**

**Assumed Answer:**
- Meetings appear in two contexts:
  1. Particle screen (detail view) showing a table of meetings for a date/context
  2. Entity list (hub screen) showing all meetings with quick-view summaries
- Both should sort by time (שעה) field ascending
- The Meeting entity is rendered via atom-display and atom-table patterns
- No backend required; sorting happens in Dart sort() before render

## Decision
Sort all Meeting instances by their `time` field (שעה) in ascending order wherever they are listed. This requires:
1. Finding the Dart code that renders Meeting lists in particle screen
2. Finding the Dart code that renders Meeting list in entity list screen  
3. Adding `.sort((a,b) => a.time.compareTo(b.time))` before rendering in both places
4. Verifying nothing breaks with the police-bench machine

## Rationale
- Meetings are naturally ordered by time in a calendar app
- The task is localized to two display surfaces
- No spec language change needed—just Dart layer
- Changes stay within generated Dart, won't affect other apps (byte-identical check)

## Alternatives Rejected
- Sort in spec layer: calendar.txt has no sort directive; adding one would require engine change
- Sort at generation time: would be opaque to future edits
- Add a computed "sort key": overengineering for a simple display order

## Consequences
- Meeting display becomes more intuitive (chronological)
- Any code that iterates meetings will inherit the sort order
- Must verify both screens actually render all meetings (not paginated/truncated)

## Verification
Machine report will show:
- `regen_ok`: generator ran without errors
- `no_hand_edit`: no manual edits to generated Dart
- `byte_identical_others`: other apps unchanged
- `gates_pass`: all gates pass
- Target: DONE verdict from police-bench
