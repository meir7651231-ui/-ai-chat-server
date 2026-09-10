# ADR: Task M02 — Add בדיקה entity to peruk12.txt

## Context
peruk12.txt defines a single-entity app for used-car purchase inspection (תיק — case). Task requires adding a second entity בדיקה (inspection) with a table screen and dashboard counter.

## Opening Questions

**Q1: Should בדיקה inherit a default skin from the app or can it be standard forge?**
**Assumed answer:** Use the app's default skin (נייר paper). The forge library handles form/table rendering consistently.

**Q2: Is the בדיקה table screen a particle on the תיק entity, or a standalone screen navigated from the dashboard?**
**Assumed answer:** Standalone screen navigated from the dashboard (hub), consistent with peruk pattern. The particle (חלקיק) would be inline viewing within a case.

**Q3: Should the dashboard counter "inspections where תקין=לא" update in real-time as fields change, or is it a static count?**
**Assumed answer:** Static count (render-time calculation) — the spec language allows `count(<entity>: <field>=<value>)`. No need for live reactivity.

## Decision
- Add בדיקה entity with three fields: תיק* (link), מה נבדק* (text), תקין (yes/no)
- Register in spec-lang via spec-ds syntax (ישות בדיקה עם ...)
- Add [טבלה] particle for table screen
- Add dashboard counter: count(בדיקה: תקין=לא)
- No particle machinery needed; just table + counter.

## Rationale
- Link field (תיק*) anchors בדיקה to cases; required status enforces referential integrity.
- מה נבדק* is free text (no type hint = string).
- תקין gets הגדרה { כן | לא } (closed choice).
- Table particle provides standard CRUD UI; counter provides KPI dashboard item.
- Regeneration via app-ds.mjs --name peruk12 will emit Dart conforming to schema.

## Verification (after implementation)
- police-bench.mjs reports DONE.
- claims.json lists: regen_ok, no_hand_edit, byte_identical_others (other apps), no_hebrew_in_engine.
