package il.liba.app.power

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import il.liba.app.Trace
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

/** step power-ledger on the device: which subsystem is on (sync), the day's meter kept in filesDir/power/day.json */
object PowerLedger {
    private val fmt = SimpleDateFormat("yyyy-MM-dd", Locale.US).apply { timeZone = TimeZone.getTimeZone("Asia/Jerusalem") }
    @Volatile private var m: PowerCore.Meter? = null
    @Volatile var last: PowerCore.Report? = null; private set
    private var phoneStart: Pair<String, Int>? = null
    private fun day(now: Long) = fmt.format(Date(now))
    private fun dir(c: Context) = File(c.filesDir, "power").apply { mkdirs() }

    @Synchronized private fun meter(c: Context, now: Long): PowerCore.Meter {
        val d = day(now); val cur = m
        if (cur != null && cur.day == d) return cur
        if (cur != null) { cur.flush(now); save(c, cur) }
        val n = PowerCore.Meter(d, EnergyModel.rates(c))
        if (cur == null) runCatching { val o = org.json.JSONObject(File(dir(c), "day.json").readText()); if (o.optString("day") == d) o.optJSONObject("mah")?.let { j -> j.keys().forEach { k -> n.mah[k] = j.getDouble(k) } } }
        cur?.open()?.forEach { n.set(it, true, now) }
        m = n; return n
    }
    private val until = HashMap<String, Long>()
    /** a job with no clean end in sight (a download on its own thread): on for at most ms, ended by the next sync after */
    @Synchronized fun pulse(c: Context, tag: String, ms: Long) { val now = System.currentTimeMillis(); until[tag] = now + ms; meter(c, now).set(tag, true, now) }
    /** the one call: the service says which tags are on now */
    @Synchronized fun sync(c: Context, on: Set<String>, now: Long = System.currentTimeMillis()) {
        val mt = meter(c, now); mt.set("base", true, now)
        for (t in PowerCore.DEFAULT_MA.keys) if (t != "base") mt.set(t, t in on || (until[t] ?: 0L) > now, now)
    }
    @Synchronized fun set(c: Context, tag: String, on: Boolean) { meter(c, System.currentTimeMillis()).set(tag, on, System.currentTimeMillis()) }
    private fun battery(c: Context): Triple<Int, Long, Boolean> {
        val bm = c.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        val pct = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY); val cc = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CHARGE_COUNTER).toLong()
        val st = c.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        return Triple(pct, cc, st == BatteryManager.BATTERY_STATUS_CHARGING || st == BatteryManager.BATTERY_STATUS_FULL)
    }
    /** the day so far, as JSON for the page (channel/power) */
    @Synchronized fun report(c: Context, now: Long = System.currentTimeMillis()): String {
        val mt = meter(c, now); val (pct, cc, charging) = runCatching { battery(c) }.getOrDefault(Triple(-1, -1L, false))
        val d = mt.day; val ps = phoneStart
        if (ps == null || ps.first != d || charging) phoneStart = d to pct
        val phonePct = phoneStart?.let { if (it.first == d && it.second >= pct && pct >= 0) (it.second - pct).toDouble() else null }
        val r = PowerCore.report(mt, PowerCore.capacity(cc, pct) ?: 4400.0, now, phonePct); last = r
        save(c, mt); return PowerCore.json(r)
    }
    private fun save(c: Context, mt: PowerCore.Meter) {
        val body = "{\"day\":\"${mt.day}\",\"mah\":{" + mt.mah.entries.joinToString(",") { "\"${it.key}\":${it.value}" } + "}}"
        Trace.post { runCatching { val t = File(dir(c), "day.json.tmp"); t.writeText(body); t.renameTo(File(dir(c), "day.json")) }.onFailure { Trace.e(Trace.Code.E_PREFS, "power:" + it.javaClass.simpleName) } }
    }
}

/** rates per tag: the defaults, or filesDir/power/model.json from a calibration on this phone */
object EnergyModel {
    fun rates(c: Context): Map<String, Double> {
        val out = LinkedHashMap(PowerCore.DEFAULT_MA)
        runCatching { val o = org.json.JSONObject(File(c.filesDir, "power/model.json").readText()); o.keys().forEach { k -> val v = o.getDouble(k); if (v in 0.0..2000.0) out[k] = v } }
        return out
    }
}
