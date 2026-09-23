// ✨ PremiumStat — אריח-KPI מקסימלי: מקבל label · value · unit · delta · trend[] · glyph.
// מיישם את מלוא סטאק-הסקילים: refactoring-ui (סקאלות·היררכיה·מבטא-יחיד) · frontend-design
// (חתימה·ריסון) · mobile-app-ui (60/30/10·מספר-טבלאי·peak) · animated-component-libraries
// (count-up) · dataviz (sparkline) · 3D (Matrix4 perspective בכניסה) · motion (entrance+easeOutCubic
// + כיבוד reduced-motion) · inclusive-design (Semantics·ניגוד·tabular·no-color-alone). חוט-טהור.
import 'dart:ui' show FontFeature;
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class PremiumStat extends StatefulWidget {
  PremiumStat({
    required this.label,
    required this.value,
    this.unit = '',
    this.delta = 0,
    this.trend = const [],
    this.glyph = '',
    this.onTap,
    super.key,
  });

  final String label;      // תווית משנית (secondary — refactoring-ui: מעל, מעומעם)
  final double value;      // הערך הראשי (primary — הבולוּת היחידה)
  final String unit;       // יחידה (/100 · ₪ · %) — נלווה, מעומעם
  final double delta;      // שינוי מגמה: >0 חיובי · <0 שלילי · 0 ניטרלי
  final List<double> trend;// sparkline — חתימת-האטום (dataviz)
  final String glyph;      // אייקון-מחרוזת (wireable, לא emoji קבוע)
  final VoidCallback? onTap;

  // ── טוקנים (Studio Dark · מבטא-אינדיגו יחיד · 60/30/10) ──
  static const _surface0 = DsAtomColors.premiumShowcasePremiumStat1;
  static Color _surface(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumStat1, (l) => l.cardAlt);   // לובש עור · _surface0 = הערך-הכהה
  static const _surface20 = DsAtomColors.premiumShowcasePremiumStat2;
  static Color _surface2(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumStat2, (l) => l.card);   // לובש עור · _surface20 = הערך-הכהה
  static const _line0 = DsAtomColors.premiumShowcasePremiumStat3;
  static Color _line(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumStat3, (l) => l.onAccent.withValues(alpha: 0.078));   // לובש עור · _line0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumShowcasePremiumStat4; // secondary ≥4.5:1
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumStat4, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה
  static const _faint0 = DsAtomColors.premiumShowcasePremiumStat5; // tertiary
  static Color _faint(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumStat5, (l) => l.muted);   // לובש עור · _faint0 = הערך-הכהה
  static const _success0 = DsAtomColors.premiumShowcasePremiumStat6;
  static Color _success(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumStat6, (l) => l.success);   // לובש עור · _success0 = הערך-הכהה
  static const _danger0 = DsAtomColors.premiumShowcasePremiumStat7;
  static Color _danger(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumStat7, (l) => l.muted);   // לובש עור · _danger0 = הערך-הכהה
  static const _accentSoft0 = DsAtomColors.premiumShowcasePremiumStat8;
  static Color _accentSoft(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumStat8, (l) => l.accentSoft.withValues(alpha: 0.141));   // לובש עור · _accentSoft0 = הערך-הכהה

  @override
  State<PremiumStat> createState() => _PremiumStatState();
}

class _PremiumStatState extends State<PremiumStat> with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 620));
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    _c.forward();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // inclusive-design: כבד reduced-motion — קפוץ לערך-הסופי בלי אנימציה.
    final reduce = MediaQuery.of(context).disableAnimations;
    if (reduce && !_c.isCompleted) _c.value = 1;

    final deltaUp = widget.delta > 0;
    final deltaColor = widget.delta == 0
        ? PremiumStat._muted(context)
        : deltaUp
            ? PremiumStat._success(context)
            : PremiumStat._danger(context);

    final card = AnimatedBuilder(
      animation: _c,
      builder: (context, _) {
        final t = Curves.easeOutCubic.transform(_c.value); // motion: entrance
        final counted = widget.value * t;                   // animated-component-libraries: count-up
        // 3D: פרספקטיבה עדינה בכניסה — rotateX מתיישר ל-0 (threejs→Matrix4).
        final m = Matrix4.identity()
          ..setEntry(3, 2, 0.0012)
          ..rotateX((1 - t) * 0.10)
          ..translate(0.0, (1 - t) * 10.0);
        return Opacity(
          opacity: t,
          child: Transform(
            alignment: Alignment.center,
            transform: m,
            child: AnimatedScale(
              scale: _pressed ? 0.985 : 1,
              duration: const Duration(milliseconds: 120),
              child: _surface(context, counted, deltaColor, deltaUp),
            ),
          ),
        );
      },
    );

    // inclusive-design: תיאור נגיש אחד — התווית+הערך מוכרזים כיחידה.
    final semanticValue =
        '${widget.value.toStringAsFixed(widget.value == widget.value.roundToDouble() ? 0 : 1)}${widget.unit}';
    return Semantics(
      container: true,
      button: widget.onTap != null,
      label: widget.label,
      value: semanticValue,
      child: widget.onTap == null
          ? card
          : GestureDetector(
              onTap: widget.onTap,
              onTapDown: (_) => setState(() => _pressed = true),
              onTapUp: (_) => setState(() => _pressed = false),
              onTapCancel: () => setState(() => _pressed = false),
              child: card,
            ),
    );
  }

  Widget _surface(BuildContext context, double counted, Color deltaColor, bool deltaUp) {
    final valueText = counted == counted.roundToDouble()
        ? counted.toStringAsFixed(0)
        : counted.toStringAsFixed(1);
    return Container(
      padding: const EdgeInsetsDirectional.fromSTEB(18, 16, 18, 16),
      decoration: BoxDecoration(
        // depth: משטח-גרדיאנט עדין + מסגרת-שיער (modern-web · refactoring-ui elevation)
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [PremiumStat._surface(context), PremiumStat._surface2(context)],
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: PremiumStat._line(context)),
        boxShadow: [
          BoxShadow(color: dsWear(context, DsAtomColors.premiumShowcasePremiumStat9, (l) => l.bg.withValues(alpha: 0.349)), blurRadius: 3, offset: Offset(0, 1)),
          BoxShadow(color: dsWear(context, DsAtomColors.premiumShowcasePremiumStat10, (l) => l.bg.withValues(alpha: 0.251)), blurRadius: 18, offset: Offset(0, 9)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // שורת-כותרת: glyph (10%) + label (secondary) + delta-chip
          Row(
            children: [
              if (widget.glyph.isNotEmpty) ...[
                Container(
                  width: 30,
                  height: 30,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: PremiumStat._accentSoft(context),
                    borderRadius: BorderRadius.circular(9),
                    border: Border.all(color: dsWear(context, DsAtomColors.premiumShowcasePremiumStat11, (l) => l.accentSoft.withValues(alpha: 0.2))),
                  ),
                  child: Text(widget.glyph, style: const TextStyle(fontSize: 15)),
                ),
                const SizedBox(width: 8),
              ],
              Expanded(
                child: Text(
                  widget.label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: PremiumStat._muted(context),
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 0.2,
                  ),
                ),
              ),
              if (widget.delta != 0) _deltaChip(deltaColor, deltaUp),
            ],
          ),
          const SizedBox(height: 12),
          // הבולוּת היחידה: המספר — ShaderMask גרדיאנט, tabular, letterSpacing שלילי (peak).
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              ShaderMask(
                shaderCallback: (r) => LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [dsWear(context, DsAtomColors.premiumShowcasePremiumStat12, (l) => l.onAccent), dsWear(context, DsAtomColors.premiumShowcasePremiumStat13, (l) => l.accentDark)],
                ).createShader(r),
                child: Text(
                  valueText,
                  style: TextStyle(
                    color: dsWear(context, DsAtomColors.premiumShowcasePremiumStat12, (l) => l.onAccent),
                    fontSize: 48,
                    fontWeight: FontWeight.w800,
                    height: 1,
                    letterSpacing: -1.5,
                    fontFeatures: [FontFeature.tabularFigures()],
                  ),
                ),
              ),
              if (widget.unit.isNotEmpty) ...[
                const SizedBox(width: 6),
                Text(
                  widget.unit,
                  style: TextStyle(
                    color: PremiumStat._faint(context),
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ],
          ),
          // חתימת-האטום: sparkline חי (dataviz) — רק אם יש trend.
          if (widget.trend.length > 1) ...[
            const SizedBox(height: 12),
            SizedBox(
              height: 30,
              child: CustomPaint(
                painter: _Spark(widget.trend, _c.value),
                size: Size.infinite,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _deltaChip(Color c, bool up) {
    return Container(
      padding: const EdgeInsetsDirectional.fromSTEB(8, 3, 6, 3),
      decoration: BoxDecoration(
        color: c.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: c.withValues(alpha: 0.30)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '${widget.delta.abs().toStringAsFixed(widget.delta.abs() == widget.delta.abs().roundToDouble() ? 0 : 1)}%',
            style: TextStyle(
              color: c,
              fontSize: 12,
              fontWeight: FontWeight.w700,
              fontFeatures: const [FontFeature.tabularFigures()],
            ),
          ),
          // no-color-alone: אייקון-כיוון בנוסף לצבע (inclusive-design).
          Icon(up ? Icons.arrow_drop_up : Icons.arrow_drop_down, color: c, size: 18),
        ],
      ),
    );
  }
}

// sparkline — עקומה חלקה + מילוי-דועך + נקודת-קצה מודגשת. reveal לפי progress.
class _Spark extends CustomPainter {
  _Spark(this.values, this.progress);
  final List<double> values;
  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;
    double lo = values.first, hi = values.first;
    for (final v in values) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    final span = (hi - lo).abs() < 1e-6 ? 1.0 : (hi - lo);
    final n = values.length;
    Offset at(int i) {
      final x = size.width * (i / (n - 1));
      final y = size.height - ((values[i] - lo) / span) * (size.height - 4) - 2;
      return Offset(x, y);
    }

    final path = Path()..moveTo(at(0).dx, at(0).dy);
    for (var i = 1; i < n; i++) {
      final p0 = at(i - 1), p1 = at(i);
      final cx = (p0.dx + p1.dx) / 2;
      path.cubicTo(cx, p0.dy, cx, p1.dy, p1.dx, p1.dy);
    }

    // מילוי-דועך
    final fill = Path.from(path)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.drawPath(
      fill,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [DsAtomColors.premiumShowcasePremiumStat11, DsAtomColors.premiumShowcasePremiumStat14],
        ).createShader(Offset.zero & size),
    );
    // קו
    canvas.drawPath(
      path,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..strokeCap = StrokeCap.round
        ..shader = LinearGradient(colors: [DsAtomColors.premiumShowcasePremiumStat15, DsAtomColors.premiumShowcasePremiumStat16])
            .createShader(Offset.zero & size),
    );
    // נקודת-קצה
    final end = at(n - 1);
    canvas.drawCircle(end, 4.5, Paint()..color = DsAtomColors.premiumShowcasePremiumStat17);
    canvas.drawCircle(end, 2.6, Paint()..color = DsAtomColors.premiumShowcasePremiumStat13);
  }

  @override
  bool shouldRepaint(covariant _Spark old) => old.progress != progress || old.values != values;
}
