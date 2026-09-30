package il.liba.app

/**
 * step device-mem: the memory the phone keeps for itself. Pure Kotlin - no Android, no org.json - so it is compiled and
 * tested on the JVM (tools/kt-test.mjs). The page is the source of truth and sends a snapshot (memSync): the 500 facts
 * used most, the person cards, the policy rules. When the page is down the bubble answers "מה אתה זוכר על X" and
 * "מי זה X" from here, and keeps "תזכור ש…" as pending until the page is back (memAsk -> memAck). The words are matched
 * exactly as the page matches them (memWords: no one-letter prefixes, no final forms), so the phone and the page never
 * disagree about what a question is about.
 */
data class MFact(val key: String, val raw: String, val kind: String = "fact", val uses: Int = 1, val updatedAt: Long = 0,
                 val expiresAt: Long = 0, val local: Boolean = false)
data class MPerson(val key: String, val name: String, val aliases: List<String> = emptyList(), val relation: String = "", val updatedAt: Long = 0)
data class MPending(val id: String, val text: String, val at: Long)

class MemCore {
    val facts = LinkedHashMap<String, MFact>()
    val people = LinkedHashMap<String, MPerson>()
    val rules = ArrayList<String>()
    val pending = ArrayList<MPending>()
    var syncedAt = 0L
    private var seq = 0

    companion object {
        const val CAP = 500
        const val PENDING_CAP = 200
        private val FINAL = mapOf('ך' to 'כ', 'ם' to 'מ', 'ן' to 'נ', 'ף' to 'פ', 'ץ' to 'צ')
        private val STOP = setOf("של", "את", "על", "עם", "זה", "מה", "הוא", "היא")
        private val MARKS = Regex("[‎‏‪-‮⁦-⁩﻿֑-ׇ]")
        private val PUNCT = Regex("[?!.,:;\"'׳״]")
        private val SPACE = Regex("\\s+")
        private val PREFIX = Regex("^[בלכושהמ]{1,2}(?=[א-ת]{3})")
        private val LIBA = Regex("(^|\\s)ליבא(?=\\s|$)")
        fun norm(t: String) = t.replace(MARKS, "").replace(PUNCT, "").replace(SPACE, " ").trim().replace(LIBA, "$1ליבה")
        /** the page's memWords, letter for letter */
        fun words(t: String): List<String> = norm(t).split(' ')
            .map { w -> w.map { FINAL[it] ?: it }.joinToString("") }
            .map { if (it.length > 3) it.replace(PREFIX, "") else it }
            .filter { it.length >= 2 && it !in STOP }
    }

    fun live(f: MFact, now: Long) = f.expiresAt == 0L || f.expiresAt > now

    fun about(q: String, now: Long): List<MFact> {
        val w = words(q); if (w.isEmpty()) return emptyList()
        return facts.values.filter { f -> live(f, now) && words(f.raw).joinToString(" ").let { hay -> w.all { hay.contains(it) } } }
            .sortedWith(compareByDescending<MFact> { it.uses }.thenByDescending { it.updatedAt }).take(5)
    }

    private fun names(p: MPerson) = (listOf(p.name) + p.aliases).map { words(it).joinToString(" ") }.filter { it.isNotEmpty() }

    fun who(q: String): MPerson? {
        val w = " " + words(q).joinToString(" ") + " "
        return people.values.firstOrNull { p -> names(p).any { w.contains(" $it ") } }
    }

    /** offline "תזכור ש…": kept as a local fact at once (so "מה אתה זוכר על" finds it) and as pending for the page */
    fun remember(text: String, at: Long): MPending {
        val t = norm(text).let { if (it.startsWith("ש") && it.length > 3) it.substring(1) else it }
        val p = MPending("m-" + at.toString(36) + "-" + (seq++).toString(36), t, at)
        pending.add(p); while (pending.size > PENDING_CAP) pending.removeAt(0)
        facts["dev." + p.id] = MFact("dev." + p.id, t, "note", 1, at, 0, true)
        return p
    }

    /** the page stored them: the pending go, and so do their local stand-ins - the next snapshot has the real facts */
    fun ack(ids: Collection<String>) {
        pending.removeAll { it.id in ids }
        ids.forEach { facts.remove("dev.$it") }
    }

    /** a snapshot from the page replaces everything but what the page has not stored yet */
    fun apply(fs: List<MFact>, ps: List<MPerson>, rs: List<String>, at: Long) {
        val keep = facts.values.filter { f -> f.local && pending.any { "dev." + it.id == f.key } }
        facts.clear()
        fs.sortedWith(compareByDescending<MFact> { it.uses }.thenByDescending { it.updatedAt }).take(CAP).forEach { facts[it.key] = it }
        keep.forEach { facts[it.key] = it }
        people.clear(); ps.forEach { people[it.key] = it }
        rules.clear(); rules.addAll(rs)
        syncedAt = at
    }

    /* the sentences, as the page says them - with where the answer came from */
    fun answerAbout(q: String, now: Long): String {
        val h = about(q, now)
        return if (h.isEmpty()) "אני לא יודעת כלום על $q, לפחות לא בזיכרון שבטלפון."
        else "על $q אני יודעת: " + h.joinToString("; ") { it.raw } + ". זה מהזיכרון שבטלפון."
    }
    fun answerWho(q: String, now: Long): String {
        val p = who(q) ?: return "אני לא מכירה את $q, לפחות לא בזיכרון שבטלפון."
        val more = about(p.name, now).map { it.raw }.filter { !it.startsWith(p.name + " הוא") }.take(3)
        return p.name + (if (p.relation.isNotEmpty()) " הוא " + p.relation else "") +
            (if (p.aliases.isNotEmpty()) ", קוראים לו גם " + p.aliases.joinToString(", ") else "") + "." +
            (if (more.isNotEmpty()) " עוד: " + more.joinToString("; ") + "." else "")
    }
    fun answerRemember(p: MPending) = "זכרתי: ${p.text}. אעביר לדף כשאתחבר."
}
