package il.liba.app

/**
 * step nbest: the recognizer hears more than one sentence. When its first guess is nothing either side would act on and
 * the second or third is a command, the command is what Meir said ("תקרי" heard as "צנומן" first and "תקרי" second).
 * A first guess that is a command, or free speech with no command among the alternatives, stays as it was: free speech
 * goes to Claude word for word. Pure Kotlin (JVM-tested).
 */
object NBest {
    data class Pick(val text: String, val index: Int)
    fun pick(alts: List<String>, known: (String) -> Boolean, depth: Int = 3): Pick {
        val a = alts.map { it.trim() }.filter { it.isNotEmpty() }
        if (a.isEmpty()) return Pick("", -1)
        if (known(a[0])) return Pick(a[0], 0)
        for (i in 1 until minOf(depth, a.size)) if (known(a[i])) return Pick(a[i], i)
        return Pick(a[0], 0)
    }
}
