// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__store_profile_screen:_StoreLogoAvatar (בנייה-חכמה main)
import 'package:flutter/material.dart';

class StoreLogoAvatar extends StatelessWidget {
  const StoreLogoAvatar({required this.logo, required this.size});

  final String? logo;
  final double size;

  @override
  Widget build(BuildContext context) {
    // Dual-render (A14): data-URL מפוענח מקומית; כתובת `https://…` שהועלתה
    // (kCloudPhotos ON) נטענת מ-R2 — שניהם דרך [imageProviderForRef]. F-43 —
    // thumb מפוענח לגודל התצוגה (ResizeImage חל על data-URL ו-network כאחד).
    final base = imageProviderForRef(logo);
    if (base != null) {
      final cacheW = (size * MediaQuery.devicePixelRatioOf(context)).round();
      return ClipOval(
        child: Image(
          image: ResizeImage(base, width: cacheW),
          width: size,
          height: size,
          fit: BoxFit.cover,
          gaplessPlayback: true,
          // payload פגום / טעינה שנכשלה → ברירת-המחדל, לעולם לא קריסה.
          errorBuilder: (_, __, ___) => _fallback(),
        ),
      );
    }
    return _fallback();
  }

  Widget _fallback() => Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        decoration: const BoxDecoration(
          color: Color(0xFFFFF0E3),
          shape: BoxShape.circle,
        ),
        // דקורטיבי: שם העסק המלא נקרא ממש לידו.
        child: ExcludeSemantics(
          child: Text('🏪', style: TextStyle(fontSize: size * 0.46)),
        ),
      );
}
