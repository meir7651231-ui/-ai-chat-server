package il.liba.app

/**
 * step proactive: the reminders the page hands the phone (remind), decided without Android so they are tested on the JVM.
 * An item is due from `at` until `until`; the phone says at most MAX a day (the page counts what the phone said, from
 * hello's spoken list, so it is one budget), never at night (before 8, from 22 - held to 8:00), never in night mode, and
 * never twice. `next` is when the one alarm should ring: the earliest due-or-future item, moved out of the night.
 */
data class Reminder(val id: String, val at: Long, val until: Long, val text: String)

class ReminderCore {
    val items = ArrayList<Reminder>()
    val fired = LinkedHashSet<String>()
    var day = ""; var count = 0

    companion object { const val MAX = 3; const val DAY_START = 8; const val DAY_END = 22 }

    /** a new list from the page replaces the old one; what was already said stays said */
    fun replace(list: List<Reminder>) { items.clear(); items.addAll(list.filter { it.id !in fired }) }

    private fun roll(today: String) { if (day != today) { day = today; count = 0 } }

    /** what to say now: due, not said, inside the day, within the budget */
    fun due(now: Long, hour: Int, today: String, night: Boolean): List<Reminder> {
        roll(today)
        if (night || hour < DAY_START || hour >= DAY_END) return emptyList()
        val out = items.filter { it.id !in fired && it.at <= now && now <= it.until }.sortedBy { it.at }.take((MAX - count).coerceAtLeast(0))
        out.forEach { fired.add(it.id) }; count += out.size
        items.removeAll { it.id in fired || it.until < now }
        while (fired.size > 200) fired.remove(fired.first())
        return out
    }

    /** when to ring next: the earliest item not said; a time in the night becomes 8:00 (given as the next morning) */
    fun next(now: Long, hour: Int, nextMorning: Long): Long? {
        val t = items.filter { it.id !in fired && it.until >= now }.minOfOrNull { maxOf(it.at, now) } ?: return null
        val nightNow = hour < DAY_START || hour >= DAY_END
        return if (t <= now && nightNow) nextMorning else t
    }
}
