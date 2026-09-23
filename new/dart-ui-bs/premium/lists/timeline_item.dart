// ✨ TimelineItem — פריט-ציר-זמן: נקודה+קו זוהרים + כותרת/שעה/גוף
import 'package:flutter/material.dart';
import '../../ds/ds.dart';
import '../../ds/ds_atoms.dart';

class TimelineItem extends StatelessWidget {
  final String title;
  final String time;
  final String? body;

  const TimelineItem({
    super.key,
    required this.title,
    required this.time,
    this.body,
  });

  static const _accent0 = DsAtomColors.premiumListsTimelineItem1;

  static Color _accent(BuildContext context) => dsWear(context, DsAtomColors.premiumListsTimelineItem1, (l) => l.accent);   // לובש עור · _accent0 = הערך-הכהה
  static const _text0 = DsAtomColors.premiumListsTimelineItem2;
  static Color _text(BuildContext context) => dsWear(context, DsAtomColors.premiumListsTimelineItem2, (l) => l.chipBg);   // לובש עור · _text0 = הערך-הכהה
  static const _muted0 = DsAtomColors.premiumListsTimelineItem3;
  static Color _muted(BuildContext context) => dsWear(context, DsAtomColors.premiumListsTimelineItem3, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Column(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [_accent(context), dsWear(context, DsAtomColors.premiumListsTimelineItem4, (l) => l.muted)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: _accent(context).withValues(alpha: 0.7),
                        blurRadius: 12,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Container(
                    width: 2.5,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          _accent(context).withValues(alpha: 0.6),
                          _accent(context).withValues(alpha: 0.05),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Padding(
                padding: const EdgeInsetsDirectional.only(bottom: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: _text(context),
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          time,
                          style: TextStyle(
                            color: dsWear(context, DsAtomColors.premiumListsTimelineItem5, (l) => l.accentDark),
                            fontSize: 11.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    if (body != null) ...[
                      const SizedBox(height: 5),
                      Text(
                        body!,
                        style: TextStyle(
                          color: _muted(context),
                          fontSize: 12.5,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
