// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__lipskey_brand_screen:_SectionCard (בנייה-חכמה main) · צרור-1 · מודל-שוטח: 2 שדות · props-שורש: label, label2, emoji, name
// התוכן: new/dart-data-bs/auto/screens__lipskey_brand_screen_content.dart
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class LipskeyBrandSectionCard extends StatelessWidget {
  LipskeyBrandSectionCard({required this.label, required this.label2, required this.emoji, required this.name, 
    
    required this.prodCount,
    required this.catCount,
    required this.onTap,});
  final String label;
  final String label2;
  final String emoji;
  final String name;
  final int prodCount;
  final int catCount;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: dsWear(context, DsAtomColors.autoLipskeyBrandSectionCard1, (l) => l.ink),
              width: 0.8)),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(emoji,
                style: const TextStyle(fontSize: 38)),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    style: TextStyle(
                        color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        height: 1.2)),
                const SizedBox(height: 5),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 7, vertical: 2),
                      decoration: BoxDecoration(
                        color:
                            dsWear(context, DsAtomColors.autoLipskeyBrandSectionCard2, (l) => l.faint).withOpacity(0.25),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text('$prodCount${label}',
                          style: TextStyle(
                              color: dsWear(context, DsAtomColors.autoLipskeyBrandSectionCard3, (l) => l.success), fontSize: 11)),
                    ),
                    const SizedBox(width: 6),
                    Text('$catCount${label2}',
                        style: TextStyle(
                            color: dsWear(context, DsAtomColors.autoLipskeyBrandSectionCard4, (l) => l.muted), fontSize: 10)),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
