// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: features__catalog_config__catalog_config_screen:_ProductThumb (בנייה-חכמה main)
import 'package:flutter/material.dart';

class ProductThumb extends StatelessWidget {
  const ProductThumb({
    required this.imageAsset,
    required this.emoji,
    required this.height,
    required this.emojiSize,
    this.width,
    this.radius = 12,
  });

  final String? imageAsset;
  final String emoji;
  final double height;
  final double emojiSize;
  final double? width;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final asset = imageAsset;
    final fallback = Text(emoji, style: TextStyle(fontSize: emojiSize));
    return Container(
      width: width,
      height: height,
      alignment: Alignment.center,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(radius),
      ),
      child: asset == null
          ? fallback
          : Image(
              image: resolveProductImage(asset),
              fit: BoxFit.contain,
              errorBuilder: (context, error, stackTrace) => fallback,
            ),
    );
  }
}
