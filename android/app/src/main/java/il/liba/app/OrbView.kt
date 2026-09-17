package il.liba.app

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Outline
import android.graphics.Paint
import android.graphics.RadialGradient
import android.graphics.RectF
import android.graphics.RuntimeShader
import android.graphics.Shader
import android.graphics.Typeface
import android.os.Build
import android.util.Log
import android.util.TypedValue
import android.view.View
import android.view.ViewOutlineProvider
import android.view.animation.LinearInterpolator
import kotlin.math.cos
import kotlin.math.min
import kotlin.math.sin

/** The bubble itself: a living glass orb. On Android 13+ the body is an AGSL shader running on the GPU –
 *  aurora light drifting inside a sphere, fresnel rim, specular, soft glow – and it reacts to the real mic level.
 *  Older devices (or a software canvas) get the drawn glass orb. State glyphs are drawn on top either way:
 *  IDLE monogram · WAKE breathing ring · LISTENING level bars · SPEAKING wave in the speaker's colour · RINGING ripples · SENDING turning arc · OFFLINE dim dash. */
class OrbView @JvmOverloads constructor(ctx: Context, attrs: android.util.AttributeSet? = null) : View(ctx, attrs) {
    enum class Mode { IDLE, WAKE, LISTENING, SPEAKING, RINGING, SENDING, OFFLINE }

    var mode: Mode = Mode.OFFLINE; private set
    var accent: Int = CYAN; private set
    /** 0..1 microphone level, smoothed here */
    var level: Float = 0f
        set(v) { target = v.coerceIn(0f, 1f); field = target }
    private var target = 0f
    private var shown = 0f
    private var phase = 0f
    private var time = 0f
    private var lastT = 0L
    private var anim: ValueAnimator? = null
    private var pressed = false
    private var activeK = 0f; private var activeTarget = 0f

    private val glow = Paint(Paint.ANTI_ALIAS_FLAG)
    private val body = Paint(Paint.ANTI_ALIAS_FLAG)
    private val spec = Paint(Paint.ANTI_ALIAS_FLAG)
    private val sh = Paint(Paint.ANTI_ALIAS_FLAG)
    private val ring = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeCap = Paint.Cap.ROUND }
    private val ink = Paint(Paint.ANTI_ALIAS_FLAG).apply { strokeCap = Paint.Cap.ROUND }
    private val text = Paint(Paint.ANTI_ALIAS_FLAG).apply { textAlign = Paint.Align.CENTER; typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL) }
    private val rect = RectF()
    private var shader: RuntimeShader? = null

    init {
        outlineProvider = object : ViewOutlineProvider() {
            override fun getOutline(v: View, o: Outline) { val p = pad(); o.setOval(p.toInt(), p.toInt(), (v.width - p).toInt(), (v.height - p).toInt()); o.alpha = 0.5f }
        }
        clipToOutline = false
        if (Build.VERSION.SDK_INT >= 33) {
            try { shader = RuntimeShader(AGSL); shaderOk = true } catch (e: Exception) { Log.w("liba", "orb shader: $e"); shaderOk = false; shaderErr = e.message ?: "?" }
        }
        // the shader needs a GPU canvas; the fallback is happy either way
        setLayerType(LAYER_TYPE_HARDWARE, null)
        startAnim()
    }

    private fun dp(v: Float) = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, resources.displayMetrics)
    private fun pad() = dp(9f - 5f * activeK)

    fun set(m: Mode, color: Int = accent) { mode = m; accent = color; activeTarget = if (m == Mode.LISTENING || m == Mode.SPEAKING || m == Mode.RINGING) 1f else 0f; startAnim(); invalidate() }
    fun press(down: Boolean) { pressed = down; animate().scaleX(if (down) 0.9f else 1f).scaleY(if (down) 0.9f else 1f).setDuration(140).start() }

    private fun startAnim() {
        if (anim != null) return
        lastT = System.nanoTime()
        anim = ValueAnimator.ofFloat(0f, 1f).apply {
            duration = 2400; repeatCount = ValueAnimator.INFINITE; interpolator = LinearInterpolator()
            addUpdateListener {
                phase = it.animatedValue as Float
                val now = System.nanoTime(); time += ((now - lastT) / 1e9f).coerceIn(0f, 0.1f); lastT = now
                shown += (target - shown) * 0.35f; if (mode != Mode.LISTENING) target *= 0.9f
                activeK += (activeTarget - activeK) * 0.18f; if (kotlin.math.abs(activeTarget - activeK) < 0.005f) activeK = activeTarget
                invalidate()
            }
            start()
        }
    }
    private fun stopAnim() { anim?.cancel(); anim = null; shown = 0f; target = 0f }
    override fun onDetachedFromWindow() { super.onDetachedFromWindow(); stopAnim() }
    override fun onAttachedToWindow() { super.onAttachedToWindow(); startAnim() }
    override fun onVisibilityChanged(v: View, vis: Int) { super.onVisibilityChanged(v, vis); if (vis == VISIBLE) startAnim() else stopAnim() }

    private fun palette(): Triple<Int, Int, Int> = when (mode) {
        Mode.OFFLINE -> Triple(Color.parseColor("#1B1F2A"), Color.parseColor("#3A4152"), Color.parseColor("#262B38"))
        Mode.LISTENING -> Triple(Color.parseColor("#3A0F2E"), ROSE, Color.parseColor("#FF9A5C"))
        Mode.RINGING -> Triple(Color.parseColor("#3A1E08"), AMBER, Color.parseColor("#FF6A3D"))
        Mode.SENDING -> Triple(Color.parseColor("#0A2A4A"), CYAN, Color.parseColor("#4F7CFF"))
        Mode.SPEAKING -> when (accent) {
            VIOLET -> Triple(Color.parseColor("#1E0F44"), VIOLET, Color.parseColor("#FF7AD9"))
            MINT -> Triple(Color.parseColor("#06302A"), MINT, Color.parseColor("#7DF9FF"))
            else -> Triple(Color.parseColor("#062F44"), CYAN, Color.parseColor("#8A5CFF"))
        }
        else -> Triple(Color.parseColor("#0B2A46"), CYAN, Color.parseColor("#8A5CFF"))
    }

    override fun onDraw(c: Canvas) {
        val w = width.toFloat(); val h = height.toFloat(); val cx = w / 2; val cy = h / 2
        val r = min(w, h) / 2 - pad()
        val ac = if (mode == Mode.OFFLINE) GRAY else accent
        val t = phase * 2f * Math.PI.toFloat()
        val s = shader
        if (s != null && c.isHardwareAccelerated && Build.VERSION.SDK_INT >= 33) {
            val (a, b, cc) = palette()
            s.setFloatUniform("iRes", w, h); s.setFloatUniform("iTime", time); s.setFloatUniform("iLevel", shown)
            s.setFloatUniform("iMode", mode.ordinal.toFloat()); s.setFloatUniform("iPad", pad())
            s.setColorUniform("cA", a); s.setColorUniform("cB", b); s.setColorUniform("cC", cc)
            sh.shader = s; c.drawRect(0f, 0f, w, h, sh)
        } else drawBody(c, cx, cy, r, ac, t)

        // ripples when ringing
        if (mode == Mode.RINGING) {
            for (i in 0 until 2) {
                val p = ((phase * 2f + i * 0.5f) % 1f)
                ring.strokeWidth = dp(2f) * (1 - p); ring.color = withA(ac, (200 * (1 - p)).toInt())
                c.drawCircle(cx, cy, r * (0.9f + 0.38f * p), ring)
            }
        }
        // state ring
        ring.strokeWidth = dp(1.25f)
        when (mode) {
            Mode.SENDING -> {
                ring.color = withA(Color.WHITE, 40); c.drawCircle(cx, cy, r - dp(1f), ring)
                ring.color = Color.WHITE; ring.strokeWidth = dp(2f); rect.set(cx - r + dp(1f), cy - r + dp(1f), cx + r - dp(1f), cy + r - dp(1f))
                c.drawArc(rect, phase * 720f, 100f, false, ring)
            }
            Mode.WAKE -> { ring.color = withA(Color.WHITE, (40 + 90 * (0.5f + 0.5f * sin(t))).toInt()); c.drawCircle(cx, cy, r - dp(1f), ring) }
            Mode.LISTENING -> { ring.color = withA(Color.WHITE, 90 + (140 * shown).toInt()); ring.strokeWidth = dp(1.25f + 1.75f * shown); c.drawCircle(cx, cy, r - dp(1f), ring) }
            Mode.OFFLINE -> { ring.color = withA(Color.WHITE, 30); c.drawCircle(cx, cy, r - dp(1f), ring) }
            else -> { ring.color = withA(Color.WHITE, 70); c.drawCircle(cx, cy, r - dp(1f), ring) }
        }

        // centre glyph
        ink.style = Paint.Style.FILL; ink.color = if (mode == Mode.OFFLINE) withA(Color.WHITE, 90) else Color.WHITE
        when (mode) {
            Mode.LISTENING -> {
                ink.strokeWidth = dp(4f); val gap = dp(7f); val base = dp(4f); val max = r * 0.9f
                val hs = floatArrayOf(0.45f, 1f, 0.7f)
                for (i in 0 until 3) {
                    val hh = base + (max - base) * (0.15f + 0.85f * shown) * hs[i] * (0.85f + 0.15f * sin(t * 4 + i))
                    val x = cx + (i - 1) * gap; c.drawLine(x, cy - hh / 2, x, cy + hh / 2, ink)
                }
            }
            Mode.SPEAKING -> {
                val gap = dp(5.5f); val amp = r * 0.32f
                for (i in -2..2) {
                    val y = cy + amp * sin(t * 2.5f - i * 0.9f); val rr = dp(2.2f) + dp(0.8f) * (0.5f + 0.5f * cos(t * 2.5f - i * 0.9f))
                    c.drawCircle(cx + i * gap, y, rr, ink)
                }
            }
            Mode.RINGING -> {
                ink.style = Paint.Style.STROKE; ink.strokeWidth = dp(2.5f)
                rect.set(cx - r * 0.42f, cy - r * 0.42f, cx + r * 0.42f, cy + r * 0.42f)
                c.drawArc(rect, 200f, 140f, false, ink); c.drawArc(rect, 20f, 140f, false, ink)
                ink.style = Paint.Style.FILL; c.drawCircle(cx, cy, dp(2.5f), ink)
            }
            Mode.SENDING -> { ink.strokeWidth = dp(2.5f); val a = r * 0.28f
                c.drawLine(cx, cy + a, cx, cy - a, ink); c.drawLine(cx, cy - a, cx - a * 0.6f, cy - a * 0.35f, ink); c.drawLine(cx, cy - a, cx + a * 0.6f, cy - a * 0.35f, ink) }
            Mode.OFFLINE -> { ink.strokeWidth = dp(2.5f); c.drawLine(cx - r * 0.25f, cy, cx + r * 0.25f, cy, ink) }
            else -> {
                text.color = if (mode == Mode.WAKE) withA(Color.WHITE, 235) else Color.WHITE
                text.textSize = r * 0.95f; text.setShadowLayer(dp(6f), 0f, 0f, withA(Color.BLACK, 90))
                val fm = text.fontMetrics; c.drawText("ל", cx, cy - (fm.ascent + fm.descent) / 2, text)
                if (mode == Mode.WAKE) { ink.color = Color.WHITE; c.drawCircle(cx + r * 0.58f, cy - r * 0.58f, dp(2.5f), ink) }
            }
        }
    }

    /** fallback body: drawn glass orb with a radial glow */
    private fun drawBody(c: Canvas, cx: Float, cy: Float, r: Float, ac: Int, t: Float) {
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
        val (a, b, cc) = palette()
        body.shader = RadialGradient(cx - r * 0.35f, cy - r * 0.4f, r * 1.5f, intArrayOf(mixC(b, Color.parseColor("#2A3050"), 0.7f), mixC(a, Color.parseColor("#151A2C"), 0.5f), mixC(cc, Color.parseColor("#0B0E1A"), 0.8f)), floatArrayOf(0f, 0.55f, 1f), Shader.TileMode.CLAMP)
        c.drawCircle(cx, cy, r, body)
        spec.shader = RadialGradient(cx - r * 0.4f, cy - r * 0.5f, r * 0.9f, intArrayOf(withA(Color.WHITE, 70), withA(Color.WHITE, 12), Color.TRANSPARENT), floatArrayOf(0f, 0.5f, 1f), Shader.TileMode.CLAMP)
        c.drawCircle(cx, cy, r, spec)
    }

    companion object {
        val CYAN = Color.parseColor("#7DF9FF"); val VIOLET = Color.parseColor("#A78BFA"); val MINT = Color.parseColor("#5CFFB0")
        val ROSE = Color.parseColor("#FF5C8A"); val AMBER = Color.parseColor("#FFB454"); val GRAY = Color.parseColor("#6B7280")
        @Volatile var shaderOk = false; @Volatile var shaderErr = ""
        fun withA(c: Int, a: Int) = (c and 0x00FFFFFF) or (a.coerceIn(0, 255) shl 24)
        fun mixC(a: Int, b: Int, k: Float): Int { fun ch(x: Int, y: Int) = (x + (y - x) * k).toInt().coerceIn(0, 255)
            return Color.argb(255, ch(Color.red(a), Color.red(b)), ch(Color.green(a), Color.green(b)), ch(Color.blue(a), Color.blue(b))) }

        // AGSL. Kept GLSL-compatible in spirit so the same text can be previewed in WebGL (see scratch preview).
        const val AGSL = """
uniform float2 iRes;
uniform float iTime;
uniform float iLevel;
uniform float iMode;
uniform float iPad;
layout(color) uniform float4 cA;
layout(color) uniform float4 cB;
layout(color) uniform float4 cC;

float hash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
float noise(float2 p) {
    float2 i = floor(p); float2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float a = hash(i); float b = hash(i + float2(1.0, 0.0)); float c = hash(i + float2(0.0, 1.0)); float d = hash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(float2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.03 + float2(1.7, 9.2); a *= 0.5; }
    return v;
}
half4 main(float2 fc) {
    float2 c = iRes * 0.5;
    float R = min(iRes.x, iRes.y) * 0.5 - iPad;
    float2 d = fc - c; float r = length(d); float nr = r / R;
    float t = iTime;
    float speed = (iMode == 6.0) ? 0.25 : ((iMode == 2.0 || iMode == 3.0) ? 1.6 : 1.0);
    float2 uv = d / R;
    float2 q = uv + 0.35 * float2(fbm(uv * 1.1 + t * 0.07 * speed), fbm(uv * 1.1 - t * 0.09 * speed + 5.0));
    float sw = fbm(q * 1.15 + float2(t * 0.12 * speed, -t * 0.08 * speed));
    float sw2 = fbm(q * 1.6 - float2(t * 0.06 * speed, t * 0.1 * speed) + 3.0);
    float3 col = mix(cA.rgb, cB.rgb, smoothstep(0.32, 0.72, sw));
    col = mix(col, cC.rgb, smoothstep(0.5, 0.8, sw2) * 0.75);
    float sph = sqrt(max(0.0, 1.0 - nr * nr));
    col *= 0.22 + 0.9 * pow(sph, 0.7);
    col += cB.rgb * 0.22 * exp(-nr * nr * 3.0) * (0.6 + 0.4 * sin(t * 2.0));
    col += (cB.rgb + cC.rgb) * 0.35 * iLevel * exp(-nr * nr * 2.0);
    float fres = pow(1.0 - sph, 3.0);
    col += (cB.rgb * 0.85 + 0.15) * fres * 1.1;
    float2 hl = uv - float2(-0.4, -0.45); float spec = exp(-dot(hl, hl) * 6.0);
    col += float3(1.0) * spec * 0.55;
    float2 hl2 = uv - float2(0.3, 0.55); col += cB.rgb * exp(-dot(hl2, hl2) * 7.0) * 0.25;
    float edge = 1.0 - smoothstep(R - 1.0, R + 1.0, r);
    float glow = exp(-(r - R) * (r - R) / (iPad * iPad * 0.4)) * step(R, r);
    float glowK = 0.35 + 0.55 * iLevel + ((iMode == 1.0) ? 0.25 * (0.5 + 0.5 * sin(t * 1.5)) : 0.0) + ((iMode == 4.0) ? 0.35 : 0.0);
    if (iMode == 6.0) glowK *= 0.3;
    float3 outc = col * edge + cB.rgb * glow * glowK;
    float a = edge + glow * glowK;
    return half4(half3(outc), half(a));
}
"""
    }
}
