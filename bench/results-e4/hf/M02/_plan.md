# Plan: Add בדיקה entity to peruk12 app

## Goal (one line)
Add a second entity בדיקה (inspection) with link to תיק, required text field, yes/no field; table screen + dashboard counter for non-conforming inspections.

## 10-Step Decomposition

1. **Search existing patterns** — use search-record.mjs to find how entities with links are declared; record --choose or --none.

2. **Read SPEC-LANG.md** (done) — confirm syntax for:
   - ישות <name> עם <field>*, <field>, <field> ...
   - קישור: field name matching entity name = automatic link (תיק* = link to תיק)
   - בחירה-סגורה: field{כן|לא}
   - Particle [טבלה]: table
   - Particle for counter: count(<entity>: <field>=<value>)

3. **Draft spec lines** for בדיקה entity:
   ```
   ישות בדיקה עם תיק*, מה נבדק*, תקין{כן|לא}
   חלקיק בדיקה: [טבלה]
   חלקיק בדיקה: [ריק] אין בדיקות עדיין
   ```

4. **Edit peruk12.txt** — append lines after תיק entity definition (keep order: entity, then particles, then content).

5. **Add dashboard counter** — find "לוח בקרה" line; add new counter:
   ```
   לוח בקרה עם מונה(תיק), מונה(בדיקה: תקין=לא)
   ```

6. **Add content particles** — any static text needed for בדיקה screens (e.g., [פעולה], [ריק]).

7. **Verify no syntax errors** — read final spec, check balance of lines, closing lines.

8. **Regenerate app** — run:
   ```
   node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin
   ```

9. **Check machine report** — run police-bench.mjs with --task M02; verify DONE and no failures.

10. **Write claims.json** with verified assertions from grep/diff.

---

## FND Checklist (Foundation: spec + entity validity)
- [ ] Entity בדיקה declared with required fields: תיק* (link), מה נבדק* (text), תקין{כן|לא}
- [ ] No syntax errors in spec (balance, field order, closing)
- [ ] Dashboard counter: count(בדיקה: תקין=לא) in לוח בקרה line

## FRM Checklist (Form/Render: generated Dart is sane)
- [ ] App regenerates without flutter analyze errors
- [ ] new/dart-gen-bs/peruk12.dart exists and contains בדיקה screens
- [ ] Table particle emits DsTable with columns
- [ ] Counter renders as numeric KPI

## WIR Checklist (Wiring: entities link correctly)
- [ ] תיק* field on בדיקה resolves to existing תיק entity
- [ ] Dashboard shows both קוראים: תיק counter and בדיקה:תקין=לא counter
- [ ] No orphaned screens or missing navigation

## VRB Checklist (Verification: no hand-edits, byte integrity)
- [ ] No files in new/ or generated/ are hand-edited (byte-identical check)
- [ ] Other apps (peruk11, peruk13, etc.) output remains byte-identical

## OPS Checklist (Operations: machine acceptance)
- [ ] police-bench.mjs --task M02 returns DONE
- [ ] All checks: regen_ok, no_hand_edit, byte_identical_others, gates_pass
- [ ] No_hebrew_in_engine passes (engine has no new Hebrew literals)
