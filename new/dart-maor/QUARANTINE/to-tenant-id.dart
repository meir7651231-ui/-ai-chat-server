/// חוט · to-tenant-id — הומר מ-JS (new/atoms/to-tenant-id.mjs). חוזה: to-tenant-id.contract.md
/// חוקים: ‏#7 truthiness-של-JS מפורש · ‏#5 slice-בטוח עם גידור-אורך.

/// truthiness של JS (חוק-7): '' / 0 / -0 / NaN / null כוזבים.
bool _truthy(dynamic v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is String) return v.isNotEmpty;
  if (v is num) return v != 0 && !v.isNaN;
  return true;
}

/// slice(start, end) של JS על מחרוזת — גידור-אורך, לא זורק (חוק-5).
String _slice(String s, int start, int end) {
  var st = start < 0 ? s.length + start : start;
  var en = end < 0 ? s.length + end : end;
  if (st < 0) st = 0;
  if (en > s.length) en = s.length;
  return st >= en ? '' : s.substring(st, en);
}

dynamic toTenantId(dynamic slug, dynamic orgName) {
  final String src = (_truthy(slug) && slug != 'default')
      ? slug as String
      : (_truthy(orgName) ? orgName as String : 'org');
  final base = _slice(
    src
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9-]+'), '-')
        .replaceAll(RegExp(r'^-+|-+$'), ''),
    0,
    38,
  );
  final padded = base.length >= 3 ? base : '$base-org';
  return RegExp(r'^[a-z0-9]').hasMatch(padded) ? padded : _slice('x-$padded', 0, 40);
}
