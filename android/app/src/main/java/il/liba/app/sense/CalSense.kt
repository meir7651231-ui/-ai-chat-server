package il.liba.app.sense

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.database.ContentObserver
import android.os.Handler
import android.os.Looper
import android.provider.CalendarContract
import androidx.core.content.ContextCompat
import il.liba.app.Trace
import org.json.JSONArray
import org.json.JSONObject

/**
 * step calendar-sense: read only. Nothing is read before Meir says "תקראי את היומן שלי" and Android's own dialog is
 * approved. The window is yesterday to a week ahead; a change in the provider (a synced invitation, a moved meeting)
 * resyncs within five seconds, and the whole window goes to the page as one snapshot (calSync), so a deleted meeting
 * is deleted there too. The last snapshot is kept for when the page comes back.
 */
object CalSense {
    const val WINDOW_BACK = 24 * 3600_000L; const val WINDOW_AHEAD = 8 * 24 * 3600_000L
    @Volatile var sink: ((String) -> Unit)? = null
    @Volatile var last: String? = null
    private var observer: ContentObserver? = null
    private val main = Handler(Looper.getMainLooper())
    private val resync = Runnable { app?.let { sync(it) } }
    private var app: Context? = null

    fun granted(c: Context) = ContextCompat.checkSelfPermission(c, Manifest.permission.READ_CALENDAR) == PackageManager.PERMISSION_GRANTED

    fun start(c: Context) {
        if (!granted(c)) return; app = c.applicationContext
        if (observer == null) runCatching {
            observer = object : ContentObserver(main) { override fun onChange(self: Boolean) { main.removeCallbacks(resync); main.postDelayed(resync, 5000) } }
            c.contentResolver.registerContentObserver(CalendarContract.CONTENT_URI, true, observer!!)
        }.onFailure { Trace.e(Trace.Code.E_SYS_CB, "cal-observe:" + it.javaClass.simpleName) }
        sync(c)
    }
    fun stop(c: Context) { observer?.let { runCatching { c.contentResolver.unregisterContentObserver(it) } }; observer = null; last = null }

    fun sync(c: Context) = Trace.post {
        if (!granted(c)) return@post
        val now = System.currentTimeMillis(); val from = now - WINDOW_BACK; val to = now + WINDOW_AHEAD
        val raw = ArrayList<CalItem>()
        runCatching {
            val proj = arrayOf(CalendarContract.Instances.EVENT_ID, CalendarContract.Instances.TITLE, CalendarContract.Instances.BEGIN, CalendarContract.Instances.END,
                CalendarContract.Instances.ALL_DAY, CalendarContract.Instances.EVENT_LOCATION, CalendarContract.Instances.SELF_ATTENDEE_STATUS, CalendarContract.Instances.CALENDAR_ID)
            CalendarContract.Instances.query(c.contentResolver, proj, from, to)?.use { q ->
                while (q.moveToNext()) raw.add(CalItem(q.getLong(0).toString(), q.getString(1) ?: "", q.getLong(2), q.getLong(3), q.getInt(4) == 1,
                    q.getString(5) ?: "", 0, q.getInt(6), q.getLong(7)))
            }
            // attendees, counted per event, in one query
            if (raw.isNotEmpty()) {
                val ids = raw.map { it.id }.distinct().take(400)
                val n = HashMap<String, Int>()
                c.contentResolver.query(CalendarContract.Attendees.CONTENT_URI, arrayOf(CalendarContract.Attendees.EVENT_ID),
                    CalendarContract.Attendees.EVENT_ID + " IN (" + ids.joinToString(",") { "?" } + ")", ids.toTypedArray(), null)?.use { q ->
                    while (q.moveToNext()) { val k = q.getLong(0).toString(); n[k] = (n[k] ?: 0) + 1 } }
                for (i in raw.indices) raw[i] = raw[i].copy(attendees = n[raw[i].id] ?: 0)
            }
        }.onFailure { Trace.e(Trace.Code.E_SYS_CB, "cal-read:" + it.javaClass.simpleName); return@post }
        val items = CalCore.merge(raw, from, to)
        val j = JSONObject().put("from", from).put("to", to).put("items", JSONArray(items.map { JSONObject().put("id", it.id + "-" + it.begin).put("title", it.title.take(200))
            .put("begin", it.begin).put("end", it.end).put("allDay", it.allDay).put("where", it.where.take(200)).put("attendees", it.attendees).put("self", it.self) })).toString()
        last = j; sink?.invoke(j)
    }
}
