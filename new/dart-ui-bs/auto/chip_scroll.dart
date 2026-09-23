// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__finder_screen:_ChipScroll (בנייה-חכמה main) · Stateful+State
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';

class ChipScroll extends StatefulWidget {
  ChipScroll({required this.children});
  final List<Widget> children;
  @override
  State<ChipScroll> createState() => ChipScrollState();
}

class ChipScrollState extends State<ChipScroll> {
  final _ctrl = ScrollController();
  bool _more = false; // hidden chips remain toward the end edge

  @override
  void initState() {
    super.initState();
    _ctrl.addListener(_recompute);
    WidgetsBinding.instance.addPostFrameCallback((_) => _recompute());
  }

  void _recompute() {
    if (!_ctrl.hasClients) return;
    final more = _ctrl.offset < _ctrl.position.maxScrollExtent - 0.5;
    if (more != _more) setState(() => _more = more);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        NotificationListener<ScrollMetricsNotification>(
          onNotification: (_) {
            _recompute();
            return false;
          },
          child: ListView(
            controller: _ctrl,
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(vertical: 7),
            children: widget.children,
          ),
        ),
        if (_more)
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: IgnorePointer(
              child: Container(
                key: Key('chip-scroll-more'),
                width: 30,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.centerRight,
                    end: Alignment.centerLeft,
                    colors: [dsWear(context, DsAtomColors.autoChipScroll1, (l) => l.onAccent.withValues(alpha: 0.0)), dsWear(context, DsAtomColors.autoChipScroll2, (l) => l.onAccent)],
                  ),
                ),
                alignment: Alignment.centerLeft,
                child: Icon(Icons.chevron_left, size: 18, color: _mute(context),
                    textDirection: TextDirection.ltr),
              ),
            ),
          ),
      ],
    );
  }
}


Color _mute(BuildContext context) => dsWear(context, DsAtomColors.autoChipScroll3, (l) => l.muted);   // לובש עור · _mute0 = הערך-הכהה
