# ⚡ מחצב · לוח-המצב של המנוע-האחד
_ריצה: 2026-08-30T09:45Z · 145s · מהיר_

| שלב | מצב | זמן | פרטים |
|---|---|---|---|
| רענון-מסכים ממקור-חי | ✅ | 1.8s | 254 מסכים |
| מיפוי-כל-המסכים (screen-decomp) | ✅ | 26.8s | 254 מסכים מופו+חולצו |
| דדופ-widgets (הכרעה-5) | ✅ | 0.4s |  |
| דדופ-אטומי-מדף | ✅ | 0.1s |   write-org-join-request-strings.mjs + write-org-request-strings.mjs  ← בקשת |
| דדופ-אימפריאלי (Dart↔Dart) | ✅ | 0.2s | 4 מועמדי-ליבה-אימפריאלית |
| קטלוג-מונחים מאוחד | ✅ | 0.1s | 5335 ייחודיים |
| מנוע-המדף (shelf-lift) | ✅ | 8.7s | 🛗 מנוע-המדף v2 · הורמו: 158 אטומים (3 Stateful · משרתים 174 מופעים) · נדחו: 166 |
| מנוע-הליטוש (data-lift) | ✅ | 9.4s | 🧽 מנוע-המטרות v3 · לוטשו: 103 widgets (287 מחרוזות⇒props · 15 משוטחי-מודל · משרתים 112) · נדחו: 385 |
| מנוע-המניפסטים (gen-manifest) | ✅ | 3.1s | 📋 מנוע-המניפסטים · שלמים: 7 ⇒ manifests/ · טיוטות: 72 (53 שטוחות) ⇒ manifests-draft/ · בלי-אטומים: 78 · לא-מסך (אפס-מחלקות): 97 |
| הרכבה-מחוללת (gen-screen) | ✅ | 7.8s | 80 מסכים הורכבו-ממניפסט |
| מנוע-הסינתזה (חלום + יכולות-מוזמנות) | ✅ | 0.9s | 🧪 סינתזה: 4 יכולות-מוזמנות הורכבו (מאגר-חיווט: 127 · ברי-הרצה: 248) |
| המחולל (genesis-gen · הכרעה 17) | ✅ | 0.3s | 🧬 entry · "המחולל" · 34/34 חלקים ⇒ HeroCard, CaSubTitle, RStat, RStat, RStat, CaSubTitle, RStat, CaSubTitle, InlineTextRow, CaSubTitle, UnitSegmentToggle, CaSubTitle, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, HeroCard, CaSubTitle, ChipWrap, ChipWrap, CoinBanner, ActionRow, RStat, SwitchRow, InlineTextRow, RStat |
| מחולל-הלוחות (board-gen) | ✅ | 4.3s | 🔌 מחולל-הלוחות · 79 לוחות · חיבורים-מהמקור: 87 · TODO-לוח: 339 · עברית-בביטוי (מועמדת-תוכן): 14 |
| ביקורת-הרכבה (box-audit) | ✅ | 0.1s | 🔌 מבקר-ההרכבה: 46 קופסאות · אפס-נסיגה מ-baseline (478 חוטים) |
| טוהר-דאטה (data-purity-check) | ✅ | 0.1s | ✓ שער-טוהר-דאטה: אפס מעורב-חדש · חוב-מנוהל 47/60 (רק יורד — הכרעה 16) |
| מכונת-הטיהור (הכרעה 19) | ✅ | 6.1s | ✓ שער-טוהר-עומק: אפס זיהום-חדש · חוב-מנוהל 35/59 (רק יורד — הכרעה 19) · 🗿 טוהרו: 0 |
| מד-מוכנות-קופסאות | ⏭️ | 0.1s | Command failed: node /home/user/-ai-chat-server/machtzev/box-coverage.mjs |
| מפת-חיווט (gen-wiring-doc) | ✅ | 0.1s | WIRING.md חולל: 64 קופסאות · 986/1114 מחווט (89%) |
| מנוע-ההמרה-מחדש · דאטה (reconvert-data) | ✅ | 0.2s | 🔁 המרת-דאטה: 392 תאומי-Dart נפלטו ⇒ new/dart-data-maor |
| הזרקת-המדף ל-buildsmart (8 מדפים) | ✅ | 10.2s | 2191 קבצים הוזרקו |
| נחיתת-buildsmart (commit+push כשיש-שינוי) | ✅ | 1.5s | נדחף: 13 קבצים |
| משטרה --fast (10 שערים) | ✅ | 63.1s | ✅ המשטרה ירוקה — 13/13 שערים רצו ותואמים-מרשם |

## המדף
| קטלוג | אטומים |
|---|---|
| מאור-JS (new/atoms) | 1114 |
| מאור-Dart (new/dart-maor) | 665 |
| בנייה-חכמה-Dart (new/dart) | 337 |
| קופסאות-JS · Dart | 64 · 62 |
| UI-משותף (dart-ui-bs) | 10 |
| דאטה (dart-data-bs+maor) | 524 |
| מחצבה (dart-quarry) | 0 |
