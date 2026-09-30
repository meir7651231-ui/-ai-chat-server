import il.liba.app.NBest

fun nbestTests() {
    val cmds = setOf("תקרי", "כמה סוללה אכלת היום", "תחזירי אחורה")
    val known: (String) -> Boolean = { it in cmds }
    ok(NBest.pick(listOf("צנומן", "תקרי", "תקרא"), known) == NBest.Pick("תקרי", 1), "nbest: noise first, the command second - the command")
    ok(NBest.pick(listOf("תקרי", "תקריא"), known).index == 0, "nbest: a command first stays first")
    ok(NBest.pick(listOf("תזמין לי מונית לשש", "תזמין לי מונית לשש וחצי"), known).text == "תזמין לי מונית לשש", "nbest: free speech is sent as heard")
    ok(NBest.pick(listOf("א", "ב", "ג", "תקרי"), known).index == 0, "nbest: only the top three are trusted")
    ok(NBest.pick(emptyList(), known).index == -1 && NBest.pick(listOf("  ", "תקרי"), known).text == "תקרי", "nbest: empty alternatives are skipped")
}
