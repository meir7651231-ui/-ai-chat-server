// step kotlin-egress on the JVM: 8 audio routes x 4 sensitivities = 32 cases against a table written here, the
// explicit "תקריאי", the lock screen, and links. Run through: node tools/kt-test.mjs
import il.liba.app.*

fun egressTests() {
    val want = mapOf(Route.EARPIECE to 3, Route.WIRED to 3, Route.BT_MINE to 3, Route.SPEAKER to 1, Route.CAR to 1, Route.UNKNOWN to 1, Route.BT_OTHER to 0, Route.CAST to 0)
    var green = 0; val bad = ArrayList<String>()
    for ((r, max) in want) for (s in 0..3) { val v = EgressCore.decide(r, s); if (v.speak == (s <= max) && (v.speak || v.hold!!.startsWith("יש הודעה אישית"))) green++ else bad.add("${r.name}/$s") }
    ok(green == 32, "egress: 8 routes x 4 levels - $green/32 " + bad.joinToString(","))
    ok(EgressCore.decide(Route.SPEAKER, 3, override = true).speak && EgressCore.decide(Route.CAR, 2, override = true).speak && !EgressCore.decide(Route.BT_OTHER, 2, override = true).speak && !EgressCore.decide(Route.CAST, 1, override = true).speak,
        "egress: 'תקריאי' opens the loudspeaker and the car, never a stranger's speaker or a cast")
    ok(EgressCore.decide(Route.BT_OTHER, 2).hold!!.contains("נתק את רמקול בלוטות' זר"), "egress: the held sentence says how to hear it")
    ok(EgressCore.notifText(2, "הילד של משה מאושפז") == ("יש הודעה מליבה" to true) && EgressCore.notifText(0, "הדוח מוכן") == ("הדוח מוכן" to false), "egress: the lock screen shows only that there is a message")
    ok(SrOffline.say(13, true).contains("זיהוי עברית מקומי") && SrOffline.say(2, false).startsWith("אין אינטרנט") && SrOffline.say(12, false).startsWith("אין אינטרנט"), "offline speech: the bubble says why it did not understand, and what to do")
    ok(EgressCore.urlClean("https://github.com/meir/x") && !EgressCore.urlClean("https://github.com/x?q=secret") && !EgressCore.urlClean("https://claude.ai/code#החוב"), "egress: a link with content in its address is not opened")
}
