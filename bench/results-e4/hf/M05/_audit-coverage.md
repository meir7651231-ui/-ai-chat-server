# Audit Coverage: peruk21 Message Particle Task

## Findings

**machtzev/generator/specs-ds/peruk21.txt · missing particle definition · P0 task-not-done · Add line after line 16: `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן תשובה]`**

**machtzev/generator/specs-ds/peruk21.txt · missing content definition · P0 task-not-done · Add line after line 55: `תוכן תשובה: קיבלתי, הסיווג: {ערך}`**

**new/dart-gen-bs/gen_app_peruk21_px1_content.dart · message particle constants not generated · P0 compile-break · Generator must create constants for message text and label (pattern: gen_app_peruk21_px1_c<N> with message and label pair)**

**new/dart-gen-bs/gen_app_peruk21_px1.dart · message particle rendering missing from per-record loop · P0 compile-break · Add ForgeMustChip + DsNote rendering in AnimatedBuilder section (pattern follows peruk04_px1.dart line 41: `ForgeMustChip(bare: true, items: [...סיווג options...], selected: {...}, onSelect: (i) => appStore.update(...)), DsNote(message: [...generated from {ערך}...], label: ..., tone: 0)`)**

## Coverage Summary

**Checked:** 
- Spec file peruk21.txt for message particle definition ([הודעה] named תשובה with field reference סיווג and content line with {ערך} placeholder) — not present
- Spec file for content definition (תוכן תשובה: קיבלתי, הסיווג: {ערך}) — not present
- Generated Dart code gen_app_peruk21_px1.dart for ForgeMustChip + DsNote rendering — not present
- Generated content file gen_app_peruk21_px1_content.dart for message particle constants (label + message) — not present
- Police report verification: `msg: 0×` and `title: 0×` confirm zero message particles generated, matching findings

**Could not check:** Actual message text value formatting at runtime (field value interpolation into `קיבלתי, הסיווג: {ערך}` pattern) due to missing implementation

**Verdict:** Task incomplete. The message particle specification was never added to the spec file, so the generator produced no output. Task requires both spec modification and successful re-generation with police verification.
