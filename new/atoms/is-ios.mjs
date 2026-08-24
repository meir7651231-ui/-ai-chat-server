/** חוט · is-ios — קודם אוטומטית (צילום-גטר). חוזה: is-ios.contract.md */
export function isIos() {
    return typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
}
