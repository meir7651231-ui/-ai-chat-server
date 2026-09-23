// ✨ PremiumAvatar — אווטאר-פרימיום: name + size + status + image?. טבעת-קונכית (conic) סביב,
// מילוי-גרדיאנט דטרמיניסטי לפי-שם עם ראשי-תיבות, נקודת-סטטוס עם טבעת-רקע. תמונה אופציונלית
// גוברת. a11y: Semantics(image/label) · אין-צבע-לבד (טבעת). חוט-טהור: material+dart:math · RTL.
import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

enum AvatarStatus { none, online, away, busy }

class PremiumAvatar extends StatelessWidget {
  PremiumAvatar({
    required this.name,
    this.size = 56,
    this.status = AvatarStatus.none,
    this.image,
    super.key,
  });

  final String name;
  final double size;
  final AvatarStatus status;
  final ImageProvider? image;

  // פלטת-גרדיאנטים דטרמיניסטית (נבחרת לפי-שם)
  static List<List<Color>> _palettes = [
    [DsAtomColors.premiumShowcasePremiumAvatar1, DsAtomColors.premiumShowcasePremiumAvatar2],
    [DsAtomColors.premiumShowcasePremiumAvatar3, DsAtomColors.premiumShowcasePremiumAvatar4],
    [DsAtomColors.premiumShowcasePremiumAvatar5, DsAtomColors.premiumShowcasePremiumAvatar6],
    [DsAtomColors.premiumShowcasePremiumAvatar7, DsAtomColors.premiumShowcasePremiumAvatar8],
    [DsAtomColors.premiumShowcasePremiumAvatar9, DsAtomColors.premiumShowcasePremiumAvatar10],
    [DsAtomColors.premiumShowcasePremiumAvatar11, DsAtomColors.premiumShowcasePremiumAvatar12],
  ];
  static const _online0 = DsAtomColors.premiumShowcasePremiumAvatar9;
  static Color _online(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumAvatar9, (l) => l.success);   // לובש עור · _online0 = הערך-הכהה
  static const _away0 = DsAtomColors.premiumShowcasePremiumAvatar11;
  static Color _away(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumAvatar11, (l) => l.warn);   // לובש עור · _away0 = הערך-הכהה
  static const _busy0 = DsAtomColors.premiumShowcasePremiumAvatar13;
  static Color _busy(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumAvatar13, (l) => l.muted);   // לובש עור · _busy0 = הערך-הכהה
  static const _ringLo0 = DsAtomColors.premiumShowcasePremiumAvatar2;
  static Color _ringLo(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumAvatar2, (l) => l.accent);   // לובש עור · _ringLo0 = הערך-הכהה
  static const _ringHi0 = DsAtomColors.premiumShowcasePremiumAvatar5;
  static Color _ringHi(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumAvatar5, (l) => l.accentDark);   // לובש עור · _ringHi0 = הערך-הכהה
  static const _ringCyan0 = DsAtomColors.premiumShowcasePremiumAvatar3;
  static Color _ringCyan(BuildContext context) => dsWear(context, DsAtomColors.premiumShowcasePremiumAvatar3, (l) => l.success);   // לובש עור · _ringCyan0 = הערך-הכהה

  String get _initials {
    final parts = name.trim().split(RegExp(r'\s+')).where((s) => s.isNotEmpty).toList();
    if (parts.isEmpty) return '?';
    if (parts.length == 1) {
      return parts.first.characters.take(2).toString().toUpperCase();
    }
    return (parts.first.characters.first + parts.last.characters.first).toUpperCase();
  }

  List<Color> get _palette {
    var h = 0;
    for (final c in name.codeUnits) {
      h = (h * 31 + c) & 0x7fffffff;
    }
    return _palettes[h % _palettes.length];
  }

  Color? get _statusColor {
    switch (status) {
      case AvatarStatus.online:
        return _online0;
      case AvatarStatus.away:
        return _away0;
      case AvatarStatus.busy:
        return _busy0;
      case AvatarStatus.none:
        return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final pal = _palette;
    final inner = size - 6; // מקום לטבעת
    final face = Container(
      width: inner,
      height: inner,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: image == null
            ? LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: pal)
            : null,
        image: image != null ? DecorationImage(image: image!, fit: BoxFit.cover) : null,
        boxShadow: [
          BoxShadow(color: pal.last.withValues(alpha: 0.45), blurRadius: 12, offset: const Offset(0, 4)),
        ],
      ),
      child: image == null
          ? Text(
              _initials,
              style: TextStyle(
                color: dsWear(context, DsAtomColors.premiumShowcasePremiumAvatar14, (l) => l.onAccent),
                fontSize: inner * 0.36,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.5,
              ),
            )
          : null,
    );

    final sc = _statusColor;
    return Semantics(
      image: image != null,
      label: name,
      child: SizedBox(
        width: size,
        height: size,
        child: Stack(
          children: [
            // טבעת-קונכית
            Positioned.fill(child: CustomPaint(painter: _AvatarRing())),
            Center(child: face),
            // נקודת-סטטוס
            if (sc != null)
              PositionedDirectional(
                end: 0,
                bottom: 0,
                child: Container(
                  width: size * 0.28,
                  height: size * 0.28,
                  decoration: BoxDecoration(
                    color: sc,
                    shape: BoxShape.circle,
                    border: Border.all(color: dsWear(context, DsAtomColors.premiumShowcasePremiumAvatar15, (l) => l.bg), width: size * 0.05),
                    boxShadow: [BoxShadow(color: sc.withValues(alpha: 0.6), blurRadius: 6)],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _AvatarRing extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final center = size.center(Offset.zero);
    final radius = size.width / 2 - 1;
    final shader = SweepGradient(
      colors: [
        PremiumAvatar._ringLo0,
        PremiumAvatar._ringCyan0,
        PremiumAvatar._ringHi0,
        PremiumAvatar._ringLo0,
      ],
      stops: [0, 0.4, 0.75, 1],
      transform: GradientRotation(-math.pi / 4),
    ).createShader(rect);
    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..shader = shader,
    );
  }

  @override
  bool shouldRepaint(covariant _AvatarRing old) => false;
}
