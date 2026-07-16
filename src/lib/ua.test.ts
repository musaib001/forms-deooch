import { expect, test } from "vitest";
import { parseUserAgent } from "./ua";

// The ordering traps: Edge/Opera UAs also contain "Chrome", Chrome contains
// "Safari". These fail loudly if the BROWSERS table is ever reordered.
test("picks the most specific browser, not the compat token", () => {
  expect(
    parseUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
    )
  ).toEqual({ browser: "Edge", os: "Windows" });

  expect(
    parseUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
  ).toEqual({ browser: "Chrome", os: "macOS" });

  expect(
    parseUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
    )
  ).toEqual({ browser: "Safari", os: "macOS" });
});

test("iOS wins over the Mac-like token in iPhone UAs", () => {
  expect(
    parseUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    )
  ).toEqual({ browser: "Safari", os: "iOS" });
});

test("returns nulls rather than throwing on missing/unknown input", () => {
  expect(parseUserAgent(null)).toEqual({ browser: null, os: null });
  expect(parseUserAgent(undefined)).toEqual({ browser: null, os: null });
  expect(parseUserAgent("curl/8.4.0")).toEqual({ browser: null, os: null });
});
