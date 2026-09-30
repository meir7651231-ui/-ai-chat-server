package il.liba.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.content.ContextCompat
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/**
 * step proactive: the first scheduling ליבה has outside a live service. The page sends the date reminders (remind); they
 * are kept in reminders.json (atomic write) with what was already said, and one alarm rings for the earliest. The alarm
 * starts the bubble (or reaches the running one), which says what is due - ReminderCore decides what and how much.
 * LifeReceiver re-arms it after a restart or an update, so a reminder does not die with the phone.
 * Exact alarms when Android allows them; otherwise the inexact one, which Doze may move by some minutes.
 */
object Reminders {
    const val ACTION = "il.liba.app.REMIND"
    val core = ReminderCore()
    @Volatile private var loaded = false
    private fun f(c: Context) = File(c.filesDir, "reminders.json")

    @Synchronized fun load(c: Context) {
        if (loaded) return; loaded = true
        runCatching {
            val o = JSONObject(f(c).readText())
            val a = o.optJSONArray("items") ?: JSONArray()
            core.replace(List(a.length()) { a.getJSONObject(it).let { x -> Reminder(x.optString("id"), x.optLong("at"), x.optLong("until"), x.optString("text")) } })
            val fr = o.optJSONArray("fired") ?: JSONArray(); for (i in 0 until fr.length()) core.fired.add(fr.optString(i))
            core.day = o.optString("day"); core.count = o.optInt("count")
            core.replace(core.items.toList())
        }.onFailure { if (f(c).exists()) Trace.e(Trace.Code.E_PREFS, "remind:" + it.javaClass.simpleName) }
    }
    @Synchronized private fun save(c: Context) {
        val o = JSONObject().put("day", core.day).put("count", core.count).put("fired", JSONArray(core.fired.toList()))
            .put("items", JSONArray(core.items.map { JSONObject().put("id", it.id).put("at", it.at).put("until", it.until).put("text", it.text) }))
        runCatching { val t = File(c.filesDir, "reminders.json.tmp"); t.writeText(o.toString()); t.renameTo(f(c)) }
            .onFailure { Trace.e(Trace.Code.E_PREFS, "remind-save:" + it.javaClass.simpleName) }
    }
    private fun hour(t: Long) = java.util.Calendar.getInstance().apply { timeInMillis = t }.get(java.util.Calendar.HOUR_OF_DAY)
    private fun today(t: Long) = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date(t))
    private fun morning(t: Long) = java.util.Calendar.getInstance().apply { timeInMillis = t; if (get(java.util.Calendar.HOUR_OF_DAY) >= ReminderCore.DAY_END) add(java.util.Calendar.DAY_OF_YEAR, 1)
        set(java.util.Calendar.HOUR_OF_DAY, ReminderCore.DAY_START); set(java.util.Calendar.MINUTE, 0); set(java.util.Calendar.SECOND, 0) }.timeInMillis

    /** from the page */
    fun onRemind(c: Context, json: String) = Trace.post {
        load(c); runCatching { val a = JSONArray(json)
            synchronized(this) { core.replace(List(a.length()) { a.getJSONObject(it).let { x -> Reminder(x.optString("id"), x.optLong("at"), x.optLong("until"), x.optString("text")) } }) }
            save(c); arm(c) }.onFailure { Trace.e(Trace.Code.E_PREFS, "remind-in:" + it.javaClass.simpleName) }
    }
    /** what to say now; marks them said (spokenMid, so the page counts them) */
    fun due(c: Context, night: Boolean): List<Reminder> { load(c); val now = System.currentTimeMillis()
        val out = synchronized(this) { core.due(now, hour(now), today(now), night) }
        out.forEach { Prefs.addSpokenMid(c, it.id) }; Trace.post { save(c); arm(c) }; return out }
    /** the one alarm, for the earliest */
    fun arm(c: Context) {
        load(c); val now = System.currentTimeMillis(); val at = synchronized(this) { core.next(now, hour(now), morning(now)) } ?: return
        val am = c.getSystemService(AlarmManager::class.java) ?: return
        val pi = PendingIntent.getBroadcast(c, 8, Intent(c, ReminderReceiver::class.java).setAction(ACTION), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        runCatching {
            if (Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms()) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, maxOf(at, now + 1000), pi)
            else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, maxOf(at, now + 1000), pi)
        }.onFailure { Trace.e(Trace.Code.E_FGS_START, "remind-arm:" + it.javaClass.simpleName) }
    }
}

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(c: Context, i: Intent) {
        if (i.action != Reminders.ACTION || !Prefs.on(c)) return
        try { ContextCompat.startForegroundService(c, Intent(c, BubbleService::class.java).putExtra("why", "remind")) }
        catch (e: Exception) { Trace.e(Trace.Code.E_FGS_START, "remind:" + e.javaClass.simpleName) }
    }
}
