// ✨ ExpandableTile — אריח מתקפל: כותרת + גוף נחשף באנימציה + חץ מסתובב
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class ExpandableTile extends StatefulWidget {
  final String title;
  final String body;

  const ExpandableTile({
    super.key,
    required this.title,
    required this.body,
  });

  @override
  State<ExpandableTile> createState() => _ExpandableTileState();
}

class _ExpandableTileState extends State<ExpandableTile>
    with SingleTickerProviderStateMixin {
  Color get _card => dsWear(context, DsAtomColors.premiumListsExpandableTile1, (l) => l.card);   // State.context — לובש עור
  Color get _accent => dsWear(context, DsAtomColors.premiumListsExpandableTile2, (l) => l.accent);   // State.context — לובש עור
  Color get _text => dsWear(context, DsAtomColors.premiumListsExpandableTile3, (l) => l.chipBg);   // State.context — לובש עור
  Color get _muted => dsWear(context, DsAtomColors.premiumListsExpandableTile4, (l) => l.muted);   // State.context — לובש עור

  bool _open = false;

  void _toggle() => setState(() => _open = !_open);

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 260),
        curve: Curves.easeOutCubic,
        decoration: BoxDecoration(
          color: _card,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: _open
                ? _accent.withValues(alpha: 0.45)
                : dsWear(context, DsAtomColors.premiumListsExpandableTile5, (l) => l.onAccent).withValues(alpha: 0.06),
          ),
          boxShadow: _open
              ? [
                  BoxShadow(
                    color: _accent.withValues(alpha: 0.18),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ]
              : const [],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _toggle,
                child: Padding(
                  padding: const EdgeInsetsDirectional.fromSTEB(16, 14, 14, 14),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          widget.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: _text,
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      AnimatedRotation(
                        turns: _open ? 0.5 : 0.0,
                        duration: const Duration(milliseconds: 260),
                        curve: Curves.easeOutCubic,
                        child: Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: _accent.withValues(alpha: 0.16),
                          ),
                          alignment: Alignment.center,
                          child: Icon(
                            Icons.keyboard_arrow_down_rounded,
                            color: dsWear(context, DsAtomColors.premiumListsExpandableTile6, (l) => l.accentDark),
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            AnimatedCrossFade(
              firstChild: const SizedBox(width: double.infinity, height: 0),
              secondChild: Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 16),
                child: Text(
                  widget.body,
                  style: TextStyle(
                    color: _muted,
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
              ),
              crossFadeState: _open
                  ? CrossFadeState.showSecond
                  : CrossFadeState.showFirst,
              duration: const Duration(milliseconds: 260),
              sizeCurve: Curves.easeOutCubic,
            ),
          ],
        ),
      ),
    );
  }
}
