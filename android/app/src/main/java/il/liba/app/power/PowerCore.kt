package il.liba.app.power

/**
 * step power-ledger: every milliamp with a name. The phone's battery counters measure the whole phone, not ליבה - so
 * the ledger charges each subsystem by how long it really ran (the tag was on) times its rate (mA, from EnergyModel:
 * defaults, replaced by a calibration on the phone). The phone's own drain is kept beside it for comparison, never mixed
 * in. Pure Kotlin (tested on the JVM); PowerLedger holds it on the device.
 */
object PowerCore {
    /** mA while the tag is on - a starting guess until the phone is calibrated (EnergyModel) */
    val DEFAULT_MA: Map<String, Double> = linkedMapOf("base" to 0.5, "mic.vad" to 8.0, "asr.cloud" to 60.0, "asr.ondevice" to 90.0, "tts" to 40.0,
        "ui.shader" to 35.0, "ui.shader.idle" to 8.0, "web.load" to 120.0, "web.idle" to 4.0, "net.update" to 80.0)
    /** reserved for later steps, rate 0 until measured */
    val RESERVED = listOf("mfcc", "yamnet", "a11y", "geo", "work", "disk")

    /** the battery's current, as mA of discharge (positive). Some phones report mA and not µA, some the sign reversed. */
    fun normCurrent(raw: Long, charging: Boolean): Double {
        val a = Math.abs(raw.toDouble()); val ma = if (a > 20_000) a / 1000.0 else a
        return if (charging) 0.0 else ma
    }

    class Meter(val day: String, private val rates: Map<String, Double> = DEFAULT_MA) {
        private val since = HashMap<String, Long>()
        val mah = LinkedHashMap<String, Double>()
        /** (at, mAh total) points for the projection window */
        private val points = ArrayList<Pair<Long, Double>>()
        fun rate(tag: String) = rates[tag] ?: 0.0
        fun isOn(tag: String) = since.containsKey(tag)
        /** a tag turned on or off; the same call twice is harmless */
        fun set(tag: String, on: Boolean, now: Long) {
            val s = since[tag]
            if (on && s == null) since[tag] = now
            else if (!on && s != null) { add(tag, now - s); since.remove(tag) }
        }
        /** charge the running tags up to now (before a report, before midnight) */
        fun flush(now: Long) { for ((t, s) in since.entries) { add(t, now - s); since[t] = now }; points.add(now to total()); while (points.size > 400) points.removeAt(0) }
        private fun add(tag: String, ms: Long) { if (ms <= 0) return; mah[tag] = (mah[tag] ?: 0.0) + rate(tag) * ms / 3_600_000.0 }
        fun total() = mah.values.sum()
        /** mAh in the last hour, from the flush points (null until an hour is covered well enough, 15 minutes) */
        fun lastHour(now: Long): Double? {
            val cut = now - 3_600_000L; val first = points.firstOrNull { it.first >= cut } ?: return null; val last = points.last()
            val span = last.first - first.first; if (span < 15 * 60_000L) return null
            return (last.second - first.second) * 3_600_000.0 / span
        }
        fun open() = since.keys.toList()
    }

    data class Report(val day: String, val mah: Double, val pct: Double, val byTag: List<Pair<String, Double>>, val projPct: Double?, val phonePct: Double?)

    fun report(m: Meter, capacityMah: Double, now: Long, phonePct: Double? = null): Report {
        m.flush(now)
        val cap = if (capacityMah > 500) capacityMah else 4400.0
        val by = m.mah.entries.filter { it.value > 0.0 }.sortedByDescending { it.value }.map { it.key to Math.round(it.value * 100) / 100.0 }
        val h = m.lastHour(now)
        return Report(m.day, Math.round(m.total() * 100) / 100.0, Math.round(m.total() / cap * 10000) / 100.0, by, h?.let { Math.round(it * 24 / cap * 1000) / 10.0 }, phonePct)
    }

    /** capacity from the counters: the charge left (µAh) over the percent left; null when the phone does not say */
    fun capacity(chargeCounterUah: Long, pct: Int): Double? = if (chargeCounterUah > 0 && pct in 5..100) chargeCounterUah / 1000.0 / (pct / 100.0) else null

    fun json(r: Report): String {
        val by = r.byTag.joinToString(",") { "\"${it.first}\":${it.second}" }
        return "{\"day\":\"${r.day}\",\"mah\":${r.mah},\"pct\":${r.pct},\"byTag\":{$by},\"proj\":${r.projPct ?: "null"},\"phonePct\":${r.phonePct ?: "null"}}"
    }
}
