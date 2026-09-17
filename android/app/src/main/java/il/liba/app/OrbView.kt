package il.liba.app

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Outline
import android.graphics.Paint
import android.graphics.RadialGradient
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.Typeface
import android.util.TypedValue
import android.view.View
import android.view.ViewOutlineProvider
import android.view.animation.LinearInterpolator
import kotlin.math.cos
import kotlin.math.min
import kotlin.math.sin

/** The bubble itself: a dark glass orb with a thin state ring. No emoji – every state is drawn.
 *  IDLE: calm monogram. WAKE: slow breathing ring. LISTENING: three bars driven by the real mic level.
 *  SPEAKING: a wave in the speaker's colour. RINGING: ripples. SENDING: a turning arc. OFFLINE: dim dash. */
class OrbView(ctx: Context) : View(ctx) {
    enum class Mode { IDLE, WAKE, LISTENING, SPEAKING, RINGING, SENDING, OFFLINE }

    var mode: Mode = Mode.OFFLINE; private set
    var accent: Int = CYAN; private set
    /** 0..1 microphone level, smoothed here */
    var level: Float = 0f
        set(v) { target = v.coerceIn(0f, 1f); field = target }
    private var target = 0f
    private var shown = 0f
    private var phase = 0f
    private var anim: ValueAnimator? = null
    private var pressed = false

    private val glow = Paint(Paint.ANTI_ALIAS_FLAG)
    private val body = Paint(Paint.ANTI_ALIAS_FLAG)
    private val spec = Paint(Paint.ANTI_ALIAS_FLAG)
    private val ring = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeCap = Paint.Cap.ROUND }
    private val ink = Paint(Paint.ANTI_ALIAS_FLAG).apply { strokeCap = Paint.Cap.ROUND }
    private val text = Paint(Paint.ANTI_ALIAS_FLAG).apply { textAlign = Paint.Align.CENTER; typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL) }
    private val rect = RectF()

    init {
        outlineProvider = object : ViewOutlineProvider() {
            override fun getOutline(v: View, o: Outline) { val p = pad(); o.setOval(p.toInt(), p.toInt(), (v.width - p).toInt(), (v.height - p).toInt()); o.alpha = 0.6f }
        }
        clipToOutline = false
        setLayerType(LAYER_TYPE_HARDWARE, null)
    }

    private fun dp(v: Float) = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, resources.displayMetrics)
    private fun pad() = dp(7f)

    fun set(m: Mode, color: Int = accent) {
        mode = m; accent = color
        val animated = m != Mode.IDLE && m != Mode.OFFLINE
        if (animated) startAnim() else stopAnim()
        invalidate()
    }
    fun press(down: Boolean) { pressed = down; animate().scaleX(if (down) 0.92f else 1f).scaleY(if (down) 0.92f else 1f).setDuration(120).start() }

    private fun startAnim() {
        if (anim != null) return
        anim = ValueAnimator.ofFloat(0f, 1f).apply {
            duration = 2400; repeatCount = ValueAnimator.INFINITE; interpolator = LinearInterpolator()
            addUpdateListener { phase = it.animatedValue as Float; shown += (target - shown) * 0.35f; if (mode != Mode.LISTENING) target *= 0.9f; invalidate() }
            start()
        }
    }
    private fun stopAnim() { anim?.cancel(); anim = null; shown = 0f; target = 0f }
    override fun onDetachedFromWindow() { super.onDetachedFromWindow(); stopAnim() }

    override fun onDraw(c: Canvas) {
        val w = width.toFloat(); val h = height.toFloat(); val cx = w / 2; val cy = h / 2
        val r = min(w, h) / 2 - pad()
        val ac = if (mode == Mode.OFFLINE) GRAY else accent
        val t = phase * 2f * Math.PI.toFloat()

        // glow: breathes in WAKE, swells with the level in LISTENING, steady otherwise
        val glowK = when (mode) {
            Mode.WAKE -> 0.55f + 0.25f * (0.5f + 0.5f * sin(t))
            Mode.LISTENING -> 0.6f + 0.5f * shown
            Mode.SPEAKING -> 0.7f + 0.15f * (0.5f + 0.5f * sin(t * 3))
            Mode.RINGING -> 0.9f
            Mode.OFFLINE -> 0.15f
            else -> 0.45f
        }
        glow.shader = RadialGradient(cx, cy, r + pad(), intArrayOf(withA(ac, (140 * glowK).toInt()), withA(ac, (60 * glowK).toInt()), Color.TRANSPARENT), floatArrayOf(0.62f, 0.8f, 1f), Shader.TileMode.CLAMP)
        c.drawCircle(cx, cy, r + pad(), glow)

        // ripples when ringing
        if (mode == Mode.RINGING) {
            for (i in 0 until 2) {
                val p = ((phase * 2f + i * 0.5f) % 1f)
                ring.strokeWidth = dp(2f) * (1 - p); ring.color = withA(ac, (200 * (1 - p)).toInt())
                c.drawCircle(cx, cy, r * (0.9f + 0.35f * p), ring)
            }
        }

        // body: deep glass with a top-left specular
        body.shader = RadialGradient(cx - r * 0.35f, cy - r * 0.4f, r * 1.5f, intArrayOf(Color.parseColor("#2A3050"), Color.parseColor("#151A2C"), Color.parseColor("#0B0E1A")), floatArrayOf(0f, 0.55f, 1f), Shader.TileMode.CLAMP)
        c.drawCircle(cx, cy, r, body)
        spec.shader = RadialGradient(cx - r * 0.4f, cy - r * 0.5f, r * 0.9f, intArrayOf(withA(Color.WHITE, 70), withA(Color.WHITE, 12), Color.TRANSPARENT), floatArrayOf(0f, 0.5f, 1f), Shader.TileMode.CLAMP)
        c.drawCircle(cx, cy, r, spec)

        // state ring
        ring.strokeWidth = dp(1.5f)
        when (mode) {
            Mode.SENDING -> {
                ring.color = withA(ac, 60); c.drawCircle(cx, cy, r - dp(1f), ring)
                ring.color = ac; ring.strokeWidth = dp(2f); rect.set(cx - r + dp(1f), cy - r + dp(1f), cx + r - dp(1f), cy + r - dp(1f))
                c.drawArc(rect, phase * 360f * 2, 100f, false, ring)
            }
            Mode.WAKE -> { ring.color = withA(ac, (90 + 110 * (0.5f + 0.5f * sin(t))).toInt()); c.drawCircle(cx, cy, r - dp(1f), ring) }
            Mode.LISTENING -> { ring.color = withA(ac, 150 + (100 * shown).toInt()); ring.strokeWidth = dp(1.5f + 1.5f * shown); c.drawCircle(cx, cy, r - dp(1f), ring) }
            Mode.OFFLINE -> { ring.color = withA(ac, 70); c.drawCircle(cx, cy, r - dp(1f), ring) }
            else -> { ring.color = withA(ac, 170); c.drawCircle(cx, cy, r - dp(1f), ring) }
        }

        // centre glyph
        ink.color = if (mode == Mode.OFFLINE) withA(Color.WHITE, 90) else Color.WHITE
        when (mode) {
            Mode.LISTENING -> {
                // three bars: centre follows the level, sides lag
                ink.strokeWidth = dp(4f); val gap = dp(7f); val base = dp(4f); val max = r * 0.9f
                val hs = floatArrayOf(0.45f, 1f, 0.7f)
                for (i in 0 until 3) {
                    val hh = base + (max - base) * (0.15f + 0.85f * shown) * hs[i] * (0.85f + 0.15f * sin(t * 4 + i))
                    val x = cx + (i - 1) * gap; c.drawLine(x, cy - hh / 2, x, cy + hh / 2, ink)
                }
            }
            Mode.SPEAKING -> {
                // a short wave: five dots rising and falling in turn
                ink.color = ac; val gap = dp(5.5f); val amp = r * 0.32f
                for (i in -2..2) {
                    val y = cy + amp * sin(t * 2.5f - i * 0.9f); val rr = dp(2.2f) + dp(0.8f) * (0.5f + 0.5f * cos(t * 2.5f - i * 0.9f))
                    c.drawCircle(cx + i * gap, y, rr, ink)
                }
            }
            Mode.RINGING -> {
                // a handset-free bell: two arcs opening
                ink.style = Paint.Style.STROKE; ink.strokeWidth = dp(2.5f); ink.color = ac
                rect.set(cx - r * 0.42f, cy - r * 0.42f, cx + r * 0.42f, cy + r * 0.42f)
                c.drawArc(rect, 200f, 140f, false, ink); c.drawArc(rect, 20f, 140f, false, ink)
                ink.style = Paint.Style.FILL; c.drawCircle(cx, cy, dp(2.5f), ink)
            }
            Mode.SENDING -> { ink.strokeWidth = dp(2.5f); val a = r * 0.28f
                c.drawLine(cx, cy + a, cx, cy - a, ink); c.drawLine(cx, cy - a, cx - a * 0.6f, cy - a * 0.35f, ink); c.drawLine(cx, cy - a, cx + a * 0.6f, cy - a * 0.35f, ink) }
            Mode.OFFLINE -> { ink.strokeWidth = dp(2.5f); c.drawLine(cx - r * 0.25f, cy, cx + r * 0.25f, cy, ink) }
            else -> {
                text.color = if (mode == Mode.WAKE) withA(Color.WHITE, 230) else Color.WHITE
                text.textSize = r * 0.95f
                val fm = text.fontMetrics; c.drawText("ל", cx, cy - (fm.ascent + fm.descent) / 2, text)
                if (mode == Mode.WAKE) { ink.color = ac; c.drawCircle(cx + r * 0.55f, cy - r * 0.55f, dp(3f), ink) }
            }
        }
    }

    companion object {
        val CYAN = Color.parseColor("#7DF9FF"); val VIOLET = Color.parseColor("#A78BFA"); val MINT = Color.parseColor("#5CFFB0")
        val ROSE = Color.parseColor("#FF5C8A"); val AMBER = Color.parseColor("#FFB454"); val GRAY = Color.parseColor("#6B7280")
        fun withA(c: Int, a: Int) = (c and 0x00FFFFFF) or (a.coerceIn(0, 255) shl 24)
    }
}
