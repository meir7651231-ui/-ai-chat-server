// 🧼 אטום · FlipCard — כרטיס-היפוך תלת-ממדי (rotateY) בין שני פנים.
// מוצא: screens__lipskey_product_sheet.dart:1470-1557 (_HeroImage/_HeroImageState).
// התרת-סבך: ref.read(catalogSettingsProvider).reducedMotion (שורה 1506) ⇒ prop
// reducedMotion — הקופסה תזרים את הגדרת-הנגישות; true = קפיצה ישירה בלי אנימציה.
// שני הפנים = builders שמקבלים flip() — הקופסה מרכיבה ImageFacePager לכל פנים.
import 'package:flutter/material.dart';
import 'dart:math';

class FlipCard extends StatefulWidget {
  const FlipCard({
    required this.height,
    required this.reducedMotion,
    required this.frontBuilder,
    required this.backBuilder,
    this.duration = const Duration(milliseconds: 420),
    super.key,
  });
  final double height;
  final bool reducedMotion;
  final Widget Function(BuildContext context, VoidCallback flip) frontBuilder;
  final Widget Function(BuildContext context, VoidCallback flip) backBuilder;
  final Duration duration;

  @override
  State<FlipCard> createState() => _FlipCardState();
}

class _FlipCardState extends State<FlipCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _anim;
  bool _showBack = false;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: widget.duration);
    _anim = CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _flip() {
    if (widget.reducedMotion) {
      _ctrl.value = _showBack ? 0.0 : 1.0;
    } else if (_showBack) {
      _ctrl.reverse();
    } else {
      _ctrl.forward();
    }
    setState(() => _showBack = !_showBack);
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: widget.height,
      width: double.infinity,
      child: AnimatedBuilder(
        animation: _anim,
        builder: (_, __) {
          final angle = _anim.value * pi;
          final showingBack = angle > pi / 2;
          return Transform(
            alignment: Alignment.center,
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001)
              ..rotateY(angle),
            child: showingBack
                ? Transform(
                    alignment: Alignment.center,
                    transform: Matrix4.rotationY(pi),
                    child: widget.backBuilder(context, _flip),
                  )
                : widget.frontBuilder(context, _flip),
          );
        },
      ),
    );
  }
}
