/** חוט · is-ios — קודם אוטומטית (צילום-גטר). חוזה: is-ios.contract.md */
export function isIos(T) {
    return typeof navigator !== T.k1 && /iphone|ipad|ipod/i.test(navigator.userAgent);
}
