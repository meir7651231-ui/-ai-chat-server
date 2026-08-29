// 🧼 אטום · ProductMiniCard — מיני-כרטיס-מוצר: תמונה/גליף + שם + מק"ט (+צ'יפ-חיבור).
// מוצא: screens__lipskey_product_sheet.dart:1416-1467 (_RelatedCard, רוחב 112 / תמונה 56 /
// גופן 11/9) + 3026-3106 (פריט _miniCarousel, רוחב 100 / תמונה 44 / גופן 10/8 + צ'יפ
// "מתחבר-איך") — דדופ פנים-מסך: אותו מנגנון, מידות-עיצוב כ-params. productImage ⇒ שקע
// image (הקופסה מזרימה תמונה-או-גליף); connectChipText = מחרוזת-מוכנה מהקופסה
// (תבנית connectExplainTpl ב-content); skuText מגיע ממופתח (הקופסה מרכיבה '#'+sku).
import 'package:flutter/material.dart';

class ProductMiniCard extends StatelessWidget {
  const ProductMiniCard({
    required this.nameText,
    required this.skuText,
    required this.image,
    required this.onTap,
    required this.surfaceColor,
    required this.borderColor,
    required this.inkColor,
    required this.skuColor,
    this.connectChipText,
    this.chipBgColor,
    this.chipFgColor,
    this.width = 112,
    this.imageHeight = 56,
    this.nameFontSize = 11,
    this.skuFontSize = 9,
    this.padding = 9,
    this.cornerRadius = 13,
    this.nameFlexible = true,
    super.key,
  });
  final String nameText, skuText;
  final Widget image;
  final VoidCallback onTap;
  final Color surfaceColor, borderColor, inkColor, skuColor;

  /// צ'יפ-הסבר-חיבור (רצועת-התאימות בלבד); null = בלי צ'יפ.
  final String? connectChipText;
  final Color? chipBgColor, chipFgColor;
  final double width, imageHeight, nameFontSize, skuFontSize, padding, cornerRadius;

  /// true = השם בתוך Flexible (כרטיס-related); false = Expanded (פריט-קרוסלה).
  final bool nameFlexible;

  @override
  Widget build(BuildContext context) {
    final name = Text(nameText,
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(
            color: inkColor, fontSize: nameFontSize, height: 1.2));
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        padding: EdgeInsets.all(padding),
        decoration: BoxDecoration(
          color: surfaceColor,
          border: Border.all(color: borderColor),
          borderRadius: BorderRadius.circular(cornerRadius),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(height: imageHeight, child: image),
            SizedBox(height: nameFlexible ? 5 : 3),
            if (nameFlexible)
              Flexible(child: name)
            else
              Expanded(child: name),
            if (connectChipText != null && connectChipText!.isNotEmpty) ...[
              const SizedBox(height: 3),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                decoration: BoxDecoration(
                  color: chipBgColor,
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Text(connectChipText!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.right,
                    style: TextStyle(
                        color: chipFgColor,
                        fontSize: 8.5,
                        fontWeight: FontWeight.w700)),
              ),
              const SizedBox(height: 2),
            ] else
              const SizedBox(height: 3),
            Text(skuText,
                style: TextStyle(
                    color: skuColor,
                    fontSize: skuFontSize,
                    fontFamily: 'monospace')),
          ],
        ),
      ),
    );
  }
}
