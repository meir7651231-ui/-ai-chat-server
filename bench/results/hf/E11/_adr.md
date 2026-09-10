# ADR — Field Rename in peruk02.txt

## Opening Question (§ג.1)

**מה:** Rename case field "תיקונים" → "תיקונים שנדרשו" in peruk02.txt spec
**מקור:** spec-ds format, `machtzev/generator/specs-ds/peruk02.txt` line 6
**תרגום:** This is a field definition in the entity spec. The field "תיקונים*" (required) should become "תיקונים שנדרשו*" throughout the generated app.
**helper נדרש:** None — spec change only, generator handles transformation
**מחרוזות verbatim:** The new field name "תיקונים שנדרשו" is user-facing text that will appear in generated UI
**חסום (⛔):** None — this is purely a spec-level rename

## Assumed Answer

This is a straightforward field rename in a data spec. The generator (`app-ds.mjs` or similar) will:
1. Parse the field name from line 6
2. Generate corresponding form fields, labels, and storage references with the new name
3. Update all references from "תיקונים" to "תיקונים שנדרשו" in the generated Dart code

The spec format appears to be: `ישות <name> עם <field1>, <field2>*, ...`
where `*` marks required fields.

Change required: Line 6, replace `תיקונים*` with `תיקונים שנדרשו*`
