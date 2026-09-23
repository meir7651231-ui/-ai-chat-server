// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__chats_screen:_PrivacyNotice (בנייה-חכמה main) · צרור-1 · props-שורש: fallback
// התוכן: new/dart-data-bs/auto/screens__chats_screen_content.dart
import 'package:flutter/material.dart';
import '../ds/ds_atoms.dart';
import 'package:buildsmart/widgets/studio/cfg_text.dart';

class PrivacyNotice extends StatelessWidget {
  PrivacyNotice({required this.fallback});
  final String fallback;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: DsAtomColors.autoPrivacyNotice1,
        borderRadius: BorderRadius.circular(10),
        boxShadow: const [
          BoxShadow(
            color: DsAtomColors.autoPrivacyNotice2,
            blurRadius: 2,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: CfgText(
              'chats_screen.privacy_notice',
              fallback,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: DsAtomColors.autoPrivacyNotice3,
                fontSize: 12.5,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
