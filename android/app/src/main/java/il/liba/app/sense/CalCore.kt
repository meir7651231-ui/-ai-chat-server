package il.liba.app.sense

/**
 * step calendar-sense: the calendar as ליבה sees it, decided without Android (tested on the JVM). The provider returns
 * the same meeting once per synced account and all-day events at UTC midnight; this makes one list: one instance per
 * (title, begin, end), the one where Meir's own status is known winning, sorted, inside the window. Read only - writing
 * to the real calendar waits for Meir's decision.
 */
data class CalItem(val id: String, val title: String, val begin: Long, val end: Long, val allDay: Boolean, val where: String,
                   val attendees: Int, val self: Int, val cal: Long = 0)

object CalCore {
    const val SELF_NONE = 0; const val SELF_ACCEPTED = 1; const val SELF_DECLINED = 2; const val SELF_INVITED = 3; const val SELF_TENTATIVE = 4
    fun key(i: CalItem) = i.title.trim().lowercase() + "|" + i.begin + "|" + i.end
    fun merge(raw: List<CalItem>, from: Long, to: Long): List<CalItem> =
        raw.filter { it.end > from && it.begin < to && it.title.isNotBlank() }
            .groupBy { key(it) }
            .map { (_, g) -> g.maxWith(compareBy<CalItem> { if (it.self != SELF_NONE) 1 else 0 }.thenBy { it.attendees }) }
            .sortedWith(compareBy<CalItem> { it.begin }.thenBy { it.title })
    /** a meeting in the sense of context-fusion: two or more people, and Meir did not decline */
    fun isMeeting(i: CalItem) = !i.allDay && i.attendees >= 2 && i.self != SELF_DECLINED
}
