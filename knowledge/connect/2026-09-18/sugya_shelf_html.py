"""היכן נתפר סורק-ה-HTML: באינדקס-האטומים (הצעת-המנהל) או בשרשרת-המקור (מדידה שלי)?
כל טענה = מקור אמיתי מהריפו, בדרגה שלו. L114: בחירה בין מועמדים עולה לישיבה."""
from yeshiva import (AMORA, BRAITA, KATUV, SEVARA, MAASEH, Case, Geder, KnowledgeBase, Rule, YeshivaEngine, source)

kb = KnowledgeBase()
kb.dimension("צרכן", "classOf", "בורר_אטומים")          # מי קורא את מה שנסרק
kb.dimension("סוג_הנסרק", "ישות_ושדות", "אטום_קוד")     # מה יוצא מה-HTML
kb.dimension("נעוץ", "כן", "לא")                         # האם הקובץ ב-pins.sha256

מנהל = source("המנהל: «atom-index.mjs (ו/או האורקל), לפי מה שתמדוד שהוא המקום הנכון»", KATUV)
לקח = source("L113 (LEARNINGS.md:904): «האורקל סורק גם knowledge/assets/screens ו-HTML»", BRAITA)
מדידה_שרשרת = source(
    "מדידה: grep atom-index-full|logic-census על tzinor.mjs · yeshiva/purpose.mjs · sentence.mjs ⇒ 0 התאמות; "
    "classOf = soleClassOf (purpose.mjs:124) ⇒ candidatesFor (tzinor.mjs:214) ⇒ vertical-packs + entity-terms + schema-fields",
    AMORA, kind=MAASEH)
מדידה_אינדקס = source(
    "מדידה: atom-index.mjs סורק new/dart-ui-bs + dart-forge-bs ומחזיר {cls,file,seam,caps} של ווידג׳טים; "
    "oracle.mjs ממזג אותו עם logic-census — שניהם על **קוד Dart**, אף אחד לא על ישויות",
    AMORA, kind=MAASEH)
מדידה_טבלה = source(
    "מדידה: knowledge/assets/screens/mosad-plan.html — 15 טבלאות עם <th>ישות</th><th>שדות עיקריים</th> ⇒ 194 שורות ישות+שדות; "
    "ב-24 המסכים האחרים 0 טבלאות כאלה",
    AMORA, kind=MAASEH)
מדידה_דיבור = source(
    "מדידה: speechSynthesis קיים ב-2 מסכים (hamecholel.html:227-233 · siha-im-hamecholel.html:212-223) כפונקציית say — קוד, לא ישות",
    AMORA, kind=MAASEH)
מדידה_נעיצה = source("מדידה: pins.sha256 — atom-index.mjs:28 · oracle.mjs:31 · entity-terms.mjs:63 נעוצים; tzinor.mjs אינו נעוץ", AMORA, kind=MAASEH)
חוק = source("LAW.md חוק-4: החוזה מתכופף למקור, לא המקור לחוזה", KATUV)
סברא = source("סברא", SEVARA)

kb.claim("נתפר_באינדקס_האטומים", True, מנהל, Case.of(סוג_הנסרק="אטום_קוד"), "המנהל הצביע על האינדקס — ולגבי say/voiceListen זה אטום-קוד")
kb.claim("נתפר_באינדקס_האטומים", True, לקח, Case.of(סוג_הנסרק="אטום_קוד"), "L113 מנסח «האורקל סורק HTML» וגם «voiceListen נרשם כאטום-גשר» — באותו משפט")
kb.claim("נתפר_באינדקס_האטומים", True, מדידה_דיבור, Case.of(סוג_הנסרק="אטום_קוד"), "say הוא פונקציה — מקומה במפקד-האטומים")
kb.claim("נתפר_באינדקס_האטומים", False, מדידה_שרשרת, Case.of(צרכן="classOf"), "classOf אינו קורא את האינדקס כלל — סריקה לשם לא תזיז אותו")
kb.claim("נתפר_באינדקס_האטומים", False, מדידה_אינדקס, Case.of(סוג_הנסרק="ישות_ושדות"), "האינדקס מחזיר מחלקות-ווידג׳ט; ישות עם שדות אינה מהסוג שלו")
kb.claim("נתפר_באינדקס_האטומים", False, מדידה_טבלה, Case.of(סוג_הנסרק="ישות_ושדות"), "194 שורות ישות+שדות הן דאטת-סכמה — צרכן שלה הוא tzinor")
kb.claim("נתפר_באינדקס_האטומים", False, חוק, Case.of(צרכן="classOf", סוג_הנסרק="ישות_ושדות"), "לכופף את האינדקס לישויות = לכופף מקור לחוזה")
kb.claim("נתפר_באינדקס_האטומים", True, מדידה_נעיצה, Case.of(נעוץ="כן"), "נעיצה אינה איסור — היא דורשת Allow ו-pins --write; לא שיקול-תוכן")
kb.rule(Case.of(צרכן="classOf", סוג_הנסרק="ישות_ושדות"), "נתפר_באינדקס_האטומים", False, סברא, "התפר הולך אחרי הצרכן, לא אחרי השם")

חלוקה = Geder("שני תפרים לפי הצרכן",
    (Rule(Case.of(סוג_הנסרק="אטום_קוד"), "נתפר_באינדקס_האטומים", True, סברא),
     Rule(Case.of(סוג_הנסרק="ישות_ושדות"), "נתפר_באינדקס_האטומים", False, סברא)),
    "ה-HTML נושא שני סוגי-חומר; כל סוג נתפר אצל הצרכן שלו — האטום למפקד, הישות לשרשרת-המקור.")
תפר_אחד = Geder("תפר אחד באינדקס",
    (Rule(Case.of(סוג_הנסרק="אטום_קוד"), "נתפר_באינדקס_האטומים", True, סברא),
     Rule(Case.of(סוג_הנסרק="ישות_ושדות"), "נתפר_באינדקס_האטומים", True, סברא)),
    "כל מה שנסרק נכנס לאינדקס-האחד, והצרכנים ייגשו אליו משם.")
kb.chakira("מהו התפר של סורק-ה-HTML", חלוקה, תפר_אחד)

if __name__ == "__main__":
    e = YeshivaEngine(kb)
    print(e.sugya("סוגיא דהיכן נתפר סורק-ה-HTML"))
    print()
    print(e.ask("נתפר_באינדקס_האטומים", Case.of(צרכן="classOf", סוג_הנסרק="ישות_ושדות")))
    print()
    print(e.ask("נתפר_באינדקס_האטומים", Case.of(צרכן="בורר_אטומים", סוג_הנסרק="אטום_קוד")))
