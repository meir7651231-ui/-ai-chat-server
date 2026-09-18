#!/usr/bin/env python3
# ══════════════════════════════════════════════════════════════════════════
#  yeshiva/ask.py — 🕯️ **הדלת של המנוע אל הישיבה.** לא מנוע, ולא פוסק.
#  ────────────────────────────────────────────────────────────────────────
#  L114 פסקה מילה-במילה: «החלטה בין מועמדים: **לא בתוך המנוע** — המנוע שואל
#  את הישיבה דרך הממשק הקיים (`KnowledgeBase.claim/ask ⇒ Answer.trace.to_dict`,
#  ‏0.099s לקריאה), בקשה אחת לריצה», ו«ממשק-מנוע לישיבה קיים; מה שאין הוא
#  **מנוע במחולל שקורא לו**». הקובץ הזה הוא הדלת — הצעד שחסר, לא מנוע חדש.
#
#  ומה שהוא **אינו**: אין כאן שורת-הכרעה אחת. הקובץ מקבל קידוד (ממדים ·
#  מקורות-בדרגה · טענות · שאלות), בונה `KnowledgeBase`, ומריץ `YeshivaEngine`.
#  הפסק כולו — הלכתא או תיקו — נולד שם, ונמסר עם ה-trace המלא כראיה.
#  מי שיחליף כאן שורה יראה את ההבדל ב-trace, לא רק בתוצאה.
#
#  🔴 L115, מילה-במילה: **`MAASEH` הוא `kind`, לא `rank`.** מדידה בפועל
#  נרשמת `AMORA, kind=MAASEH` — לא `BRAITA` מעל הדובר, אחרת הפסק מתהפך.
#  הקובץ אוכף את זה: `kind` נקרא בנפרד מ-`rank`, ו-`rank` חייב להיות 1..6.
#
#  חוזה (stdin ⇒ stdout, JSON יחיד):
#    {  "title":      "<כותרת-הסוגיא>",
#       "dimensions": [ {"dim":"...", "values":["..."], "severity":false} ],
#       "sources":    { "<כינוי>": {"name":"...", "rank":6, "kind":""} },
#       "claims":     [ {"law":"...","truth":true,"source":"<כינוי>",
#                        "case":{"<ממד>":"<ערך>"},"text":"..."} ],
#       "rules":      [ {"when":{...},"law":"...","truth":true,"source":"<כינוי>","name":"..."} ],
#       "questions":  [ {"law":"...","case":{...},"title":"..."} ],
#       "sugya":      true|false }
#  ⇒  {  "ok": true, "engine": "<נתיב yeshiva-engine>",
#        "answers": [ {"law":..,"case":..,"outcome":true|false|null,"trace":{..}} ],
#        "sugya": {..}|null, "ms": <מילישניות> }
#  כשל ⇒ {"ok": false, "error": "<מה בדיוק>"} וקוד-יציאה 1. **אין ברירת-מחדל
#  שקטה**: מי שקורא לקובץ הזה ולא קיבל `ok:true` לא קיבל פסק (L27 · L110).
#
#  שימוש:  PYTHONPATH=<yeshiva-engine> python3 yeshiva/ask.py < kb.json
# ══════════════════════════════════════════════════════════════════════════
import json
import sys
import time

_RANKS = (1, 2, 3, 4, 5, 6)


def _fail(msg):
    json.dump({"ok": False, "error": msg}, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    sys.exit(1)


def main():
    try:
        spec = json.load(sys.stdin)
    except Exception as e:                                  # קלט פגום ≠ «אין פסק»
        _fail(f"stdin אינו JSON תקין: {e}")
    if not isinstance(spec, dict):
        _fail("הקידוד אינו אובייקט")

    try:
        from yeshiva import Case, KnowledgeBase, YeshivaEngine, source
    except Exception as e:
        _fail(f"yeshiva-engine אינו נטען (PYTHONPATH): {e}")

    t0 = time.time()
    kb = KnowledgeBase()

    for d in spec.get("dimensions", []):
        kb.dimension(d["dim"], *d.get("values", []), severity=bool(d.get("severity")))

    srcs = {}
    for alias, s in (spec.get("sources") or {}).items():
        rank = s.get("rank")
        if rank not in _RANKS:
            _fail(f"מקור «{alias}»: דרגה {rank!r} אינה 1..6 "
                  f"(‏MAASEH הוא kind ולא rank — L115)")
        srcs[alias] = source(s["name"], rank, s.get("kind", "") or "")

    def _src(alias):
        if alias not in srcs:
            _fail(f"טענה מפנה למקור «{alias}» שלא הוגדר")
        return srcs[alias]

    def _case(d):
        return Case.of(dict(d or {}))

    for c in spec.get("claims", []):
        kb.claim(c["law"], bool(c["truth"]), _src(c["source"]), _case(c.get("case")), c.get("text", ""))
    for r in spec.get("rules", []):
        kb.rule(_case(r.get("when")), r["law"], bool(r["truth"]), _src(r["source"]), r.get("name", ""))

    e = YeshivaEngine(kb)
    answers = []
    for q in spec.get("questions", []):
        case = _case(q.get("case"))
        a = e.ask(q["law"], case, q.get("title"))
        answers.append({"law": q["law"], "case": case.as_dict(),
                        "outcome": a.outcome, "trace": a.trace.to_dict()})

    sug = None
    if spec.get("sugya"):
        sug = e.sugya(spec.get("title", "סוגיא")).to_dict()

    json.dump({"ok": True, "answers": answers, "sugya": sug,
               "ms": int((time.time() - t0) * 1000)}, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
