// ✨ GoldButton — כפתור-פרימיום מקסימלי: label + onTap? + icon? + loading + kind.
// פאס-מקסימום (כל הסקילים, שכבה על שכבה, אטום יחיד):
//  · טבעת-קונכית מסתובבת (conic SweepGradient) עם bloom מטושטש + קו-חד
//  · גוף אורורה-מש חי (עומק + שתי עדשות-RadialGradient) + שפה-עליונה מוארת (specular)
//  · חלקיקי-נצנוץ פנימיים (deterministic twinkle) · ברק-זכוכית חולף
//  · זוהר-נשימה חיצוני (sin) · tilt-3D בתגובה לריחוף (Matrix4 perspective) + נצנוץ-עוקב-סמן
//  · מיקרו-לחיצה עם עומק-מתכווץ · כל המצבים: hover/press/focus/loading/disabled.
// הכל ממנוע-אנימציה יחיד. a11y: Semantics(button) · reduced-motion מקפיא-תנועה ·
// פוקוס-מקלדת (FocusableActionDetector) · touch≥48 · אין-צבע-לבד.
// חוט-טהור: material + dart:math בלבד · פיגמנט · טקסט דרך פרמטר · RTL. אומת 3×.
import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

enum GoldButtonKind { primary, secondary, ghost }

class GoldButton extends StatefulWidget {
  GoldButton({
    required this.label,
    this.onTap,
    this.icon,
    this.loading = false,
    this.kind = GoldButtonKind.primary,
    super.key,
  });

  final String label;
  final VoidCallback? onTap;
  final IconData? icon;
  final bool loading;
  final GoldButtonKind kind;

  // ── טוקנים ──
  static const _onAccent0 = DsAtomColors.premiumShowcaseGoldButton1;
  static Color _onAccent(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton1, (l) => l.onAccent);   // לובש עור · _onAccent0 = הערך-הכהה
  static const _ink0 = DsAtomColors.premiumShowcaseGoldButton2;
  static Color _ink(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton2, (l) => l.chipBg);   // לובש עור · _ink0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumShowcaseGoldButton3;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton3, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה
  static const _hair0 = DsAtomColors.premiumShowcaseGoldButton4;
  static Color _hair(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton4, (l) => l.onAccent.withValues(alpha: 0.122));   // לובש עור · _hair0 = הערך-הכהה
  static const _ring0 = DsAtomColors.premiumShowcaseGoldButton5;
  static Color _ring(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton5, (l) => l.accentDark);   // לובש עור · _ring0 = הערך-הכהה
  static final _radius = 15.0;

  // גוף-אורורה (מבטא-אינדיגו · לבן עליו עובר 4.5:1)
  static const _bodyA0 = DsAtomColors.premiumShowcaseGoldButton6;
  static Color _bodyA(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton6, (l) => l.accent);   // לובש עור · _bodyA0 = הערך-הכהה
  static const _bodyB0 = DsAtomColors.premiumShowcaseGoldButton7;
  static Color _bodyB(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton7, (l) => l.accent);   // לובש עור · _bodyB0 = הערך-הכהה
  static const _bodyC0 = DsAtomColors.premiumShowcaseGoldButton8;
  static Color _bodyC(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton8, (l) => l.accent);   // לובש עור · _bodyC0 = הערך-הכהה
  static const _auroraViolet0 = DsAtomColors.premiumShowcaseGoldButton9;
  static Color _auroraViolet(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton9, (l) => l.accentSoft.withValues(alpha: 0.4));   // לובש עור · _auroraViolet0 = הערך-הכהה
  static const _auroraCyan0 = DsAtomColors.premiumShowcaseGoldButton10;
  static Color _auroraCyan(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton10, (l) => l.successSoft.withValues(alpha: 0.275));   // לובש עור · _auroraCyan0 = הערך-הכהה
  static const _glow0 = DsAtomColors.premiumShowcaseGoldButton11;
  static Color _glow(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton11, (l) => l.accent);   // לובש עור · _glow0 = הערך-הכהה

  // טבעת-הקונכית (conic)
  static const _ringHi0 = DsAtomColors.premiumShowcaseGoldButton12;
  static Color _ringHi(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton12, (l) => l.accentDark);   // לובש עור · _ringHi0 = הערך-הכהה
  static const _ringLo0 = DsAtomColors.premiumShowcaseGoldButton7;
  static Color _ringLo(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton7, (l) => l.accent);   // לובש עור · _ringLo0 = הערך-הכהה
  static const _ringCyan0 = DsAtomColors.premiumShowcaseGoldButton13;
  static Color _ringCyan(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton13, (l) => l.success);   // לובש עור · _ringCyan0 = הערך-הכהה
  static const _ringMag0 = DsAtomColors.premiumShowcaseGoldButton14;
  static Color _ringMag(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton14, (l) => l.accentDark);   // לובש עור · _ringMag0 = הערך-הכהה

  // משטח secondary
  static const _surfaceTop0 = DsAtomColors.premiumShowcaseGoldButton15;
  static Color _surfaceTop(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton15, (l) => l.track);   // לובש עור · _surfaceTop0 = הערך-הכהה
  static const _surface0 = DsAtomColors.premiumShowcaseGoldButton16;
  static Color _surface(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcaseGoldButton16, (l) => l.card);   // לובש עור · _surface0 = הערך-הכהה

  @override
  State<GoldButton> createState() => _GoldButtonState();
}

class _GoldButtonState extends State<GoldButton> with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: Duration(milliseconds: 4200))..repeat();
  final GlobalKey _key = GlobalKey();
  bool _pressed = false;
  bool _focused = false;
  bool _hover = false;
  double _hx = 0; // ריחוף -1..1
  double _hy = 0;

  bool get _enabled => widget.onTap != null && !widget.loading;
  bool get _primary => widget.kind == GoldButtonKind.primary;

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  void _onHover(Offset local) {
    final box = _key.currentContext?.findRenderObject() as RenderBox?;
    if (box == null) return;
    final s = box.size;
    setState(() {
      _hover = true;
      _hx = (local.dx / s.width) * 2 - 1;
      _hy = (local.dy / s.height) * 2 - 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.of(context).disableAnimations;
    final k = widget.kind;

    final fg = _primary
        ? GoldButton._onAccent(context)
        : k == GoldButtonKind.secondary
            ? GoldButton._ink(context)
            : GoldButton._muted(context);

    final content = widget.loading
        ? SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
                strokeWidth: 2, valueColor: AlwaysStoppedAnimation(GoldButton._onAccent(context))),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.icon != null) ...[
                Icon(widget.icon, size: 18, color: fg),
                SizedBox(width: 8),
              ],
              Text(
                widget.label,
                style: TextStyle(
                    color: fg, fontSize: 15, fontWeight: FontWeight.w600, letterSpacing: -0.1),
              ),
            ],
          );

    final visual = AnimatedBuilder(
      animation: _c,
      builder: (context, _) {
        final t = reduce ? 0.12 : _c.value;
        final breathe = reduce ? 0.5 : 0.5 + 0.5 * math.sin(t * 2 * math.pi);
        final down = _pressed && _enabled;
        final hot = _hover && _enabled && !down;

        // זוהר-נשימה חיצוני (primary) — מתעצם בריחוף, מתכווץ בלחיצה
        final glowA = down ? 0.24 : (0.34 + 0.16 * breathe) * (hot ? 1.18 : 1.0);
        final glowBlur = down ? 10.0 : (22 + 12 * breathe) + (hot ? 8 : 0);
        final shadows = <BoxShadow>[
          if (_focused) BoxShadow(color: GoldButton._ring(context), spreadRadius: 2.5),
          if (_primary && _enabled) ...[
            BoxShadow(
              color: GoldButton._glow(context).withValues(alpha: glowA.clamp(0.0, 1.0)),
              blurRadius: glowBlur,
              spreadRadius: down ? -3 : 0,
              offset: Offset(0, down ? 4 : 12),
            ),
            BoxShadow(color: dsWear(context, DsAtomColors.premiumShowcaseGoldButton17, (l) => l.bg.withValues(alpha: 0.251)), blurRadius: 8, offset: Offset(0, 3)),
          ],
        ];

        // tilt-3D בתגובה לריחוף (מכובה ב-reduced-motion)
        final tiltX = (hot && !reduce) ? -_hy * 0.12 : 0.0;
        final tiltY = (hot && !reduce) ? _hx * 0.14 : 0.0;
        final m = Matrix4.identity()
          ..setEntry(3, 2, 0.0016)
          ..rotateX(tiltX)
          ..rotateY(tiltY);

        final card = AnimatedScale(
          scale: down ? 0.97 : 1,
          duration: Duration(milliseconds: reduce ? 0 : 110),
          curve: Curves.easeOut,
          child: Container(
            key: _key,
            height: 48,
            decoration: BoxDecoration(
              color: k == GoldButtonKind.ghost ? Colors.transparent : null,
              borderRadius: BorderRadius.circular(GoldButton._radius),
              boxShadow: shadows,
            ),
            child: Stack(
              children: [
                // ── גוף מרובד ──
                Positioned.fill(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(GoldButton._radius),
                    child: _primary
                        ? _primaryBody(t, hot)
                        : DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: k == GoldButtonKind.secondary
                                  ? LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [GoldButton._surfaceTop(context), GoldButton._surface(context)])
                                  : null,
                              border: k == GoldButtonKind.ghost
                                  ? null
                                  : Border.fromBorderSide(
                                      BorderSide(color: GoldButton._hair(context))),
                              borderRadius: BorderRadius.circular(GoldButton._radius),
                            ),
                          ),
                  ),
                ),
                // ── טבעת-קונכית מסתובבת ──
                if (_primary)
                  Positioned.fill(child: CustomPaint(painter: _GlowRing(t, enabled: _enabled))),
                // ── תוכן ──
                Positioned.fill(
                  child: Padding(
                    padding: EdgeInsetsDirectional.symmetric(horizontal: 20),
                    child: Center(child: content),
                  ),
                ),
              ],
            ),
          ),
        );

        return Transform(alignment: Alignment.center, transform: m, child: card);
      },
    );

    final interactive = MouseRegion(
      onEnter: _enabled ? (_) => setState(() => _hover = true) : null,
      onExit: _enabled
          ? (_) => setState(() {
                _hover = false;
                _hx = 0;
                _hy = 0;
              })
          : null,
      onHover: _enabled ? (e) => _onHover(e.localPosition) : null,
      cursor: _enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _enabled ? widget.onTap : null,
        onTapDown: _enabled ? (_) => setState(() => _pressed = true) : null,
        onTapUp: _enabled ? (_) => setState(() => _pressed = false) : null,
        onTapCancel: _enabled ? () => setState(() => _pressed = false) : null,
        child: visual,
      ),
    );

    return Semantics(
      button: true,
      enabled: _enabled,
      label: widget.label,
      child: Opacity(
        opacity: _enabled ? 1 : 0.5,
        child: FocusableActionDetector(
          enabled: _enabled,
          onShowFocusHighlight: (v) => setState(() => _focused = v),
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) {
              widget.onTap?.call();
              return null;
            }),
          },
          child: interactive,
        ),
      ),
    );
  }

  // גוף primary: עומק + אורורה + שפה-מוארת + חלקיקים + ברק + נצנוץ-עוקב-סמן.
  Widget _primaryBody(double t, bool hot) {
    final sweepX = -0.35 + ((t / 0.42) % 1) * 1.7;
    final sweepActive = t < 0.42;
    return Stack(
      children: [
        // בסיס-עומק
        Positioned.fill(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [GoldButton._bodyA(context), GoldButton._bodyB(context), GoldButton._bodyC(context)],
                stops: [0, 0.5, 1],
              ),
            ),
          ),
        ),
        // עדשת-אורורה סגולה (שמאל-עליון)
        Positioned.fill(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(-0.7, -0.9),
                radius: 1.1,
                colors: [GoldButton._auroraViolet(context), Color(0x00000000)],
              ),
            ),
          ),
        ),
        // עדשת-אורורה טורקיז (ימין-תחתון)
        Positioned.fill(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0.9, 1),
                radius: 1.2,
                colors: [GoldButton._auroraCyan(context), Color(0x00000000)],
              ),
            ),
          ),
        ),
        // חלקיקי-נצנוץ פנימיים
        Positioned.fill(child: CustomPaint(painter: _Sparkles(t))),
        // נצנוץ-עוקב-סמן (רק בריחוף)
        if (hot)
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment(_hx, _hy),
                  radius: 0.9,
                  colors: [dsWear(context, DsAtomColors.premiumShowcaseGoldButton18, (l) => l.onAccent.withValues(alpha: 0.22)), dsWear(context, DsAtomColors.premiumShowcaseGoldButton19, (l) => l.onAccent.withValues(alpha: 0.0))],
                ),
              ),
            ),
          ),
        // שפה-עליונה מוארת (specular)
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          height: 1.3,
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [dsWear(context, DsAtomColors.premiumShowcaseGoldButton19, (l) => l.onAccent.withValues(alpha: 0.0)), dsWear(context, DsAtomColors.premiumShowcaseGoldButton20, (l) => l.onAccent.withValues(alpha: 0.561)), dsWear(context, DsAtomColors.premiumShowcaseGoldButton19, (l) => l.onAccent.withValues(alpha: 0.0))],
              ),
            ),
          ),
        ),
        // ברק-זכוכית חולף
        if (sweepActive) Positioned.fill(child: CustomPaint(painter: _Sweep(sweepX))),
      ],
    );
  }
}

// טבעת-קונכית: SweepGradient מסתובב — bloom מטושטש + קו-חד.
class _GlowRing extends CustomPainter {
  _GlowRing(this.t, {required this.enabled});
  final double t;
  final bool enabled;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final rr = RRect.fromRectAndRadius(
        rect.deflate(0.8), Radius.circular(GoldButton._radius));
    final shader = SweepGradient(
      transform: GradientRotation(t * 2 * math.pi),
      colors: [
        GoldButton._ringLo0,
        GoldButton._ringCyan0,
        GoldButton._ringHi0,
        GoldButton._ringMag0,
        GoldButton._ringLo0,
      ],
      stops: const [0, 0.28, 0.5, 0.76, 1],
    ).createShader(rect);
    final a = enabled ? 1.0 : 0.4;
    canvas
      ..drawRRect(
        rr,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3
          ..shader = shader
          ..color = DsAtomColors.premiumShowcaseGoldButton1.withValues(alpha: a)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6),
      )
      ..drawRRect(
        rr,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.4
          ..shader = shader,
      );
  }

  @override
  bool shouldRepaint(covariant _GlowRing old) => old.t != t || old.enabled != enabled;
}

// חלקיקי-נצנוץ: נקודות זעירות דטרמיניסטיות שמהבהבות ונעות מעט.
class _Sparkles extends CustomPainter {
  _Sparkles(this.t);
  final double t;
  static const int _n = 16;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();
    for (var i = 0; i < _n; i++) {
      final fi = i / _n;
      final bx = ((i * 73) % 100) / 100.0;
      final by = ((i * 149) % 100) / 100.0;
      final drift = math.sin((t + fi) * 2 * math.pi) * 0.02;
      final x = ((bx + t * 0.06 + drift) % 1.0) * size.width;
      final y = (by * 0.7 + 0.15) * size.height;
      final tw = 0.5 + 0.5 * math.sin((t * 2 + fi) * 2 * math.pi);
      final r = 0.5 + 1.1 * tw;
      paint.color = DsAtomColors.premiumShowcaseGoldButton1.withValues(alpha: 0.05 + 0.22 * tw);
      canvas.drawCircle(Offset(x, y), r, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _Sparkles old) => old.t != t;
}

// ברק-זכוכית: פס-אור אלכסוני שחולף לרוחב.
class _Sweep extends CustomPainter {
  _Sweep(this.x);
  final double x;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.width * x;
    final bandW = size.width * 0.3;
    final rect = Rect.fromLTWH(center - bandW, 0, bandW * 2, size.height);
    final shader = LinearGradient(
      colors: [DsAtomColors.premiumShowcaseGoldButton19, DsAtomColors.premiumShowcaseGoldButton21, DsAtomColors.premiumShowcaseGoldButton19],
    ).createShader(rect);
    canvas
      ..save()
      ..transform((Matrix4.identity()..rotateZ(-0.3)).storage)
      ..drawRect(
        Rect.fromLTWH(center - bandW, -size.height, bandW * 2, size.height * 3),
        Paint()..shader = shader,
      )
      ..restore();
  }

  @override
  bool shouldRepaint(covariant _Sweep old) => old.x != x;
}
