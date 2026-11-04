/** Pages under /messenger that are lists, not a conversation with a message box at the bottom. */
const messengerLists = ["members", "channels", "news", "projects", "tasks"];

/** True on pages that end in a message box, so floating buttons must not cover it. */
export function hasMessageBox(pathname: string) {
  if (pathname === "/chat" || pathname.startsWith("/chat/")) return true;
  if (pathname === "/messenger" || pathname === "/messenger/") return true;
  if (!pathname.startsWith("/messenger/")) return false;
  return !messengerLists.includes(pathname.split("/")[2]);
}

/** Pages that fill the window themselves: the two-pane pages (messenger, groups, channels) and the workflow editor. */
export function fillsWindow(pathname: string) {
  return hasMessageBox(pathname) || pathname === "/messenger/channels" || /^\/workflows\/[^/]+/.test(pathname);
}
