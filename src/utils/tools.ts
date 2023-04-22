export function checkIsPC() {
  return !navigator.userAgent
    .toLowerCase()
    .match(
      /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/
    );
}
