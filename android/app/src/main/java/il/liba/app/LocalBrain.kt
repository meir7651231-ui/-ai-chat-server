package il.liba.app

/**
 * step local-brain: when the page is dead the bubble still knows the state of things - from the mirror the page sends
 * every fifteen seconds (tasks, the brief, the roster) - and answers the few questions that are about that state:
 * where we stopped, what is open, what is stuck, who the brain is. Every answer says how old what it knows is, because
 * a stale answer said as fresh is worse than silence. Pure Kotlin (tested on the JVM); StateMirror keeps it on disk.
 */
data class MTask(val title: String, val status: String, val question: String = "")
data class MProof(val text: String, val speaker: String, val grade: String, val src: String, val at: Long)
data class Mirror(val at: Long, val tasks: List<MTask>, val openLoop: List<String>, val waitingOn: String, val nextAction: String, val brain: String, val live: Int, val proofs: List<MProof> = emptyList(), val today: List<String> = emptyList())

object LocalBrain {
    fun age(now: Long, at: Long): String { val m = ((now - at) / 60_000L).coerceAtLeast(0)
        return when { m < 1 -> "מלפני רגע"; m == 1L -> "מלפני דקה"; m < 60 -> "מלפני $m דקות"; m < 120 -> "מלפני שעה"; m < 24 * 60 -> "מלפני ${m / 60} שעות"; else -> "מלפני ${m / (24 * 60)} ימים" } }
    private fun src(now: Long, m: Mirror) = " (לפי מה שידעתי " + age(now, m.at) + ", הדף לא מחובר)"
    /** id is the registry intent the utterance matched (LibaIntents.offline); null when this is not a state question */
    /** work-book: the second line of the status - what is left today, from the mirror (the page may be dead) */
    fun todayLine(m: Mirror?): String = if (m == null || m.today.isEmpty()) "" else "היום נשאר: " + m.today.take(4).joinToString(", ") + "."
    fun answer(id: String, m: Mirror?, now: Long): String? {
        if (m == null) return when (id) { "brain.where", "brain.open", "brain.who", "tasks.stuck", "proof.where" -> "אין לי עדיין תמונה של המצב בטלפון. כשהדף יחזור אדע."; else -> null }
        return when (id) {
            "brain.where" -> { val loop = m.openLoop.firstOrNull() ?: m.tasks.firstOrNull { it.status == "blocked" || it.status == "running" }?.title
                if (loop == null) "אין לי שום דבר פתוח לדווח עליו" + src(now, m) + "."
                else "עצרנו ב$loop" + (if (m.nextAction.isNotEmpty()) ". הצעד הבא: ${m.nextAction}" else "") + (if (m.waitingOn.isNotEmpty()) ". מחכה ל${m.waitingOn}" else "") + src(now, m) + "." }
            "brain.open" -> { val l = if (m.openLoop.isNotEmpty()) m.openLoop else m.tasks.filter { it.status == "running" || it.status == "blocked" }.map { it.title }
                (if (l.isEmpty()) "אין שום דבר פתוח" else "פתוח: " + l.take(4).joinToString("; ")) + src(now, m) + "." }
            "tasks.stuck" -> { val b = m.tasks.filter { it.status == "blocked" }
                (if (b.isEmpty()) "שום משימה לא תקועה" else (if (b.size == 1) "משימה אחת תקועה: " else "${b.size} משימות תקועות: ") + b.take(3).joinToString("; ") { it.title + (if (it.question.isNotEmpty()) " - " + it.question else "") }) + src(now, m) + "." }
            "proof.where" -> m.proofs.lastOrNull()?.let { p -> "\"" + p.text.take(60) + "\" - " + (if (p.grade == "בלי מקור") "אמר ${p.speaker} בלי מקור" else "${p.grade}, אמר ${p.speaker}" + (if (p.src.isNotBlank()) ". המקור: " + p.src else "")) + src(now, m) + "." } ?: ("עוד לא אמרתי שום דבר שיש לו מקור" + src(now, m) + ".")
            "brain.who" -> (if (m.brain.isEmpty()) "אף מוח לא נרשם" else "המוח: ${m.brain}" + (if (m.live > 0) ", ${m.live} ערים" else ", אף אחד לא ער")) + src(now, m) + "."
            else -> null
        }
    }
}
