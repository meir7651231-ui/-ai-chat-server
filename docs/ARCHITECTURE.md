<p align="right"><b>עברית</b> · <a href="#architecture-english">English</a></p>

# ארכיטקטורה

<div dir="rtl">

> כל מספר וכל שם כאן נבדק מול הקבצים ב-6.11.2026. מה שלא נבדק — לא נכתב.

## התמונה הגדולה

</div>

```
legacy (maor · buildsmart · yoman)
        │  machtzev/ — חציבה ⇒ טיוטות
        ▼
new/atoms/   אטום = <name>.mjs + <name>.contract.md + <name>.test.mjs
        │  מחווטים רק בתוך קופסה
        ▼
new/boxes/   קופסה = <name>.mjs + <name>.contract.md + <name>.test.mjs
        │  מחוברות רק בלוח-האם
        ▼
new/board.mjs   makeBoard(placement) — כאן בלבד מוזרקים שעון, קונפיג וזהות

engine/   משפט (specs/*.txt) ⇒ בחירת-אטומים מ-catalog/ ⇒ מסך Dart (out/)
```

<div dir="rtl">

## השכבות

| שכבה | איפה | מה מותר | מי אוכף |
|---|---|---|---|
| אטום | `new/atoms/` — 1,160 אטומי JS, לכל אחד `.mjs` + `.contract.md` + `.test.mjs` | אפס import של אטום אחר; אפס דאטה צרובה | `wiring-check` · `contract-check` |
| קופסה | `new/boxes/` — 78 קופסאות, לכל אחת קוד + חוזה + בדיקה | המקום היחיד שמחווט אטומים | `wiring-check` |
| לוח-אם | `new/board.mjs` — מייבא 12 קופסאות | מייבא רק מ-`boxes/`; כאן בלבד IO וזהות (חוק 6) | `wiring-check` · `board.test.mjs` (39 טענות) |
| Dart | `new/dart*/`, `runtime/` | אותם חוקים, בשפת Dart | שער-הסינתזה במשטרה |
| מחולל | `engine/` | ליבה בלי ידע על שום פרויקט; כל הידע ב-`knowledge/` והאטומים ב-`catalog/` | שער-הטוהר של המחולל |

`contract-check` סופר 1,239 אטומים — יותר מ-1,160 קבצי ה-JS, כי הוא סורק את כל העץ החדש.

## החוקים (`LAW.md`)

1. **אטום** — עצמאי. אפס import של אטום אחר. קלט ופלט מוצהרים בלבד.
2. **קופסה** — המקום היחיד שמחווט אטומים.
3. **לוח-האם** — קובץ יחיד שמחבר קופסאות.
4. **חוזה קודם, תמיד בדיקה.**
5. **טוהר מוחלט** — שום דאטה בתוך אטום.
6. **זהות וסודות אינם אטומים** — הם חיווט-הצבה.
7. **החלפה הפיכה** — מעבר בטוען-לצד ודגל שאפשר לכבות.

## המחולל — משפט ⇒ מסך

</div>

```
spec line → role (knowledge/lexicon.json) → pickAtom (atlas of catalog/) → fillProp → emit Dart
```

<div dir="rtl">

1. **parse** — כל שורה: מילת-צורה, תווית, מספרים, אופציות, תת-כותרת.
2. **atlas** — סריקה סטטית של `catalog/widgets/*.dart`: שם המחלקה, ה-props והטיפוסים.
3. **pickAtom** — ניקוד לפי התאמת role ויכולת למלא את ה-props; הגבוה נבחר. דטרמיניסטי.
4. **fillProp** — צבעים ⇒ טוקנים, מספרים ⇒ לפי הסדר, טקסט ⇒ תווית.
5. **emit** — `out/screens/gen_<slug>.dart` + `out/data/gen_<slug>_content.dart`. כל הטקסט יוצא לקובץ-הדאטה.

שורה שמילת-הצורה שלה לא נמצאת ב-`lexicon.json` מדולגת — הפלט מראה `3/4 חלקים` (נבדק).

## המשטרה

`machtzev/police.mjs` מריץ 13 שערים (מרשם: `machtzev/gates.tsv`). `--fast` מריץ 10 מהם: wiring · contract · quarry · freeref · datapurity · deeppurity · assembly · synth · coverage · pins. הריצה המלאה מוסיפה boxes · selftest · mutation.
קבצי המשטרה עצמם נעולים בחתימה (`machtzev/pins.sha256`, נבדק ב-`pins-check.mjs`: 11 קבצים).

</div>

---

<a id="architecture-english"></a>

# Architecture (English)

> Every number and name here was checked against the files on 6 Nov 2026. Nothing unchecked is written.

| Layer | Where | Allowed | Enforced by |
|---|---|---|---|
| Atom | `new/atoms/` — 1,160 JS atoms, each `.mjs` + `.contract.md` + `.test.mjs` | no import of another atom; no burned-in data | `wiring-check` · `contract-check` |
| Box | `new/boxes/` — 78 boxes, each with code + contract + test | the only place that wires atoms | `wiring-check` |
| Board | `new/board.mjs` — imports 12 boxes | imports only from `boxes/`; IO and identity injected here only (law 6) | `wiring-check` · `board.test.mjs` (39 assertions) |
| Dart | `new/dart*/`, `runtime/` | the same laws, in Dart | the police synthesis gate |
| Generator | `engine/` | a core with no project knowledge; knowledge in `knowledge/`, atoms in `catalog/` | the generator purity gate |

`contract-check` counts 1,239 atoms — more than the 1,160 JS files, because it scans the whole new tree.

**The laws (`LAW.md`):** 1 atom is independent · 2 only a box wires atoms · 3 one board joins boxes · 4 contract first, always a test · 5 total purity, no data in an atom · 6 identity and secrets are not atoms · 7 reversible replacement.

**The generator:** spec line → role (`knowledge/lexicon.json`) → `pickAtom` over the catalog atlas → `fillProp` → emit `out/screens/gen_<slug>.dart` + `out/data/gen_<slug>_content.dart`. A line whose shape word is not in the lexicon is skipped — the output shows `3/4 parts` (checked).

**The police:** `machtzev/police.mjs` runs 13 gates (registry: `machtzev/gates.tsv`). `--fast` runs 10 of them: wiring · contract · quarry · freeref · datapurity · deeppurity · assembly · synth · coverage · pins. The full run adds boxes · selftest · mutation. The police files are pinned (`machtzev/pins.sha256`, 11 files, checked by `pins-check.mjs`).
