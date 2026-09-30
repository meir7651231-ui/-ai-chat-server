package il.liba.app.sense

/**
 * step sense-bus-ears: what the phone hears around Meir (a notification now; the calendar and places later), decided
 * without Android so it is tested on the JVM. One bus for every sense: emit -> a bounded ring (on disk, by SenseBus) ->
 * the page, which acks. The same thing twice (kind:key) is kept once. A notification is heard only from an app Meir
 * named ("תקשיבי להתראות של וואטסאפ") - the list starts empty, so nothing is read before he asks.
 */
data class SenseItem(val id: String, val kind: String, val key: String, val app: String, val title: String, val text: String,
                     val at: Long, val importance: Int, val ttl: Long)

object SenseRules {
    private val URGENT = listOf("דחוף", "חירום", "בהקדם", "מיד", "תתקשר", "urgent", "asap", "emergency")
    private val PROMO = listOf("מבצע", "הנחה", "קופון", "sale", "promo", "discount", "unsubscribe")
    private val CHAT = setOf("com.whatsapp", "com.whatsapp.w4b", "com.google.android.apps.messaging", "org.telegram.messenger", "com.samsung.android.messaging")
    private val MAIL = setOf("com.google.android.gm", "com.microsoft.office.outlook")
    private val CALLS = setOf("com.google.android.dialer", "com.samsung.android.dialer", "com.android.server.telecom")
    /** 0 noise, 1 mail and the rest, 2 a person writing, 3 urgent or a missed call */
    fun importance(app: String, title: String, text: String): Int {
        val t = (title + " " + text).lowercase()
        if (PROMO.any { t.contains(it) }) return 0
        if (URGENT.any { t.contains(it) } || (app in CALLS && (t.contains("שיחה שלא נענתה") || t.contains("missed")))) return 3
        if (app in CHAT && title.isNotBlank()) return 2
        return if (app in MAIL) 1 else 1
    }
}

class SenseCore {
    val ring = ArrayDeque<SenseItem>()
    private val seen = LinkedHashMap<String, Long>()
    val apps = LinkedHashSet<String>()
    private var seq = 0
    companion object { const val CAP = 500; const val SEEN = 3000; const val TTL = 2 * 86_400_000L }

    fun emit(kind: String, key: String, app: String, title: String, text: String, at: Long, ttl: Long = TTL): SenseItem? {
        if (kind == "notif" && app !in apps) return null
        if (title.isBlank() && text.isBlank()) return null
        val h = "$kind:$key"; if (seen.containsKey(h)) return null
        seen[h] = at; while (seen.size > SEEN) seen.remove(seen.keys.first())
        val it = SenseItem("s-" + at.toString(36) + "-" + (seq++).toString(36), kind, key, app, title.take(120), text.take(500), at, SenseRules.importance(app, title, text), ttl)
        ring.addLast(it); while (ring.size > CAP) ring.removeFirst()
        return it
    }
    /** the oldest first, still in the ring until acked */
    fun batch(max: Int, now: Long): List<SenseItem> { ring.removeAll { it.at + it.ttl < now }; return ring.take(max) }
    fun ack(ids: Collection<String>) { ring.removeAll { it.id in ids } }
    fun restore(items: List<SenseItem>) { items.forEach { ring.addLast(it); seen["${it.kind}:${it.key}"] = it.at } }
}
