// ponytail: substring matching, not a real UA grammar. Good enough to label a
// submission's browser/OS in the details drawer; swap in `ua-parser-js` if this
// ever drives anything beyond display.

// Order matters: Edge/Opera UAs also contain "Chrome", Chrome contains "Safari".
const BROWSERS: [RegExp, string][] = [
  [/Edg\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/Firefox\//, "Firefox"],
  [/Chrome\//, "Chrome"],
  [/Safari\//, "Safari"],
];

const OSES: [RegExp, string][] = [
  [/iPhone|iPad|iPod/, "iOS"],
  [/Android/, "Android"],
  [/Mac OS X|Macintosh/, "macOS"],
  [/Windows/, "Windows"],
  [/Linux/, "Linux"],
];

function match(ua: string, table: [RegExp, string][]) {
  return table.find(([re]) => re.test(ua))?.[1] ?? null;
}

export function parseUserAgent(ua: string | null | undefined) {
  if (!ua) return { browser: null, os: null };
  return { browser: match(ua, BROWSERS), os: match(ua, OSES) };
}
